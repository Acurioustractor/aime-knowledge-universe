/**
 * Progressive Disclosure Interface Component
 * 
 * Reveals information progressively based on user engagement and understanding level
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  LightBulbIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface DisclosureLevel {
  id: string;
  title: string;
  content: React.ReactNode;
  prerequisite?: string;
  estimatedTime?: number;
  complexity: 1 | 2 | 3 | 4 | 5;
  type: 'philosophy' | 'concept' | 'implementation' | 'example';
}

interface ProgressiveDisclosureProps {
  title: string;
  description: string;
  levels: DisclosureLevel[];
  userLevel?: number;
  onLevelComplete?: (levelId: string) => void;
  onEngagement?: (levelId: string, action: 'view' | 'complete' | 'skip') => void;
  className?: string;
}

export default function ProgressiveDisclosure({
  title,
  description,
  levels,
  userLevel = 1,
  onLevelComplete,
  onEngagement,
  className = ''
}: ProgressiveDisclosureProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);

  useEffect(() => {
    // Auto-expand the first appropriate level based on user level
    const appropriateLevel = levels.find(level => level.complexity <= userLevel);
    if (appropriateLevel && expandedLevels.size === 0) {
      setExpandedLevels(new Set([appropriateLevel.id]));
      setCurrentLevel(appropriateLevel.id);
    }
  }, [levels, userLevel]);

  const toggleLevel = (levelId: string) => {
    const newExpanded = new Set(expandedLevels);
    
    if (newExpanded.has(levelId)) {
      newExpanded.delete(levelId);
    } else {
      newExpanded.add(levelId);
      setCurrentLevel(levelId);
      onEngagement?.(levelId, 'view');
    }
    
    setExpandedLevels(newExpanded);
  };

  const markLevelComplete = (levelId: string) => {
    const newCompleted = new Set(completedLevels);
    newCompleted.add(levelId);
    setCompletedLevels(newCompleted);
    onLevelComplete?.(levelId);
    onEngagement?.(levelId, 'complete');

    // Auto-expand next level if available
    const currentIndex = levels.findIndex(level => level.id === levelId);
    const nextLevel = levels[currentIndex + 1];
    
    if (nextLevel && !expandedLevels.has(nextLevel.id)) {
      const newExpanded = new Set(expandedLevels);
      newExpanded.add(nextLevel.id);
      setExpandedLevels(newExpanded);
      setCurrentLevel(nextLevel.id);
    }
  };

  const skipLevel = (levelId: string) => {
    onEngagement?.(levelId, 'skip');
    
    // Move to next level
    const currentIndex = levels.findIndex(level => level.id === levelId);
    const nextLevel = levels[currentIndex + 1];
    
    if (nextLevel) {
      const newExpanded = new Set(expandedLevels);
      newExpanded.delete(levelId);
      newExpanded.add(nextLevel.id);
      setExpandedLevels(newExpanded);
      setCurrentLevel(nextLevel.id);
    }
  };

  const isLevelAccessible = (level: DisclosureLevel) => {
    if (!level.prerequisite) return true;
    return completedLevels.has(level.prerequisite);
  };

  const getLevelIcon = (type: DisclosureLevel['type']) => {
    switch (type) {
      case 'philosophy':
        return LightBulbIcon;
      case 'concept':
        return BookOpenIcon;
      case 'implementation':
        return WrenchScrewdriverIcon;
      case 'example':
        return StarIcon;
      default:
        return BookOpenIcon;
    }
  };

  const getLevelColor = (type: DisclosureLevel['type']) => {
    switch (type) {
      case 'philosophy':
        return 'text-yellow-600 bg-yellow-100';
      case 'concept':
        return 'text-blue-600 bg-blue-100';
      case 'implementation':
        return 'text-green-600 bg-green-100';
      case 'example':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplexityIndicator = (complexity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < complexity ? 'bg-orange-500' : 'bg-gray-200'
        }`}
      />
    ));
  };

  const calculateProgress = () => {
    return (completedLevels.size / levels.length) * 100;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedLevels.size} of {levels.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Level Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {levels.map((level, index) => {
            const Icon = getLevelIcon(level.type);
            const isCompleted = completedLevels.has(level.id);
            const isExpanded = expandedLevels.has(level.id);
            const isAccessible = isLevelAccessible(level);
            
            return (
              <div
                key={level.id}
                className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : isExpanded
                    ? 'bg-blue-50 border-blue-200'
                    : isAccessible
                    ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    : 'bg-gray-25 border-gray-100 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAccessible && toggleLevel(level.id)}
              >
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${getLevelColor(level.type)}`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {index + 1}. {level.title}
                </div>
                <div className="flex justify-center gap-1">
                  {getComplexityIndicator(level.complexity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Content */}
      <div className="divide-y divide-gray-100">
        {levels.map((level, index) => {
          const Icon = getLevelIcon(level.type);
          const isExpanded = expandedLevels.has(level.id);
          const isCompleted = completedLevels.has(level.id);
          const isAccessible = isLevelAccessible(level);
          const isCurrent = currentLevel === level.id;

          return (
            <div key={level.id} className={`${isCurrent ? 'bg-blue-50' : ''}`}>
              {/* Level Header */}
              <div
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  !isAccessible ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => isAccessible && toggleLevel(level.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getLevelColor(level.type)}`}>
                      {isCompleted ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {index + 1}. {level.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">Complexity:</span>
                          <div className="flex gap-1">
                            {getComplexityIndicator(level.complexity)}
                          </div>
                        </div>
                        
                        {level.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            {level.estimatedTime} min
                          </div>
                        )}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(level.type)}`}>
                          {level.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isAccessible && level.prerequisite && (
                      <span className="text-xs text-gray-500">
                        Requires: {levels.find(l => l.id === level.prerequisite)?.title}
                      </span>
                    )}
                    
                    {isAccessible && (
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronDownIcon className="h-5 w-5" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Level Content */}
              {isExpanded && isAccessible && (
                <div className="px-4 pb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    {level.content}
                    
                    {/* Level Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => skipLevel(level.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Skip this level
                      </button>
                      
                      <div className="flex gap-2">
                        {index > 0 && (
                          <button
                            onClick={() => toggleLevel(levels[index - 1].id)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Previous
                          </button>
                        )}
                        
                        <button
                          onClick={() => markLevelComplete(level.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          {isCompleted ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {completedLevels.size === levels.length && (
        <div className="p-6 border-t border-gray-100 bg-green-50">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Congratulations!</h3>
              <p className="text-green-700 text-sm">
                You've completed all levels. You're ready to explore related content and implementation tools.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
              Explore Implementation Tools
            </button>
            <button className="px-4 py-2 bg-white text-green-600 text-sm font-medium rounded-md border border-green-200 hover:bg-green-50 transition-colors">
              View Related Content
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple Progressive Disclosure for smaller content sections
 */
export function SimpleDisclosure({
  title,
  children,
  defaultExpanded = false,
  level = 1,
  onToggle,
  className = ''
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  level?: 1 | 2 | 3;
  onToggle?: (expanded: boolean) => void;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const levelClasses = {
    1: 'text-lg font-semibold',
    2: 'text-base font-medium',
    3: 'text-sm font-medium'
  };

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={handleToggle}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-gray-900 ${levelClasses[level]}`}>
            {title}
          </h3>
          <div className="text-gray-400">
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}