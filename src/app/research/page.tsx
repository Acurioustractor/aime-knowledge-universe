import Link from 'next/link';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-300">
        <div className="container-wiki py-2">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link>
            <span className="text-gray-500 mx-1">›</span>
            <span className="text-gray-700">Research</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-300 bg-white py-8">
        <div className="container-wiki">
          <h1 className="text-2xl font-bold text-black mb-4">
            Research & Insights
          </h1>
          <p className="text-gray-700 max-w-4xl">
            Research findings, analysis, and insights from 20 years of AIME mentoring programs worldwide.
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="container-wiki">
          <div className="border border-gray-300 p-6 bg-gray-50">
            <h3 className="text-lg font-bold text-black mb-2">Research content coming soon</h3>
            <p className="text-gray-700 mb-4">
              Research findings and analysis are being processed and will be available here.
            </p>
            <p className="text-sm text-gray-600">
              In the meantime, you can:
            </p>
            <ul className="text-sm text-gray-700 mt-2 ml-4">
              <li>• <Link href="/browse?type=research" className="text-blue-600 underline hover:text-blue-800">Browse existing research content</Link></li>
              <li>• <Link href="/search?q=research" className="text-blue-600 underline hover:text-blue-800">Search for research-related content</Link></li>
              <li>• <Link href="/" className="text-blue-600 underline hover:text-blue-800">Return to the homepage</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}