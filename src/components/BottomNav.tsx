import { BookOpen, Music, Timer, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export type TabId = 'stories' | 'music' | 'timer' | 'journal';

interface TabItem {
  id: TabId;
  label: string;
  icon: typeof BookOpen;
}

const tabs: TabItem[] = [
  { id: 'stories', label: '故事书架', icon: BookOpen },
  { id: 'music', label: '音乐电台', icon: Music },
  { id: 'timer', label: '定时入睡', icon: Timer },
  { id: 'journal', label: '陪伴日志', icon: Calendar },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isDesktop?: boolean;
}

export default function BottomNav({ activeTab, onTabChange, isDesktop = false }: BottomNavProps) {
  if (isDesktop) {
    return (
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all duration-300',
                isActive
                  ? 'text-dream-purple bg-dream-purple/15 shadow-inner-glow font-semibold'
                  : 'text-night-400 hover:text-night-200 hover:bg-white/5 font-medium'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="px-4">
        <div className="glass-card !rounded-t-2xl !border-b-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-around py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'tab-item',
                    isActive && 'tab-item-active',
                    'flex-1'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
