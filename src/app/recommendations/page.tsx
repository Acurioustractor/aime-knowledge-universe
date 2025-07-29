"use client"

import Link from 'next/link'
import Image from 'next/image'

// Metadata moved to layout.tsx

// This would normally come from an API or data file
const recommendations = [
  {
    id: '01',
    title: 'Film/TV Industry That Nurtures',
    description: 'Creating media that nurtures attention rather than mines it, transforming how stories are told and consumed.',
    image: '/assets/images/Uluru Day 1-73.jpg',
    link: '/recommendations/01-nurturing-media'
  },
  {
    id: '02',
    title: 'Healthy Relational Networks',
    description: 'Building digital spaces without advertising/data theft that prioritize human connection over extraction.',
    image: '/assets/images/School - Day 4-16.jpg',
    link: '/recommendations/02-relational-networks'
  },
  {
    id: '03',
    title: 'Schools as Imagination Labs',
    description: 'Reimagining education institutions as laboratories for imagination, linked to Hoodie Economics principles.',
    image: '/assets/images/School - Day 4-20.jpg',
    link: '/recommendations/03-imagination-labs'
  },
  {
    id: '04',
    title: 'Relational Economies',
    description: 'Implementing the 7 principles from Hoodie Economics to create economies based on relationship rather than transaction.',
    image: '/assets/images/Uluru Day 1-47.jpg',
    link: '/recommendations/04-relational-economies'
  },
  {
    id: '05',
    title: 'Kindness as Core Societal Value',
    description: 'Centering kindness in policy, governance, and community design as a foundational societal principle.',
    image: '/assets/images/IMG_1461.jpg',
    link: '/recommendations/05-kindness-value'
  },
  {
    id: '06',
    title: 'Universal Imagination Curriculum',
    description: 'Developing a globally accessible curriculum that nurtures imagination as a core human capacity.',
    image: '/assets/images/School - Day 4-44.jpg',
    link: '/recommendations/06-imagination-curriculum'
  },
  {
    id: '07',
    title: 'Nature-Centered Governance',
    description: 'Creating governance systems that recognize nature as a primary stakeholder in all decision-making.',
    image: '/assets/images/Uluru Day 1-136.jpg',
    link: '/recommendations/07-nature-governance'
  },
  {
    id: '08',
    title: 'Decentralized Knowledge Systems',
    description: 'Building knowledge infrastructures that honor diverse ways of knowing and democratize access.',
    image: '/assets/images/School - Day 4-16.jpg',
    link: '/recommendations/08-decentralized-knowledge'
  },
  {
    id: '09',
    title: 'Youth Leadership in Systems Design',
    description: 'Positioning young people as primary designers of the systems they will inherit and steward.',
    image: '/assets/images/School - Day 4-20.jpg',
    link: '/recommendations/09-youth-leadership'
  },
  {
    id: '10',
    title: 'Intentional Organizational Death Cycles',
    description: 'Embracing organizational endings as natural and necessary for regeneration and evolution.',
    image: '/assets/images/Uluru Day 1-73.jpg',
    link: '/recommendations/10-organizational-cycles'
  }
];

export default function RecommendationsPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container-wiki">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><span>/</span></li>
              <li className="text-gray-700 font-medium">Key Recommendations</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-6">Key Recommendations</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl">
            These 10 recommendations represent the collective wisdom of a global imagination generation, 
            synthesized from 250+ conversations and workshops across 52 countries.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {recommendations.map((recommendation) => (
              <Link 
                key={recommendation.id}
                href={recommendation.link}
                className="group"
              >
                <div className="card overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={recommendation.image}
                      alt={recommendation.title}
                      fill
                      style={{objectFit: 'cover'}}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 left-0 bg-primary-600 text-white font-bold text-xl p-2 rounded-br-lg">
                      {recommendation.id}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                      {recommendation.title}
                    </h2>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {recommendation.description}
                    </p>
                    <div className="text-primary-600 font-medium flex items-center mt-auto">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Implementation Roadmap</h2>
            <p className="text-gray-700 mb-6">
              These recommendations aren't just ideas—they're blueprints for action. Explore our implementation 
              resources to activate these insights in your context.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/implementation/policy-integration"
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-start"
              >
                <div className="bg-primary-100 text-primary-800 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Policy Integration</h3>
                  <p className="text-gray-600">Frameworks for incorporating these recommendations into policy and governance.</p>
                </div>
              </Link>
              
              <Link 
                href="/implementation/community-activation"
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-start"
              >
                <div className="bg-primary-100 text-primary-800 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Community Activation</h3>
                  <p className="text-gray-600">Tools for mobilizing communities around these recommendations.</p>
                </div>
              </Link>
              
              <Link 
                href="/implementation/educational-transformation"
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-start"
              >
                <div className="bg-primary-100 text-primary-800 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Educational Transformation</h3>
                  <p className="text-gray-600">Resources for educators implementing these ideas in learning environments.</p>
                </div>
              </Link>
              
              <Link 
                href="/implementation/economic-redesign"
                className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors flex items-start"
              >
                <div className="bg-primary-100 text-primary-800 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Economic Redesign</h3>
                  <p className="text-gray-600">Frameworks for implementing relational economic principles.</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="bg-primary-900 text-white rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold mb-4">Ready to Implement These Recommendations?</h2>
                <p className="mb-6">
                  Download our implementation toolkits, connect with others working on similar initiatives, 
                  and join the global movement to activate these insights.
                </p>
                <Link 
                  href="/implementation/resources/toolkits"
                  className="btn bg-white text-primary-900 hover:bg-gray-100"
                >
                  Access Implementation Toolkits
                </Link>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/assets/images/IMG_1461.jpg"
                    alt="Implementation toolkits"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}