"use client"

import { useState, useEffect, ReactNode } from 'react'

interface ResponsiveLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  navigation?: ReactNode
  className?: string
}

interface ViewportInfo {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: 'portrait' | 'landscape'
}

export function useViewport() {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait'
  })

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return viewport
}

export default function ResponsiveLayout({ children, sidebar, navigation, className = '' }: ResponsiveLayoutProps) {
  const viewport = useViewport()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)

  // Close sidebar/navigation when switching to desktop
  useEffect(() => {
    if (viewport.isDesktop) {
      setSidebarOpen(false)
      setNavigationOpen(false)
    }
  }, [viewport.isDesktop])

  const renderMobileHeader = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        {navigation && (
          <button
            onClick={() => setNavigationOpen(!navigationOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">Knowledge Synthesis</h1>
      </div>
      
      {sidebar && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )

  const renderMobileNavigation = () => (
    <>
      {/* Navigation Overlay */}
      {navigationOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setNavigationOpen(false)}
          />
          <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setNavigationOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              {navigation}
            </div>
          </div>
        </div>
      )}
    </>
  )

  const renderMobileSidebar = () => (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              {sidebar}
            </div>
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      {renderMobileHeader()}

      {/* Desktop Layout */}
      <div className="lg:flex lg:h-screen">
        {/* Desktop Navigation Sidebar */}
        {navigation && (
          <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64 lg:bg-white lg:border-r lg:border-gray-200">
            <div className="w-64 overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              </div>
              <div className="p-6">
                {navigation}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 lg:flex lg:flex-col lg:overflow-hidden">
          <div className="flex-1 lg:flex lg:overflow-hidden">
            {/* Content */}
            <main className="flex-1 lg:overflow-y-auto">
              <div className={`
                ${viewport.isMobile ? 'px-4 py-4' : ''}
                ${viewport.isTablet ? 'px-6 py-6' : ''}
                ${viewport.isDesktop ? 'px-8 py-8' : ''}
              `}>
                {children}
              </div>
            </main>

            {/* Desktop Sidebar */}
            {sidebar && (
              <div className="hidden lg:flex lg:flex-shrink-0 lg:w-80 lg:bg-white lg:border-l lg:border-gray-200">
                <div className="w-80 overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Details</h2>
                  </div>
                  <div className="p-6">
                    {sidebar}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlays */}
      {renderMobileNavigation()}
      {renderMobileSidebar()}

      {/* Viewport Info for Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
          {viewport.width}x{viewport.height} - 
          {viewport.isMobile && ' Mobile'}
          {viewport.isTablet && ' Tablet'}
          {viewport.isDesktop && ' Desktop'} -
          {viewport.orientation}
        </div>
      )}
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 }, 
  gap = 6,
  className = '' 
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop } = useViewport()
  
  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile || 1}`
    if (isTablet) return `grid-cols-${cols.tablet || 2}`
    if (isDesktop) return `grid-cols-${cols.desktop || 3}`
    return 'grid-cols-1'
  }

  return (
    <div className={`grid ${getGridCols()} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: ReactNode
  size?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  className?: string
}

export function ResponsiveText({ 
  children, 
  size = { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' },
  className = '' 
}: ResponsiveTextProps) {
  const { isMobile, isTablet, isDesktop } = useViewport()
  
  const getTextSize = () => {
    if (isMobile) return size.mobile || 'text-sm'
    if (isTablet) return size.tablet || 'text-base'
    if (isDesktop) return size.desktop || 'text-lg'
    return 'text-base'
  }

  return (
    <div className={`${getTextSize()} ${className}`}>
      {children}
    </div>
  )
}

// Touch-friendly Button Component
interface TouchButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  className?: string
  disabled?: boolean
}

export function TouchButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false 
}: TouchButtonProps) {
  const { isMobile } = useViewport()

  const getButtonClasses = () => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    // Touch-friendly sizing
    const sizeClasses = {
      small: isMobile ? 'px-3 py-2 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
      medium: isMobile ? 'px-4 py-3 text-base min-h-[48px]' : 'px-4 py-2 text-base',
      large: isMobile ? 'px-6 py-4 text-lg min-h-[52px]' : 'px-6 py-3 text-lg'
    }
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    }
    
    const disabledClasses = 'opacity-50 cursor-not-allowed'
    
    return [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      disabled ? disabledClasses : '',
      className
    ].join(' ')
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      {children}
    </button>
  )
}

// Responsive Card Component
interface ResponsiveCardProps {
  children: ReactNode
  padding?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  className?: string
}

export function ResponsiveCard({ 
  children, 
  padding = { mobile: 'p-4', tablet: 'p-6', desktop: 'p-8' },
  className = '' 
}: ResponsiveCardProps) {
  const { isMobile, isTablet, isDesktop } = useViewport()
  
  const getPadding = () => {
    if (isMobile) return padding.mobile || 'p-4'
    if (isTablet) return padding.tablet || 'p-6'
    if (isDesktop) return padding.desktop || 'p-8'
    return 'p-6'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${getPadding()} ${className}`}>
      {children}
    </div>
  )
}