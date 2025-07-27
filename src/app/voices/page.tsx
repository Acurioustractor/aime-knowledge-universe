"use client"

import Link from 'next/link'
import Image from 'next/image'

// Metadata moved to layout.tsx

// This would normally come from an API or data file
const participantCategories = [
  {
    name: 'Youth Voices',
    description: 'Young people from around the world sharing their visions for the future they want to create.',
    count: 87,
    image: '/assets/images/School - Day 4-20.jpg',
    link: '/voices/youth'
  },
  {
    name: 'Indigenous Knowledge Holders',
    description: 'Wisdom keepers sharing ancestral knowledge systems that offer solutions to contemporary challenges.',
    count: 42,
    image: '/assets/images/Uluru Day 1-47.jpg',
    link: '/voices/indigenous'
  },
  {
    name: 'Government Leaders',
    description: 'Prime ministers, policy makers, and public servants reimagining governance for the next century.',
    count: 23,
    image: '/assets/images/Uluru Day 1-73.jpg',
    link: '/voices/government'
  },
  {
    name: 'Educators',
    description: 'Teachers, school leaders, and education innovators designing learning for imagination.',
    count: 56,
    image: '/assets/images/School - Day 4-44.jpg',
    link: '/voices/educators'
  },
  {
    name: 'Artists & Creators',
    description: 'Storytellers, filmmakers, musicians, and artists exploring the role of creativity in systems change.',
    count: 38,
    image: '/assets/images/IMG_1461.jpg',
    link: '/voices/artists'
  },
  {
    name: 'Systems Thinkers',
    description: 'Philosophers, scientists, and change-makers connecting dots across disciplines.',
    count: 31,
    image: '/assets/images/School - Day 4-16.jpg',
    link: '/voices/systems-thinkers'
  }
];

const regions = [
  { name: 'Africa', count: 42, link: '/voices/regions/africa' },
  { name: 'Asia-Pacific', count: 68, link: '/voices/regions/asia-pacific' },
  { name: 'Europe', count: 37, link: '/voices/regions/europe' },
  { name: 'North America', count: 29, link: '/voices/regions/north-america' },
  { name: 'South America', count: 31, link: '/voices/regions/south-america' },
  { name: 'Indigenous Nations', count: 43, link: '/voices/regions/indigenous-nations' }
];

const featuredVoices = [
  {
    name: 'Amara Okafor',
    role: 'Youth Climate Activist',
    country: 'Nigeria',
    quote: "Imagination isn't just a creative exercise—it's a survival skill for our planet. We need to imagine the world we want before we can build it.",
    image: '/assets/images/School - Day 4-20.jpg'
  },
  {
    name: 'Elder James Redfeather',
    role: 'Indigenous Knowledge Keeper',
    country: 'Canada',
    quote: "Our ancestors didn't separate knowledge into disciplines. They understood that everything is connected—the land, the water, the sky, and all living beings.",
    image: '/assets/images/Uluru Day 1-47.jpg'
  },
  {
    name: 'Dr. Maya Johnson',
    role: 'Education Innovator',
    country: 'Kenya',
    quote: "Schools should be places where imagination is cultivated, not crushed. Where young people learn to dream and then build those dreams.",
    image: '/assets/images/School - Day 4-44.jpg'
  }
];

export default function VoicesPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Global Voices</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Global Voices</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl">
            The IMAGI-NATION Research Synthesis represents one of the most diverse global co-design processes 
            ever documented, with voices from every continent and across generations.
          </p>
          
          {/* Featured Voices */}
          <h2 className="text-2xl font-semibold mb-6">Featured Voices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredVoices.map((voice) => (
              <div key={voice.name} className="card overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={voice.image}
                    alt={voice.name}
                    fill
                    style={{objectFit: 'cover'}}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold">{voice.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{voice.role}, {voice.country}</p>
                  <p className="text-gray-700 italic mb-4">"{voice.quote}"</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Participant Categories */}
          <h2 className="text-2xl font-semibold mb-6">Participant Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {participantCategories.map((category) => (
              <Link 
                key={category.name}
                href={category.link}
                className="group"
              >
                <div className="card overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      style={{objectFit: 'cover'}}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 right-0 bg-primary-600 text-white font-bold px-3 py-1 rounded-tl-lg">
                      {category.count} participants
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {category.description}
                    </p>
                    <div className="text-primary-600 font-medium flex items-center mt-auto">
                      Explore Voices
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Regional Representation */}
          <h2 className="text-2xl font-semibold mb-6">Regional Representation</h2>
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => (
                <Link 
                  key={region.name}
                  href={region.link}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{region.name}</h3>
                    <p className="text-gray-500">{region.count} participants</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary-600">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quote Database */}
          <div className="bg-primary-900 text-white rounded-lg shadow-md p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-4">Quote Database</h2>
                <p className="mb-6">
                  Explore our searchable collection of powerful insights from participants around the world. 
                  Filter by theme, region, or participant type to find wisdom that resonates with your interests.
                </p>
                <Link 
                  href="/voices/quotes"
                  className="btn bg-white text-primary-900 hover:bg-gray-100"
                >
                  Explore Quote Database
                </Link>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/Uluru Day 1-136.jpg"
                    alt="Quote database"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Video Highlights */}
          <h2 className="text-2xl font-semibold mb-6">Video Highlights</h2>
          <p className="text-gray-700 mb-6">
            Watch key moments from IMAGI-NATION {'{TV}'} featuring our diverse participants sharing their insights and visions.
          </p>
          <div className="mb-8">
            <Link 
              href="/content/videos"
              className="btn btn-primary"
            >
              View Video Highlights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}