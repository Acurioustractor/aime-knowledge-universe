"use client"

import { useState, useEffect, useRef, ReactNode, KeyboardEvent } from 'react'

// Screen Reader Support Hook
export function useScreenReader() {
  const [isScreenReader, setIsScreenReader] = useState(false)

  useEffect(() => {
    // Detect screen reader usage
    const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                           window.navigator.userAgent.includes('JAWS') ||
                           window.speechSynthesis?.getVoices().length > 0

    setIsScreenReader(hasScreenReader)
  }, [])

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return { isScreenReader, announce }
}

// Keyboard Navigation Hook
export function useKeyboardNavigation() {
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([])
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)

  const registerFocusable = (element: HTMLElement) => {
    setFocusableElements(prev => {
      if (!prev.includes(element)) {
        return [...prev, element]
      }
      return prev
    })
  }

  const unregisterFocusable = (element: HTMLElement) => {
    setFocusableElements(prev => prev.filter(el => el !== element))
  }

  const handleKeyNavigation = (event: KeyboardEvent) => {
    const { key } = event

    switch (key) {
      case 'Tab':
        // Handle custom tab navigation
        if (focusableElements.length > 0) {
          event.preventDefault()
          const nextIndex = event.shiftKey 
            ? Math.max(0, currentFocusIndex - 1)
            : Math.min(focusableElements.length - 1, currentFocusIndex + 1)
          
          focusableElements[nextIndex]?.focus()
          setCurrentFocusIndex(nextIndex)
        }
        break
      
      case 'Escape':
        // Handle escape key for modals/overlays
        const activeElement = document.activeElement as HTMLElement
        activeElement?.blur()
        break
      
      case 'Enter':
      case ' ':
        // Handle activation for custom interactive elements
        const target = event.target as HTMLElement
        if (target.getAttribute('role') === 'button' && !target.hasAttribute('disabled')) {
          target.click()
        }
        break
    }
  }

  return {
    registerFocusable,
    unregisterFocusable,
    handleKeyNavigation,
    currentFocusIndex
  }
}

// Accessible Button Component
interface AccessibleButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = ''
}: AccessibleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { announce } = useScreenReader()

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick()
      
      // Announce action to screen readers
      if (ariaLabel) {
        announce(`${ariaLabel} activated`)
      }
    }
  }

  const getButtonClasses = () => {
    const baseClasses = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
    
    const sizeClasses = {
      small: 'px-3 py-2 text-sm min-h-[44px]',
      medium: 'px-4 py-3 text-base min-h-[48px]',
      large: 'px-6 py-4 text-lg min-h-[52px]'
    }
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
      ghost: 'text-gray-700 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent'
    }
    
    return [
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      className
    ].join(' ')
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={getButtonClasses()}
    >
      {children}
    </button>
  )
}

// Accessible Modal Component
interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function AccessibleModal({ isOpen, onClose, title, children, className = '' }: AccessibleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const { announce } = useScreenReader()

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus modal
      modalRef.current?.focus()
      
      // Announce modal opening
      announce(`${title} dialog opened`, 'assertive')
      
      // Trap focus within modal
      const handleTabKey = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault()
              firstElement.focus()
            }
          }
        }
        
        if (event.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleTabKey)
      
      return () => {
        document.removeEventListener('keydown', handleTabKey)
      }
    } else {
      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
        announce(`${title} dialog closed`)
      }
    }
  }, [isOpen, title, onClose, announce])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 ${className}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

// Skip Link Component
export function SkipLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
    >
      {children}
    </a>
  )
}

// High Contrast Mode Hook
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast)
    
    // Apply high contrast styles to document
    if (!isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  return { isHighContrast, toggleHighContrast }
}

// Focus Management Component
interface FocusManagerProps {
  children: ReactNode
  restoreFocus?: boolean
}

export function FocusManager({ children, restoreFocus = true }: FocusManagerProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    return () => {
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [restoreFocus])

  return (
    <div ref={containerRef} className="focus-manager">
      {children}
    </div>
  )
}

// Accessible Form Field Component
interface AccessibleFieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  value: string
  onChange: (value: string) => void
  error?: string
  helpText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function AccessibleField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helpText,
  required = false,
  disabled = false,
  placeholder,
  className = ''
}: AccessibleFieldProps) {
  const helpId = helpText ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ')

  return (
    <div className={`form-field ${className}`}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={`
          w-full px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      
      {helpText && (
        <p id={helpId} className="mt-1 text-sm text-gray-600">
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

// Progress Indicator Component
interface AccessibleProgressProps {
  value: number
  max?: number
  label: string
  showPercentage?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function AccessibleProgress({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'medium',
  className = ''
}: AccessibleProgressProps) {
  const percentage = Math.round((value / max) * 100)
  
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }

  return (
    <div className={`progress-indicator ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-600">{percentage}%</span>
        )}
      </div>
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label}: ${percentage}% complete`}
          className="bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, height: '100%' }}
        />
      </div>
      
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {label}: {percentage}% complete
      </div>
    </div>
  )
}

// Accessible Tabs Component
interface Tab {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

interface AccessibleTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export function AccessibleTabs({ tabs, defaultTab, onTabChange, className = '' }: AccessibleTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabListRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab && !tab.disabled) {
      setActiveTab(tabId)
      onTabChange?.(tabId)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === tabId)
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = tabs.length - 1
        break
    }

    if (nextIndex !== currentIndex) {
      const nextTab = tabs[nextIndex]
      if (!nextTab.disabled) {
        handleTabChange(nextTab.id)
        
        // Focus the new tab
        const tabButton = tabListRef.current?.querySelector(`[data-tab-id="${nextTab.id}"]`) as HTMLButtonElement
        tabButton?.focus()
      }
    }
  }

  const activeTabContent = tabs.find(t => t.id === activeTab)?.content

  return (
    <div className={`accessible-tabs ${className}`}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Knowledge synthesis sections"
        className="flex border-b border-gray-200 mb-6"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`
              px-4 py-2 font-medium text-sm border-b-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        {activeTabContent}
      </div>
    </div>
  )
}

// Live Region for Dynamic Content Updates
interface LiveRegionProps {
  message: string
  priority?: 'polite' | 'assertive'
  atomic?: boolean
  className?: string
}

export function LiveRegion({ message, priority = 'polite', atomic = true, className = '' }: LiveRegionProps) {
  return (
    <div
      aria-live={priority}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  )
}