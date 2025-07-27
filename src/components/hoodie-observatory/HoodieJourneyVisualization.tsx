/**
 * Hoodie Journey Visualization
 * 
 * Shows the complete journey from hoodie discovery to community impact
 * Demonstrates how individual achievement creates collective value
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  HandRaisedIcon,
  SparklesIcon,
  UsersIcon,
  TrendingUpIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LightBulbIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface JourneyStage {
  id: string;
  title: string;
  description: string;
  philosophyPrinciple: string;
  icon: React.ReactNode;
  color: string;
  activities: string[];
  outcomes: string[];
  communityBenefit: string;
  timeframe: string;
  realExample: string;
}

interface HoodieJourneyVisualizationProps {
  selectedHoodie?: any;
  onStageSelect?: (stageId: string) => void;
  className?: string;
}

export default function HoodieJourneyVisualization({
  selectedHoodie,
  onStageSelect,
  className = ''
}: HoodieJourneyVisualizationProps) {
  const [activeStage, setActiveStage] = useState<string>('discovery');
  const [completedStages, setCompletedStages] = useState<Set<string>>(new Set());
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const journeyStages: JourneyStage[] = [
    {
      id: 'discovery',
      title: 'Discovery',
      description: 'Learning about hoodie opportunities and understanding requirements',
      philosophyPrinciple: 'Knowledge is freely shared to enable everyone to see possibilities',
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
      color: 'blue',
      activities: [
        'Explore hoodie categories and descriptions',
        'Understand earning requirements and prerequisites',
        'Connect with current holders for guidance',
        'Assess personal readiness and interest'
      ],
      outcomes: [
        'Clear understanding of hoodie purpose',
        'Awareness of community expectations',
        'Connection with mentors and guides',
        'Personal commitment to the journey'
      ],
      communityBenefit: 'New members join the community with clear understanding and proper support',
      timeframe: '1-2 weeks',
      realExample: 'Sarah discovers the Systems Mapping hoodie through a mentoring session and learns how it could help her understand organizational dynamics better'
    },
    {
      id: 'engagement',
      title: 'Engagement',
      description: 'Active participation in learning and community building activities',
      philosophyPrinciple: 'Learning happens through relationship and collaborative exploration',
      icon: <BookOpenIcon className="h-6 w-6" />,
      color: 'green',
      activities: [
        'Participate in relevant programs and workshops',
        'Engage with content and learning materials',
        'Build relationships with community members',
        'Practice skills and apply knowledge'
      ],
      outcomes: [
        'Developed competencies and understanding',
        'Strengthened community relationships',
        'Demonstrated commitment and growth',
        'Contributed to others\' learning journeys'
      ],
      communityBenefit: 'Community knowledge base grows through active participation and peer learning',
      timeframe: '2-6 months',
      realExample: 'Sarah attends systems thinking workshops, mentors newer members, and applies mapping techniques in her organization'
    },
    {
      id: 'achievement',
      title: 'Achievement',
      description: 'Meeting hoodie requirements through demonstrated impact and community validation',
      philosophyPrinciple: 'Recognition comes through community validation of positive impact',
      icon: <HandRaisedIcon className="h-6 w-6" />,
      color: 'purple',
      activities: [
        'Demonstrate required competencies and impact',
        'Receive community validation and support',
        'Complete assessment and reflection processes',
        'Celebrate achievement with community'
      ],
      outcomes: [
        'Hoodie earned through community recognition',
        'Validated expertise and capability',
        'Strengthened sense of belonging',
        'Increased responsibility to community'
      ],
      communityBenefit: 'Community gains a validated practitioner who can guide and support others',
      timeframe: '1-2 weeks',
      realExample: 'Sarah\'s systems mapping work is recognized by the community, and she receives the hoodie along with responsibility to mentor others'
    },
    {
      id: 'utilization',
      title: 'Utilization',
      description: 'Actively using hoodie capabilities to create positive change and support others',
      philosophyPrinciple: 'Individual capabilities are most valuable when used to benefit the community',
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'orange',
      activities: [
        'Apply hoodie capabilities in real-world contexts',
        'Mentor and guide others on similar journeys',
        'Contribute to community programs and initiatives',
        'Share learnings and insights with broader network'
      ],
      outcomes: [
        'Measurable positive impact in community',
        'Others supported and guided to success',
        'Knowledge and wisdom shared broadly',
        'Systems and processes improved'
      ],
      communityBenefit: 'Hoodie holder becomes a resource for community growth and development',
      timeframe: 'Ongoing',
      realExample: 'Sarah uses systems mapping to help organizations improve, mentors 5 new people toward the hoodie, and contributes to program development'
    },
    {
      id: 'amplification',
      title: 'Amplification',
      description: 'Creating multiplier effects that benefit the entire ecosystem',
      philosophyPrinciple: 'True success is measured by how much positive change you enable in others',
      icon: <TrendingUpIcon className="h-6 w-6" />,
      color: 'red',
      activities: [
        'Scale impact through systems and processes',
        'Develop new approaches and innovations',
        'Build partnerships and collaborations',
        'Influence broader organizational and social change'
      ],
      outcomes: [
        'Systemic change and lasting impact',
        'New generations of hoodie holders',
        'Innovation and improvement in practices',
        'Broader adoption of hoodie economics principles'
      ],
      communityBenefit: 'Entire ecosystem benefits from scaled impact and systemic improvements',
      timeframe: '1-3 years',
      realExample: 'Sarah\'s work influences organizational design across multiple companies, creates new training programs, and helps establish systems thinking as standard practice'
    }
  ];

  const getStageColor = (color: string, variant: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant];
  };

  const handleStageClick = (stageId: string) => {
    setActiveStage(stageId);
    onStageSelect?.(stageId);
  };

  const toggleStageCompletion = (stageId: string) => {
    const newCompleted = new Set(completedStages);
    if (newCompleted.has(stageId)) {
      newCompleted.delete(stageId);
    } else {
      newCompleted.add(stageId);
    }
    setCompletedStages(newCompleted);
  };

  const activeStageData = journeyStages.find(stage => stage.id === activeStage);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-purple-600" />
              Hoodie Journey: From Discovery to Impact
            </h2>
            <p className="text-gray-600 text-sm">
              Follow the complete journey showing how individual achievement creates collective community value
            </p>
          </div>
          
          {selectedHoodie && (
            <div className="text-right">
              <div className="font-medium text-gray-900">{selectedHoodie.name}</div>
              <div className="text-sm text-gray-600">{selectedHoodie.category}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journey Timeline */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200"></div>
              <div 
                className="absolute left-8 top-16 w-0.5 bg-purple-500 transition-all duration-1000"
                style={{ height: `${(completedStages.size / journeyStages.length) * 100}%` }}
              ></div>

              {/* Journey Stages */}
              <div className="space-y-8">
                {journeyStages.map((stage, index) => {
                  const isActive = activeStage === stage.id;
                  const isCompleted = completedStages.has(stage.id);
                  
                  return (
                    <div key={stage.id} className="relative">
                      {/* Stage Indicator */}
                      <div className="flex items-start gap-4">
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isActive 
                                ? `${getStageColor(stage.color)} ${getStageColor(stage.color, 'text')} border-2 ${getStageColor(stage.color, 'border')}`
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          onClick={() => handleStageClick(stage.id)}
                        >
                          {isCompleted ? (
                            <CheckCircleIcon className="h-8 w-8" />
                          ) : (
                            stage.icon
                          )}
                        </div>
                        
                        {/* Stage Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 
                                className={`font-semibold cursor-pointer transition-colors ${
                                  isActive ? 'text-purple-900' : 'text-gray-900 hover:text-purple-700'
                                }`}
                                onClick={() => handleStageClick(stage.id)}
                              >
                                {stage.title}
                              </h3>
                              <p className="text-gray-600 text-sm">{stage.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{stage.timeframe}</span>
                              <button
                                onClick={() => toggleStageCompletion(stage.id)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  isCompleted
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                              </button>
                            </div>
                          </div>

                          {/* Philosophy Principle */}
                          <div className={`rounded-lg p-3 mb-3 border ${getStageColor(stage.color)} ${getStageColor(stage.color, 'border')}`}>
                            <div className="flex items-start gap-2">
                              <LightBulbIcon className={`h-4 w-4 mt-0.5 ${getStageColor(stage.color, 'text')}`} />
                              <div>
                                <div className={`font-medium text-sm ${getStageColor(stage.color, 'text')}`}>
                                  Philosophy Principle
                                </div>
                                <div className={`text-xs ${getStageColor(stage.color, 'text')}`}>
                                  {stage.philosophyPrinciple}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Community Benefit */}
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-start gap-2">
                              <UsersIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-blue-900 text-sm">Community Benefit</div>
                                <div className="text-blue-800 text-xs">{stage.communityBenefit}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stage Details Panel */}
          <div className="space-y-6">
            {activeStageData && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStageColor(activeStageData.color)} ${getStageColor(activeStageData.color, 'text')}`}>
                    {activeStageData.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activeStageData.title}</h3>
                    <span className="text-sm text-gray-600">{activeStageData.timeframe}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Activities */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Activities</h4>
                    <ul className="space-y-1">
                      {activeStageData.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcomes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expected Outcomes</h4>
                    <ul className="space-y-1">
                      {activeStageData.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <StarIcon className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real Example */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                      Real Example
                    </h4>
                    <p className="text-gray-700 text-sm">{activeStageData.realExample}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Journey Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Journey Progress</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completion</span>
                  <span className="text-sm text-gray-500">
                    {completedStages.size} of {journeyStages.length} stages
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedStages.size / journeyStages.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {journeyStages.map(stage => (
                  <div key={stage.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{stage.title}</span>
                    <div className="flex items-center gap-2">
                      {completedStages.has(stage.id) ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : activeStage === stage.id ? (
                        <div className="w-4 h-4 border-2 border-purple-600 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {completedStages.size === journeyStages.length && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Journey Complete!</span>
                  </div>
                  <p className="text-green-800 text-sm mt-1">
                    You've experienced the full hoodie journey from discovery to amplification, 
                    creating lasting value for yourself and the community.
                  </p>
                </div>
              )}
            </div>

            {/* Philosophy Summary */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
              <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <HeartIcon className="h-4 w-4" />
                Hoodie Economics in Action
              </h3>
              <p className="text-purple-800 text-sm">
                This journey demonstrates how hoodie economics creates value at every stage. 
                Individual growth strengthens community capacity, achievement is validated by peers, 
                and success is measured by positive impact on others. Each stage builds collective abundance 
                rather than individual wealth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}