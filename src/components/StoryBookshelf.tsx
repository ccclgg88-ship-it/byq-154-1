import { useState, useEffect, useRef } from 'react';
import { Book, Clock, Heart, Play, ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { useAppStore } from '../store';
import { stories, getStoryById, getStoriesByCategory } from '../data/stories';
import type { StoryCategory } from '../types';
import { cn } from '../lib/utils';
import Pet from './Pet';

const categories: { id: 'all' | StoryCategory; name: string; emoji: string }[] = [
  { id: 'all', name: '全部故事', emoji: '📚' },
  { id: 'fairy', name: '童话故事', emoji: '🧚' },
  { id: 'nature', name: '自然故事', emoji: '🌿' },
  { id: 'whitenoise', name: '白噪音', emoji: '🌧️' },
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function StoryBookshelf() {
  const [activeCategory, setActiveCategory] = useState<'all' | StoryCategory>('all');
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  const player = useAppStore((state) => state.player);
  const favorites = useAppStore((state) => state.favorites);
  const playStory = useAppStore((state) => state.playStory);
  const togglePlay = useAppStore((state) => state.togglePlay);
  const prevStory = useAppStore((state) => state.prevStory);
  const nextStory = useAppStore((state) => state.nextStory);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);
  const toggleScript = useAppStore((state) => state.toggleScript);

  const filteredStories = activeCategory === 'all' 
    ? stories 
    : getStoriesByCategory(activeCategory);

  const currentStory = player.currentStoryId ? getStoryById(player.currentStoryId) : null;

  useEffect(() => {
    if (player.showScript && scriptContainerRef.current && currentStory) {
      const activeLine = scriptContainerRef.current.querySelector('[data-active="true"]');
      if (activeLine) {
        activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [player.currentScriptIndex, player.showScript, currentStory]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dream-purple/30 to-dream-pink/30 flex items-center justify-center text-3xl">
          📖
        </div>
        <div>
          <h2 className="text-2xl font-bold text-night-100">故事书架</h2>
          <p className="text-night-400 text-sm">选一个故事，让圆嘟嘟陪你入睡吧</p>
        </div>
      </div>

      {currentStory && (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex lg:flex-col items-center gap-4 lg:gap-6 lg:w-64 shrink-0">
              <div className={cn(
                'w-28 h-36 lg:w-full lg:h-56 rounded-2xl bg-gradient-to-br flex items-center justify-center text-6xl lg:text-7xl shadow-glow',
                currentStory.coverColor
              )}>
                {currentStory.coverEmoji}
              </div>
              <Pet size="md" showName={false} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-night-100 mb-2">{currentStory.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag bg-dream-purple/20 text-dream-purple">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(currentStory.duration)}
                    </span>
                    <span className="tag bg-dream-blue/20 text-dream-blue">
                      <Book className="w-3 h-3 mr-1" />
                      {currentStory.ageRange}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleScript}
                    className="btn-icon"
                    title={player.showScript ? '隐藏文稿' : '显示文稿'}
                  >
                    {player.showScript ? <X className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => toggleFavorite(currentStory.id)}
                    className="btn-icon"
                  >
                    <Heart className={cn(
                      'w-5 h-5',
                      favorites.includes(currentStory.id) && 'fill-red-400 text-red-400'
                    )} />
                  </button>
                </div>
              </div>

              <div className="mb-5 p-4 rounded-2xl bg-dream-yellow/10 border border-dream-yellow/20">
                <p className="text-sm text-dream-yellow mb-1">💫 圆嘟嘟推荐：</p>
                <p className="text-night-200">{currentStory.petRecommendation}</p>
              </div>

              <div className="flex gap-3 mb-5">
                <button onClick={prevStory} className="btn-icon">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {player.isPlaying ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                      暂停播放
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {player.currentTime > 0 ? '继续播放' : '开始播放'}
                    </>
                  )}
                </button>
                <button onClick={nextStory} className="btn-icon">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {player.showScript && currentStory.script && (
                <div
                  ref={scriptContainerRef}
                  className="max-h-64 overflow-y-auto pr-2 space-y-1 rounded-2xl bg-white/3 p-2"
                >
                  {currentStory.script.map((line, index) => (
                    <div
                      key={line.id}
                      data-active={index === player.currentScriptIndex}
                      className={cn(
                        'script-line',
                        index === player.currentScriptIndex && 'script-line-active'
                      )}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-4 py-2 rounded-2xl font-medium transition-all duration-300',
              activeCategory === cat.id
                ? 'bg-dream-purple/25 text-dream-purple shadow-inner-glow'
                : 'bg-white/5 text-night-300 hover:bg-white/10 hover:text-night-100'
            )}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStories.map((story) => {
          const isCurrent = player.currentStoryId === story.id;
          const isFavorited = favorites.includes(story.id);

          return (
            <div
              key={story.id}
              className={cn(
                'glass-card-hover p-4 cursor-pointer',
                isCurrent && 'ring-2 ring-dream-purple/50 bg-white/10'
              )}
              onClick={() => playStory(story.id)}
            >
              <div className="flex gap-4">
                <div className={cn(
                  'w-20 h-28 shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center text-4xl shadow-lg',
                  story.coverColor
                )}>
                  {story.coverEmoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-night-100 text-lg leading-tight truncate">
                      {story.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(story.id);
                      }}
                      className="shrink-0 mt-0.5"
                    >
                      <Heart className={cn(
                        'w-5 h-5 transition-colors',
                        isFavorited ? 'fill-red-400 text-red-400' : 'text-night-500 hover:text-night-300'
                      )} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="tag bg-white/8 text-night-300 text-xs">
                      {formatDuration(story.duration)}
                    </span>
                    <span className="tag bg-dream-blue/15 text-dream-blue text-xs">
                      {story.ageRange}
                    </span>
                  </div>

                  <p className="text-xs text-night-400 line-clamp-2 leading-relaxed">
                    💫 {story.petRecommendation}
                  </p>
                </div>
              </div>

              {isCurrent && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-dream-purple">
                    <span className="relative flex h-2.5 w-2.5">
                      {player.isPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dream-purple opacity-75"></span>
                      )}
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-dream-purple"></span>
                    </span>
                    正在播放
                  </div>
                  <div className="text-xs text-night-400">
                    {formatDuration(player.currentTime)} / {formatDuration(player.duration)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
