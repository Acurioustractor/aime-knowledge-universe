/**
 * Indigenous Systems Thinking & Nature-Based Challenges
 * Challenges rooted in Indigenous custodianship that unlock unique hoodies
 * and build real-world skills for systems transformation
 */

import { Challenge, ChallengeStep, HoodieReward } from './master-hoodie-system';

export const INDIGENOUS_NATURE_CHALLENGES: Challenge[] = [
  {
    id: 'seven-generations-thinking',
    name: 'Seven Generations Systems Thinking',
    description: 'Learn to think like your ancestors - consider the impact of decisions on seven generations into the future. A fundamental Indigenous approach to systems thinking.',
    category: 'systems-thinking',
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    prerequisites: ['basic-systems-awareness'],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Apply long-term thinking to a real project or decision in your community',
    indigenousWisdom: 'Seven Generations principle from Haudenosaunee (Iroquois) tradition - every decision should consider the impact on children seven generations in the future',
    isActive: true,
    steps: [
      {
        id: 'learn-principle',
        title: 'Understand the Seven Generations Principle',
        description: 'Learn about this Indigenous decision-making framework that considers impact 150+ years into the future',
        type: 'learning',
        content: 'Study the Haudenosaunee Seven Generations principle and how it guides sustainable decision-making',
        verification: 'self-report',
        timeEstimate: '2 hours',
        resources: ['indigenous-governance-principles', 'seven-generations-videos'],
        isCompleted: false
      },
      {
        id: 'map-current-systems',
        title: 'Map Your Current Systems',
        description: 'Identify a system you\'re part of (family, work, community) and map its current decision-making patterns',
        type: 'reflection',
        content: 'Create a visual map showing how decisions are currently made and their short vs long-term impacts',
        verification: 'peer-review',
        timeEstimate: '3 hours',
        resources: ['systems-mapping-tools', 'decision-tree-templates'],
        isCompleted: false
      },
      {
        id: 'apply-seven-generations',
        title: 'Apply Seven Generations Thinking',
        description: 'Take a real decision facing your system and analyze it through the seven generations lens',
        type: 'action',
        content: 'Document how this decision might impact people 150 years from now, considering environmental, social, and cultural effects',
        verification: 'mentor-approval',
        timeEstimate: '4 hours',
        resources: ['future-impact-worksheets', 'sustainability-frameworks'],
        isCompleted: false
      },
      {
        id: 'teach-others',
        title: 'Share the Wisdom',
        description: 'Teach the Seven Generations principle to others in your network',
        type: 'community',
        content: 'Lead a workshop, create content, or facilitate a discussion about long-term thinking in decision-making',
        verification: 'peer-review',
        timeEstimate: '2 hours',
        resources: ['teaching-templates', 'workshop-guides'],
        isCompleted: false
      },
      {
        id: 'implement-change',
        title: 'Create Lasting Change',
        description: 'Implement a change in your system that embodies seven generations thinking',
        type: 'action',
        content: 'Make a concrete change that demonstrates this long-term perspective and document its impact',
        verification: 'data-tracking',
        timeEstimate: 'Ongoing',
        resources: ['implementation-guides', 'impact-tracking-tools'],
        isCompleted: false
      }
    ],
    rewards: [
      {
        hoodieId: 'seven-generations-hoodie',
        unlockCondition: 'Complete all steps and demonstrate real-world application',
        bonusValue: 200,
        specialEdition: true
      }
    ]
  },

  {
    id: 'country-connection-challenge',
    name: 'Country Connection & Seasonal Wisdom',
    description: 'Deepen your connection to Country (land) through seasonal awareness, weather patterns, and ecological understanding. Learn how Indigenous peoples read the land.',
    category: 'nature',
    difficulty: 'beginner',
    estimatedTime: '3 months (seasonal cycle)',
    prerequisites: [],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Develop practical skills for reading your local environment and its seasonal patterns',
    indigenousWisdom: 'Country connection practices from Aboriginal Australian culture - understanding that land is not owned but is a living ancestor that teaches',
    isActive: true,
    seasonalAvailability: ['spring', 'summer', 'autumn', 'winter'],
    steps: [
      {
        id: 'choose-your-sit-spot',
        title: 'Choose Your Sit Spot',
        description: 'Find a place in nature where you can sit regularly and observe. This becomes your classroom for Country connection.',
        type: 'action',
        content: 'Choose a natural place you can visit weekly. It could be a park, garden, or wild space. This is your learning place.',
        verification: 'self-report',
        timeEstimate: '1 hour',
        resources: ['sit-spot-guide', 'nature-observation-tips'],
        isCompleted: false
      },
      {
        id: 'weekly-observations',
        title: 'Weekly Nature Observations',
        description: 'Spend time each week at your sit spot, observing and recording what you notice about the natural world',
        type: 'reflection',
        content: 'Journal about weather patterns, plant changes, animal behavior, seasonal shifts. Notice what the land is teaching.',
        verification: 'self-report',
        timeEstimate: '1 hour weekly',
        resources: ['nature-journal-templates', 'observation-guides'],
        isCompleted: false
      },
      {
        id: 'learn-local-ecology',
        title: 'Learn Your Local Ecology',
        description: 'Research the Indigenous history and ecological systems of your area. What plants, animals, and seasons did traditional peoples recognize?',
        type: 'learning',
        content: 'Study local Indigenous knowledge about your area\'s ecology, seasonal calendars, and traditional land management',
        verification: 'peer-review',
        timeEstimate: '3 hours',
        resources: ['local-indigenous-knowledge', 'ecological-guides'],
        isCompleted: false
      },
      {
        id: 'seasonal-ceremony',
        title: 'Create a Seasonal Recognition Practice',
        description: 'Develop a respectful way to acknowledge and celebrate seasonal transitions in your area',
        type: 'creation',
        content: 'Create a personal or community practice for marking seasonal changes with respect to local Indigenous traditions',
        verification: 'mentor-approval',
        timeEstimate: '2 hours',
        resources: ['ceremony-guidelines', 'cultural-protocols'],
        isCompleted: false
      },
      {
        id: 'share-country-wisdom',
        title: 'Share Country Wisdom',
        description: 'Share what you\'ve learned about your local Country with others in a respectful way',
        type: 'community',
        content: 'Create educational content, lead nature walks, or facilitate discussions about local ecological knowledge',
        verification: 'peer-review',
        timeEstimate: '3 hours',
        resources: ['education-templates', 'cultural-sharing-protocols'],
        isCompleted: false
      }
    ],
    rewards: [
      {
        hoodieId: 'country-connection-hoodie',
        unlockCondition: 'Complete full seasonal cycle of observations',
        bonusValue: 150
      }
    ]
  },

  {
    id: 'circular-economics-challenge',
    name: 'Circular Economics & Gift Culture',
    description: 'Learn Indigenous economic principles that prioritize relationship, reciprocity, and regeneration over extraction and accumulation.',
    category: 'systems-thinking',
    difficulty: 'advanced',
    estimatedTime: '6 weeks',
    prerequisites: ['basic-economics-understanding', 'community-engagement'],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Implement circular economic practices in your personal or professional life',
    indigenousWisdom: 'Potlatch and gift economy traditions from Pacific Northwest peoples - wealth measured by what you give away, not what you accumulate',
    isActive: true,
    steps: [
      {
        id: 'study-gift-economy',
        title: 'Understand Gift Economy Principles',
        description: 'Learn how Indigenous gift economies create abundance through giving rather than hoarding',
        type: 'learning',
        content: 'Study examples of gift economies, potlatch ceremonies, and how Indigenous societies created wealth through generosity',
        verification: 'peer-review',
        timeEstimate: '4 hours',
        resources: ['gift-economy-studies', 'potlatch-history', 'indigenous-economics'],
        isCompleted: false
      },
      {
        id: 'map-extraction-patterns',
        title: 'Map Current Extraction Patterns',
        description: 'Analyze how current economic systems in your life operate on extraction vs regeneration principles',
        type: 'reflection',
        content: 'Identify where you participate in extractive economics vs regenerative practices in work, consumption, relationships',
        verification: 'self-report',
        timeEstimate: '3 hours',
        resources: ['extraction-mapping-tools', 'economic-analysis-guides'],
        isCompleted: false
      },
      {
        id: 'design-gift-practice',
        title: 'Design a Gift Practice',
        description: 'Create a personal or community practice that embodies gift economy principles',
        type: 'creation',
        content: 'Design a way to give that creates abundance for others - skills, time, resources, knowledge, or connections',
        verification: 'mentor-approval',
        timeEstimate: '2 hours',
        resources: ['gift-practice-templates', 'community-giving-models'],
        isCompleted: false
      },
      {
        id: 'implement-circular-practices',
        title: 'Implement Circular Practices',
        description: 'Put circular economic principles into practice in your daily life for 4 weeks',
        type: 'action',
        content: 'Practice gifting, sharing, repairing, regenerating instead of consuming and discarding',
        verification: 'data-tracking',
        timeEstimate: '4 weeks ongoing',
        resources: ['circular-practice-guide', 'tracking-templates'],
        isCompleted: false
      },
      {
        id: 'teach-circular-economics',
        title: 'Teach Circular Economics',
        description: 'Share Indigenous economic wisdom with others through education or example',
        type: 'community',
        content: 'Create learning opportunities for others to understand and practice circular/gift economics',
        verification: 'peer-review',
        timeEstimate: '3 hours',
        resources: ['teaching-materials', 'workshop-templates'],
        isCompleted: false
      }
    ],
    rewards: [
      {
        hoodieId: 'gift-economy-hoodie',
        unlockCondition: 'Successfully implement and teach circular economic practices',
        bonusValue: 250,
        specialEdition: true
      }
    ]
  },

  {
    id: 'story-systems-challenge',
    name: 'Story as Systems Change',
    description: 'Learn how Indigenous storytelling traditions carry complex systems knowledge and use story to create cultural transformation.',
    category: 'indigenous-wisdom',
    difficulty: 'intermediate',
    estimatedTime: '4 weeks',
    prerequisites: ['listening-mastery'],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Use storytelling to create positive change in your community',
    indigenousWisdom: 'Storytelling traditions from global Indigenous cultures - stories as technology for transmitting complex knowledge across generations',
    isActive: true,
    steps: [
      {
        id: 'learn-story-technology',
        title: 'Understand Story as Technology',
        description: 'Learn how Indigenous stories carry scientific, ecological, social, and spiritual knowledge in memorable forms',
        type: 'learning',
        content: 'Study examples of how Indigenous stories encode complex systems knowledge and cultural teachings',
        verification: 'peer-review',
        timeEstimate: '3 hours',
        resources: ['story-technology-examples', 'indigenous-storytelling-traditions'],
        isCompleted: false
      },
      {
        id: 'analyze-current-stories',
        title: 'Analyze Current Cultural Stories',
        description: 'Identify the dominant stories that shape systems in your community - what narratives drive behavior?',
        type: 'reflection',
        content: 'Map the stories (spoken and unspoken) that influence how your community operates and makes decisions',
        verification: 'mentor-approval',
        timeEstimate: '2 hours',
        resources: ['narrative-analysis-tools', 'cultural-story-mapping'],
        isCompleted: false
      },
      {
        id: 'craft-transformation-story',
        title: 'Craft a Systems Transformation Story',
        description: 'Create a story that carries new possibilities for positive systems change',
        type: 'creation',
        content: 'Write or develop a story that helps people imagine and move toward better ways of being together',
        verification: 'peer-review',
        timeEstimate: '4 hours',
        resources: ['story-crafting-guides', 'transformation-narrative-examples'],
        isCompleted: false
      },
      {
        id: 'share-your-story',
        title: 'Share Your Story',
        description: 'Tell your transformation story to others and observe its impact on thinking and behavior',
        type: 'community',
        content: 'Share your story through appropriate channels and gather feedback on how it lands with different audiences',
        verification: 'peer-review',
        timeEstimate: '2 hours',
        resources: ['storytelling-platforms', 'impact-measurement-tools'],
        isCompleted: false
      },
      {
        id: 'amplify-story-impact',
        title: 'Amplify Story Impact',
        description: 'Help your story create lasting change by supporting others to tell similar stories',
        type: 'action',
        content: 'Create opportunities for others to develop and share their own transformation stories',
        verification: 'data-tracking',
        timeEstimate: 'Ongoing',
        resources: ['story-circle-guides', 'community-storytelling-programs'],
        isCompleted: false
      }
    ],
    rewards: [
      {
        hoodieId: 'story-weaver-hoodie',
        unlockCondition: 'Create and share a story that demonstrates systems transformation impact',
        bonusValue: 180
      }
    ]
  },

  {
    id: 'water-wisdom-challenge',
    name: 'Water Wisdom & Flow Systems',
    description: 'Learn from water as teacher - understanding flow, adaptation, and life-giving principles that can transform how we approach systems change.',
    category: 'nature',
    difficulty: 'beginner',
    estimatedTime: '3 weeks',
    prerequisites: [],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Apply water principles to create more flowing, adaptive systems in your life',
    indigenousWisdom: 'Water teachings from many Indigenous traditions - water as first medicine, life-giver, and teacher of flow and adaptation',
    isActive: true,
    steps: [
      {
        id: 'water-observation',
        title: 'Observe Water in Nature',
        description: 'Spend time observing different forms of water and how it moves, adapts, and creates life',
        type: 'reflection',
        content: 'Visit rivers, lakes, rain, or even observe water from a tap. Notice how water behaves and what it teaches',
        verification: 'self-report',
        timeEstimate: '3 hours over 1 week',
        resources: ['water-observation-guide', 'nature-journaling-prompts'],
        isCompleted: false
      },
      {
        id: 'learn-water-teachings',
        title: 'Learn Indigenous Water Teachings',
        description: 'Study how Indigenous cultures understand water as teacher, medicine, and sacred life force',
        type: 'learning',
        content: 'Research water ceremonies, teachings, and the role of water in Indigenous worldviews',
        verification: 'peer-review',
        timeEstimate: '2 hours',
        resources: ['water-teachings-collection', 'indigenous-water-ceremonies'],
        isCompleted: false
      },
      {
        id: 'apply-water-principles',
        title: 'Apply Water Principles to Systems',
        description: 'Identify areas in your life where you can apply water\'s qualities: flow, persistence, adaptation, nourishment',
        type: 'action',
        content: 'Choose a stuck area in your personal or professional life and apply water wisdom to create flow',
        verification: 'self-report',
        timeEstimate: '2 weeks ongoing',
        resources: ['water-principles-guide', 'flow-system-tools'],
        isCompleted: false
      },
      {
        id: 'water-gratitude-ceremony',
        title: 'Practice Water Gratitude',
        description: 'Create a respectful practice for honoring water and its teachings in your daily life',
        type: 'creation',
        content: 'Develop a daily or weekly practice that honors water and integrates its teachings',
        verification: 'self-report',
        timeEstimate: '1 hour',
        resources: ['gratitude-ceremony-guides', 'daily-practice-templates'],
        isCompleted: false
      },
      {
        id: 'share-water-wisdom',
        title: 'Share Water Wisdom',
        description: 'Teach others about water as teacher and how its principles can guide better systems',
        type: 'community',
        content: 'Create educational content or experiences that help others learn from water',
        verification: 'peer-review',
        timeEstimate: '2 hours',
        resources: ['water-education-materials', 'experiential-learning-guides'],
        isCompleted: false
      }
    ],
    rewards: [
      {
        hoodieId: 'water-wisdom-hoodie',
        unlockCondition: 'Complete all water teachings and demonstrate application in daily life',
        bonusValue: 130
      }
    ]
  }
];

// Special Seasonal and Community Challenges
export const SEASONAL_CHALLENGES: Challenge[] = [
  {
    id: 'spring-renewal-challenge',
    name: 'Spring Renewal & Regeneration',
    description: 'Align with spring energy to plant seeds of positive change in your community',
    category: 'nature',
    difficulty: 'beginner',
    estimatedTime: '6 weeks',
    prerequisites: [],
    participants: 0,
    completionRate: 0,
    realWorldApplication: 'Start a regenerative project that grows throughout the year',
    indigenousWisdom: 'Spring planting and renewal ceremonies from global Indigenous traditions',
    isActive: false, // Activated seasonally
    seasonalAvailability: ['spring'],
    steps: [], // Would be filled with spring-specific activities
    rewards: [
      {
        hoodieId: 'spring-regeneration-hoodie',
        unlockCondition: 'Complete during spring season',
        specialEdition: true
      }
    ]
  }
  // Additional seasonal challenges for summer, autumn, winter...
];

export function getActiveChalllenges(): Challenge[] {
  const currentSeason = getCurrentSeason();
  return INDIGENOUS_NATURE_CHALLENGES.filter(c => c.isActive)
    .concat(SEASONAL_CHALLENGES.filter(c => 
      c.isActive || (c.seasonalAvailability && c.seasonalAvailability.includes(currentSeason))
    ));
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}