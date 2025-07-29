"use client"

import { useState, useEffect } from 'react'
import WikiContentRenderer from './WikiContentRenderer'
import WikiSearchResults from './WikiSearchResults'

interface WikiContentProps {
  section: string
  page: string
  searchQuery: string
  searchMode: boolean
  onNavigate: (section: string, page?: string) => void
}

export default function WikiContent({ 
  section, 
  page, 
  searchQuery, 
  searchMode, 
  onNavigate 
}: WikiContentProps) {
  const [loading, setLoading] = useState(false)

  // Show search results when in search mode
  if (searchMode && searchQuery) {
    return (
      <WikiSearchResults 
        query={searchQuery}
        onNavigate={onNavigate}
      />
    )
  }

  // Show regular wiki content
  return (
    <div className="max-w-4xl mx-auto">
      <WikiContentRenderer 
        section={section}
        page={page}
        onNavigate={onNavigate}
      />
    </div>
  )
}