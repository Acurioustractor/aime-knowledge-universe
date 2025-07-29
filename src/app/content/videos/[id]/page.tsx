import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// This would normally come from an API call
const getVideoData = async (id: string) => {
  // Mock data for demonstration
  const videos = {
    'YE7VzlLtp-4': {
      id: 'YE7VzlLtp-4',
      title: 'Schools as Imagination Labs',
      description: 'Exploring how schools can become laboratories for imagination and creativity, fostering the next generation of systems thinkers. This episode features educators, students, and thought leaders discussing the transformation of educational spaces into centers of imagination and creativity.',
      publishedAt: '2023-10-15T14:00:00Z',
      channelTitle: 'IMAGI-NATION {"{TV}"}',
      tags: ['education', 'imagination', 'schools', 'creativity', 'systems thinking'],
      participants: [
        { name: 'Dr. Maya Johnson', role: 'Education Innovator', country: 'Kenya' },
        { name: 'Sam Rodriguez', role: 'Student Leader', country: 'Mexico' },
        { name: 'Professor Aisha Nkosi', role: 'Indigenous Knowledge Systems Expert', country: 'South Africa' }
      ],
      relatedVideos: ['Mq4Nk5BWJIQ', 'Ks-_Mh1QhMc'],
      relatedRecommendations: [
        { id: '03', title: 'Schools as Imagination Labs' },
        { id: '06', title: 'Universal Imagination Curriculum' }
      ]
    },
    'Mq4Nk5BWJIQ': {
      id: 'Mq4Nk5BWJIQ',
      title: 'Indigenous Knowledge Systems',
      description: 'Learning from Indigenous custodianship to create sustainable futures and integrate ancestral knowledge into modern systems design. This episode explores how Indigenous knowledge systems offer profound insights for addressing contemporary challenges.',
      publishedAt: '2023-09-28T14:00:00Z',
      channelTitle: 'IMAGI-NATION {"{TV}"}',
      tags: ['indigenous knowledge', 'sustainability', 'wisdom', 'systems thinking'],
      participants: [
        { name: 'Elder James Redfeather', role: 'Knowledge Keeper', country: 'Canada' },
        { name: 'Dr. Moana Williams', role: 'Indigenous Systems Researcher', country: 'New Zealand' },
        { name: 'Leila Whaitiri', role: 'Youth Activist', country: 'Australia' }
      ],
      relatedVideos: ['YE7VzlLtp-4', 'Ks-_Mh1QhMc'],
      relatedRecommendations: [
        { id: '07', title: 'Nature-Centered Governance' },
        { id: '08', title: 'Decentralized Knowledge Systems' }
      ]
    },
    'Ks-_Mh1QhMc': {
      id: 'Ks-_Mh1QhMc',
      title: 'Youth Leadership in Systems Design',
      description: 'How young people are taking the lead in reimagining our systems and building a future based on imagination and relationship. This episode showcases youth leaders from around the world who are driving systems change.',
      publishedAt: '2023-09-10T14:00:00Z',
      channelTitle: 'IMAGI-NATION {"{TV}"}',
      tags: ['youth leadership', 'systems design', 'future', 'imagination'],
      participants: [
        { name: 'Amara Okafor', role: 'Youth Climate Activist', country: 'Nigeria' },
        { name: 'Jin-ho Park', role: 'Student Innovator', country: 'South Korea' },
        { name: 'Sofia Mendez', role: 'Community Organizer', country: 'Colombia' }
      ],
      relatedVideos: ['YE7VzlLtp-4', 'Mq4Nk5BWJIQ'],
      relatedRecommendations: [
        { id: '09', title: 'Youth Leadership in Systems Design' },
        { id: '04', title: 'Relational Economies' }
      ]
    }
  };

  if (!videos[id as keyof typeof videos]) {
    return null;
  }

  return videos[id as keyof typeof videos];
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  const video = await getVideoData(params.id);
  
  if (!video) {
    return {
      title: 'Video Not Found',
      description: 'The requested video could not be found.'
    };
  }
  
  return {
    title: `${video.title} | IMAGI-NATION {"{TV}"}`,
    description: video.description.substring(0, 160),
  };
}

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await getVideoData(params.id);
  
  if (!video) {
    notFound();
  }
  
  const formattedDate = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li><Link href="/content" className="hover:text-primary-600">Content Archive</Link></li>
              <li><span>/</span></li>
              <li><Link href="/content/videos" className="hover:text-primary-600">Videos</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium truncate">{video.title}</li>
            </ol>
          </nav>
          
          {/* Video title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">{video.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {formattedDate}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {video.channelTitle}
            </div>
          </div>
          
          {/* Video player */}
          <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {video.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Episode</h2>
            <p className="text-gray-700 mb-6">{video.description}</p>
            
            <h3 className="text-lg font-semibold mb-3">Featured Participants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {video.participants.map(participant => (
                <div key={participant.name} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold">{participant.name}</h4>
                  <p className="text-sm text-gray-600">{participant.role}</p>
                  <p className="text-sm text-gray-500">{participant.country}</p>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-3">Related Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {video.relatedRecommendations.map(rec => (
                <Link 
                  key={rec.id} 
                  href={`/recommendations/${rec.id.padStart(2, '0')}-${rec.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-primary-100 text-primary-800 font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center mr-3 shrink-0">
                    {rec.id}
                  </div>
                  <span className="font-medium">{rec.title}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Related videos */}
          <h2 className="text-2xl font-semibold mb-6">Related Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {video.relatedVideos.map(videoId => {
              const relatedVideo = getVideoData(videoId);
              if (!relatedVideo) return null;
              
              return (
                <Link 
                  key={videoId}
                  href={`/content/videos/${videoId}`}
                  className="card group hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={(relatedVideo as any)?.title || `Video ${videoId}`}
                      fill
                      style={{objectFit: 'cover'}}
                      className="rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
                      <div className="w-12 h-12 rounded-full bg-primary-600 bg-opacity-90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{(relatedVideo as any)?.title || `Video ${videoId}`}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Back to videos */}
          <div className="text-center">
            <Link href="/content/videos" className="btn btn-outline">
              Back to Video Archive
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}