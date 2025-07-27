'use client';

import React, { useState } from 'react';
import { useHoodie } from '@/lib/hoodie-system/hoodie-context';
import { MENTOR_APP_HOODIES } from '@/lib/hoodie-system/hoodie-definitions';
import HoodieBadge from './HoodieBadge';
import Link from 'next/link';

interface HoodieCollectionProps {
  size?: 'compact' | 'full';
  showProgress?: boolean;
}

export default function HoodieCollection({ size = 'full', showProgress = true }: HoodieCollectionProps) {
  const { earnedHoodies, totalValue, isPhysicalEligible, getAllEarnedHoodies } = useHoodie();
  const [selectedHoodie, setSelectedHoodie] = useState<string | null>(null);

  const earnedHoodieObjects = getAllEarnedHoodies();
  const regularHoodies = MENTOR_APP_HOODIES.filter(h => !h.isPhysical);
  const physicalHoodie = MENTOR_APP_HOODIES.find(h => h.isPhysical);
  const earnedRegularCount = earnedHoodies.filter(id => 
    regularHoodies.some(h => h.id === id)
  ).length;

  const progressPercentage = (earnedRegularCount / regularHoodies.length) * 100;

  if (size === 'compact') {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Hoodie Collection</h3>
          <span className="text-yellow-400 font-bold">{totalValue} pts</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {earnedHoodieObjects.slice(0, 6).map(hoodie => (
            <HoodieBadge
              key={hoodie.id}
              hoodie={hoodie}
              isEarned={true}
              size="small"
            />
          ))}
          {earnedHoodieObjects.length > 6 && (
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-white/60 text-xs font-semibold border border-white/20">
              +{earnedHoodieObjects.length - 6}
            </div>
          )}
        </div>

        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80">Physical Hoodie Progress</span>
              <span className="text-white/80">{earnedRegularCount}/{regularHoodies.length}</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2 border border-white/20">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {isPhysicalEligible && (
              <p className="text-green-400 text-xs font-semibold">🏆 Physical hoodie unlocked!</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Your Hoodie Collection
        </h2>
        <p className="text-white/80 drop-shadow">
          Each hoodie represents mastery of an Indigenous mentorship principle
        </p>
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-emerald-400 mb-1">{earnedHoodieObjects.length}</div>
          <div className="text-white/80 text-sm">Hoodies Earned</div>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-1">{totalValue}</div>
          <div className="text-white/80 text-sm">Hoodie Economics Value</div>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{Math.round(progressPercentage)}%</div>
          <div className="text-white/80 text-sm">Progress to Physical</div>
        </div>
      </div>

      {/* Physical Hoodie Progress */}
      <div className="bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-md rounded-xl p-6 border border-yellow-400/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-yellow-400">🏆 Physical AIME Hoodie Journey</h3>
          <span className="text-white font-semibold">{earnedRegularCount}/{regularHoodies.length}</span>
        </div>
        
        <div className="w-full bg-black/40 rounded-full h-4 mb-4 border border-white/20">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {isPhysicalEligible ? (
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-2">🎉 Congratulations! You've unlocked the physical AIME hoodie!</p>
            <p className="text-white/80 text-sm">Complete the final celebration to claim your reward.</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/80 mb-2">
              Complete {regularHoodies.length - earnedRegularCount} more lessons to earn your physical AIME hoodie!
            </p>
            <p className="text-yellow-400 text-sm">
              A real hoodie will be shipped to your door as a symbol of your complete mentorship journey.
            </p>
          </div>
        )}
      </div>

      {/* Hoodie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {regularHoodies.map(hoodie => (
          <div key={hoodie.id} onClick={() => setSelectedHoodie(hoodie.id)}>
            <HoodieBadge
              hoodie={hoodie}
              isEarned={earnedHoodies.includes(hoodie.id)}
              size="medium"
              showDetails={true}
            />
          </div>
        ))}
      </div>

      {/* Physical Hoodie Display */}
      {physicalHoodie && (
        <div className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-xl p-6 border-2 border-yellow-400/30">
          <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
            🏆 Ultimate Reward: Physical AIME Hoodie
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <HoodieBadge
                hoodie={physicalHoodie}
                isEarned={earnedHoodies.includes(physicalHoodie.id)}
                size="large"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-lg font-semibold text-white mb-2">{physicalHoodie.name}</h4>
              <p className="text-white/80 mb-3">{physicalHoodie.description}</p>
              <div className="text-yellow-400 font-semibold">
                Value: {physicalHoodie.value} Hoodie Economics Points
              </div>
              {earnedHoodies.includes(physicalHoodie.id) && (
                <div className="mt-3">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Earned! Check your email for shipping details.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Hub Integration */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-400/30">
        <h3 className="text-xl font-bold text-blue-400 mb-4">🌐 Hoodie Economics Ecosystem</h3>
        <p className="text-white/80 mb-4">
          Your hoodies unlock exclusive content and opportunities across the AIME Knowledge Hub:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/knowledge-hub" 
            className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 hover:bg-blue-500/30 transition-all group"
          >
            <h4 className="text-blue-300 font-semibold mb-2 group-hover:text-blue-200">
              📚 Advanced Learning Modules
            </h4>
            <p className="text-white/70 text-sm">
              Unlock deeper content based on your earned hoodies
            </p>
          </Link>
          
          <Link 
            href="/mentorship-network" 
            className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 hover:bg-green-500/30 transition-all group"
          >
            <h4 className="text-green-300 font-semibold mb-2 group-hover:text-green-200">
              🤝 Mentor Network Access
            </h4>
            <p className="text-white/70 text-sm">
              Connect with other hoodie earners and mentors
            </p>
          </Link>
          
          <Link 
            href="/community-challenges" 
            className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4 hover:bg-purple-500/30 transition-all group"
          >
            <h4 className="text-purple-300 font-semibold mb-2 group-hover:text-purple-200">
              🎯 Community Challenges
            </h4>
            <p className="text-white/70 text-sm">
              Use your hoodies to join exclusive challenges
            </p>
          </Link>
          
          <Link 
            href="/impact-projects" 
            className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4 hover:bg-orange-500/30 transition-all group"
          >
            <h4 className="text-orange-300 font-semibold mb-2 group-hover:text-orange-200">
              🌍 Real-World Impact Projects
            </h4>
            <p className="text-white/70 text-sm">
              Apply your learning in community projects
            </p>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {earnedHoodieObjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👕</div>
          <h3 className="text-xl font-semibold text-white mb-2">Start Your Hoodie Journey</h3>
          <p className="text-white/80 mb-6">
            Complete your first lesson to earn your first digital hoodie and begin building your collection!
          </p>
          <Link 
            href="/apps/mentor-app"
            className="inline-block bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-emerald-400 hover:to-blue-500 transition-all shadow-lg"
          >
            Start Learning
          </Link>
        </div>
      )}
    </div>
  );
}