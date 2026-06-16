import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Music, Clock, Award, Lock, Unlock, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';
import { getStoryById } from '../data/stories';
import { getTrackById } from '../data/music';
import type { JournalEntry } from '../types';
import { cn } from '../lib/utils';
import Pet from './Pet';

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}秒`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins}分${secs}秒` : `${mins}分钟`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}小时${remainMins > 0 ? remainMins + '分' : ''}`;
};

export default function CompanionJournal() {
  const journal = useAppStore((state) => state.journal);
  const pet = useAppStore((state) => state.pet);
  const checkConsecutiveDays = useAppStore((state) => state.checkConsecutiveDays);
  const unlockSkin = useAppStore((state) => state.unlockSkin);
  const setCurrentSkin = useAppStore((state) => state.setCurrentSkin);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const consecutiveDays = checkConsecutiveDays();
  const hasStarryBlanket = pet.unlockedSkins.includes('starryBlanket');

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [viewYear, viewMonth]);

  const getEntryForDate = (year: number, month: number, day: number): JournalEntry | undefined => {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return journal.find((e) => e.date === dateStr);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDate(null);
  };

  const selectedEntry = selectedDate ? journal.find((e) => e.date === selectedDate) : null;

  const completedCount = journal.filter((e) => e.completed).length;
  const totalMinutes = Math.floor(journal.reduce((sum, e) => sum + e.totalDuration, 0) / 60);

  const formatDateKey = (year: number, month: number, day: number) =>
    `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dream-green/30 to-dream-blue/30 flex items-center justify-center text-3xl">
          📔
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-night-100">陪伴日志</h2>
          <p className="text-night-400 text-sm">记录和圆嘟嘟一起的每一个安睡夜晚</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-dream-purple mb-1">{completedCount}</div>
          <div className="text-sm text-night-400">完成天数</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-dream-blue mb-1">{totalMinutes}</div>
          <div className="text-sm text-night-400">总时长(分钟)</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-dream-yellow mb-1">{consecutiveDays}</div>
          <div className="text-sm text-night-400">连续完成</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-dream-green mb-1">{pet.unlockedSkins.length}</div>
          <div className="text-sm text-night-400">解锁外观</div>
        </div>
      </div>

      <div className="glass-card p-5 border-2 border-dream-purple/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-dream-purple/10 to-transparent rounded-bl-full" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <Pet size="md" showName={false} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-night-100 mb-2 flex items-center justify-center sm:justify-start gap-2">
              <Award className="w-5 h-5 text-dream-yellow" />
              成就解锁
            </h3>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-night-300">连续 7 天完成计划</span>
                <span className={cn(
                  'font-semibold',
                  hasStarryBlanket ? 'text-dream-green' : 'text-night-400'
                )}>
                  {hasStarryBlanket ? `${consecutiveDays}/7 已解锁` : `${consecutiveDays}/7`}
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    hasStarryBlanket
                      ? 'bg-gradient-to-r from-dream-purple via-dream-pink to-dream-yellow'
                      : 'bg-gradient-to-r from-dream-purple to-dream-pink'
                  )}
                  style={{ width: `${Math.min(100, (consecutiveDays / 7) * 100)}%` }}
                />
              </div>
            </div>
            <div className={cn(
              'flex items-center justify-center sm:justify-start gap-2 p-3 rounded-2xl',
              hasStarryBlanket
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-purple-400/30'
                : 'bg-white/5 border border-white/5'
            )}>
              {hasStarryBlanket ? (
                <Unlock className="w-5 h-5 text-dream-purple shrink-0" />
              ) : (
                <Lock className="w-5 h-5 text-night-500 shrink-0" />
              )}
              <div className="flex-1">
                <p className={cn('font-medium', hasStarryBlanket ? 'text-night-100' : 'text-night-400')}>
                  ✨ 星空被子外观
                </p>
                <p className="text-xs text-night-500">让圆嘟嘟裹上星光入睡</p>
              </div>
              {hasStarryBlanket && (
                <button
                  onClick={() => setCurrentSkin(
                    pet.currentSkin === 'starryBlanket' ? 'default' : 'starryBlanket'
                  )}
                  className="btn-secondary !py-1.5 !px-3 text-sm whitespace-nowrap"
                >
                  {pet.currentSkin === 'starryBlanket' ? '取下' : '穿戴'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="btn-icon !w-10 !h-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-dream-purple" />
              <h3 className="text-xl font-bold text-night-100">
                {viewYear}年 {monthNames[viewMonth]}
              </h3>
            </div>
            <button
              onClick={nextMonth}
              className="btn-icon !w-10 !h-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-night-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="calendar-day calendar-day-empty" />;
              }

              const dateKey = formatDateKey(viewYear, viewMonth, day);
              const entry = getEntryForDate(viewYear, viewMonth, day);
              const isToday =
                viewYear === today.getFullYear() &&
                viewMonth === today.getMonth() &&
                day === today.getDate();
              const isSelected = selectedDate === dateKey;

              return (
                <button
                  key={day}
                  onClick={() => entry && setSelectedDate(dateKey)}
                  className={cn(
                    'calendar-day',
                    entry?.completed && 'calendar-day-completed',
                    !entry?.completed && entry && 'bg-white/8 text-night-300',
                    !entry && 'text-night-600',
                    isToday && 'calendar-day-today',
                    isSelected && 'ring-2 ring-dream-pink scale-105',
                    entry && 'hover:scale-105'
                  )}
                >
                  <span className="font-medium">{day}</span>
                  {entry?.completed && (
                    <Sparkles className="w-3 h-3 text-dream-yellow mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-md bg-gradient-to-br from-dream-purple/30 to-dream-pink/30 border border-dream-purple/30" />
              <span className="text-night-400">已完成</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-md bg-white/8" />
              <span className="text-night-400">有记录</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-md ring-2 ring-dream-yellow/60" />
              <span className="text-night-400">今天</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-night-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-dream-blue" />
            当晚详情
          </h3>

          {!selectedEntry ? (
            <div className="py-16 text-center">
              <Calendar className="w-16 h-16 text-night-700 mx-auto mb-4" />
              <p className="text-night-400 mb-1">点击日历上有记录的日期</p>
              <p className="text-night-500 text-sm">查看那晚的陪伴详情</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div>
                  <p className="text-sm text-night-400">日期</p>
                  <p className="text-lg font-semibold text-night-100">{selectedEntry.date}</p>
                </div>
                <div className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium',
                  selectedEntry.completed
                    ? 'bg-dream-green/20 text-dream-green'
                    : 'bg-dream-orange/20 text-dream-orange'
                )}>
                  {selectedEntry.completed ? '✓ 完成计划' : '未完成'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-dream-blue/10 border border-dream-blue/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-dream-blue" />
                    <span className="text-sm text-dream-blue">总陪伴时长</span>
                  </div>
                  <p className="text-2xl font-bold text-night-100">
                    {formatDuration(selectedEntry.totalDuration)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-dream-purple/10 border border-dream-purple/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-dream-purple" />
                    <span className="text-sm text-dream-purple">入睡计划</span>
                  </div>
                  <p className="text-xl font-bold text-night-100">
                    {selectedEntry.sleepPlan.targetTime}
                  </p>
                </div>
              </div>

              {selectedEntry.stories.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-night-300 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-dream-pink" />
                    播放的故事 ({selectedEntry.stories.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedEntry.stories.map((story, idx) => {
                      const storyData = getStoryById(story.storyId);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl">
                              {storyData?.coverEmoji || '📖'}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-night-100 truncate">
                                {story.title}
                              </p>
                              <p className="text-xs text-night-500">
                                {new Date(story.playedAt).toLocaleTimeString('zh-CN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-night-400 shrink-0 ml-2">
                            {formatDuration(story.duration)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedEntry.musicTracks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-night-300 mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4 text-dream-green" />
                    播放的音乐 ({selectedEntry.musicTracks.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.musicTracks.map((trackId) => {
                      const track = getTrackById(trackId);
                      return (
                        <span
                          key={trackId}
                          className="px-3 py-1.5 rounded-full bg-white/8 text-night-300 text-sm"
                        >
                          {track?.name || trackId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
