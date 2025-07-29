'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DigitalHoodie, MENTOR_APP_HOODIES, getHoodieForLesson, isEligibleForPhysicalHoodie, getTotalHoodieValue } from './hoodie-definitions';

interface HoodieContextType {
  earnedHoodies: string[];
  totalValue: number;
  isPhysicalEligible: boolean;
  earnHoodie: (lessonId: string) => Promise<DigitalHoodie | null>;
  getEarnedHoodie: (hoodieId: string) => DigitalHoodie | null;
  getAllEarnedHoodies: () => DigitalHoodie[];
  celebrationHoodie: DigitalHoodie | null;
  clearCelebration: () => void;
  resetProgress: () => void;
}

const HoodieContext = createContext<HoodieContextType | undefined>(undefined);

interface HoodieProviderProps {
  children: ReactNode;
}

export function HoodieProvider({ children }: HoodieProviderProps) {
  const [earnedHoodies, setEarnedHoodies] = useState<string[]>([]);
  const [celebrationHoodie, setCelebrationHoodie] = useState<DigitalHoodie | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    const savedHoodies = localStorage.getItem('aime-earned-hoodies');
    if (savedHoodies) {
      try {
        const hoodies = JSON.parse(savedHoodies);
        setEarnedHoodies(hoodies);
      } catch (error) {
        console.error('Failed to load saved hoodies:', error);
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (earnedHoodies.length > 0) {
      localStorage.setItem('aime-earned-hoodies', JSON.stringify(earnedHoodies));
    }
  }, [earnedHoodies]);

  const earnHoodie = async (lessonId: string): Promise<DigitalHoodie | null> => {
    // Find the hoodie for this lesson
    const hoodie = getHoodieForLesson(lessonId);
    if (!hoodie) {
      console.warn(`No hoodie found for lesson: ${lessonId}`);
      return null;
    }

    // Check if already earned
    if (earnedHoodies.includes(hoodie.id)) {
      console.log(`Hoodie already earned: ${hoodie.name}`);
      return hoodie;
    }

    // Add to earned hoodies
    const newEarnedHoodies = [...earnedHoodies, hoodie.id];
    setEarnedHoodies(newEarnedHoodies);

    // Mark earned date
    const earnedHoodie = { ...hoodie, earnedDate: new Date() };

    // Trigger celebration
    setCelebrationHoodie(earnedHoodie);

    // Check if user is now eligible for physical hoodie
    if (isEligibleForPhysicalHoodie(newEarnedHoodies) && !earnedHoodies.includes('hoodie-mentor-master')) {
      // Auto-award the physical hoodie
      setTimeout(() => {
        const physicalHoodie = MENTOR_APP_HOODIES.find(h => h.id === 'hoodie-mentor-master');
        if (physicalHoodie) {
          setEarnedHoodies(prev => [...prev, 'hoodie-mentor-master']);
          setCelebrationHoodie({ ...physicalHoodie, earnedDate: new Date() });
        }
      }, 3000); // Delay to let first celebration finish
    }

    console.log(`🏆 Hoodie earned: ${hoodie.name} (${hoodie.value} value)`);
    return earnedHoodie;
  };

  const getEarnedHoodie = (hoodieId: string): DigitalHoodie | null => {
    if (!earnedHoodies.includes(hoodieId)) return null;
    return MENTOR_APP_HOODIES.find(h => h.id === hoodieId) || null;
  };

  const getAllEarnedHoodies = (): DigitalHoodie[] => {
    return MENTOR_APP_HOODIES.filter(hoodie => earnedHoodies.includes(hoodie.id));
  };

  const clearCelebration = () => {
    setCelebrationHoodie(null);
  };

  const resetProgress = () => {
    setEarnedHoodies([]);
    setCelebrationHoodie(null);
    localStorage.removeItem('aime-earned-hoodies');
  };

  const totalValue = getTotalHoodieValue(earnedHoodies);
  const isPhysicalEligible = isEligibleForPhysicalHoodie(earnedHoodies);

  return (
    <HoodieContext.Provider
      value={{
        earnedHoodies,
        totalValue,
        isPhysicalEligible,
        earnHoodie,
        getEarnedHoodie,
        getAllEarnedHoodies,
        celebrationHoodie,
        clearCelebration,
        resetProgress,
      }}
    >
      {children}
    </HoodieContext.Provider>
  );
}

export function useHoodie() {
  const context = useContext(HoodieContext);
  if (context === undefined) {
    throw new Error('useHoodie must be used within a HoodieProvider');
  }
  return context;
}