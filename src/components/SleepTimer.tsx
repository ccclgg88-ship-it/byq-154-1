import { useState, useMemo } from 'react';
import { Clock, Timer, Play, Pause, RotateCcw, Moon, Sparkles, Music2 } from 'lucide-react';
import { useAppStore } from '../store';
import { useSleepTimer } from '../hooks/useSleepTimer';
import { cn } from '../lib/utils';
import Pet from './Pet';

const durationPresets = [15, 30, 45, 60, 90, 120];

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function SleepTimer() {
  const timer = useAppStore((state) => state.timer);
  const player = useAppStore((state) => state.player);
  const music = useAppStore((state) => state.music);
  const setTimerState = useAppStore((state) => state.setTimerState);
  const startTimer = useAppStore((state) => state.startTimer);
  const pauseTimer = useAppStore((state) => state.pauseTimer);
  const resetTimer = useAppStore((state) => state.resetTimer);

  useSleepTimer();

  const [customDuration, setCustomDuration] = useState('');

  const progressPercent = useMemo(() => {
    if (timer.mode === 'duration' && timer.durationMinutes > 0) {
      const totalSeconds = timer.durationMinutes * 60;
      return Math.min(100, ((totalSeconds - timer.remainingSeconds) / totalSeconds) * 100);
    }
    if (timer.mode === 'targetTime') {
      const [hours, minutes] = timer.targetTime.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      
      const totalSeconds = Math.max(1, Math.floor((target.getTime() - now.getTime()) / 1000) + timer.remainingSeconds);
      const elapsed = totalSeconds - timer.remainingSeconds;
      return Math.min(100, (elapsed / totalSeconds) * 100);
    }
    return 0;
  }, [timer]);

  const fadeProgress = useMemo(() => {
    if (!timer.fadeOutStart) return 0;
    const totalFadeSeconds = 5 * 60;
    const elapsed = totalFadeSeconds - timer.remainingSeconds;
    return Math.min(100, Math.max(0, (elapsed / totalFadeSeconds) * 100));
  }, [timer.fadeOutStart, timer.remainingSeconds]);

  const hasActivePlayback = player.isPlaying || music.activeTracks.length > 0;

  const handleCustomDuration = () => {
    const mins = parseInt(customDuration);
    if (mins > 0 && mins <= 300) {
      setTimerState({
        mode: 'duration',
        durationMinutes: mins,
        remainingSeconds: mins * 60,
      });
      setCustomDuration('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dream-purple/30 to-dream-blue/30 flex items-center justify-center text-3xl">
          ⏰
        </div>
        <div>
          <h2 className="text-2xl font-bold text-night-100">定时入睡</h2>
          <p className="text-night-400 text-sm">设定入睡时间，到点自动停止播放</p>
        </div>
      </div>

      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Pet size="lg" />
          </div>

          <div className="relative w-56 h-56 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="12"
              />
              
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercent / 100)}`}
                className="transition-all duration-1000"
              />

              {timer.fadeOutStart && (
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="url(#fadeGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 72}`}
                  strokeDashoffset={`${2 * Math.PI * 72 * (1 - fadeProgress / 100)}`}
                  className="transition-all duration-500"
                />
              )}

              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#f9a8d4" />
                </linearGradient>
                <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {timer.isRunning ? (
                <>
                  <span className="text-xs text-night-400 mb-1 flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    剩余时间
                  </span>
                  <span className="text-4xl font-bold text-night-100 font-display tracking-wide">
                    {formatTime(timer.remainingSeconds)}
                  </span>
                  {timer.fadeOutStart && (
                    <span className="text-xs text-dream-orange mt-2 flex items-center gap-1 animate-pulse-soft">
                      <Sparkles className="w-3 h-3" />
                      音量淡出中...
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-xs text-night-400 mb-1">
                    {timer.mode === 'duration' ? '设定时长' : '目标时间'}
                  </span>
                  {timer.mode === 'duration' ? (
                    <span className="text-4xl font-bold text-night-100 font-display tracking-wide">
                      {timer.durationMinutes}
                      <span className="text-lg text-night-400 ml-1">分钟</span>
                    </span>
                  ) : (
                    <span className="text-4xl font-bold text-night-100 font-display tracking-wide">
                      {timer.targetTime}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            {!timer.isRunning ? (
              <button
                onClick={startTimer}
                className="btn-primary flex items-center gap-2 !px-8 !py-4"
              >
                <Play className="w-5 h-5" />
                开始计时
              </button>
            ) : (
              <>
                <button
                  onClick={pauseTimer}
                  className="btn-secondary flex items-center gap-2 !px-6 !py-3"
                >
                  <Pause className="w-5 h-5" />
                  暂停
                </button>
                <button
                  onClick={resetTimer}
                  className="btn-icon"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {!hasActivePlayback && !timer.isRunning && (
            <div className="mb-6 p-4 rounded-2xl bg-dream-yellow/10 border border-dream-yellow/20 max-w-md w-full">
              <p className="text-sm text-dream-yellow flex items-center gap-2">
                <Music2 className="w-4 h-4 shrink-0" />
                提示：建议先去故事书架或音乐电台选择要播放的内容哦~
              </p>
            </div>
          )}

          <div className="w-full max-w-2xl">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTimerState({ mode: 'duration', remainingSeconds: timer.durationMinutes * 60 })}
                className={cn(
                  'flex-1 py-3 px-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2',
                  timer.mode === 'duration'
                    ? 'bg-dream-purple/25 text-dream-purple shadow-inner-glow'
                    : 'bg-white/5 text-night-400 hover:bg-white/10 hover:text-night-200'
                )}
              >
                <Timer className="w-5 h-5" />
                按时长
              </button>
              <button
                onClick={() => setTimerState({ mode: 'targetTime' })}
                className={cn(
                  'flex-1 py-3 px-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-2',
                  timer.mode === 'targetTime'
                    ? 'bg-dream-purple/25 text-dream-purple shadow-inner-glow'
                    : 'bg-white/5 text-night-400 hover:bg-white/10 hover:text-night-200'
                )}
              >
                <Clock className="w-5 h-5" />
                按时间
              </button>
            </div>

            {timer.mode === 'duration' ? (
              <div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                  {durationPresets.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTimerState({
                        durationMinutes: mins,
                        remainingSeconds: mins * 60,
                      })}
                      disabled={timer.isRunning}
                      className={cn(
                        'py-3 px-2 rounded-2xl font-medium text-center transition-all',
                        timer.durationMinutes === mins
                          ? 'bg-white/15 text-night-100 shadow-glow border border-dream-purple/30'
                          : 'bg-white/5 text-night-300 hover:bg-white/10 border border-white/5',
                        timer.isRunning && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="自定义分钟数"
                    disabled={timer.isRunning}
                    className="flex-1 bg-white/15 border border-white/20 rounded-2xl px-4 py-3 text-night-100 placeholder-night-400 focus:outline-none focus:ring-2 focus:ring-dream-purple/60 focus:border-dream-purple/40 disabled:opacity-50 text-base"
                  />
                  <button
                    onClick={handleCustomDuration}
                    disabled={timer.isRunning || !customDuration}
                    className="btn-secondary"
                  >
                    确认
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 py-4">
                <label className="text-night-300">目标入睡时间：</label>
                <input
                  type="time"
                  value={timer.targetTime}
                  onChange={(e) => setTimerState({ targetTime: e.target.value })}
                  disabled={timer.isRunning}
                  className="min-w-[160px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h4 className="font-semibold text-night-100 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-dream-green/20 flex items-center justify-center text-sm">1</span>
            入睡计划
          </h4>
          <p className="text-sm text-night-300 leading-relaxed">
            在定时结束前 <span className="text-dream-green font-medium">15 分钟</span>，
            系统会自动降低音量并切换为纯音乐模式，帮助你慢慢进入深度睡眠。
          </p>
        </div>

        <div className="glass-card p-5">
          <h4 className="font-semibold text-night-100 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-dream-yellow/20 flex items-center justify-center text-sm">2</span>
            音量淡出
          </h4>
          <p className="text-sm text-night-300 leading-relaxed">
            最后 <span className="text-dream-yellow font-medium">5 分钟</span>音量将线性淡出，
            避免突然停止带来的惊扰，让你安安稳稳地入睡。
          </p>
        </div>
      </div>
    </div>
  );
}
