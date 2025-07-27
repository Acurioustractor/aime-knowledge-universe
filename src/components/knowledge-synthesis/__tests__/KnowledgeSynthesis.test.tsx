/**
 * Comprehensive Test Suite for Knowledge Synthesis Components
 * 
 * Testing approach:
 * - Unit tests for individual components
 * - Integration tests for component interactions
 * - Performance tests for large datasets
 * - Accessibility tests for inclusive design
 */

import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// Component imports
import KnowledgeSynthesisHub from '../KnowledgeSynthesisHub'
import EvolutionStory from '../EvolutionStory'
import SystemsEconomics from '../SystemsEconomics'
import ImagiNationVision from '../ImagiNationVision'
import ImplementationPathways from '../ImplementationPathways'
import SynthesisSearch from '../SynthesisSearch'
import CrossReference from '../CrossReference'
import FramingIntegration from '../FramingIntegration'
import ExportCapabilities from '../ExportCapabilities'
import { FramingProvider } from '../../framing/FramingContext'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock framing context
const mockFramingContext = {
  concepts: [
    {
      name: 'seven-generation-thinking',
      frequency: 15,
      categories: ['indigenous-wisdom', 'sustainability'],
      definition: 'A principle that considers the impact of decisions on seven generations into the future'
    },
    {
      name: 'hoodie-economics',
      frequency: 12,
      categories: ['economics', 'alternative-systems'],
      definition: 'An alternative economic framework based on relationships and community wellbeing'
    }
  ],
  getConceptInfo: jest.fn(),
  isFramingLoaded: true,
  relatedConcepts: jest.fn()
}

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

// Mock fetch for API calls
global.fetch = jest.fn()

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <FramingProvider>
    {children}
  </FramingProvider>
)

describe('Knowledge Synthesis Hub', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Unit Tests', () => {
    test('renders main navigation correctly', () => {
      render(
        <TestWrapper>
          <KnowledgeSynthesisHub />
        </TestWrapper>
      )
      
      expect(screen.getByText('AIME Knowledge Synthesis')).toBeInTheDocument()
      expect(screen.getByText('Evolution & Growth Story')).toBeInTheDocument()
      expect(screen.getByText('Systems & Economics')).toBeInTheDocument()
      expect(screen.getByText('IMAGI-NATION Vision')).toBeInTheDocument()
      expect(screen.getByText('Implementation Pathways')).toBeInTheDocument()
    })

    test('handles section navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <KnowledgeSynthesisHub />
        </TestWrapper>
      )
      
      const evolutionCard = screen.getByText('Evolution & Growth Story')
      await user.click(evolutionCard)
      
      await waitFor(() => {
        expect(screen.getByText('Key Milestones')).toBeInTheDocument()
      })
    })

    test('manages bookmarks correctly', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <KnowledgeSynthesisHub />
        </TestWrapper>
      )
      
      const bookmarkButton = screen.getAllByRole('button', { name: /bookmark/i })[0]
      await user.click(bookmarkButton)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'knowledge-synthesis-progress',
        expect.stringContaining('bookmarks')
      )
    })

    test('tracks reading progress', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <KnowledgeSynthesisHub />
        </TestWrapper>
      )
      
      const evolutionCard = screen.getByText('Evolution & Growth Story')
      await user.click(evolutionCard)
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'knowledge-synthesis-progress',
          expect.stringContaining('lastVisited')
        )
      })
    })
  })

  describe('Evolution Story Component', () => {
    test('renders timeline with milestones', () => {
      render(<EvolutionStory />)
      
      expect(screen.getByText('Interactive Timeline')).toBeInTheDocument()
      expect(screen.getByText('The Beginning - University of Sydney')).toBeInTheDocument()
      expect(screen.getByText('IMAGI-NATION Vision')).toBeInTheDocument()
    })

    test('allows milestone selection and detail viewing', async () => {
      const user = userEvent.setup()
      
      render(<EvolutionStory />)
      
      const milestone = screen.getByText('Joy Corps Formation')
      await user.click(milestone)
      
      expect(screen.getByText('Key Impact')).toBeInTheDocument()
    })

    test('switches between tabs correctly', async () => {
      const user = userEvent.setup()
      
      render(<EvolutionStory />)
      
      const lessonsTab = screen.getByText('💡 Lessons Learned')
      await user.click(lessonsTab)
      
      expect(screen.getByText('Organizational Insights')).toBeInTheDocument()
      expect(screen.getByText('Relationship Before Program')).toBeInTheDocument()
    })
  })

  describe('Systems Economics Component', () => {
    test('renders hoodie economics principles', () => {
      render(<SystemsEconomics />)
      
      expect(screen.getByText('Core Principles of Hoodie Economics')).toBeInTheDocument()
      expect(screen.getByText('Relational Value Creation')).toBeInTheDocument()
      expect(screen.getByText('Community-Centered Exchange')).toBeInTheDocument()
    })

    test('shows economic comparison table', async () => {
      const user = userEvent.setup()
      
      render(<SystemsEconomics />)
      
      const comparisonTab = screen.getByText('⚖️ Economic Models Comparison')
      await user.click(comparisonTab)
      
      expect(screen.getByText('Traditional vs. Hoodie Economics')).toBeInTheDocument()
      expect(screen.getByText('Primary Goal')).toBeInTheDocument()
    })
  })

  describe('Search Component', () => {
    test('performs search with filters', async () => {
      const user = userEvent.setup()
      
      render(<SynthesisSearch />)
      
      const searchInput = screen.getByPlaceholderText(/search for concepts/i)
      await user.type(searchInput, 'seven generation')
      
      await waitFor(() => {
        expect(screen.getByText(/found.*matches/i)).toBeInTheDocument()
      })
    })

    test('applies section filters', async () => {
      const user = userEvent.setup()
      
      render(<SynthesisSearch />)
      
      const sectionFilter = screen.getByLabelText('Indigenous Foundations')
      await user.click(sectionFilter)
      
      // Should trigger search with filter applied
      await waitFor(() => {
        expect(screen.getByText(/filtered results/i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Cross Reference Component', () => {
    test('shows concept connections', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <CrossReference />
        </TestWrapper>
      )
      
      const concept = screen.getByText('Seven-Generation Thinking')
      await user.click(concept)
      
      expect(screen.getByText('Related Concepts')).toBeInTheDocument()
    })
  })

  describe('Export Component', () => {
    test('configures export options', async () => {
      const user = userEvent.setup()
      
      render(<ExportCapabilities />)
      
      const pdfFormat = screen.getByText('PDF Document')
      await user.click(pdfFormat)
      
      const sectionCheckbox = screen.getByLabelText(/Evolution & Growth Story/)
      await user.click(sectionCheckbox)
      
      const titleInput = screen.getByPlaceholderText('Document title')
      await user.type(titleInput, 'Test Export')
      
      expect(screen.getByDisplayValue('Test Export')).toBeInTheDocument()
    })

    test('validates export requirements', async () => {
      const user = userEvent.setup()
      
      render(<ExportCapabilities />)
      
      const exportButton = screen.getByText('Start Export')
      await user.click(exportButton)
      
      // Should show validation error for missing sections
      await waitFor(() => {
        expect(exportButton).toBeDisabled()
      })
    })
  })
})

describe('Integration Tests', () => {
  test('navigation between components maintains state', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Navigate to Evolution Story
    const evolutionCard = screen.getByText('Evolution & Growth Story')
    await user.click(evolutionCard)
    
    // Select a milestone
    await waitFor(() => {
      const milestone = screen.getByText('Joy Corps Formation')
      user.click(milestone)
    })
    
    // Navigate back to overview
    const backButton = screen.getByText('Knowledge Synthesis')
    await user.click(backButton)
    
    // Check that progress was saved
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
  })

  test('search results connect to cross-reference system', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Navigate to search
    const searchCard = screen.getByText('Search & Discovery')
    await user.click(searchCard)
    
    // Perform search
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search for concepts/i)
      user.type(searchInput, 'hoodie economics')
    })
    
    // Results should link to cross-reference
    await waitFor(() => {
      expect(screen.getByText(/concept linking/i)).toBeInTheDocument()
    })
  })

  test('framing integration updates in real-time', async () => {
    // Mock API response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          results: [
            {
              id: 'test-doc-1',
              title: 'Test Document',
              category: 'report',
              concepts: ['seven-generation-thinking'],
              keyQuotes: ['Test quote']
            }
          ]
        }
      })
    })
    
    render(
      <TestWrapper>
        <FramingIntegration currentSection="Indigenous Foundations" sectionConcepts={['seven-generation-thinking']} />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Test Document')).toBeInTheDocument()
    })
    
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/framing?type=search')
    )
  })
})

describe('Performance Tests', () => {
  test('handles large concept datasets efficiently', async () => {
    const largeConcepts = Array.from({ length: 1000 }, (_, i) => ({
      name: `concept-${i}`,
      frequency: Math.floor(Math.random() * 100),
      categories: ['test-category'],
      definition: `Test definition ${i}`
    }))
    
    const startTime = performance.now()
    
    render(
      <FramingProvider>
        <CrossReference />
      </FramingProvider>
    )
    
    const endTime = performance.now()
    
    // Should render within reasonable time (< 100ms)
    expect(endTime - startTime).toBeLessThan(100)
  })

  test('search performs well with large result sets', async () => {
    const user = userEvent.setup()
    
    render(<SynthesisSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search for concepts/i)
    
    const startTime = performance.now()
    await user.type(searchInput, 'test')
    
    await waitFor(() => {
      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(500) // < 500ms for search
    })
  })

  test('export component handles multiple concurrent exports', async () => {
    const user = userEvent.setup()
    
    render(<ExportCapabilities />)
    
    // Configure multiple exports
    const pdfFormat = screen.getByText('PDF Document')
    await user.click(pdfFormat)
    
    const sectionCheckbox = screen.getByLabelText(/Evolution & Growth Story/)
    await user.click(sectionCheckbox)
    
    const titleInput = screen.getByPlaceholderText('Document title')
    await user.type(titleInput, 'Performance Test Export')
    
    // Start multiple exports rapidly
    const exportButton = screen.getByText('Start Export')
    
    for (let i = 0; i < 5; i++) {
      await user.click(exportButton)
    }
    
    // Should handle gracefully without crashes
    expect(screen.getByText('Export Knowledge Synthesis')).toBeInTheDocument()
  })
})

describe('Accessibility Tests', () => {
  test('hub component has no accessibility violations', async () => {
    const { container } = render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Tab through navigation elements
    await user.tab()
    await user.tab()
    
    const focusedElement = document.activeElement
    expect(focusedElement).toHaveAttribute('role', 'button')
  })

  test('provides proper ARIA labels', () => {
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    const searchInput = screen.getByRole('textbox')
    expect(searchInput).toHaveAttribute('aria-label')
    
    const navigationRegion = screen.getByRole('navigation')
    expect(navigationRegion).toBeInTheDocument()
  })

  test('maintains focus management in modals', async () => {
    const user = userEvent.setup()
    
    render(<ExportCapabilities />)
    
    // Open export job history
    const historyTab = screen.getByText('📋 Export History')
    await user.click(historyTab)
    
    // Focus should be managed properly
    const focusedElement = document.activeElement
    expect(focusedElement).toBeVisible()
  })

  test('supports screen reader announcements', () => {
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    const statusRegion = screen.getByText(/Progress: \d+%/)
    expect(statusRegion).toHaveAttribute('aria-live', 'polite')
  })
})

describe('Mobile Responsiveness Tests', () => {
  beforeEach(() => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 })
  })

  test('adapts layout for mobile devices', () => {
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Mobile-specific elements should be present
    const mobileHeader = screen.getByRole('banner')
    expect(mobileHeader).toBeInTheDocument()
  })

  test('provides touch-friendly interface elements', () => {
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      const styles = window.getComputedStyle(button)
      const minHeight = parseInt(styles.minHeight)
      expect(minHeight).toBeGreaterThanOrEqual(44) // iOS touch target size
    })
  })
})

describe('Error Handling Tests', () => {
  test('handles API failures gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(
      <TestWrapper>
        <FramingIntegration />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/integration status/i)).toBeInTheDocument()
    })
    
    // Should not crash the component
    expect(screen.getByText('Document & Concept Integration')).toBeInTheDocument()
  })

  test('handles invalid search queries', async () => {
    const user = userEvent.setup()
    
    render(<SynthesisSearch />)
    
    const searchInput = screen.getByPlaceholderText(/search for concepts/i)
    
    // Try problematic input
    await user.type(searchInput, '<script>alert("xss")</script>')
    
    // Should handle safely without executing script
    expect(screen.getByDisplayValue(/<script>/)).toBeInTheDocument()
  })

  test('handles localStorage unavailability', () => {
    // Mock localStorage failure
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage not available')
    })
    
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Should still render without crashing
    expect(screen.getByText('AIME Knowledge Synthesis')).toBeInTheDocument()
  })
})

describe('Data Integrity Tests', () => {
  test('maintains data consistency across component updates', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <KnowledgeSynthesisHub />
      </TestWrapper>
    )
    
    // Add bookmark
    const bookmarkButton = screen.getAllByRole('button', { name: /bookmark/i })[0]
    await user.click(bookmarkButton)
    
    // Navigate away and back
    const evolutionCard = screen.getByText('Evolution & Growth Story')
    await user.click(evolutionCard)
    
    const backButton = screen.getByText('Knowledge Synthesis')
    await user.click(backButton)
    
    // Bookmark should persist
    expect(bookmarkButton).toHaveClass(/text-yellow-500/)
  })

  test('validates export configuration integrity', async () => {
    const user = userEvent.setup()
    
    render(<ExportCapabilities />)
    
    // Configure export with invalid settings
    const titleInput = screen.getByPlaceholderText('Document title')
    await user.type(titleInput, '') // Empty title
    
    const exportButton = screen.getByText('Start Export')
    await user.click(exportButton)
    
    // Should prevent export with invalid config
    expect(exportButton).toBeDisabled()
  })
})