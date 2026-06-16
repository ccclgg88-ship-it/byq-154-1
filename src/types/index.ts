export interface StoryScriptLine {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export type StoryCategory = 'fairy' | 'nature' | 'whitenoise';

export interface Story {
  id: string;
  title: string;
  category: StoryCategory;
  duration: number;
  ageRange: string;
  petRecommendation: string;
  coverColor: string;
  coverEmoji: string;
  audioUrl: string;
  script: StoryScriptLine[];
}

export type MusicCategory = 'rain' | 'fire' | 'stars' | 'ocean' | 'forest' | 'wind';

export interface MusicTrack {
  id: string;
  name: string;
  category: MusicCategory;
  icon: string;
  audioUrl: string;
  defaultVolume: number;
}

export interface MixPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tracks: { trackId: string; volume: number }[];
}

export interface PlayedStory {
  storyId: string;
  title: string;
  duration: number;
  playedAt: string;
}

export interface JournalEntry {
  date: string;
  completed: boolean;
  stories: PlayedStory[];
  musicTracks: string[];
  totalDuration: number;
  sleepPlan: {
    targetTime: string;
    actualDuration: number;
  };
}

export type PetMood = 'awake' | 'sleepy' | 'sleeping';
export type PetSkin = 'default' | 'starryBlanket';

export interface PetState {
  name: string;
  mood: PetMood;
  unlockedSkins: PetSkin[];
  currentSkin: PetSkin;
  breathingRate: number;
  breathingDepth: number;
}

export type TimerMode = 'duration' | 'targetTime';

export interface TimerState {
  mode: TimerMode;
  durationMinutes: number;
  targetTime: string;
  isRunning: boolean;
  remainingSeconds: number;
  startTime: number | null;
  fadeOutStart: boolean;
}

export type PlayerType = 'story' | 'music' | null;

export interface PlayerState {
  currentType: PlayerType;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentStoryId: string | null;
  showScript: boolean;
  currentScriptIndex: number;
}

export interface MusicState {
  activeTracks: { trackId: string; volume: number }[];
  masterVolume: number;
  currentPresetId: string | null;
}
