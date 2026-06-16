import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useAppStore } from '../store';
import { getTrackById } from '../data/music';

interface TrackState {
  id: string;
  sound: Howl | null;
  loading: boolean;
  error: boolean;
}

export const useMusicAudio = () => {
  const tracksRef = useRef<Map<string, TrackState>>(new Map());
  const fadeIntervalRef = useRef<number | null>(null);
  const initialVolumesRef = useRef<Map<string, number>>(new Map());

  const music = useAppStore((state) => state.music);
  const timer = useAppStore((state) => state.timer);
  const setMasterVolume = useAppStore((state) => state.setMasterVolume);
  const setPlayerState = useAppStore((state) => state.setPlayerState);
  const player = useAppStore((state) => state.player);

  const cleanupAllTracks = useCallback(() => {
    tracksRef.current.forEach((track) => {
      if (track.sound) {
        track.sound.unload();
      }
    });
    tracksRef.current.clear();
    initialVolumesRef.current.clear();
  }, []);

  const createTrack = useCallback((trackId: string, volume: number) => {
    const trackData = getTrackById(trackId);
    if (!trackData) return;

    const existing = tracksRef.current.get(trackId);
    if (existing?.sound) {
      existing.sound.volume(volume * music.masterVolume);
      if (!existing.sound.playing()) {
        existing.sound.play();
      }
      return;
    }

    const sound = new Howl({
      src: [trackData.audioUrl],
      html5: true,
      loop: true,
      volume: volume * music.masterVolume,
      onload: () => {
        const state = tracksRef.current.get(trackId);
        if (state) {
          state.loading = false;
          state.sound?.play();
        }
      },
      onloaderror: () => {
        const state = tracksRef.current.get(trackId);
        if (state) {
          state.error = true;
          state.loading = false;
        }
      },
    });

    tracksRef.current.set(trackId, {
      id: trackId,
      sound,
      loading: true,
      error: false,
    });
    initialVolumesRef.current.set(trackId, volume);
  }, [music.masterVolume]);

  const removeTrack = useCallback((trackId: string) => {
    const track = tracksRef.current.get(trackId);
    if (track?.sound) {
      track.sound.fade(track.sound.volume(), 0, 500);
      setTimeout(() => {
        track.sound?.unload();
        tracksRef.current.delete(trackId);
        initialVolumesRef.current.delete(trackId);
      }, 500);
    }
  }, []);

  useEffect(() => {
    const activeIds = new Set(music.activeTracks.map((t) => t.trackId));

    music.activeTracks.forEach(({ trackId, volume }) => {
      createTrack(trackId, volume);
    });

    tracksRef.current.forEach((_, trackId) => {
      if (!activeIds.has(trackId)) {
        removeTrack(trackId);
      }
    });

    if (music.activeTracks.length > 0) {
      setPlayerState({ currentType: 'music' });
    }
  }, [music.activeTracks, createTrack, removeTrack, setPlayerState]);

  useEffect(() => {
    music.activeTracks.forEach(({ trackId, volume }) => {
      const track = tracksRef.current.get(trackId);
      if (track?.sound) {
        const initialVolume = initialVolumesRef.current.get(trackId) ?? volume;
        track.sound.volume(initialVolume * music.masterVolume);
      }
    });
  }, [music.masterVolume, music.activeTracks]);

  useEffect(() => {
    music.activeTracks.forEach(({ trackId, volume }) => {
      const track = tracksRef.current.get(trackId);
      if (track?.sound) {
        const fadeTarget = volume * music.masterVolume;
        track.sound.fade(track.sound.volume(), fadeTarget, 300);
        initialVolumesRef.current.set(trackId, volume);
      }
    });
  }, [music.activeTracks.map((t) => `${t.trackId}-${t.volume}`).join(','), music.masterVolume]);

  useEffect(() => {
    const isFading = timer.isRunning && timer.fadeOutStart;
    const fadeRemaining = timer.remainingSeconds;
    const totalFadeTime = 5 * 60;

    if (isFading && fadeRemaining > 0 && fadeRemaining <= totalFadeTime) {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      const baseStoryVolume = useAppStore.getState().player.volume;
      const baseMusicVolume = music.masterVolume;
      const startRemaining = fadeRemaining;

      fadeIntervalRef.current = window.setInterval(() => {
        const currentState = useAppStore.getState();
        const remaining = currentState.timer.remainingSeconds;
        const progress = 1 - (remaining / Math.min(startRemaining, totalFadeTime));
        const factor = Math.max(0, 1 - progress);

        tracksRef.current.forEach((track) => {
          if (track.sound) {
            const initialVolume = initialVolumesRef.current.get(track.id) ?? 0.5;
            track.sound.volume(initialVolume * baseMusicVolume * factor);
          }
        });

        setMasterVolume(baseMusicVolume * factor);
        setPlayerState({ volume: baseStoryVolume * factor });

        if (remaining <= 0 || factor <= 0.01) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
      }, 500);
    } else if (!isFading && fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, [timer.isRunning, timer.fadeOutStart, timer.remainingSeconds, setMasterVolume, setPlayerState, music.masterVolume, player.volume]);

  useEffect(() => {
    return () => {
      cleanupAllTracks();
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [cleanupAllTracks]);

  const retryTrack = useCallback((trackId: string) => {
    const track = tracksRef.current.get(trackId);
    if (track) {
      if (track.sound) {
        track.sound.unload();
      }
      tracksRef.current.delete(trackId);
    }
    
    const trackConfig = music.activeTracks.find((t) => t.trackId === trackId);
    if (trackConfig) {
      createTrack(trackId, trackConfig.volume);
    }
  }, [music.activeTracks, createTrack]);

  const getTrackStatus = useCallback((trackId: string) => {
    const track = tracksRef.current.get(trackId);
    return {
      loading: track?.loading ?? false,
      error: track?.error ?? false,
    };
  }, []);

  return { retryTrack, getTrackStatus };
};
