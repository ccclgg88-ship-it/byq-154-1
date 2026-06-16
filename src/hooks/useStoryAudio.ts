import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useAppStore } from '../store';
import { getStoryById } from '../data/stories';
import type { PlayedStory } from '../types';

export const useStoryAudio = () => {
  const soundRef = useRef<Howl | null>(null);
  const updateIntervalRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  const player = useAppStore((state) => state.player);
  const timer = useAppStore((state) => state.timer);
  const setPlayerState = useAppStore((state) => state.setPlayerState);
  const updatePetMood = useAppStore((state) => state.updatePetMood);
  const addJournalEntry = useAppStore((state) => state.addJournalEntry);
  const nextStory = useAppStore((state) => state.nextStory);

  const cleanupSound = useCallback(() => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }
  }, []);

  const updateProgress = useCallback(() => {
    if (!soundRef.current) return;
    const currentTime = soundRef.current.seek() as number;
    const story = player.currentStoryId ? getStoryById(player.currentStoryId) : null;
    
    let scriptIndex = 0;
    if (story) {
      for (let i = 0; i < story.script.length; i++) {
        if (currentTime >= story.script[i].startTime && currentTime < story.script[i].endTime) {
          scriptIndex = i;
          break;
        }
        if (i === story.script.length - 1 && currentTime >= story.script[i].endTime) {
          scriptIndex = i;
        }
      }
    }

    setPlayerState({
      currentTime,
      currentScriptIndex: scriptIndex,
    });
  }, [player.currentStoryId, setPlayerState]);

  useEffect(() => {
    if (!player.currentStoryId || player.currentType !== 'story') {
      cleanupSound();
      return;
    }

    const story = getStoryById(player.currentStoryId);
    if (!story) return;

    cleanupSound();
    sessionStartRef.current = Date.now();

    const sound = new Howl({
      src: [story.audioUrl],
      html5: true,
      loop: false,
      volume: player.volume,
      onload: () => {
        setPlayerState({ duration: story.duration });
      },
      onloaderror: () => {
        setPlayerState({ isPlaying: false });
      },
      onplay: () => {
        if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = window.setInterval(updateProgress, 200);
      },
      onpause: () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
        }
      },
      onstop: () => {
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
          updateIntervalRef.current = null;
        }
      },
      onend: () => {
        updatePetMood('sleeping');
        
        const playedDuration = sessionStartRef.current 
          ? Math.round((Date.now() - sessionStartRef.current) / 1000)
          : story.duration;

        const today = new Date().toISOString().split('T')[0];
        const playedStory: PlayedStory = {
          storyId: story.id,
          title: story.title,
          duration: playedDuration,
          playedAt: new Date().toISOString(),
        };

        const journal = useAppStore.getState().journal;
        const existingEntry = journal.find((e) => e.date === today);
        
        if (existingEntry) {
          addJournalEntry({
            ...existingEntry,
            stories: [...existingEntry.stories, playedStory],
            totalDuration: existingEntry.totalDuration + playedDuration,
            completed: timer.isRunning ? existingEntry.completed : true,
          });
        } else {
          addJournalEntry({
            date: today,
            completed: !timer.isRunning,
            stories: [playedStory],
            musicTracks: [],
            totalDuration: playedDuration,
            sleepPlan: {
              targetTime: timer.targetTime,
              actualDuration: playedDuration,
            },
          });
        }

        const consecutive = useAppStore.getState().checkConsecutiveDays();
        if (consecutive >= 7) {
          useAppStore.getState().unlockSkin('starryBlanket');
        }

        nextStory();
      },
    });

    soundRef.current = sound;

    if (player.isPlaying) {
      sound.play();
    }

    return () => {
      cleanupSound();
    };
  }, [player.currentStoryId, player.currentType]);

  useEffect(() => {
    if (!soundRef.current) return;
    
    if (player.isPlaying && !soundRef.current.playing()) {
      soundRef.current.play();
    } else if (!player.isPlaying && soundRef.current.playing()) {
      soundRef.current.pause();
    }
  }, [player.isPlaying]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(player.volume);
    }
  }, [player.volume]);

  useEffect(() => {
    return () => {
      cleanupSound();
    };
  }, [cleanupSound]);

  const handleSeek = useCallback((time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setPlayerState({ currentTime: time });
    }
  }, [setPlayerState]);

  return { handleSeek };
};
