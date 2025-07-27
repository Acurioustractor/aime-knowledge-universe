'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Hoodie {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  created_by?: string;
  imagination_value?: number;
  trade_count?: number;
  color?: string;
  emoji?: string;
}

interface HoodiePreviewProps {
  hoodie?: Hoodie;
  mode?: 'inline' | 'card' | 'floating' | 'hero';
  showActions?: boolean;
  onInteraction?: (action: string, hoodie: Hoodie) => void;
}

export function HoodiePreview({ 
  hoodie, 
  mode = 'card', 
  showActions = true,
  onInteraction 
}: HoodiePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!hoodie) {
    return (
      <div className={`${getModeClasses(mode)} animate-pulse`}>
        <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const getHoodieColor = () => {
    if (hoodie.color) return hoodie.color;
    const colors = ['from-purple-400 to-pink-400', 'from-blue-400 to-cyan-400', 
                   'from-green-400 to-emerald-400', 'from-orange-400 to-red-400'];
    return colors[hoodie.id.charCodeAt(0) % colors.length];
  };

  const getHoodieEmoji = () => {
    if (hoodie.emoji) return hoodie.emoji;
    const emojis = ['👕', '🎭', '🌟', '🚀', '🎨', '💡', '🌈', '🔮'];
    return emojis[hoodie.id.charCodeAt(1) % emojis.length];
  };

  if (mode === 'inline') {
    return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getHoodieColor()} 
                       flex items-center justify-center text-2xl shadow-sm`}>
          {getHoodieEmoji()}
        </div>
        <div className="flex-1">
          <Link href="/hoodie-exchange" className="font-medium text-gray-900 hover:text-blue-600">
            {hoodie.name}
          </Link>
          <p className="text-sm text-gray-600">
            Value: {hoodie.imagination_value || 0} • Trades: {hoodie.trade_count || 0}
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'floating') {
    return (
      <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-2xl shadow-xl 
                      border border-gray-200 p-4 z-50 transform transition-all duration-300
                      ${isHovered ? 'scale-105' : 'scale-100'}`}
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}>
        <div className="flex items-start gap-4">
          <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${getHoodieColor()} 
                         flex items-center justify-center text-4xl shadow-lg
                         ${isHovered ? 'animate-bounce' : ''}`}>
            {getHoodieEmoji()}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1">{hoodie.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{hoodie.description}</p>
            <div className="flex gap-2">
              <Link href="/hoodie-exchange" 
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">
                View Exchange
              </Link>
              <button onClick={() => onInteraction?.('dismiss', hoodie)}
                      className="text-xs text-gray-500 hover:text-gray-700">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'hero') {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute w-96 h-96 rounded-full bg-gradient-to-br ${getHoodieColor()}
                         blur-3xl transform -translate-x-1/2 -translate-y-1/2
                         ${animationPhase === 0 ? 'top-0 left-0' : ''}
                         ${animationPhase === 1 ? 'top-0 right-0' : ''}
                         ${animationPhase === 2 ? 'bottom-0 right-0' : ''}
                         ${animationPhase === 3 ? 'bottom-0 left-0' : ''}
                         transition-all duration-3000`}></div>
        </div>
        
        <div className="relative z-10 flex items-center gap-8">
          <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${getHoodieColor()} 
                         flex items-center justify-center text-6xl shadow-2xl
                         transform hover:rotate-12 transition-transform`}>
            {getHoodieEmoji()}
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-3xl font-bold mb-2">{hoodie.name}</h2>
            <p className="text-gray-300 mb-4">{hoodie.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-400">Imagination Value</span>
                <p className="text-2xl font-bold">{hoodie.imagination_value || 0}</p>
              </div>
              <div>
                <span className="text-gray-400">Total Trades</span>
                <p className="text-2xl font-bold">{hoodie.trade_count || 0}</p>
              </div>
              <div>
                <span className="text-gray-400">Category</span>
                <p className="text-lg">{hoodie.category || 'General'}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Link href="/hoodie-exchange" 
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Trade on Exchange
              </Link>
              <button onClick={() => onInteraction?.('learn', hoodie)}
                      className="text-white border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card mode
  return (
    <div className={`${getModeClasses(mode)} group`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${getHoodieColor()} 
                       transform transition-transform group-hover:scale-110`}></div>
        <div className="absolute inset-0 flex items-center justify-center text-6xl 
                       transform transition-all group-hover:scale-125 group-hover:rotate-12">
          {getHoodieEmoji()}
        </div>
        {hoodie.trade_count && hoodie.trade_count > 10 && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
            🔥 Hot
          </div>
        )}
      </div>
      
      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {hoodie.name}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {hoodie.description}
      </p>
      
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-500">
          Value: <span className="font-medium text-gray-900">{hoodie.imagination_value || 0}</span>
        </span>
        <span className="text-gray-500">
          {hoodie.trade_count || 0} trades
        </span>
      </div>
      
      {hoodie.tags && hoodie.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {hoodie.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {showActions && (
        <div className="flex gap-2">
          <Link href="/hoodie-exchange" 
                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg 
                         hover:bg-blue-700 transition-colors text-sm font-medium">
            View Details
          </Link>
          <button onClick={() => onInteraction?.('save', hoodie)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                           transition-colors text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function getModeClasses(mode: string): string {
  switch (mode) {
    case 'inline':
      return '';
    case 'floating':
      return '';
    case 'hero':
      return '';
    case 'card':
    default:
      return 'bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow';
  }
}