"use client"

import { useState } from 'react'
import SystemsEconomics from '../../components/knowledge-synthesis/SystemsEconomics'
import ImagiNationVision from '../../components/knowledge-synthesis/ImagiNationVision'
import ImplementationPathways from '../../components/knowledge-synthesis/ImplementationPathways'

export default function KnowledgeSynthesisTestPage() {
  const [activeComponent, setActiveComponent] = useState<string>('systems')

  const renderComponent = () => {
    switch (activeComponent) {
      case 'systems':
        return <SystemsEconomics />
      case 'vision':
        return <ImagiNationVision />
      case 'implementation':
        return <ImplementationPathways />
      default:
        return <div>Select a component to test</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Knowledge Synthesis Component Test</h1>
        
        <div className="mb-6">
          <button
            onClick={() => setActiveComponent('systems')}
            className={`mr-4 px-4 py-2 rounded ${activeComponent === 'systems' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Systems & Economics
          </button>
          <button
            onClick={() => setActiveComponent('vision')}
            className={`mr-4 px-4 py-2 rounded ${activeComponent === 'vision' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            IMAGI-NATION Vision
          </button>
          <button
            onClick={() => setActiveComponent('implementation')}
            className={`px-4 py-2 rounded ${activeComponent === 'implementation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Implementation Pathways
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}