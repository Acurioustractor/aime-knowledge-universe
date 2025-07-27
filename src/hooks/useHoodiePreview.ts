import { useState, useEffect } from 'react';

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

interface UseHoodiePreviewOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  category?: string;
  excludeIds?: string[];
}

export function useHoodiePreview(options: UseHoodiePreviewOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    category,
    excludeIds = []
  } = options;

  const [hoodie, setHoodie] = useState<Hoodie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomHoodie = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (excludeIds.length > 0) params.append('exclude', excludeIds.join(','));
      params.append('random', 'true');
      params.append('limit', '1');
      
      const response = await fetch(`/api/hoodies?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch hoodie');
      
      const data = await response.json();
      
      if (data.hoodies && data.hoodies.length > 0) {
        setHoodie(data.hoodies[0]);
      } else {
        // Fallback to a default hoodie if none found
        setHoodie({
          id: 'default-1',
          name: 'Imagination Catalyst',
          description: 'This hoodie sparks creative thinking and transforms ideas into reality through collective imagination.',
          category: 'Creativity',
          tags: ['imagination', 'creativity', 'innovation'],
          imagination_value: 100,
          trade_count: 42,
          color: 'from-purple-400 to-pink-400',
          emoji: '🚀'
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching hoodie:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Set a fallback hoodie even on error
      setHoodie({
        id: 'fallback-1',
        name: 'Connection Weaver',
        description: 'Building bridges between minds and hearts, this hoodie represents the power of human connection.',
        category: 'Community',
        tags: ['connection', 'community', 'relationships'],
        imagination_value: 75,
        trade_count: 28,
        color: 'from-blue-400 to-cyan-400',
        emoji: '🌈'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshHoodie = () => {
    fetchRandomHoodie();
  };

  useEffect(() => {
    fetchRandomHoodie();
    
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchRandomHoodie, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [category, autoRefresh, refreshInterval]);

  return {
    hoodie,
    loading,
    error,
    refresh: refreshHoodie
  };
}

// Hook for managing multiple hoodies
export function useHoodieCollection(count: number = 3, options: UseHoodiePreviewOptions = {}) {
  const [hoodies, setHoodies] = useState<Hoodie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoodies = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      params.append('limit', count.toString());
      
      const response = await fetch(`/api/hoodies?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch hoodies');
      
      const data = await response.json();
      
      if (data.hoodies && data.hoodies.length > 0) {
        setHoodies(data.hoodies);
      } else {
        // Fallback hoodies
        setHoodies([
          {
            id: 'default-1',
            name: 'Imagination Catalyst',
            description: 'Sparks creative thinking and transforms ideas into reality.',
            imagination_value: 100,
            trade_count: 42
          },
          {
            id: 'default-2',
            name: 'Connection Weaver',
            description: 'Building bridges between minds and hearts.',
            imagination_value: 75,
            trade_count: 28
          },
          {
            id: 'default-3',
            name: 'Wisdom Keeper',
            description: 'Preserving and sharing ancestral knowledge.',
            imagination_value: 150,
            trade_count: 67
          }
        ].slice(0, count));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching hoodies:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoodies();
  }, [count, options.category]);

  return {
    hoodies,
    loading,
    error,
    refresh: fetchHoodies
  };
}