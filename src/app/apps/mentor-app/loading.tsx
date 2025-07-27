export default function MentorAppLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-32 bg-black/30 rounded-lg animate-pulse"></div>
            <div className="h-10 w-48 bg-black/30 rounded-lg animate-pulse"></div>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl">
                🎓
              </div>
              <div>
                <div className="h-12 w-80 bg-white/20 rounded-lg animate-pulse mb-2"></div>
                <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="h-20 w-full max-w-3xl mx-auto bg-black/20 rounded-xl animate-pulse mb-8"></div>

            {/* Progress Bar Skeleton */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="w-full bg-black/40 rounded-full h-3 border border-white/20">
                <div className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3 rounded-full w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              className="relative bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl animate-pulse"
            >
              {/* Badge */}
              <div className="absolute -top-3 -right-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
              </div>

              {/* Thumbnail */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <div className="w-full h-32 bg-slate-700 animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                {/* Title */}
                <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                
                {/* Summary */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-blue-500/20 rounded-full animate-pulse"></div>
                  <div className="h-6 w-16 bg-green-500/20 rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-purple-500/20 rounded-full animate-pulse"></div>
                </div>

                {/* Duration */}
                <div className="h-8 bg-black/20 rounded-lg animate-pulse"></div>

                {/* Button */}
                <div className="h-12 bg-slate-600 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Skeleton */}
        <div className="mt-16 text-center">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-full max-w-2xl bg-white/10 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 w-3/4 max-w-xl bg-white/10 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-12 w-40 bg-purple-600/50 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-blue-600/50 rounded-lg animate-pulse"></div>
              <div className="h-12 w-40 bg-green-600/50 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}