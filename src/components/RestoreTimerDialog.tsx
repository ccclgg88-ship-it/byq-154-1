import { Timer, Play, X } from 'lucide-react';
import { useAppStore } from '../store';
import Pet from './Pet';

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function RestoreTimerDialog() {
  const showRestoreTimer = useAppStore((state) => state.showRestoreTimer);
  const pendingTimerState = useAppStore((state) => state.pendingTimerState);
  const restoreTimer = useAppStore((state) => state.restoreTimer);
  const setShowRestoreTimer = useAppStore((state) => state.setShowRestoreTimer);
  const setPendingTimerState = useAppStore((state) => state.setPendingTimerState);
  const startTimer = useAppStore((state) => state.startTimer);

  const handleRestore = () => {
    restoreTimer();
    setTimeout(() => {
      startTimer();
    }, 100);
  };

  const handleDismiss = () => {
    setShowRestoreTimer(false);
    setPendingTimerState(null);
    localStorage.removeItem('bedtime-timer-pending');
  };

  if (!showRestoreTimer || !pendingTimerState) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      <div className="relative glass-card p-8 max-w-sm w-full animate-slide-up shadow-glow-strong">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-night-400 hover:text-night-100 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 scale-75">
            <Pet size="md" showName={false} />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dream-purple/30 to-dream-pink/30 flex items-center justify-center mb-4">
            <Timer className="w-8 h-8 text-dream-purple animate-pulse-soft" />
          </div>

          <h3 className="text-xl font-bold text-night-100 mb-2">
            发现未完成的计时
          </h3>
          <p className="text-night-400 text-sm mb-6 leading-relaxed">
            上次离开时圆嘟嘟还在陪你计时，要恢复之前的入睡计划吗？
          </p>

          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <p className="text-xs text-night-500 mb-1">剩余时间</p>
            <p className="text-3xl font-bold text-dream-purple font-display tracking-wide">
              {formatTime(pendingTimerState.remainingSeconds)}
            </p>
            <p className="text-xs text-night-500 mt-2">
              {pendingTimerState.mode === 'duration'
                ? `按 ${pendingTimerState.durationMinutes} 分钟时长设定`
                : `目标时间 ${pendingTimerState.targetTime}`}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleDismiss}
              className="flex-1 btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleRestore}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              恢复计时
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
