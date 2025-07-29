"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PurposeContentItem, UpdateType } from '@/lib/content-organization/models/purpose-content'

// Types for Latest Updates
type LatestUpdatesProps = {
  updates: PurposeContentItem[];
  isLoading?: boolean;
  limit?: number;
}

/**
 * Latest Updates component
 * 
 * Displays a list of the latest updates
 */
export default function LatestUpdates({ 
  updates = [],
  isLoading = false,
  limit
}: LatestUpdatesProps) {
  const [displayedUpdates, setDisplayedUpdates] = useState<PurposeContentItem[]>([]);
  
  useEffect(() => {
    if (limit && updates.length > limit) {
      setDisplayedUpdates(updates.slice(0, limit));
    } else {
      setDisplayedUpdates(updates);
    }
  }, [updates, limit]);
  
  // Get update type label
  const getUpdateTypeLabel = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'Newsletter';
      case 'announcement':
        return 'Announcement';
      case 'news':
        return 'News';
      case 'release':
        return 'Release';
      default:
        return 'Update';
    }
  };
  
  // Get update type color
  const getUpdateTypeColor = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-green-100 text-green-800';
      case 'news':
        return 'bg-purple-100 text-purple-800';
      case 'release':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get update type icon
  const getUpdateTypeIcon = (type?: UpdateType) => {
    switch (type) {
      case 'newsletter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-blue-500">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-green-500">
            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
          </svg>
        );
      case 'news':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-purple-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        );
      case 'release':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-yellow-500">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-500">
            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clipRule="evenodd" />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
          </svg>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (displayedUpdates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">No updates found</h3>
        <p className="text-gray-600 mb-4">
          There are no updates available at this time.
        </p>
        <Link href="/updates" className="btn btn-primary">
          View All Updates
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {displayedUpdates.map((update) => (
        <div key={update.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4">
              <div className="relative h-48 md:h-full">
                {update.thumbnail ? (
                  <Image
                    src={update.thumbnail}
                    alt={update.title}
                    fill
                    style={{objectFit: 'cover'}}
                    className="bg-gray-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    {getUpdateTypeIcon(update.updateDetails?.updateType)}
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-3/4 p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUpdateTypeColor(update.updateDetails?.updateType)}`}>
                  {getUpdateTypeLabel(update.updateDetails?.updateType)}
                </span>
                {update.date && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
              <p className="text-gray-600 mb-4">{update.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {update.themes?.slice(0, 3).map(theme => (
                  <Link 
                    key={theme.id} 
                    href={`/updates?theme=${theme.id}`}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs px-2.5 py-1 rounded-full"
                  >
                    {theme.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center">
                {update.updateDetails?.publisher && (
                  <span className="text-sm text-gray-500 mr-auto">{update.updateDetails.publisher}</span>
                )}
                <Link href={`/updates/${update.id}`} className="btn btn-primary">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}