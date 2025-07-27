/**
 * AIME Hoodie Economics - Digital Badge System
 * Each lesson completion earns a unique digital hoodie representing Indigenous wisdom and AIME values
 */

export interface DigitalHoodie {
  id: string;
  lessonId: string;
  name: string;
  concept: string;
  description: string;
  color: string;
  pattern: string;
  symbol: string;
  value: number; // Hoodie Economics value points
  unlocksContent: string[]; // What this hoodie unlocks in knowledge hub
  earnedDate?: Date;
  isPhysical: boolean;
}

export const MENTOR_APP_HOODIES: DigitalHoodie[] = [
  {
    id: 'hoodie-know-yourself',
    lessonId: 'know-yourself',
    name: 'The Mirror Hoodie',
    concept: 'Know Yourself',
    description: 'A hoodie that reflects your inner strength and authentic self. Earned through deep self-reflection and understanding.',
    color: '#4F46E5', // Deep indigo
    pattern: 'mirror-reflection',
    symbol: '🪞',
    value: 100,
    unlocksContent: ['advanced-self-discovery', 'mentorship-principles'],
    isPhysical: false
  },
  {
    id: 'hoodie-brave-goals',
    lessonId: 'brave-goals',
    name: 'The Courage Hoodie',
    concept: 'BRAVE Goals',
    description: 'A bold hoodie that embodies fearless ambition and the courage to dream big. For those who set brave goals.',
    color: '#DC2626', // Bold red
    pattern: 'mountain-peaks',
    symbol: '⛰️',
    value: 100,
    unlocksContent: ['goal-setting-masterclass', 'bravery-stories'],
    isPhysical: false
  },
  {
    id: 'hoodie-rebelliousness',
    lessonId: 'rebelliousness',
    name: 'The Rebel Hoodie',
    description: 'A hoodie for positive rebels who challenge systems to create change. Wear your rebellion with pride.',
    concept: 'Rebelliousness',
    color: '#7C2D12', // Deep orange-brown
    pattern: 'lightning-bolt',
    symbol: '⚡',
    value: 100,
    unlocksContent: ['systems-change-toolkit', 'rebellion-philosophy'],
    isPhysical: false
  },
  {
    id: 'hoodie-kindness',
    lessonId: 'kindness',
    name: 'The Heart Hoodie',
    concept: 'Kindness',
    description: 'A gentle hoodie radiating warmth and compassion. For those who lead with kindness in everything they do.',
    color: '#BE185D', // Deep pink
    pattern: 'heart-waves',
    symbol: '💝',
    value: 100,
    unlocksContent: ['kindness-practices', 'community-building'],
    isPhysical: false
  },
  {
    id: 'hoodie-hope',
    lessonId: 'hope',
    name: 'The Dawn Hoodie',
    concept: 'Hope',
    description: 'A hoodie that carries the light of hope into dark places. For dreamers and future-builders.',
    color: '#F59E0B', // Golden yellow
    pattern: 'sunrise-rays',
    symbol: '🌅',
    value: 100,
    unlocksContent: ['hope-strategies', 'future-visioning'],
    isPhysical: false
  },
  {
    id: 'hoodie-freedom',
    lessonId: 'freedom',
    name: 'The Wind Hoodie',
    concept: 'Freedom',
    description: 'A hoodie that flows like the wind, representing liberation and the freedom to be yourself.',
    color: '#059669', // Emerald green
    pattern: 'flowing-wind',
    symbol: '🍃',
    value: 100,
    unlocksContent: ['freedom-philosophy', 'liberation-stories'],
    isPhysical: false
  },
  {
    id: 'hoodie-no-shame',
    lessonId: 'no-shame',
    name: 'The Pride Hoodie',
    concept: 'No Shame',
    description: 'A hoodie that celebrates authenticity without shame. Wear your truth proudly.',
    color: '#7C3AED', // Deep purple
    pattern: 'celebration-burst',
    symbol: '🎉',
    value: 100,
    unlocksContent: ['shame-resilience', 'authentic-living'],
    isPhysical: false
  },
  {
    id: 'hoodie-failure',
    lessonId: 'failure',
    name: 'The Phoenix Hoodie',
    concept: 'Failure',
    description: 'A hoodie that rises from the ashes of failure. For those who learn and grow stronger.',
    color: '#EA580C', // Orange-red
    pattern: 'phoenix-flames',
    symbol: '🔥',
    value: 100,
    unlocksContent: ['failure-wisdom', 'resilience-building'],
    isPhysical: false
  },
  {
    id: 'hoodie-initiative',
    lessonId: 'initiative',
    name: 'The Leader Hoodie',
    concept: 'Initiative',
    description: 'A hoodie for those who step up and take the first move. Leadership through action.',
    color: '#0F172A', // Deep slate
    pattern: 'forward-arrows',
    symbol: '🚀',
    value: 100,
    unlocksContent: ['leadership-training', 'initiative-examples'],
    isPhysical: false
  },
  {
    id: 'hoodie-forgiveness',
    lessonId: 'forgiveness',
    name: 'The Healing Hoodie',
    concept: 'Forgiveness',
    description: 'A hoodie that carries the power of forgiveness and healing. For broken hearts made whole.',
    color: '#0369A1', // Deep blue
    pattern: 'healing-circles',
    symbol: '🕊️',
    value: 100,
    unlocksContent: ['forgiveness-practices', 'healing-journeys'],
    isPhysical: false
  },
  {
    id: 'hoodie-effort',
    lessonId: 'effort',
    name: 'The Work Hoodie',
    concept: 'Effort',
    description: 'A hoodie earned through dedication and hard work. For those who show up every day.',
    color: '#374151', // Dark gray
    pattern: 'work-tools',
    symbol: '🔨',
    value: 100,
    unlocksContent: ['work-ethic-mastery', 'persistence-stories'],
    isPhysical: false
  },
  {
    id: 'hoodie-mentors-not-saviours',
    lessonId: 'mentors-not-saviours',
    name: 'The Guide Hoodie',
    concept: 'Mentors Not Saviours',
    description: 'A hoodie for those who guide without controlling. True mentorship in Indigenous tradition.',
    color: '#92400E', // Earth brown
    pattern: 'guiding-paths',
    symbol: '🧭',
    value: 100,
    unlocksContent: ['mentorship-mastery', 'indigenous-guidance'],
    isPhysical: false
  },
  {
    id: 'hoodie-change',
    lessonId: 'change',
    name: 'The Transform Hoodie',
    concept: 'Change',
    description: 'A hoodie that evolves with you. For changemakers and transformation leaders.',
    color: '#065F46', // Deep teal
    pattern: 'transformation-spiral',
    symbol: '🦋',
    value: 100,
    unlocksContent: ['change-mastery', 'transformation-tools'],
    isPhysical: false
  },
  {
    id: 'hoodie-gift-of-time',
    lessonId: 'gift-of-time',
    name: 'The Sacred Hoodie',
    concept: 'The Gift of Time',
    description: 'A hoodie that honors the sacred gift of time shared in mentorship. Time as the ultimate gift.',
    color: '#581C87', // Deep violet
    pattern: 'time-spirals',
    symbol: '⏳',
    value: 100,
    unlocksContent: ['time-wisdom', 'sacred-moments'],
    isPhysical: false
  },
  {
    id: 'hoodie-empathy',
    lessonId: 'empathy',
    name: 'The Connection Hoodie',
    concept: 'Empathy',
    description: 'A hoodie that connects hearts across differences. For those who feel deeply and understand.',
    color: '#BE123C', // Deep rose
    pattern: 'connected-hearts',
    symbol: '💗',
    value: 100,
    unlocksContent: ['empathy-skills', 'deep-connection'],
    isPhysical: false
  },
  {
    id: 'hoodie-yes-and',
    lessonId: 'yes-and',
    name: 'The Possibility Hoodie',
    concept: 'Yes And',
    description: 'A hoodie that opens doors to infinite possibilities. Yes to life, and more.',
    color: '#15803D', // Vibrant green
    pattern: 'open-doors',
    symbol: '🚪',
    value: 100,
    unlocksContent: ['possibility-thinking', 'opportunity-creation'],
    isPhysical: false
  },
  {
    id: 'hoodie-listening',
    lessonId: 'listening',
    name: 'The Wisdom Hoodie',
    concept: 'Listening',
    description: 'A hoodie for deep listeners who hear between the words. Wisdom through listening.',
    color: '#1E40AF', // Deep blue
    pattern: 'sound-waves',
    symbol: '👂',
    value: 100,
    unlocksContent: ['listening-mastery', 'deep-hearing'],
    isPhysical: false
  },
  {
    id: 'hoodie-asking-questions',
    lessonId: 'asking-questions',
    name: 'The Curiosity Hoodie',
    concept: 'Asking Questions',
    description: 'A hoodie for the eternally curious. Those who ask the questions that matter.',
    color: '#7C2D12', // Deep brown
    pattern: 'question-marks',
    symbol: '❓',
    value: 100,
    unlocksContent: ['questioning-mastery', 'curiosity-cultivation'],
    isPhysical: false
  },
  // The ultimate reward - physical hoodie
  {
    id: 'hoodie-mentor-master',
    lessonId: 'completion',
    name: 'The AIME Mentor Master Hoodie',
    concept: 'Complete Journey',
    description: 'The ultimate hoodie - a physical AIME hoodie shipped to your door. You have mastered the 18 principles of mentorship through Indigenous wisdom.',
    color: '#000000', // AIME black
    pattern: 'aime-logo',
    symbol: '🏆',
    value: 1800, // Sum of all lessons
    unlocksContent: ['mentor-certification', 'advanced-programs', 'mentor-network'],
    isPhysical: true
  }
];

export const HOODIE_PATTERNS = {
  'mirror-reflection': 'radial-gradient(circle, rgba(79,70,229,0.8) 0%, rgba(79,70,229,0.4) 100%)',
  'mountain-peaks': 'linear-gradient(45deg, #DC2626 25%, transparent 25%), linear-gradient(-45deg, #DC2626 25%, transparent 25%)',
  'lightning-bolt': 'repeating-linear-gradient(45deg, #7C2D12, #7C2D12 5px, #EA580C 5px, #EA580C 10px)',
  'heart-waves': 'radial-gradient(ellipse at center, rgba(190,24,93,0.8) 0%, rgba(190,24,93,0.2) 100%)',
  'sunrise-rays': 'conic-gradient(from 0deg, #F59E0B, #FCD34D, #F59E0B)',
  'flowing-wind': 'linear-gradient(90deg, rgba(5,150,105,0.8) 0%, rgba(5,150,105,0.2) 50%, rgba(5,150,105,0.8) 100%)',
  'celebration-burst': 'radial-gradient(circle, #7C3AED 20%, #A855F7 40%, #C084FC 80%)',
  'phoenix-flames': 'linear-gradient(0deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
  'forward-arrows': 'repeating-linear-gradient(90deg, #0F172A 0%, #0F172A 10px, #334155 10px, #334155 20px)',
  'healing-circles': 'radial-gradient(circle at 25% 25%, rgba(3,105,161,0.6) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(3,105,161,0.6) 0%, transparent 50%)',
  'work-tools': 'linear-gradient(45deg, #374151 25%, #4B5563 25%, #4B5563 50%, #374151 50%)',
  'guiding-paths': 'repeating-linear-gradient(45deg, #92400E, #92400E 3px, #B45309 3px, #B45309 6px)',
  'transformation-spiral': 'conic-gradient(from 45deg, #065F46, #047857, #059669, #10B981)',
  'time-spirals': 'conic-gradient(from 0deg, #581C87, #7C3AED, #A855F7, #581C87)',
  'connected-hearts': 'radial-gradient(ellipse at top left, rgba(190,18,60,0.8) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(190,18,60,0.8) 0%, transparent 50%)',
  'open-doors': 'linear-gradient(90deg, #15803D 0%, #16A34A 25%, #22C55E 50%, #16A34A 75%, #15803D 100%)',
  'sound-waves': 'repeating-radial-gradient(circle, rgba(30,64,175,0.8) 0%, rgba(30,64,175,0.2) 10%, rgba(30,64,175,0.8) 20%)',
  'question-marks': 'repeating-linear-gradient(45deg, #7C2D12, #7C2D12 8px, #92400E 8px, #92400E 16px)',
  'aime-logo': 'linear-gradient(135deg, #000000 0%, #1F2937 50%, #000000 100%)'
};

export function getHoodieForLesson(lessonId: string): DigitalHoodie | null {
  // Try exact match first
  let hoodie = MENTOR_APP_HOODIES.find(h => h.lessonId === lessonId);
  if (hoodie) return hoodie;
  
  // Try with lesson ID transformations
  const normalizedLessonId = lessonId.replace(/\s+/g, '-').toLowerCase();
  hoodie = MENTOR_APP_HOODIES.find(h => h.lessonId === normalizedLessonId);
  if (hoodie) return hoodie;
  
  // Try matching by concept name in lesson title
  const lessonTitle = lessonId.replace(/-/g, ' ').toLowerCase();
  hoodie = MENTOR_APP_HOODIES.find(h => 
    lessonTitle.includes(h.concept.toLowerCase()) ||
    h.concept.toLowerCase().includes(lessonTitle)
  );
  if (hoodie) return hoodie;
  
  // Try finding by extracting key concept from lesson ID/title
  const concepts = [
    'know yourself', 'brave goals', 'rebelliousness', 'kindness', 'hope', 
    'freedom', 'no shame', 'failure', 'initiative', 'forgiveness', 'effort',
    'mentors not saviours', 'change', 'gift of time', 'empathy', 'yes and',
    'listening', 'asking questions'
  ];
  
  for (const concept of concepts) {
    if (lessonTitle.includes(concept) || lessonId.toLowerCase().includes(concept.replace(/\s+/g, '-'))) {
      hoodie = MENTOR_APP_HOODIES.find(h => h.concept.toLowerCase() === concept);
      if (hoodie) return hoodie;
    }
  }
  
  console.warn(`No hoodie found for lesson: ${lessonId}. Available hoodies:`, MENTOR_APP_HOODIES.map(h => h.lessonId));
  return null;
}

export function getTotalHoodieValue(earnedHoodies: string[]): number {
  return MENTOR_APP_HOODIES
    .filter(hoodie => earnedHoodies.includes(hoodie.id))
    .reduce((total, hoodie) => total + hoodie.value, 0);
}

export function getUnlockedContent(earnedHoodies: string[]): string[] {
  return MENTOR_APP_HOODIES
    .filter(hoodie => earnedHoodies.includes(hoodie.id))
    .flatMap(hoodie => hoodie.unlocksContent);
}

export function isEligibleForPhysicalHoodie(earnedHoodies: string[]): boolean {
  const regularHoodies = MENTOR_APP_HOODIES.filter(h => !h.isPhysical);
  const earnedRegularHoodies = earnedHoodies.filter(id => 
    regularHoodies.some(h => h.id === id)
  );
  return earnedRegularHoodies.length >= regularHoodies.length;
}