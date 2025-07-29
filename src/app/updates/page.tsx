"use client"

import { useState, useEffect } from 'react'
import UpdatesHub from '@/components/updates/UpdatesHub'
import { PurposeContentItem } from '@/lib/content-organization/models/purpose-content'
import { DefaultPurposeClassifier } from '@/lib/content-organization/classifiers/purpose-classifier'
import { DefaultContentEnhancer } from '@/lib/content-organization/utils/content-enhancer'

/**
 * Updates page
 * 
 * Main page for the Updates & News hub
 */
export default function UpdatesPage() {
  const [latestUpdates, setLatestUpdates] = useState<PurposeContentItem[]>([]);
  const [allUpdates, setAllUpdates] = useState<PurposeContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setIsLoading(true);
        
        // Import the integration functions
        const { getAllContent } = await import('@/lib/integrations');
        
        // Fetch all content
        const allContent = await getAllContent();
        
        // Create content enhancer
        const contentEnhancer = new DefaultContentEnhancer(new DefaultPurposeClassifier());
        
        // Enhance content with purpose fields
        const enhancedContent = contentEnhancer.enhanceMultipleWithPurpose(allContent);
        
        // Filter for updates (primary or secondary purpose)
        const updates = enhancedContent.filter(item => 
          item.primaryPurpose === 'update' || 
          item.secondaryPurposes?.includes('update')
        );
        
        // Sort by date (most recent first)
        updates.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        
        // Get latest updates
        const latest = updates.slice(0, 5);
        
        setLatestUpdates(latest);
        setAllUpdates(updates);
      } catch (err) {
        console.error('Error fetching updates:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpdates();
  }, []);
  
  return (
    <UpdatesHub 
      latestUpdates={latestUpdates}
      allUpdates={allUpdates}
      isLoading={isLoading}
    />
  );
}