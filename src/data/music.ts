import type { MusicTrack, MixPreset } from '../types';

export const musicTracks: MusicTrack[] = [
  {
    id: 'rain',
    name: '绵绵细雨',
    category: 'rain',
    icon: 'cloud-rain',
    audioUrl: '/audio/music/rain.mp3',
    defaultVolume: 0.6,
  },
  {
    id: 'fire',
    name: '温暖篝火',
    category: 'fire',
    icon: 'flame',
    audioUrl: '/audio/music/fire.mp3',
    defaultVolume: 0.5,
  },
  {
    id: 'stars',
    name: '星空絮语',
    category: 'stars',
    icon: 'sparkles',
    audioUrl: '/audio/music/stars.mp3',
    defaultVolume: 0.4,
  },
  {
    id: 'ocean',
    name: '海浪轻拍',
    category: 'ocean',
    icon: 'waves',
    audioUrl: '/audio/music/ocean.mp3',
    defaultVolume: 0.5,
  },
  {
    id: 'forest',
    name: '森林低语',
    category: 'forest',
    icon: 'tree-pine',
    audioUrl: '/audio/music/forest.mp3',
    defaultVolume: 0.45,
  },
  {
    id: 'wind',
    name: '微风拂面',
    category: 'wind',
    icon: 'wind',
    audioUrl: '/audio/music/wind.mp3',
    defaultVolume: 0.35,
  },
];

export const mixPresets: MixPreset[] = [
  {
    id: 'deep-sleep',
    name: '深度睡眠',
    description: '雨声+海浪，营造深沉宁静的睡眠氛围',
    emoji: '🌙',
    tracks: [
      { trackId: 'rain', volume: 0.5 },
      { trackId: 'ocean', volume: 0.4 },
    ],
  },
  {
    id: 'light-sleep',
    name: '浅眠模式',
    description: '星空+微风，轻柔舒缓助你慢慢入眠',
    emoji: '✨',
    tracks: [
      { trackId: 'stars', volume: 0.35 },
      { trackId: 'wind', volume: 0.3 },
    ],
  },
  {
    id: 'white-noise',
    name: '仅白噪音',
    description: '纯雨声，经典白噪音助眠选择',
    emoji: '🌧️',
    tracks: [
      { trackId: 'rain', volume: 0.7 },
    ],
  },
  {
    id: 'cozy-night',
    name: '温馨夜晚',
    description: '篝火+森林，温暖安心的夜晚氛围',
    emoji: '🔥',
    tracks: [
      { trackId: 'fire', volume: 0.5 },
      { trackId: 'forest', volume: 0.3 },
    ],
  },
];

export const getTrackById = (id: string): MusicTrack | undefined => {
  return musicTracks.find(track => track.id === id);
};

export const getPresetById = (id: string): MixPreset | undefined => {
  return mixPresets.find(preset => preset.id === id);
};
