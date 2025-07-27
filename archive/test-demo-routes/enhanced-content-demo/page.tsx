/**
 * Enhanced Content Presentation Demo
 * 
 * Demonstrates the complete enhanced content presentation system including
 * philosophy-first templates, implementation pathways, and evidence-story integration
 */

'use client';

import { useState } from 'react';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  MapIcon,
  ChartBarIcon,
  LightBulbIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import PhilosophyFirstContentTemplate from '@/components/content/PhilosophyFirstContentTemplate';
import ImplementationPathwayVisualization from '@/components/content/ImplementationPathwayVisualization';
import EvidenceStoryIntegration from '@/components/content/EvidenceStoryIntegration';

export default function EnhancedContentDemoPage() {
  const [activeDemo, setActiveDemo] = useState<'template' | 'pathway' | 'evidence'>('template');

  // Sample data for demonstrations
  const sampleContent = {
    id: 'imagination-mentoring-demo',
    title: 'Imagination-Based Mentoring: Unlocking Potential Through Story',
    description: 'Discover how imagination and storytelling can transform mentoring relationships and unlock hidden potential in young people.',
    content: `Imagination is not just about creativity—it's about seeing possibility where others see limitation. In mentoring relationships, imagination becomes a powerful tool for unlocking potential and creating pathways to success.

When we approach mentoring through an imagination-based lens, we move beyond traditional models of advice-giving to become co-creators of possibility. This approach recognizes that every young person carries within them unique gifts and potential that can be unlocked through the right relationship and approach.

The power of imagination in mentoring lies in its ability to help both mentor and mentee envision futures that might not seem immediately possible. Through storytelling, creative exercises, and imaginative exploration, mentoring relationships become spaces of transformation and growth.

This philosophy-first approach to mentoring has been proven to create deeper connections, more meaningful outcomes, and lasting impact that extends far beyond the formal mentoring relationship.`,
    philosophyContext: {
      domain: 'Imagination-Based Learning',
      coreValue: 'Every person has unlimited potential waiting to be unlocked',
      keyPrinciple: 'Imagination creates pathways to possibility',
      practicalApplication: 'Use storytelling and creative exercises in mentoring sessions',
      expectedOutcome: 'Deeper connections and transformational growth for both mentor and mentee'
    },
    businessCase: {
      problem: 'Traditional mentoring approaches often fail to create lasting impact because they focus on advice-giving rather than potential unlocking.',
      solution: 'Imagination-based mentoring creates deeper connections through storytelling and creative exploration, leading to more meaningful outcomes.',
      benefits: [
        'Increased engagement and retention in mentoring programs',
        'Deeper, more meaningful relationships between mentors and mentees',
        'Better outcomes in academic and personal development',
        'Enhanced creativity and problem-solving skills',
        'Stronger sense of identity and purpose in young people'
      ],
      evidence: [
        {
          type: 'story' as const,
          title: 'Marcus\'s Transformation Through Imaginative Mentoring',
          content: 'Marcus was a quiet 16-year-old who struggled with confidence and direction. Through imagination-based mentoring sessions that included storytelling and creative visualization, he discovered his passion for environmental science and developed the confidence to pursue university studies.',
          source: 'AIME Mentoring Program Case Study',
          impact: '85% improvement in academic performance',
          credibility: 5
        },
        {
          type: 'data' as const,
          title: 'Program Effectiveness Statistics',
          content: 'Programs using imagination-based mentoring show 40% higher retention rates and 60% better long-term outcomes compared to traditional mentoring approaches.',
          source: 'AIME Internal Research 2023',
          impact: '40% higher retention, 60% better outcomes',
          credibility: 4
        }
      ]
    },
    implementationPathway: {
      overview: 'Implementing imagination-based mentoring requires a shift from traditional advice-giving to co-creative exploration. This pathway guides you through the essential steps to transform your mentoring approach.',
      timeline: '8-12 weeks for full implementation',
      steps: [
        {
          id: 'step-1',
          title: 'Understand the Philosophy',
          description: 'Deep dive into imagination-based learning principles and how they apply to mentoring relationships.',
          philosophyConnection: 'Imagination is the foundation of all learning and growth - it allows us to see beyond current limitations.',
          timeEstimate: '1-2 weeks',
          difficulty: 'easy' as const,
          prerequisites: [],
          resources: ['Philosophy primer materials', 'Core values documentation', 'Principle explanation videos'],
          successMetrics: ['Can articulate core philosophy', 'Understands difference from traditional mentoring', 'Identifies personal connection to approach']
        },
        {
          id: 'step-2',
          title: 'Develop Storytelling Skills',
          description: 'Learn to use stories as tools for connection, inspiration, and possibility creation in mentoring sessions.',
          philosophyConnection: 'Stories are vehicles for wisdom and understanding - they help us connect with deeper truths.',
          timeEstimate: '2-3 weeks',
          difficulty: 'medium' as const,
          prerequisites: ['step-1'],
          resources: ['Storytelling workshop materials', 'Story bank for mentors', 'Practice exercises'],
          successMetrics: ['Can tell compelling personal stories', 'Knows how to elicit stories from mentees', 'Uses stories to illustrate key points']
        },
        {
          id: 'step-3',
          title: 'Practice Creative Exercises',
          description: 'Master a toolkit of imagination-based activities that can be used in mentoring sessions.',
          philosophyConnection: 'Creativity unlocks potential by helping people see new possibilities and pathways.',
          timeEstimate: '2-3 weeks',
          difficulty: 'medium' as const,
          prerequisites: ['step-1', 'step-2'],
          resources: ['Creative exercise toolkit', 'Activity guides', 'Facilitation tips'],
          successMetrics: ['Comfortable facilitating creative activities', 'Can adapt exercises to different mentees', 'Sees positive engagement from mentees']
        },
        {
          id: 'step-4',
          title: 'Build Deeper Relationships',
          description: 'Apply imagination-based techniques to create stronger, more meaningful connections with mentees.',
          philosophyConnection: 'Relationships are the foundation of all growth - imagination helps us connect at a deeper level.',
          timeEstimate: '3-4 weeks',
          difficulty: 'hard' as const,
          prerequisites: ['step-1', 'step-2', 'step-3'],
          resources: ['Relationship building guide', 'Communication techniques', 'Conflict resolution tools'],
          successMetrics: ['Stronger rapport with mentees', 'More open communication', 'Increased trust and vulnerability']
        }
      ],
      successStories: [
        'Sarah, a university mentor, saw her mentee\'s engagement increase by 200% after implementing storytelling techniques.',
        'The Melbourne program reported 45% higher completion rates after training mentors in imagination-based approaches.',
        'Indigenous mentors found that creative exercises helped bridge cultural gaps and create deeper understanding.'
      ]
    },
    relatedConcepts: ['imagination', 'storytelling', 'mentoring', 'potential', 'creativity', 'relationships'],
    tags: ['mentoring', 'imagination', 'storytelling', 'youth development', 'education'],
    estimatedReadTime: 12,
    difficultyLevel: 'intermediate' as const
  };

  const samplePathwaySteps = [
    {
      id: 'pathway-step-1',
      title: 'Foundation: Understanding Imagination-Based Learning',
      description: 'Establish a deep understanding of how imagination drives learning and personal growth.',
      philosophyConnection: 'Imagination is the cornerstone of all learning - it allows us to envision what could be.',
      timeEstimate: '2 weeks',
      difficulty: 'easy' as const,
      prerequisites: [],
      resources: ['Philosophy materials', 'Video content', 'Reading list'],
      successMetrics: ['Articulate core principles', 'Identify personal connections', 'Understand practical applications'],
      status: 'completed' as const,
      completionPercentage: 100
    },
    {
      id: 'pathway-step-2',
      title: 'Skill Building: Storytelling Mastery',
      description: 'Develop the ability to use stories as powerful tools for connection and inspiration.',
      philosophyConnection: 'Stories carry wisdom and create understanding between people.',
      timeEstimate: '3 weeks',
      difficulty: 'medium' as const,
      prerequisites: ['pathway-step-1'],
      resources: ['Storytelling workshop', 'Practice exercises', 'Feedback tools'],
      successMetrics: ['Tell compelling stories', 'Elicit stories from others', 'Use stories strategically'],
      status: 'in_progress' as const,
      completionPercentage: 65
    },
    {
      id: 'pathway-step-3',
      title: 'Application: Creative Mentoring Techniques',
      description: 'Apply imagination-based techniques in real mentoring relationships.',
      philosophyConnection: 'Creativity unlocks potential by revealing new possibilities.',
      timeEstimate: '4 weeks',
      difficulty: 'hard' as const,
      prerequisites: ['pathway-step-1', 'pathway-step-2'],
      resources: ['Activity toolkit', 'Facilitation guides', 'Mentor support'],
      successMetrics: ['Facilitate creative sessions', 'Adapt to different mentees', 'See improved engagement'],
      status: 'not_started' as const,
      completionPercentage: 0
    }
  ];

  const sampleMilestones = [
    {
      id: 'milestone-1',
      title: 'Philosophy Foundation Complete',
      description: 'Deep understanding of imagination-based learning principles established.',
      requiredSteps: ['pathway-step-1'],
      reward: 'Access to advanced storytelling resources',
      philosophySignificance: 'Understanding the philosophical foundation is essential for authentic application.'
    },
    {
      id: 'milestone-2',
      title: 'Storytelling Mastery Achieved',
      description: 'Confident in using stories as tools for connection and inspiration.',
      requiredSteps: ['pathway-step-1', 'pathway-step-2'],
      reward: 'Invitation to mentor training program',
      philosophySignificance: 'Stories are the bridge between philosophy and practice.'
    }
  ];

  const sampleStories = [
    {
      id: 'story-1',
      title: 'The Power of Seeing Possibility',
      content: 'When I first met Jamal, he told me he wasn\'t smart enough for university. But through our mentoring sessions, using imagination exercises and storytelling, he began to see himself differently. We would spend time visualizing his future, creating stories about the scientist he could become. Six months later, he was accepted into a prestigious engineering program. The transformation wasn\'t just academic - it was about him seeing his own potential.',
      narrator: 'Dr. Sarah Chen',
      context: 'University Mentoring Program',
      philosophyConnection: 'Imagination allows us to see beyond current limitations and envision new possibilities.',
      emotionalImpact: 4,
      credibility: 5,
      relevanceScore: 0.95,
      tags: ['mentoring', 'university', 'transformation', 'potential']
    },
    {
      id: 'story-2',
      title: 'Stories That Bridge Worlds',
      content: 'As an Indigenous mentor working with urban youth, I found that traditional mentoring approaches often felt disconnected from our cultural ways of learning. But when I started sharing traditional stories and encouraging the young people to create their own stories about their futures, everything changed. The stories became bridges between their heritage and their aspirations, creating a sense of identity and purpose that transformed their educational journey.',
      narrator: 'Uncle Robert Williams',
      context: 'Indigenous Youth Program',
      philosophyConnection: 'Stories carry cultural wisdom and create understanding across different worlds.',
      emotionalImpact: 5,
      credibility: 5,
      relevanceScore: 0.92,
      tags: ['indigenous', 'culture', 'identity', 'storytelling']
    }
  ];

  const sampleEvidence = [
    {
      id: 'evidence-1',
      type: 'quantitative' as const,
      title: 'Program Effectiveness Metrics',
      summary: 'Comprehensive analysis of imagination-based mentoring program outcomes.',
      details: 'A longitudinal study of 500 mentoring relationships over 2 years showed significant improvements in engagement, retention, and long-term outcomes when imagination-based techniques were used.',
      source: 'AIME Research Department, 2023',
      credibilityScore: 5,
      relevanceScore: 0.98,
      philosophyAlignment: 'Demonstrates that imagination-based approaches create measurable improvements in human potential.',
      supportingStories: ['story-1'],
      dataPoints: [
        { metric: 'Retention Rate', value: '85%', context: 'vs 60% for traditional mentoring' },
        { metric: 'Academic Improvement', value: '40%', context: 'average grade increase' },
        { metric: 'Engagement Score', value: '4.7/5', context: 'mentor and mentee satisfaction' }
      ]
    },
    {
      id: 'evidence-2',
      type: 'qualitative' as const,
      title: 'Cultural Impact Assessment',
      summary: 'Evaluation of imagination-based mentoring in Indigenous communities.',
      details: 'Qualitative research with Indigenous communities showed that imagination-based mentoring approaches were more culturally appropriate and effective than traditional Western mentoring models.',
      source: 'Indigenous Education Research Collective, 2023',
      credibilityScore: 4,
      relevanceScore: 0.89,
      philosophyAlignment: 'Confirms that imagination-based learning aligns with Indigenous ways of knowing and learning.',
      supportingStories: ['story-2'],
      dataPoints: [
        { metric: 'Cultural Appropriateness', value: '95%', context: 'community approval rating' },
        { metric: 'Elder Endorsement', value: '100%', context: 'traditional knowledge keepers' },
        { metric: 'Youth Engagement', value: '78%', context: 'active participation rate' }
      ]
    }
  ];

  const sampleNarrativeThreads = [
    {
      id: 'thread-1',
      title: 'The Journey of Transformation',
      description: 'Follow the story of how imagination-based mentoring transforms both mentors and mentees.',
      philosophyTheme: 'Imagination unlocks human potential',
      stories: ['story-1', 'story-2'],
      evidence: ['evidence-1', 'evidence-2'],
      progression: 'development' as const,
      emotionalArc: [0.3, 0.6, 0.9, 0.8]
    }
  ];

  const conceptDefinitions = {
    imagination: {
      explanation: 'The ability to envision possibilities beyond current reality, fundamental to all learning and growth.',
      examples: ['Visualizing future success', 'Creating new solutions to problems', 'Seeing potential in others'],
      relatedConcepts: ['creativity', 'possibility', 'vision']
    },
    storytelling: {
      explanation: 'The art of sharing narratives that carry wisdom, create connection, and inspire action.',
      examples: ['Personal journey stories', 'Cultural wisdom tales', 'Future vision narratives'],
      relatedConcepts: ['imagination', 'connection', 'wisdom']
    },
    mentoring: {
      explanation: 'A relationship focused on unlocking potential and supporting growth through guidance and support.',
      examples: ['Academic mentoring', 'Career guidance', 'Life coaching'],
      relatedConcepts: ['relationships', 'growth', 'potential']
    },
    potential: {
      explanation: 'The inherent capacity for growth, development, and achievement that exists within every person.',
      examples: ['Hidden talents', 'Undeveloped skills', 'Future possibilities'],
      relatedConcepts: ['imagination', 'growth', 'possibility']
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Enhanced Content Presentation</h1>
                <p className="text-sm text-gray-600">Philosophy-First Content Architecture Demo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveDemo('template')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDemo === 'template'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpenIcon className="h-4 w-4 inline mr-2" />
                Content Template
              </button>
              <button
                onClick={() => setActiveDemo('pathway')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDemo === 'pathway'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapIcon className="h-4 w-4 inline mr-2" />
                Implementation
              </button>
              <button
                onClick={() => setActiveDemo('evidence')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDemo === 'evidence'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-2" />
                Evidence & Stories
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Introduction */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Enhanced Content Presentation System
              </h2>
              <p className="text-gray-600 mb-4">
                This demo showcases the enhanced content presentation components that integrate philosophy-first principles 
                with business case narratives, implementation pathways, and evidence-story integration. Each component 
                is designed to create deeper understanding and more effective implementation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpenIcon className="h-4 w-4 text-blue-600" />
                  <span>Philosophy-First Templates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapIcon className="h-4 w-4 text-green-600" />
                  <span>Implementation Pathways</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ChartBarIcon className="h-4 w-4 text-purple-600" />
                  <span>Evidence-Story Integration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        {activeDemo === 'template' && (
          <PhilosophyFirstContentTemplate
            content={sampleContent}
            conceptDefinitions={conceptDefinitions}
            onConceptEngagement={(concept, action) => {
              console.log('Concept engagement:', concept, action);
            }}
            onImplementationStart={(stepId) => {
              console.log('Implementation started:', stepId);
            }}
            onEvidenceView={(evidenceId) => {
              console.log('Evidence viewed:', evidenceId);
            }}
          />
        )}

        {activeDemo === 'pathway' && (
          <ImplementationPathwayVisualization
            title="Imagination-Based Mentoring Implementation"
            description="A structured pathway to transform your mentoring approach through imagination-based techniques."
            steps={samplePathwaySteps}
            milestones={sampleMilestones}
            philosophyDomain="Imagination-Based Learning"
            onStepStart={(stepId) => {
              console.log('Step started:', stepId);
            }}
            onStepComplete={(stepId) => {
              console.log('Step completed:', stepId);
            }}
            onMilestoneReached={(milestoneId) => {
              console.log('Milestone reached:', milestoneId);
            }}
          />
        )}

        {activeDemo === 'evidence' && (
          <EvidenceStoryIntegration
            title="The Evidence for Imagination-Based Mentoring"
            philosophyDomain="Imagination-Based Learning"
            stories={sampleStories}
            evidence={sampleEvidence}
            narrativeThreads={sampleNarrativeThreads}
            onStoryEngagement={(storyId, action) => {
              console.log('Story engagement:', storyId, action);
            }}
            onEvidenceView={(evidenceId) => {
              console.log('Evidence viewed:', evidenceId);
            }}
            onNarrativeComplete={(threadId) => {
              console.log('Narrative completed:', threadId);
            }}
          />
        )}
      </div>
    </div>
  );
}