"use client"

import SystemsEconomics from '../../components/knowledge-synthesis/SystemsEconomics'
import ImagiNationVision from '../../components/knowledge-synthesis/ImagiNationVision'
import ImplementationPathways from '../../components/knowledge-synthesis/ImplementationPathways'

export default function TestSectionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Testing Individual Sections</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 bg-green-100 p-4 rounded">🏠 Systems & Economics Component Test</h2>
            <SystemsEconomics />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 bg-purple-100 p-4 rounded">🌟 IMAGI-NATION Vision Component Test</h2>
            <ImagiNationVision />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 bg-orange-100 p-4 rounded">🛠️ Implementation Pathways Component Test</h2>
            <ImplementationPathways />
          </section>
        </div>
      </div>
    </div>
  )
}