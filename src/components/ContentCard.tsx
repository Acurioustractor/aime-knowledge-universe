"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ContentItem } from '@/lib/integrations'
import { generateDescription, generateTitle } from '@/lib/content-manager'
import { format } from 'date-fns'

type ContentCardProps = {
  item: ContentItem;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export default function ContentCard({ item, variant = 'default', className = '' }: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Generate fallback values if needed
  const title = item.title || generateTitle(item);
  const description = item.description || generateDescription(item);
  
  // Format date if available
  const formattedDate = item.date 
    ? format(new Date(item.date), 'MMMM d, yyyy')
    : null;
  
  // Determine if this is an external link
  const isExternalLink = item.url.startsWith('http');
  
  // Determine thumbnail image
  const thumbnailImage = imageError || !item.thumbnail
    ? `/assets/images/placeholder-${item.type}.jpg` // Fallback image based on content type
    : item.thumbnail;
  
  // Render the appropriate icon based on content type
  const renderContentTypeIcon = () => {
    switch (item.type) {
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        );
      case 'newsletter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        );
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
            <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
          </svg>
        );
      case 'toolkit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
            <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
          </svg>
        );
      case 'event':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-500">
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
            <path fillRule="evenodd" d="M2.25 4.5A.75.75 0 013 3.75h14.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm0 4.5A.75.75 0 013 8.25h9.75a.75.75 0 010 1.5H3A.75.75 0 012.25 9zm15-.75A.75.75 0 0118 9v10.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V9a.75.75 0 01.75-.75zm-15 5.25a.75.75 0 01.75-.75h9.75a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Render compact variant
  if (variant === 'compact') {
    return (
      <Link 
        href={item.url}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        className={`flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
      >
        <div className="flex-shrink-0 mr-3">
          {thumbnailImage ? (
            <div className="relative w-12 h-12 rounded overflow-hidden">
              <Image
                src={thumbnailImage}
                alt={title}
                fill
                style={{objectFit: 'cover'}}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {renderContentTypeIcon()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </Link>
    );
  }
  
  // Render featured variant
  if (variant === 'featured') {
    return (
      <div className={`card overflow-hidden ${className}`}>
        <div className="relative aspect-video">
          {thumbnailImage ? (
            <Image
              src={thumbnailImage}
              alt={title}
              fill
              style={{objectFit: 'cover'}}
              onError={() => setImageError(true)}
              className="rounded-t-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="w-16 h-16">
                {renderContentTypeIcon()}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {item.tags && item.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            {formattedDate && (
              <span className="text-xs text-gray-500">{formattedDate}</span>
            )}
          </div>
          <Link 
            href={item.url}
            target={isExternalLink ? "_blank" : undefined}
            rel={isExternalLink ? "noopener noreferrer" : undefined}
            className="mt-4 text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center"
          >
            {item.type === 'video' ? 'Watch Now' : 
             item.type === 'newsletter' ? 'Read Newsletter' :
             item.type === 'document' ? 'View Document' :
             item.type === 'toolkit' ? 'Explore Toolkit' :
             'Learn More'}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`card group hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative h-48">
        {thumbnailImage ? (
          <Image
            src={thumbnailImage}
            alt={title}
            fill
            style={{objectFit: 'cover'}}
            onError={() => setImageError(true)}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            {renderContentTypeIcon()}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-xl font-bold">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="text-xs font-medium text-white bg-primary-600 rounded-full px-2 py-1 mr-2">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
          {formattedDate && (
            <span className="text-xs text-gray-500">{formattedDate}</span>
          )}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags && item.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Link 
          href={item.url}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          className="text-primary-600 font-medium flex items-center"
        >
          {item.type === 'video' ? 'Watch Now' : 
           item.type === 'newsletter' ? 'Read Newsletter' :
           item.type === 'document' ? 'View Document' :
           item.type === 'toolkit' ? 'Explore Toolkit' :
           'Learn More'}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}