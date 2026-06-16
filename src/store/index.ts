import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PlayerState,
  MusicState,
  PetState,
  TimerState,
  JournalEntry,
  PlayedStory,
  PlayerType,
  PetMood,
  PetSkin,
} from '../types';
import { getStoryById, getStoriesByCategory } from '../data/stories';

interface AppState {
  player: PlayerState;
  music: MusicState;
  pet: PetState;
  timer: TimerState;
  journal: JournalEntry[];
  favorites: string[];
  audioContextReady: boolean;
  showGoodnight: boolean;
  showRestoreTimer: boolean;
  pendingTimerState: TimerState | null;

  setPlayerState: (updates: Partial<PlayerState>) => void;
  setMusicState: (updates: Partial<MusicState>) => void;
  setPetState: (updates: Partial<PetState>) => void;
  setTimerState: (updates: Partial<TimerState>) => void;
  setAudioContextReady: (ready: boolean) => void;
  setShowGoodnight: (show: boolean) => void;
  setShowRestoreTimer: (show: boolean) => void;
  setPendingTimerState: (state: TimerState | null) => void;

  playStory: (storyId: string) => void;
  togglePlay: () => void;
  nextStory: () => void;
  prevStory: () => void;
  seekStory: (time: number) => void;
  toggleScript: () => void;

  toggleMusicTrack: (trackId: string, defaultVolume?: number) => void;
  setTrackVolume: (trackId: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  applyPreset: (tracks: { trackId: string; volume: number }[], presetId: string) => void;
  clearAllTracks: () => void;

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  restoreTimer: () => void;

  addJournalEntry: (entry: JournalEntry) => void;
  toggleFavorite: (storyId: string) => void;

  updatePetMood: (mood: PetMood) => void;
  unlockSkin: (skin: PetSkin) => void;
  setCurrentSkin: (skin: PetSkin) => void;

  checkConsecutiveDays: () => number;
}

const initialPlayerState: PlayerState = {
  currentType: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  currentStoryId: null,
  showScript: true,
  currentScriptIndex: 0,
};

const initialMusicState: MusicState = {
  activeTracks: [],
  masterVolume: 0.8,
  currentPresetId: null,
};

const initialPetState: PetState = {
  name: '圆嘟嘟',
  mood: 'awake',
  unlockedSkins: ['default'],
  currentSkin: 'default',
  breathingRate: 1,
  breathingDepth: 0.5,
};

const initialTimerState: TimerState = {
  mode: 'duration',
  durationMinutes: 30,
  targetTime: '22:00',
  isRunning: false,
  remainingSeconds: 30 * 60,
  startTime: null,
  fadeOutStart: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      player: initialPlayerState,
      music: initialMusicState,
      pet: initialPetState,
      timer: initialTimerState,
      journal: [],
      favorites: [],
      audioContextReady: false,
      showGoodnight: false,
      showRestoreTimer: false,
      pendingTimerState: null,

      setPlayerState: (updates) =>
        set((state) => ({ player: { ...state.player, ...updates } })),
      setMusicState: (updates) =>
        set((state) => ({ music: { ...state.music, ...updates } })),
      setPetState: (updates) =>
        set((state) => ({ pet: { ...state.pet, ...updates } })),
      setTimerState: (updates) =>
        set((state) => ({ timer: { ...state.timer, ...updates } })),
      setAudioContextReady: (ready) => set({ audioContextReady: ready }),
      setShowGoodnight: (show) => set({ showGoodnight: show }),
      setShowRestoreTimer: (show) => set({ showRestoreTimer: show }),
      setPendingTimerState: (state) => set({ pendingTimerState: state }),

      playStory: (storyId) => {
        const story = getStoryById(storyId);
        if (!story) return;
        set((state) => ({
          player: {
            ...state.player,
            currentType: 'story',
            isPlaying: true,
            currentTime: 0,
            duration: story.duration,
            currentStoryId: storyId,
            currentScriptIndex: 0,
          },
          pet: {
            ...state.pet,
            mood: 'sleepy',
          },
        }));
      },

      togglePlay: () =>
        set((state) => ({
          player: { ...state.player, isPlaying: !state.player.isPlaying },
        })),

      nextStory: () => {
        const { currentStoryId } = get().player;
        if (!currentStoryId) return;
        const currentStory = getStoryById(currentStoryId);
        if (!currentStory) return;
        const categoryStories = getStoriesByCategory(currentStory.category);
        const currentIndex = categoryStories.findIndex(
          (s) => s.id === currentStoryId
        );
        const nextIndex = (currentIndex + 1) % categoryStories.length;
        const nextStoryItem = categoryStories[nextIndex];
        if (nextStoryItem) {
          get().playStory(nextStoryItem.id);
        }
      },

      prevStory: () => {
        const { currentStoryId } = get().player;
        if (!currentStoryId) return;
        const currentStory = getStoryById(currentStoryId);
        if (!currentStory) return;
        const categoryStories = getStoriesByCategory(currentStory.category);
        const currentIndex = categoryStories.findIndex(
          (s) => s.id === currentStoryId
        );
        const prevIndex =
          currentIndex === 0 ? categoryStories.length - 1 : currentIndex - 1;
        const prevStoryItem = categoryStories[prevIndex];
        if (prevStoryItem) {
          get().playStory(prevStoryItem.id);
        }
      },

      seekStory: (time) =>
        set((state) => ({
          player: { ...state.player, currentTime: Math.max(0, Math.min(time, state.player.duration)) },
        })),

      toggleScript: () =>
        set((state) => ({
          player: { ...state.player, showScript: !state.player.showScript },
        })),

      toggleMusicTrack: (trackId, defaultVolume = 0.5) => {
        const { activeTracks } = get().music;
        const exists = activeTracks.find((t) => t.trackId === trackId);
        if (exists) {
          set((state) => ({
            music: {
              ...state.music,
              activeTracks: state.music.activeTracks.filter(
                (t) => t.trackId !== trackId
              ),
            },
          }));
        } else {
          if (activeTracks.length >= 3) return;
          set((state) => ({
            music: {
              ...state.music,
              activeTracks: [
                ...state.music.activeTracks,
                { trackId, volume: defaultVolume },
              ],
            },
          }));
        }
      },

      setTrackVolume: (trackId, volume) =>
        set((state) => ({
          music: {
            ...state.music,
            activeTracks: state.music.activeTracks.map((t) =>
              t.trackId === trackId ? { ...t, volume } : t
            ),
          },
        })),

      setMasterVolume: (volume) =>
        set((state) => ({
          music: { ...state.music, masterVolume: volume },
        })),

      applyPreset: (tracks, presetId) =>
        set((state) => ({
          music: {
            ...state.music,
            activeTracks: tracks,
            currentPresetId: presetId,
          },
        })),

      clearAllTracks: () =>
        set((state) => ({
          music: { ...state.music, activeTracks: [], currentPresetId: null },
        })),

      startTimer: () =>
        set((state) => {
          let remainingSeconds = state.timer.remainingSeconds;
          if (state.timer.mode === 'duration' && !state.timer.isRunning) {
            remainingSeconds = state.timer.durationMinutes * 60;
          }
          return {
            timer: {
              ...state.timer,
              isRunning: true,
              remainingSeconds,
              startTime: Date.now(),
            },
          };
        }),

      pauseTimer: () =>
        set((state) => ({
          timer: { ...state.timer, isRunning: false },
        })),

      resetTimer: () =>
        set((state) => ({
          timer: {
            ...state.timer,
            isRunning: false,
            remainingSeconds: state.timer.durationMinutes * 60,
            startTime: null,
            fadeOutStart: false,
          },
        })),

      restoreTimer: () => {
        const { pendingTimerState } = get();
        if (pendingTimerState) {
          set({ timer: pendingTimerState, showRestoreTimer: false, pendingTimerState: null });
        }
      },

      addJournalEntry: (entry) =>
        set((state) => {
          const existingIndex = state.journal.findIndex(
            (e) => e.date === entry.date
          );
          if (existingIndex >= 0) {
            const newJournal = [...state.journal];
            newJournal[existingIndex] = entry;
            return { journal: newJournal };
          }
          return { journal: [...state.journal, entry] };
        }),

      toggleFavorite: (storyId) =>
        set((state) => ({
          favorites: state.favorites.includes(storyId)
            ? state.favorites.filter((id) => id !== storyId)
            : [...state.favorites, storyId],
        })),

      updatePetMood: (mood) =>
        set((state) => ({ pet: { ...state.pet, mood } })),

      unlockSkin: (skin) =>
        set((state) => ({
          pet: {
            ...state.pet,
            unlockedSkins: state.pet.unlockedSkins.includes(skin)
              ? state.pet.unlockedSkins
              : [...state.pet.unlockedSkins, skin],
          },
        })),

      setCurrentSkin: (skin) =>
        set((state) => ({ pet: { ...state.pet, currentSkin: skin } })),

      checkConsecutiveDays: () => {
        const { journal } = get();
        if (journal.length === 0) return 0;

        const sortedEntries = [...journal]
          .filter((e) => e.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (sortedEntries.length === 0) return 0;

        let count = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedEntries.length; i++) {
          const entryDate = new Date(sortedEntries[i].date);
          entryDate.setHours(0, 0, 0, 0);
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          expectedDate.setHours(0, 0, 0, 0);

          if (entryDate.getTime() === expectedDate.getTime()) {
            count++;
          } else if (i === 0) {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            if (entryDate.getTime() === yesterday.getTime()) {
              count++;
            } else {
              break;
            }
          } else {
            break;
          }
        }

        return count;
      },
    }),
    {
      name: 'bedtime-story-storage',
      partialize: (state) => ({
        player: {
          volume: state.player.volume,
          showScript: state.player.showScript,
        },
        music: state.music,
        pet: state.pet,
        journal: state.journal,
        favorites: state.favorites,
      }),
    }
  )
);
