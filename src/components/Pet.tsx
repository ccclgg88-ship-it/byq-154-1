import { useMemo } from 'react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';

interface PetProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export default function Pet({ size = 'md', showName = true }: PetProps) {
  const pet = useAppStore((state) => state.pet);
  const player = useAppStore((state) => state.player);
  const music = useAppStore((state) => state.music);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const breatheAnimation = useMemo(() => {
    if (pet.mood === 'sleeping') return 'animate-breathe-slow';
    if (pet.mood === 'sleepy') return 'animate-breathe';
    
    const isPlaying = player.isPlaying || music.activeTracks.length > 0;
    const avgVolume = player.isPlaying 
      ? player.volume 
      : music.activeTracks.length > 0 
        ? (music.activeTracks.reduce((sum, t) => sum + t.volume, 0) / music.activeTracks.length) * music.masterVolume
        : 0.5;

    if (!isPlaying) return 'animate-breathe';
    if (avgVolume > 0.7) return 'animate-breathe-fast';
    if (avgVolume < 0.3) return 'animate-breathe-slow';
    return 'animate-breathe';
  }, [pet.mood, player.isPlaying, player.volume, music.activeTracks, music.masterVolume]);

  const eyeStyle = useMemo(() => {
    if (pet.mood === 'sleeping') return 'h-1 rounded-full';
    if (pet.mood === 'sleepy') return 'h-2 rounded-full';
    return 'h-4 rounded-full';
  }, [pet.mood]);

  const mouthStyle = useMemo(() => {
    if (pet.mood === 'sleeping') return 'h-0.5 w-3 rounded-full';
    if (pet.mood === 'sleepy') return 'h-1 w-4 rounded-full';
    return 'h-2 w-5 rounded-b-full';
  }, [pet.mood]);

  const blanketStyle = pet.currentSkin === 'starryBlanket' 
    ? 'bg-gradient-to-br from-indigo-600/60 via-purple-600/50 to-pink-500/50' 
    : 'bg-gradient-to-br from-pink-300/20 to-purple-300/20';

  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          'relative transition-all duration-500',
          sizeClasses[size],
          breatheAnimation
        )}
      >
        <svg 
          viewBox="0 0 200 180" 
          className={cn(
            'w-full h-full',
            pet.mood === 'sleeping' || pet.mood === 'sleepy' ? 'rotate-[-5deg]' : ''
          )}
        >
          <defs>
            <radialGradient id="petBody" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f9a8d4" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#ec4899" />
            </radialGradient>
            <radialGradient id="petBelly" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </radialGradient>
            <radialGradient id="petCheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse 
            cx="100" 
            cy="110" 
            rx="75" 
            ry="55" 
            fill="url(#petBody)"
            className="drop-shadow-lg"
          />

          <ellipse 
            cx="100" 
            cy="120" 
            rx="45" 
            ry="35" 
            fill="url(#petBelly)"
            opacity="0.9"
          />

          <ellipse 
            cx="100" 
            cy="65" 
            rx="55" 
            ry="48" 
            fill="url(#petBody)"
          />

          <ellipse 
            cx="55" 
            cy="35" 
            rx="18" 
            ry="20" 
            fill="url(#petBody)"
            transform="rotate(-15 55 35)"
          />
          <ellipse 
            cx="55" 
            cy="35" 
            rx="10" 
            ry="12" 
            fill="#fce7f3"
            transform="rotate(-15 55 35)"
          />

          <ellipse 
            cx="145" 
            cy="35" 
            rx="18" 
            ry="20" 
            fill="url(#petBody)"
            transform="rotate(15 145 35)"
          />
          <ellipse 
            cx="145" 
            cy="35" 
            rx="10" 
            ry="12" 
            fill="#fce7f3"
            transform="rotate(15 145 35)"
          />

          <g className={pet.mood === 'awake' ? 'animate-twinkle' : ''}>
            <ellipse cx="78" cy="65" rx="6" ry="8" fill="url(#petCheek)" />
            <ellipse cx="122" cy="65" rx="6" ry="8" fill="url(#petCheek)" />
          </g>

          <ellipse 
            cx="75" 
            cy="58" 
            rx="8" 
            ry={pet.mood === 'awake' ? 8 : pet.mood === 'sleepy' ? 4 : 2}
            fill="#1e1b4b"
            className={eyeStyle}
            style={{ transition: 'all 0.5s ease' }}
          />
          
          {pet.mood === 'awake' && (
            <>
              <circle cx="73" cy="56" r="2.5" fill="white" opacity="0.9" />
              <circle cx="76" cy="59" r="1" fill="white" opacity="0.6" />
            </>
          )}
          
          {pet.mood !== 'sleeping' && (
            <path 
              d="M 68 52 Q 75 48 82 52" 
              stroke="#1e1b4b" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity={pet.mood === 'sleepy' ? '0.7' : '1'}
            />
          )}

          <ellipse 
            cx="125" 
            cy="58" 
            rx="8" 
            ry={pet.mood === 'awake' ? 8 : pet.mood === 'sleepy' ? 4 : 2}
            fill="#1e1b4b"
            style={{ transition: 'all 0.5s ease' }}
          />
          
          {pet.mood === 'awake' && (
            <>
              <circle cx="123" cy="56" r="2.5" fill="white" opacity="0.9" />
              <circle cx="126" cy="59" r="1" fill="white" opacity="0.6" />
            </>
          )}
          
          {pet.mood !== 'sleeping' && (
            <path 
              d="M 118 52 Q 125 48 132 52" 
              stroke="#1e1b4b" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
              opacity={pet.mood === 'sleepy' ? '0.7' : '1'}
            />
          )}

          <ellipse 
            cx="100" 
            cy="75" 
            rx="5" 
            ry="4" 
            fill="#f472b6"
          />

          <path 
            d={`M 100 79 Q ${pet.mood === 'sleeping' ? '98 84 100 86' : pet.mood === 'sleepy' ? '97 84 100 86 Q 103 84 103 83' : '95 85 100 88 Q 105 85 105 83'}`}
            stroke="#be185d" 
            strokeWidth="2" 
            fill={pet.mood === 'awake' ? '#fce7f3' : 'none'}
            strokeLinecap="round"
            className={mouthStyle}
          />

          <ellipse 
            cx="40" 
            cy="100" 
            rx="15" 
            ry="12" 
            fill="url(#petBody)"
            transform="rotate(-20 40 100)"
          />

          <ellipse 
            cx="160" 
            cy="105" 
            rx="15" 
            ry="12" 
            fill="url(#petBody)"
            transform="rotate(15 160 105)"
          />

          {pet.currentSkin === 'starryBlanket' && (
            <g>
              <path 
                d="M 45 105 Q 100 80 155 105 L 165 155 Q 100 165 35 155 Z"
                fill="url(#petBlanket)"
                className="drop-shadow-lg"
                opacity="0.85"
              />
              
              <circle cx="65" cy="120" r="1.5" fill="white" opacity="0.9" />
              <circle cx="85" cy="135" r="2" fill="#fde68a" opacity="0.9" />
              <circle cx="100" cy="115" r="1.5" fill="white" opacity="0.8" />
              <circle cx="120" cy="140" r="1.8" fill="#f9a8d4" opacity="0.9" />
              <circle cx="140" cy="125" r="1.5" fill="white" opacity="0.85" />
              <circle cx="75" cy="145" r="1.2" fill="#a78bfa" opacity="0.9" />
              <circle cx="130" cy="150" r="1.3" fill="white" opacity="0.7" />
              <circle cx="55" cy="135" r="1" fill="#fde68a" opacity="0.8" />
              <circle cx="150" cy="140" r="1.4" fill="white" opacity="0.9" />
            </g>
          )}

          <defs>
            <linearGradient id="petBlanket" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {pet.mood === 'sleeping' && (
            <g className="animate-float">
              <text x="150" y="40" fontSize="16" fill="#a78bfa" opacity="0.8">Z</text>
              <text x="160" y="25" fontSize="12" fill="#c4b5fd" opacity="0.7">z</text>
              <text x="168" y="15" fontSize="10" fill="#ddd6fe" opacity="0.6">z</text>
            </g>
          )}
        </svg>

        <div 
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-full blur-md',
            pet.currentSkin === 'starryBlanket' ? 'bg-purple-500/30' : 'bg-pink-400/30'
          )}
        />
      </div>

      {showName && (
        <div className="mt-3 text-center">
          <p className="text-lg font-semibold text-night-200">{pet.name}</p>
          <p className={cn(
            'text-xs mt-1 px-3 py-1 rounded-full inline-block',
            pet.mood === 'awake' && 'bg-dream-green/20 text-dream-green',
            pet.mood === 'sleepy' && 'bg-dream-yellow/20 text-dream-yellow',
            pet.mood === 'sleeping' && 'bg-dream-purple/20 text-dream-purple',
          )}>
            {pet.mood === 'awake' && '✨ 精神满满'}
            {pet.mood === 'sleepy' && '😴 有点困了'}
            {pet.mood === 'sleeping' && '💤 已经睡着啦'}
          </p>
        </div>
      )}
    </div>
  );
}
