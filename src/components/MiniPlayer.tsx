import { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, FileText, X } from 'lucide-react';
import { useAppStore } from '../store';
import { getStoryById } from '../data/stories';
import { getTrackById } from '../data/music';
import { useStoryAudio } from '../hooks/useStoryAudio';
import { cn } from '../lib/utils';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MiniPlayer() {
  const player = useAppStore((state) => state.player);
  const music = useAppStore((state) => state.music);
  const timer = useAppStore((state) => state.timer);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const prevStory = useAppStore((state) => state.prevStory);
  const nextStory = useAppStore((state) => state.nextStory);
  const setPlayerState = useAppStore((state) => state.setPlayerState);
  const setMasterVolume = useAppStore((state) => state.setMasterVolume);
  const toggleScript = useAppStore((state) => state.toggleScript);
  const clearAllTracks = useAppStore((state) => state.clearAllTracks);

  const { handleSeek } = useStoryAudio();

  const currentStory = player.currentStoryId ? getStoryById(player.currentStoryId) : null;
  const hasActiveMusic = music.activeTracks.length > 0;
  const isPlayingSomething = player.isPlaying || hasActiveMusic;

  const progress = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;

  const activeTrackNames = music.activeTracks
    .map((t) => getTrackById(t.trackId)?.name)
    .filter(Boolean)
    .join(' + ');

  const displayTitle = currentStory
    ? currentStory.title
    : activeTrackNames || '暂无播放内容';

  const displaySubtitle = currentStory
    ? `${currentStory.coverEmoji} 睡前故事`
    : hasActiveMusic
      ? `🎵 ${music.activeTracks.length} 条音轨混音中`
      : '';

  const handleSeekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentStory || player.duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * player.duration;
    handleSeek(time);
  };

  useEffect(() => {
    // no-op to avoid unused warnings
  }, [timer.isRunning]);

  const showMiniPlayer = currentStory || hasActiveMusic;

  if (!showMiniPlayer) return null;

  return (
    <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-40 md:z-30 animate-slide-up">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-3 md:pb-0">
        <div className="glass-card !rounded-2xl p-3 md:p-4 shadow-glow-strong">
          {currentStory && (
            <div
              className="h-1.5 bg-white/5 rounded-full mb-3 cursor-pointer overflow-hidden group"
              onClick={handleSeekBar}
            >
              <div
                className="h-full bg-gradient-to-r from-dream-purple to-dream-pink rounded-full transition-all duration-200 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-3 min-w-0 flex-1 md:w-72 md:flex-none">
              <div className={cn(
                'w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl',
                currentStory ? currentStory.coverColor : 'from-dream-purple/40 to-dream-blue/40'
              )}>
                {currentStory ? currentStory.coverEmoji : hasActiveMusic ? '🎵' : '🎶'}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-night-100 truncate text-sm md:text-base">
                  {displayTitle}
                </p>
                {displaySubtitle && (
                  <p className="text-xs text-night-400 truncate">{displaySubtitle}</p>
                )}
              </div>
            </div>

            <div className="sm:hidden flex-1 min-w-0">
              <p className="font-medium text-night-100 truncate text-sm">{displayTitle}</p>
              <p className="text-xs text-night-400 truncate">
                {currentStory ? `${formatTime(player.currentTime)} / ${formatTime(player.duration)}` : displaySubtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2">
              {currentStory && (
                <>
                  <button
                    onClick={prevStory}
                    className="btn-icon !w-9 !h-9 md:!w-10 md:!h-10"
                  >
                    <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="btn-icon !w-11 !h-11 md:!w-12 md:!h-12 !bg-gradient-to-br !from-dream-purple !to-dream-pink !text-white shadow-glow"
                  >
                    {player.isPlaying ? (
                      <Pause className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={nextStory}
                    className="btn-icon !w-9 !h-9 md:!w-10 md:!h-10"
                  >
                    <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </>
              )}

              {!currentStory && hasActiveMusic && (
                <button
                  onClick={clearAllTracks}
                  className="btn-icon !w-11 !h-11 md:!w-12 md:!h-12 !bg-gradient-to-br !from-red-500/80 !to-orange-500/80 !text-white"
                  title="停止所有音轨"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>

            <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
              {currentStory && (
                <button
                  onClick={toggleScript}
                  className="btn-icon !w-9 !h-9"
                  title={player.showScript ? '隐藏文稿' : '显示文稿'}
                >
                  {player.showScript ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </button>
              )}

              <div className="flex items-center gap-2 w-40">
                <VolumeX className="w-4 h-4 text-night-500 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentStory ? player.volume : music.masterVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (currentStory) {
                      setPlayerState({ volume: val });
                    } else {
                      setMasterVolume(val);
                    }
                  }}
                  className="input-range"
                />
                <Volume2 className="w-4 h-4 text-night-500 shrink-0" />
              </div>

              {currentStory && (
                <span className="text-xs text-night-400 w-24 text-right shrink-0 tabular-nums">
                  {formatTime(player.currentTime)} / {formatTime(player.duration)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
