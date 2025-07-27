'use client';

import { HoodieProvider } from '@/lib/hoodie-system/hoodie-context';
import HoodieCollection from '@/components/hoodie-system/HoodieCollection';
import Link from 'next/link';

function HoodieCollectionContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/apps/mentor-app" 
              className="text-white/90 hover:text-white text-sm flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all"
            >
              <span>←</span>
              <span>Back to Mentor App</span>
            </Link>
            <div className="text-white/90 text-sm bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
              Hoodie Economics Collection
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <HoodieCollection size="full" showProgress={true} />
      </div>
    </div>
  );
}

export default function HoodieCollectionPage() {
  return (
    <HoodieProvider>
      <HoodieCollectionContent />
    </HoodieProvider>
  );
}