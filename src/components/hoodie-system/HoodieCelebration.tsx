'use client';

import React, { useEffect, useState } from 'react';
import { DigitalHoodie, HOODIE_PATTERNS } from '@/lib/hoodie-system/hoodie-definitions';

interface HoodieCelebrationProps {
  hoodie: DigitalHoodie | null;
  onComplete: () => void;
}

export default function HoodieCelebration({ hoodie, onComplete }: HoodieCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    if (!hoodie) return;

    setIsVisible(true);
    setAnimationPhase('enter');

    // Animation sequence
    const timeouts = [
      setTimeout(() => setAnimationPhase('celebrate'), 500),
      setTimeout(() => setAnimationPhase('exit'), 4000),
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 5000)
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [hoodie, onComplete]);

  if (!hoodie || !isVisible) return null;

  const pattern = HOODIE_PATTERNS[hoodie.pattern] || hoodie.color;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
          animationPhase === 'exit' ? 'opacity-0' : 'opacity-75'
        }`}
        onClick={() => {
          setAnimationPhase('exit');
          setTimeout(() => {
            setIsVisible(false);
            onComplete();
          }, 1000);
        }}
      />

      {/* Celebration Content */}
      <div 
        className={`relative z-10 text-center transition-all duration-1000 ${
          animationPhase === 'enter' 
            ? 'scale-50 opacity-0' 
            : animationPhase === 'celebrate'
            ? 'scale-100 opacity-100'
            : 'scale-110 opacity-0'
        }`}
      >
        {/* Confetti Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 opacity-80 animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>

        {/* Main Hoodie Display */}
        <div className="bg-black/90 backdrop-blur-md rounded-3xl p-8 border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/20 max-w-md mx-auto">
          {/* Achievement Header */}
          <div className="mb-6">
            <div className="text-6xl mb-2 animate-pulse">🎉</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              {hoodie.isPhysical ? 'PHYSICAL HOODIE UNLOCKED!' : 'HOODIE EARNED!'}
            </h2>
            <p className="text-white/80">
              {hoodie.isPhysical 
                ? 'You\'ve completed all 18 lessons! A real AIME hoodie is coming your way!' 
                : 'You\'ve mastered another principle of mentorship!'
              }
            </p>
          </div>

          {/* Hoodie Badge - Large */}
          <div className="mb-6">
            <div
              className="w-40 h-40 mx-auto rounded-3xl border-4 border-yellow-400 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-yellow-400/30"
              style={{
                background: pattern,
                backgroundSize: 'cover'
              }}
            >
              <div className="text-6xl mb-2 drop-shadow-2xl animate-bounce">
                {hoodie.symbol}
              </div>
              <div className="text-lg font-bold text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                {hoodie.value}
              </div>
              
              {/* Special effect for physical hoodie */}
              {hoodie.isPhysical && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 animate-pulse" />
              )}
            </div>
          </div>

          {/* Hoodie Details */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">{hoodie.name}</h3>
            <p className="text-yellow-300 font-semibold mb-2">"{hoodie.concept}"</p>
            <p className="text-white/80 text-sm leading-relaxed">{hoodie.description}</p>
          </div>

          {/* Value and Unlocks */}
          <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-yellow-400 font-semibold">Hoodie Economics Value:</span>
              <span className="text-white font-bold text-lg">{hoodie.value} points</span>
            </div>
            
            {hoodie.unlocksContent.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">🔓 Knowledge Hub Unlocks:</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                  {hoodie.unlocksContent.map(content => (
                    <li key={content} className="flex items-center space-x-2">
                      <span>•</span>
                      <span>{content.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Physical Hoodie Special Message */}
          {hoodie.isPhysical && (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-4 mb-6 border border-yellow-400/50">
              <h4 className="text-yellow-400 font-bold mb-2">📦 Physical Reward Details:</h4>
              <p className="text-white/90 text-sm">
                Congratulations! You've earned a real AIME hoodie. We'll contact you to arrange shipping. 
                This hoodie represents your complete journey through Indigenous mentorship wisdom.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setAnimationPhase('exit');
                setTimeout(() => {
                  setIsVisible(false);
                  onComplete();
                }, 1000);
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-emerald-400 hover:to-blue-500 transition-all shadow-lg"
            >
              Continue Your Journey
            </button>
            
            {hoodie.isPhysical && (
              <button
                onClick={() => {
                  // TODO: Implement shipping details collection
                  alert('Shipping details collection coming soon!');
                }}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg"
              >
                📦 Provide Shipping Details
              </button>
            )}
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Click anywhere to continue • Your hoodie has been saved to your collection
          </p>
        </div>
      </div>
    </div>
  );
}