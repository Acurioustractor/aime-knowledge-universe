import Link from 'next/link';

export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-black mb-4">Simple Test Page</h1>
        <p className="text-gray-700 mb-6">
          This is a simple server component page to test if the hydration issues persist.
        </p>
        
        <div className="border border-gray-300 p-6 bg-gray-50">
          <h2 className="text-lg font-bold text-black mb-3">Navigation Test</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="text-blue-600 underline hover:text-blue-800">Home</Link></li>
            <li><Link href="/search" className="text-blue-600 underline hover:text-blue-800">Search</Link></li>
            <li><Link href="/browse" className="text-blue-600 underline hover:text-blue-800">Browse</Link></li>
          </ul>
        </div>
        
        <div className="mt-6">
          <Link href="/" className="text-blue-600 underline hover:text-blue-800">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}