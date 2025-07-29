'use client';

import React from 'react';
import { DigitalHoodie, HOODIE_PATTERNS } from '@/lib/hoodie-system/hoodie-definitions';

interface HoodieBadgeProps {
  hoodie: DigitalHoodie;
  isEarned?: boolean;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  onClick?: () => void;
}

export default function HoodieBadge({ 
  hoodie, 
  isEarned = false, 
  size = 'medium',
  showDetails = false,
  onClick 
}: HoodieBadgeProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const symbolSizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const pattern = HOODIE_PATTERNS[hoodie.pattern] || hoodie.color;

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 ${
        onClick ? 'hover:scale-110' : ''
      }`}
      onClick={onClick}
    >
      {/* Hoodie Badge */}
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-2xl 
          border-2 
          flex 
          flex-col 
          items-center 
          justify-center 
          relative
          overflow-hidden
          transition-all
          duration-300
          shadow-lg
          ${isEarned 
            ? 'border-yellow-400 shadow-yellow-400/30 bg-opacity-90' 
            : 'border-gray-400 bg-gray-600 opacity-50'
          }
        `}
        style={{
          background: isEarned ? pattern : '#4B5563',
          backgroundSize: 'cover'
        }}
      >
        {/* Hoodie Symbol */}
        <div className={`${symbolSizeClasses[size]} mb-1 drop-shadow-lg`}>
          {hoodie.symbol}
        </div>
        
        {/* Hoodie Value */}
        {isEarned && (
          <div className={`
            ${textSizeClasses[size]} 
            font-bold 
            text-white 
            bg-black/30 
            px-2 
            py-1 
            rounded-full
            backdrop-blur-sm
            border
            border-white/20
          `}>
            {hoodie.value}
          </div>
        )}

        {/* Physical Hoodie Indicator */}
        {hoodie.isPhysical && isEarned && (
          <div className="absolute top-1 right-1">
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs">
              🏆
            </div>
          </div>
        )}

        {/* Lock Overlay for Unearned */}
        {!isEarned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
            <div className="text-white/80 text-xl">🔒</div>
          </div>
        )}

        {/* Earned Date Badge */}
        {isEarned && hoodie.earnedDate && (
          <div className="absolute -bottom-1 -right-1">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold border-2 border-white">
              ✓
            </div>
          </div>
        )}
      </div>

      {/* Hoodie Details */}
      {showDetails && (
        <div className="mt-2 text-center">
          <h4 className={`${textSizeClasses[size]} font-semibold text-white drop-shadow`}>
            {hoodie.name}
          </h4>
          <p className={`${textSizeClasses[size]} text-white/80 mt-1`}>
            {hoodie.concept}
          </p>
          {isEarned && (
            <p className="text-xs text-green-400 mt-1">
              ✓ Earned
            </p>
          )}
        </div>
      )}

      {/* Tooltip on Hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <div className="bg-black/90 text-white text-xs p-3 rounded-lg shadow-xl backdrop-blur-sm border border-white/20 max-w-xs">
          <h4 className="font-semibold mb-1">{hoodie.name}</h4>
          <p className="mb-2">{hoodie.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-400">Value: {hoodie.value}</span>
            {hoodie.isPhysical && (
              <span className="text-orange-400">Physical Reward!</span>
            )}
          </div>
          {hoodie.unlocksContent.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs text-gray-300">Unlocks:</p>
              <ul className="text-xs text-blue-300">
                {hoodie.unlocksContent.slice(0, 2).map(content => (
                  <li key={content}>• {content.replace(/-/g, ' ')}</li>
                ))}
                {hoodie.unlocksContent.length > 2 && (
                  <li>• +{hoodie.unlocksContent.length - 2} more...</li>
                )}
              </ul>
            </div>
          )}
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
}