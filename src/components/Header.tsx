"use client"

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navigation = [
  { 
    name: 'Discover', 
    href: '/discover',
    description: 'Philosophy-first entry to AIME knowledge'
  },
  { 
    name: 'Apps', 
    href: '/apps',
    description: 'Interactive applications and digital tools'
  },
  { 
    name: 'Learn', 
    href: '/learn',
    description: 'Purpose-based content hubs and living applications'
  },
  { 
    name: 'Explore', 
    href: '/explore',
    description: 'Intelligent discovery and knowledge connections'
  },
  { 
    name: 'Understand', 
    href: '/understanding',
    description: 'AIME\'s philosophical frameworks and foundational documents'
  },
  { 
    name: 'Connect', 
    href: '/connect',
    description: 'Community relationships and mentoring'
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname?.startsWith(path)) return true
    return false
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(searchValue)}`
    }
  }

  // Don't show header on homepage - it has its own integrated header
  if (pathname === '/') {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo - More prominent */}
          <Link href="/" className="flex items-center">
            <div>
              <div className="text-2xl font-light tracking-wide text-gray-900">
                AIME Knowledge Universe
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Indigenous wisdom for systems transformation
              </div>
            </div>
          </Link>
          
          {/* Universal Search - Larger and more prominent */}
          <div className="hidden md:flex flex-1 max-w-lg mx-16">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                className="w-full px-6 py-3 text-base border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          
          {/* Desktop Navigation - More spaced out */}
          <nav className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base transition-colors ${
                  isActive(item.href) 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={item.description}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-8 border-t border-gray-200">
            {/* Mobile search */}
            <div className="mb-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 focus:outline-none focus:border-gray-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
            
            {/* Mobile navigation */}
            <nav className="space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block transition-colors ${
                    isActive(item.href) 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="text-lg">{item.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}