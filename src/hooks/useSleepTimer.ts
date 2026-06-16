import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store';

export const useSleepTimer = () => {
  const intervalRef = useRef<number | null>(null);
  const storageKey = 'bedtime-timer-pending';

  const timer = useAppStore((state) => state.timer);
  const setTimerState = useAppStore((state) => state.setTimerState);
  const setShowGoodnight = useAppStore((state) => state.setShowGoodnight);
  const setPlayerState = useAppStore((state) => state.setPlayerState);
  const clearAllTracks = useAppStore((state) => state.clearAllTracks);
  const setPendingTimerState = useAppStore((state) => state.setPendingTimerState);
  const setShowRestoreTimer = useAppStore((state) => state.setShowRestoreTimer);

  const savePendingTimer = useCallback(() => {
    if (timer.isRunning) {
      const pending = {
        ...timer,
        remainingSeconds: timer.remainingSeconds,
      };
      localStorage.setItem(storageKey, JSON.stringify(pending));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [timer]);

  const checkPendingTimer = useCallback(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const pending = JSON.parse(saved);
        if (pending.isRunning && pending.startTime) {
          const elapsed = Math.floor((Date.now() - pending.startTime) / 1000);
          const remaining = Math.max(0, pending.remainingSeconds - elapsed);
          
          if (remaining > 0) {
            setPendingTimerState({
              ...pending,
              remainingSeconds: remaining,
              isRunning: false,
            });
            setShowRestoreTimer(true);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, [setPendingTimerState, setShowRestoreTimer]);

  const triggerSleep = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimerState({
      isRunning: false,
      remainingSeconds: 0,
      fadeOutStart: false,
      startTime: null,
    });

    setPlayerState({
      isPlaying: false,
      currentType: null,
      currentStoryId: null,
    });
    clearAllTracks();

    const journal = useAppStore.getState().journal;
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = journal.find((e) => e.date === today);
    const addJournalEntry = useAppStore.getState().addJournalEntry;

    if (existingEntry) {
      addJournalEntry({
        ...existingEntry,
        completed: true,
        sleepPlan: {
          ...existingEntry.sleepPlan,
          actualDuration: (timer.mode === 'duration' ? timer.durationMinutes * 60 : timer.remainingSeconds),
        },
      });
    } else {
      addJournalEntry({
        date: today,
        completed: true,
        stories: [],
        musicTracks: [],
        totalDuration: timer.mode === 'duration' ? timer.durationMinutes * 60 : 0,
        sleepPlan: {
          targetTime: timer.targetTime,
          actualDuration: timer.mode === 'duration' ? timer.durationMinutes * 60 : 0,
        },
      });
    }

    const consecutive = useAppStore.getState().checkConsecutiveDays();
    if (consecutive >= 7) {
      useAppStore.getState().unlockSkin('starryBlanket');
    }

    localStorage.removeItem(storageKey);
    setTimeout(() => {
      setShowGoodnight(true);
    }, 300);
  }, [setTimerState, setPlayerState, clearAllTracks, setShowGoodnight, timer]);

  useEffect(() => {
    if (!timer.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      savePendingTimer();
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const current = useAppStore.getState().timer;
      const newRemaining = current.remainingSeconds - 1;

      if (newRemaining <= 0) {
        triggerSleep();
        return;
      }

      const shouldFade = newRemaining <= 5 * 60;
      setTimerState({
        remainingSeconds: newRemaining,
        fadeOutStart: shouldFade,
      });

      savePendingTimer();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.isRunning, setTimerState, triggerSleep, savePendingTimer]);

  useEffect(() => {
    checkPendingTimer();
  }, [checkPendingTimer]);

  useEffect(() => {
    if (timer.mode === 'targetTime' && timer.isRunning) {
      const [hours, minutes] = timer.targetTime.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const remainingSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
      if (Math.abs(remainingSeconds - timer.remainingSeconds) > 2) {
        setTimerState({ remainingSeconds });
      }
    }
  }, [timer.mode, timer.targetTime, timer.isRunning, timer.remainingSeconds, setTimerState]);

  return {
    triggerSleep,
    checkPendingTimer,
  };
};
