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
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:z-30 md:top-0 md:bottom-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="glass-card md:!rounded-b-none md:border-b-0 md:border-t-0 !rounded-t-2xl md:!rounded-none !border-b-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-around md:justify-start md:gap-2 py-2 md:py-3">
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
                    'flex-1 md:flex-none'
                  )}
                >
                  <Icon className="w-5 h-5 md:w-5 md:h-5" />
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
