import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Sparkles, Moon, Star } from 'lucide-react';
import Pet from './Pet';

export default function GoodnightScreen() {
  const showGoodnight = useAppStore((state) => state.showGoodnight);
  const setShowGoodnight = useAppStore((state) => state.setShowGoodnight);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (showGoodnight) {
      setTimeout(() => setFadeIn(true), 50);
    } else {
      setFadeIn(false);
    }
  }, [showGoodnight]);

  const handleDismiss = () => {
    setFadeIn(false);
    setTimeout(() => setShowGoodnight(false), 500);
  };

  if (!showGoodnight) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-opacity duration-1000 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f172a 40%, #020617 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className={`absolute text-white animate-twinkle`}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${
          fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-8 animate-float">
          <Moon className="w-20 h-20 text-dream-yellow drop-shadow-[0_0_30px_rgba(253,230,138,0.5)]" />
        </div>

        <div className="mb-8 scale-150 transform">
          <Pet size="lg" showName={false} />
        </div>

        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-dream-purple via-dream-pink to-dream-yellow mb-4 font-display">
            晚安
          </h1>
          <p className="text-xl md:text-2xl text-night-300 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-dream-yellow" />
            愿你有一个甜甜的梦
            <Sparkles className="w-5 h-5 text-dream-yellow" />
          </p>
          <p className="text-sm text-night-500 mt-4 animate-pulse-soft">
            点击任意处继续
          </p>
        </div>
      </div>
    </div>
  );
}
