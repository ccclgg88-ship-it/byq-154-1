import { useState, useEffect } from 'react';
import BottomNav, { type TabId } from '../components/BottomNav';
import StoryBookshelf from '../components/StoryBookshelf';
import MusicRadio from '../components/MusicRadio';
import SleepTimer from '../components/SleepTimer';
import CompanionJournal from '../components/CompanionJournal';
import MiniPlayer from '../components/MiniPlayer';
import GoodnightScreen from '../components/GoodnightScreen';
import RestoreTimerDialog from '../components/RestoreTimerDialog';
import AudioContextOverlay from '../components/AudioContextOverlay';
import { useStoryAudio } from '../hooks/useStoryAudio';
import { useMusicAudio } from '../hooks/useMusicAudio';
import { useSleepTimer } from '../hooks/useSleepTimer';
import { useAppStore } from '../store';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('stories');

  const player = useAppStore((state) => state.player);
  const seekStory = useAppStore((state) => state.seekStory);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const setAudioContextReady = useAppStore((state) => state.setAudioContextReady);
  const audioContextReady = useAppStore((state) => state.audioContextReady);

  useStoryAudio();
  useMusicAudio();
  useSleepTimer();

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioContextReady) {
        setAudioContextReady(true);
      }
      document.removeEventListener('click', handleFirstInteraction, true);
      document.removeEventListener('touchstart', handleFirstInteraction, true);
      document.removeEventListener('keydown', handleFirstInteraction, true);
    };

    document.addEventListener('click', handleFirstInteraction, true);
    document.addEventListener('touchstart', handleFirstInteraction, true);
    document.addEventListener('keydown', handleFirstInteraction, true);

    return () => {
      document.removeEventListener('click', handleFirstInteraction, true);
      document.removeEventListener('touchstart', handleFirstInteraction, true);
      document.removeEventListener('keydown', handleFirstInteraction, true);
    };
  }, [audioContextReady, setAudioContextReady]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (player.currentStoryId || player.currentType === 'music') {
            togglePlay();
          }
          break;
        case 'ArrowLeft':
          if (player.currentStoryId && player.currentType === 'story') {
            seekStory(Math.max(0, player.currentTime - 10));
          }
          break;
        case 'ArrowRight':
          if (player.currentStoryId && player.currentType === 'story') {
            seekStory(Math.min(player.duration, player.currentTime + 10));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, togglePlay, seekStory]);

  const renderContent = () => {
    switch (activeTab) {
      case 'stories':
        return <StoryBookshelf />;
      case 'music':
        return <MusicRadio />;
      case 'timer':
        return <SleepTimer />;
      case 'journal':
        return <CompanionJournal />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="hidden md:block fixed top-0 left-0 right-0 z-30 backdrop-blur-xl border-b border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(8,17,34,0.95) 0%, rgba(15,23,42,0.85) 80%, rgba(15,23,42,0) 100%)',
          }}
        />
        <div className="px-6 max-w-6xl mx-auto">
          <header className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dream-purple via-dream-pink to-dream-yellow flex items-center justify-center text-2xl shadow-glow">
                  🌙
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-night-100 font-display">
                    睡前故事角
                  </h1>
                  <p className="text-sm text-night-400">
                    和圆嘟嘟一起安睡
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-night-400">
                <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-night-300 text-xs font-mono">Space</kbd>
                  <span>暂停/播放</span>
                </span>
                <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-night-300 text-xs font-mono">←</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-night-300 text-xs font-mono">→</kbd>
                  <span>快进/快退 10s</span>
                </span>
              </div>
            </div>
          </header>

          <div className="pb-3">
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isDesktop />
          </div>
        </div>
      </div>

      <header className="md:hidden pt-4 pb-2 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-dream-purple via-dream-pink to-dream-yellow flex items-center justify-center text-xl shadow-glow">
                🌙
              </div>
              <div>
                <h1 className="text-xl font-bold text-night-100 font-display">
                  睡前故事角
                </h1>
                <p className="text-xs text-night-400">
                  和圆嘟嘟一起安睡
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-32 md:pb-28 pt-4 px-4 md:px-6 md:pt-[170px]">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <MiniPlayer />
      
      <div className="md:hidden">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isDesktop={false} />
      </div>

      <GoodnightScreen />
      <RestoreTimerDialog />
      <AudioContextOverlay />
    </div>
  );
}
