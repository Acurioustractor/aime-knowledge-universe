"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import StoriesHub from '@/components/stories/StoriesHub'

export default function VideoStoriesPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/stories" className="hover:text-primary-600">Stories & Narratives</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Video Stories</li>
            </ol>
          </nav>
          
          {/* Stories Hub */}
          <StoriesHub 
            title="Video Stories" 
            description="Explore video stories and narratives from across the IMAGI-NATION network."
          />
        </div>
      </div>
    </div>
  );
}