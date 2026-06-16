import { useEffect } from 'react';
import { Howl } from 'howler';
import { Volume2, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';
import Pet from './Pet';

export default function AudioContextOverlay() {
  const audioContextReady = useAppStore((state) => state.audioContextReady);
  const setAudioContextReady = useAppStore((state) => state.setAudioContextReady);

  useEffect(() => {
    if (audioContextReady) return;

    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContext) {
      setAudioContextReady(true);
      return;
    }

    const ctx = new AudioContext();
    if (ctx.state === 'running') {
      setAudioContextReady(true);
      ctx.close().catch(() => {});
    }
  }, [audioContextReady, setAudioContextReady]);

  const handleUnlock = async () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        ctx.close().catch(() => {});
      }

      const silent = new Howl({
        src: ['data:audio/wav;base64,UklGRiIAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'],
        volume: 0,
      });
      silent.play();
      setTimeout(() => silent.unload(), 100);
    } catch {
      // ignore
    }
    setAudioContextReady(true);
  };

  if (audioContextReady) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      
      <div className="relative glass-card p-8 max-w-sm w-full animate-slide-up shadow-glow-strong border-dream-purple/30">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 scale-75">
            <Pet size="md" showName={false} />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dream-purple/30 to-dream-blue/30 flex items-center justify-center mb-5 animate-pulse-soft">
            <Volume2 className="w-8 h-8 text-dream-purple" />
          </div>

          <h3 className="text-xl font-bold text-night-100 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-dream-yellow" />
            欢迎来到睡前故事角
          </h3>
          
          <p className="text-night-400 text-sm mb-6 leading-relaxed">
            为了让圆嘟嘟能顺利为你播放故事和音乐，
            <br />
            请先点击下方按钮启用音频播放~
          </p>

          <button
            onClick={handleUnlock}
            className="w-full btn-primary flex items-center justify-center gap-2 !py-4 text-lg"
          >
            <Volume2 className="w-5 h-5" />
            开始使用
          </button>

          <p className="text-xs text-night-600 mt-4">
            仅在浏览器限制音频自动播放时出现
          </p>
        </div>
      </div>
    </div>
  );
}
