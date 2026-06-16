import { useMemo } from 'react';
import { Volume2, VolumeX, CloudRain, Flame, Sparkles, Waves, TreePine, Wind, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store';
import { musicTracks, mixPresets, getTrackById } from '../data/music';
import { useMusicAudio } from '../hooks/useMusicAudio';
import { cn } from '../lib/utils';
import Pet from './Pet';

const iconMap: Record<string, typeof CloudRain> = {
  'cloud-rain': CloudRain,
  'flame': Flame,
  'sparkles': Sparkles,
  'waves': Waves,
  'tree-pine': TreePine,
  'wind': Wind,
};

const categoryColors: Record<string, string> = {
  rain: 'from-blue-400/30 to-cyan-400/30 text-dream-blue',
  fire: 'from-orange-400/30 to-red-400/30 text-dream-orange',
  stars: 'from-purple-400/30 to-pink-400/30 text-dream-purple',
  ocean: 'from-cyan-400/30 to-blue-400/30 text-dream-blue',
  forest: 'from-green-400/30 to-emerald-400/30 text-dream-green',
  wind: 'from-teal-400/30 to-gray-400/30 text-night-200',
};

export default function MusicRadio() {
  const music = useAppStore((state) => state.music);
  const toggleMusicTrack = useAppStore((state) => state.toggleMusicTrack);
  const setTrackVolume = useAppStore((state) => state.setTrackVolume);
  const setMasterVolume = useAppStore((state) => state.setMasterVolume);
  const applyPreset = useAppStore((state) => state.applyPreset);
  const clearAllTracks = useAppStore((state) => state.clearAllTracks);

  const { retryTrack, getTrackStatus } = useMusicAudio();

  const activeTrackCount = music.activeTracks.length;

  const activeTracksWithData = useMemo(() => {
    return music.activeTracks.map((t) => {
      const track = getTrackById(t.trackId);
      const status = getTrackStatus(t.trackId);
      return { ...t, track, ...status };
    }).filter((t) => t.track);
  }, [music.activeTracks, getTrackStatus]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dream-blue/30 to-dream-purple/30 flex items-center justify-center text-3xl">
          🎵
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-night-100">音乐电台</h2>
          <p className="text-night-400 text-sm">混合多种自然声音，创造属于你的助眠氛围</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex flex-col items-center gap-4 md:w-64 shrink-0">
            <Pet size="md" />
            <div className="text-center">
              <p className="text-sm text-night-400 mb-1">已混音轨</p>
              <p className="text-2xl font-bold text-dream-purple">
                {activeTrackCount}<span className="text-lg text-night-400"> / 3</span>
              </p>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-night-100 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-dream-purple" />
                当前混音
              </h3>
              {activeTrackCount > 0 && (
                <button
                  onClick={clearAllTracks}
                  className="btn-secondary !py-1.5 !px-3 text-sm flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  清空全部
                </button>
              )}
            </div>

            {activeTracksWithData.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-white/3 border border-white/5">
                <VolumeX className="w-12 h-12 text-night-600 mx-auto mb-3" />
                <p className="text-night-400">还没有选择音轨</p>
                <p className="text-night-500 text-sm mt-1">从下方选择最多 3 种声音开始混音</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTracksWithData.map(({ trackId, volume, track, loading, error }) => {
                  const Icon = iconMap[track!.icon] || Sparkles;
                  
                  return (
                    <div
                      key={trackId}
                      className={cn(
                        'p-4 rounded-2xl border border-white/10 bg-gradient-to-r transition-all',
                        categoryColors[track!.category],
                        'bg-opacity-10'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="font-semibold text-night-100 truncate">{track!.name}</p>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {loading && (
                                <RefreshCw className="w-4 h-4 animate-spin text-night-400" />
                              )}
                              {error && (
                                <button
                                  onClick={() => retryTrack(trackId)}
                                  className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  title="加载失败，点击重试"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => toggleMusicTrack(trackId)}
                                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-night-300 hover:text-night-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <VolumeX className="w-4 h-4 text-night-500 shrink-0" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.01"
                              value={volume}
                              onChange={(e) => setTrackVolume(trackId, parseFloat(e.target.value))}
                              className="input-range flex-1"
                            />
                            <Volume2 className="w-4 h-4 text-night-500 shrink-0" />
                            <span className="w-12 text-right text-sm text-night-400 font-medium shrink-0">
                              {Math.round(volume * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dream-purple/20 flex items-center justify-center shrink-0">
                      <Volume2 className="w-6 h-6 text-dream-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-night-300 mb-2 font-medium">主音量</p>
                      <div className="flex items-center gap-3">
                        <VolumeX className="w-4 h-4 text-night-500 shrink-0" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={music.masterVolume}
                          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                          className="input-range flex-1"
                        />
                        <Volume2 className="w-4 h-4 text-night-500 shrink-0" />
                        <span className="w-12 text-right text-sm text-night-400 font-medium shrink-0">
                          {Math.round(music.masterVolume * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-night-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-dream-yellow" />
          预设混音方案
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mixPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.tracks, preset.id)}
              className={cn(
                'glass-card-hover p-4 text-left',
                music.currentPresetId === preset.id && 'ring-2 ring-dream-purple/50 bg-white/10'
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{preset.emoji}</span>
                <div>
                  <p className="font-semibold text-night-100">{preset.name}</p>
                  <p className="text-xs text-night-400">{preset.tracks.length} 条音轨</p>
                </div>
              </div>
              <p className="text-sm text-night-400 leading-relaxed">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-night-100 mb-4 flex items-center gap-2">
          <Waves className="w-5 h-5 text-dream-blue" />
          可选音轨
          <span className="text-xs text-night-500 font-normal ml-2">
            (最多同时播放 3 轨)
          </span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {musicTracks.map((track) => {
            const isActive = music.activeTracks.some((t) => t.trackId === track.id);
            const Icon = iconMap[track.icon] || Sparkles;
            const disabled = !isActive && activeTrackCount >= 3;

            return (
              <button
                key={track.id}
                onClick={() => !disabled && toggleMusicTrack(track.id, track.defaultVolume)}
                disabled={disabled}
                className={cn(
                  'glass-card-hover p-4 flex flex-col items-center gap-3 text-center',
                  isActive && 'ring-2 ring-dream-purple/50 bg-white/10',
                  disabled && 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center',
                  categoryColors[track.category]
                )}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-medium text-night-100 text-sm">{track.name}</p>
                </div>
                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-dream-purple/20 text-dream-purple">
                    已开启
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
