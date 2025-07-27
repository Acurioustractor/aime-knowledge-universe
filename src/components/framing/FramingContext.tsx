"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FramingConcept {
  name: string
  frequency: number
  categories: string[]
  definition?: string
}

interface FramingContextType {
  concepts: FramingConcept[]
  getConceptInfo: (conceptName: string) => FramingConcept | null
  isFramingLoaded: boolean
  relatedConcepts: (conceptName: string) => FramingConcept[]
}

const FramingContext = createContext<FramingContextType | null>(null)

export function FramingProvider({ children }: { children: ReactNode }) {
  const [concepts, setConcepts] = useState<FramingConcept[]>([])
  const [isFramingLoaded, setIsFramingLoaded] = useState(false)

  useEffect(() => {
    loadFramingConcepts()
  }, [])

  const loadFramingConcepts = async () => {
    try {
      const response = await fetch('/api/framing?type=concepts&limit=50')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setConcepts(data.data.concepts)
          setIsFramingLoaded(true)
        }
      }
    } catch (error) {
      console.error('Failed to load framing concepts:', error)
    }
  }

  const getConceptInfo = (conceptName: string): FramingConcept | null => {
    return concepts.find(concept => 
      concept.name.toLowerCase() === conceptName.toLowerCase()
    ) || null
  }

  const relatedConcepts = (conceptName: string): FramingConcept[] => {
    const concept = getConceptInfo(conceptName)
    if (!concept) return []

    // Find concepts that share categories
    return concepts
      .filter(c => 
        c.name !== conceptName && 
        c.categories.some(cat => concept.categories.includes(cat))
      )
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
  }

  return (
    <FramingContext.Provider value={{
      concepts,
      getConceptInfo,
      isFramingLoaded,
      relatedConcepts
    }}>
      {children}
    </FramingContext.Provider>
  )
}

export function useFraming() {
  const context = useContext(FramingContext)
  if (!context) {
    throw new Error('useFraming must be used within a FramingProvider')
  }
  return context
}