'use client';

import { useState, useEffect } from 'react';
import { HoodieExchangeInterface } from '@/components/hoodie-exchange/HoodieExchangeInterface';

export default function HoodieExchangePage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the hoodie exchange by seeding data if needed
    const initializeExchange = async () => {
      try {
        const response = await fetch('/api/hoodie-exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'seed' })
        });

        if (!response.ok) {
          throw new Error('Failed to initialize hoodie exchange');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing hoodie exchange:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setIsInitialized(true); // Still show interface even if seeding failed
      }
    };

    initializeExchange();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your learning journey...</p>
          <p className="text-gray-300 text-sm mt-2">Preparing hoodie achievement system</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-2xl font-bold mb-4">Learning System Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎓 AIME Learning Universe</h1>
          <p className="text-gray-300 text-lg">Earn hoodies by mastering wisdom and systems thinking</p>
          <div className="flex justify-center items-center mt-4 space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Learning Paths Active
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Achievement System Live
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Community Learning
            </div>
          </div>
        </header>

        <HoodieExchangeInterface />
      </div>
    </div>
  );
}