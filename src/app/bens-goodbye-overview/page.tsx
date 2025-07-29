"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function BensGoodbyeOverview() {
  const [activeSection, setActiveSection] = useState('video')

  const keyAreas = [
    {
      title: "Indigenous Knowledge Systems",
      description: "Top of the tree classifier - safe and protected knowledge",
      links: [
        { text: "Wiki: Indigenous Knowledge", href: "/wiki?section=indigenous-knowledge" },
        { text: "Search: Indigenous", href: "/discover?q=indigenous" }
      ]
    },
    {
      title: "Hoodie Economics Framework", 
      description: "Economic framework with API integration",
      links: [
        { text: "Hoodie Stock Exchange", href: "/hoodie-stock-exchange" },
        { text: "Wiki: Hoodie Economics", href: "/wiki?section=hoodie-economics" },
        { text: "Business Cases", href: "/business-cases" }
      ]
    },
    {
      title: "Imagination TV",
      description: "400+ videos with automated transcription and wisdom extraction",
      links: [
        { text: "Imagination TV App", href: "/apps/imagination-tv" },
        { text: "All Videos", href: "/content/videos" },
        { text: "Search Videos", href: "/discover?types=video" }
      ]
    },
    {
      title: "Data Lake & Unified System",
      description: "Central repository connecting all knowledge sources",
      links: [
        { text: "Unified Search", href: "/discover" },
        { text: "Knowledge Wiki", href: "/wiki" },
        { text: "Content Universe", href: "/content-universe" }
      ]
    },
    {
      title: "Learning & Mentoring",
      description: "Structured pathways and mentor applications",
      links: [
        { text: "Mentor App", href: "/apps/mentor-app" },
        { text: "Learning Pathways", href: "/learn" },
        { text: "Wiki: Mentoring", href: "/wiki?section=mentoring" }
      ]
    },
    {
      title: "Tools & Resources",
      description: "500-600 tools from Airtable integration",
      links: [
        { text: "All Tools", href: "/tools" },
        { text: "Search Tools", href: "/discover?types=tool" },
        { text: "Newsletters Archive", href: "/newsletters" }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" className="text-blue-200 hover:text-white text-sm">
              ← Back to Main Site
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">Ben's Goodbye Overview</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            A comprehensive handover of 20 years of AIME knowledge, systems, and the unified platform architecture
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'video', label: 'Video Overview' },
            { id: 'transcript', label: 'Full Transcript' },
            { id: 'summary', label: 'Key Takeaways' },
            { id: 'links', label: 'System Links' },
            { id: 'comms-handover', label: 'Communications Handover' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeSection === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Video Section */}
        {activeSection === 'video' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">AIME Handover Video Overview</h2>
              <div className="flex justify-center mb-6">
                <iframe 
                  src="https://share.descript.com/embed/TdR92IaXDm8" 
                  width="640" 
                  height="360" 
                  frameBorder="0" 
                  allowFullScreen
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Complete architecture overview</li>
                    <li>• Data lake and unified search system</li>
                    <li>• Indigenous knowledge protection</li>
                    <li>• Hoodie economics integration</li>
                    <li>• Learning pathway creation</li>
                    <li>• Open source implementation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Statistics</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• <strong>2,745+</strong> total resources</li>
                    <li>• <strong>400+</strong> YouTube videos</li>
                    <li>• <strong>500-600</strong> tools from Airtable</li>
                    <li>• <strong>20 years</strong> of AIME knowledge</li>
                    <li>• <strong>Multiple</strong> integrated data sources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Section */}
        {activeSection === 'transcript' && (
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Full Video Transcript</h2>
            <div className="prose max-w-none">
              <div className="bg-white p-6 rounded-lg shadow-sm border text-gray-700 leading-relaxed whitespace-pre-line">
                {`[00:00:00] I've been working on a little bit of a goodbye overview over the last few weeks and yeah, we can do a face to face or zoom to zoom, little catch up. But I thought I'd do this as a bit of an overview, i've taken that challenge of how do you combine 20 years of AIME's knowledge and then create repositories that then are able to search each other and creates multiple pathways through that knowledge.

So plenty more to throw in, I think. But from a high level, what we're looking at is this indigenous knowledge systems. Is like the top of the tree, and it comes in as a classifier, which means that it's its own piece. And it's like safe. And then we have the Hoodie Economics framework, which that's an overview that then links to an API that then goes into this master system.

And then imagination as the nation is separate at the moment. So that sits Digital Nation, it has a next JS front end, and it's got a process. So then we have less sources, which YouTube 400 or so videos. Air table it's like 500 tools, 600 tools or something. GitHub, which has a few different of the platforms that we've created from the impact to the hoodie stuff, and then MailChimp, which is the history of our MailChimp newsletters, which goes into a mastery system, which then goes into another classifier.

So it means it's another like layer of that knowledge. Which then goes into this thing called a contents enhancer, which uses all of this to be able to understand what are all the contextualization that work I can create from this to create themes, filters, and experiences. And then this is the important part, which I love this terminology of a data lake.

So this is our lake of data in which we are currently sitting in this thing called SQ light, which is. Just a local computer server thing, but then moving it across to an online SQL server, which just means that you can get stuff in and stored in the cloud. And there's this processing system at the moment where you have your inputs, you have a sync, you have a processing.

Then there's these hubs that it goes into. So what's a story? What's a tool? What's research? What are events? And then what are updates? And then it creates this unified system. So this is pretty nerdy but I love it. Yeah, I think this architecture is quite interesting around like how do you create an API of all of the information that then links to what is a knowledge process, how do you explain that hoodie exchange and have a front end?

And how do those newsletters sync? And then it like, it's almost like how do you take. What's inside the platform and then push it out to something else. So you can push it to a newsletter, create a newsletter , from that information and then edit it. Push it back to Airtable as new information.

So maybe you read something, create something that goes back into Airtable, into that pipeline. So you can see here there's a couple of things where it's like you can have a storytelling engine. You can have AI do some content analysis and then build these things called knowledge graphs which I can show you a bit later.

Front end is important, so making sure we have our page routes. So that people know where they're going, and then thinking about what is a learning pathway and what's a knowledge system, and then understanding what that process is. I won't do much more of this. I'll get to the fun stuff where you can see it.

I think this one's cool. So API goes out to, youTube or Vimeo, and then it's able to understand what episode that is and then automatically transcribe and then create these wisdom extracts, which are then synced across the rest of the data lake and searchable. So I can show you that yeah. In a minute as well.

And yeah, this is all. Open source, right? So this code's on GitHub and that wants to jump in and add layers to this can, they can make their own and just make their own learning platform. If there's people at university, it's this is rad, I wanna implement it into my system. They could, whether it's Moodle or whatever, they could just create an API and say.

Gather every aim video about mentoring and then that would show up in their system. Rad. Let's have a look at the actual thing. Now. This is gonna break for sure, but let's see how we go. So we've got 2,745 resources. Got a unified search platform. That you can search for anything, hopefully. And then it discovers knowledge based on that.

So this is coming up as three tools, seven articles, four knowledge docs, and one video. This is a tool, so it's like photos of when we did hoodie day, there was photos we took about developing. It's an episode of making a hoodie. Again, making a hoodie. This is a mail out. This is a document so you can see it just is pulling different things from different areas.

The way this works is it's broken up to four sections. Discover, which is where you can find hopefully everything you need. Apps, which are like self-contained applications, you can build on top of the knowledge, imagination, TV mentor app type stuff. Learn, which is creating learning pathways. So having topics that then link to specific lessons that then links to everything else and understand which is how you understand the different concepts across all of the areas.

A bunch of questions here you can click through to, and then different formats. This hoodie journey thing was that thing I made around like that the journey of hoodies and that process that you go through, for example this is just widgets, these show up linked from the data lake. Then just screwing with all this stuff.

So here's a bunch of links that directly go to different ways in which this data has been manufactured. Everything from wikis to like that hoodie, stock exchange is just built from what it thinks it knows which is interesting. And then yeah, some other exciting bits. I might show you the mentor app.

So you can see here, you go to the apps and then I've just mocked ideas for this. So TV mentor, I was even thinking, imagine. Film app. So it's like when the filming happens, you can have an app to track where it's being hosted and like things that are happening and people can add comments and things and reflections.

And even like a see the word thing, which is how can you have an app that sorts out where to meet and how, and yeah, how to give.

So here's our Imagination TV app. So at the moment it's just linking to all the videos. So 457 videos that you can filter. And then watch, this is like an episode widget type experience where you can see, the details from YouTube, but you can also have these learning objectives that are automated.

And then the next process of this would be this automated transactions transcription service. I've just put the details in there. Probably take a week and cost a hundred bucks. And that's all automated. You just run an agent and it'll just run in the background and finish. Which is rad.

Now let's, yeah. This one I've been playing with takes a little bit of load, but pretty fun. Essentially it's just taken it, all of these lessons and then you start your lesson. And in the lesson you'll have a few different areas that you can do. So it's got an intro, a lesson, a watch, a practice, and reflect.

And so you go through each one to finish the activity, and then once you've completed your lesson, you can review or go to the next one. And then one thing that I have tried to implement is this idea of a hoodie collection. So you can see hoodies earned some form of economic value and your pro your progress.

Which these hoodies are based around a particular. Lesson you do the lesson, this unlocks, it's got a value, and then the ultimate at the end you get a hoodie. And then there's this idea of unlocking things. So what sort of opportunities do you unlock with your physical hoodie? And then I came up with this.

Wild idea that's based around Jack's idea, for sure, not mine. This idea of a hoodie challenge, this whole experience where what you can do is because we have the data lake and it has every piece of knowledge, information, you can actually create a hoodie challenge that's based around. Kind of anything you do on the platform.

So you could build pretty easy roots to be able to be like watching Imagination TV for X amount of minutes gets you a particular amount of hoodie, economic score or a hoodie. Creating real relationships gets you. A certain amount. And even this idea of doing stuff in nature creates a certain amount.

So pretty, I dunno, pretty rad. It's just a process of what do you want the challenges to be really like, set it up, start the challenge off it goes, allow the language model to understand what, how to base the value of it. Overlaid with hood economics as that wisdom to do that. It's pretty fun. And then I guess this system of, is business case system type things where it's like there's a bunch of business cases, there's a whole bunch of information that relates to that business case. You input that spits out these criteria. So this is the Joy Corp and the challenge and the target audiences. This is like a high level approach.

Let's say you implement, this is like metrics in which you're looking for and testimonials. And then you've got a bunch of resources. So yeah it's as I said, like all of this stuff is based around this language model, the data lake. So of course things are gonna be, there's gonna be some interesting topics at some stage, like it's pulling from 20 years ago.

So I think there's this process of validation, that aim staff can go through and be validating knowledge and then making that role to the top, if that makes sense. And even this idea of adding case studies is like each time there's a Joy Corp person working through a progress, add a case study and jump on a Zoom and get 'em to like, add their knowledge and then add that to this business case system.

Sort of analyzes it and does all that stuff away talking shit now there's so much more as this whole idea of this wiki. So taking all the knowledge and then as you saw from that makeup. It just creates these roots for these particular types of knowledge. And then you can see like it comes up with different numbers of knowledge that's related to this.

Provides a bit of a summary and then with some of them it should link to. Other parts of the site. So it's this web, right? You search for something, it tries to show you, hey, you look at all this stuff as well. Yeah, so a bit of it will probably making up stuff that's a bit too much, whatever, but yeah.

Yeah. And then learning pathways. So creating this pathway, it's broken, of course. You can brought. Like a pathway from understanding what systems, indigenous systems thinking is, and just like pulling in those specific learning outcomes or topics and then putting them into a logic for people to work through.

Yeah, so this, I don't know, it's ready to go, but just needs a bit of love. It's like a, living, breathing knowledge system where each time you add more information to it, it recalibrates in a way and creates like a a symbiosis with, its with itself. Yeah, I be, can walk people through it.

It links to my huge amount of stuff. In notion like this is like my baby from when I started. There's pages and links and when I first started aim, I was like, young go-getter. I wanted everything. So most of it's in here and I can walk people through this as well. Peace.`}
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">Key System Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">🏛️ Core Structure</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Indigenous Knowledge Systems:</strong> Top-level classifier, protected and safe</li>
                    <li><strong>Hoodie Economics Framework:</strong> API-driven economic system</li>
                    <li><strong>Data Lake:</strong> Central repository in SQL/cloud storage</li>
                    <li><strong>Content Enhancer:</strong> AI-driven contextualization</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">📊 Data Sources</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>YouTube:</strong> 400+ videos with auto-transcription</li>
                    <li><strong>Airtable:</strong> 500-600 tools and resources</li>
                    <li><strong>GitHub:</strong> Platform code and documentation</li>
                    <li><strong>MailChimp:</strong> Newsletter archive and updates</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-900">Key Features & Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">🔍 Discovery</h3>
                  <p className="text-gray-700">Unified search across all knowledge sources with intelligent filtering and theme detection</p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">📱 Applications</h3>
                  <p className="text-gray-700">Self-contained apps like Imagination TV, Mentor App, and custom learning tools</p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">🎯 Learning Pathways</h3>
                  <p className="text-gray-700">Structured learning with hoodie rewards and progress tracking</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-900">Innovation Highlights</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">🤖 Automated Wisdom Extraction</h3>
                  <p className="text-gray-700">AI automatically transcribes videos and creates "wisdom extracts" that sync across the entire data lake</p>
                </div>
                <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">🏆 Hoodie Challenge System</h3>
                  <p className="text-gray-700">Dynamic challenges based on platform engagement - watching content, building relationships, nature activities</p>
                </div>
                <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-2">🌐 Open Source Vision</h3>
                  <p className="text-gray-700">Universities and organizations can create APIs to integrate AIME knowledge into their own systems</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links Section */}
        {activeSection === 'links' && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Explore the AIME Knowledge Universe</h2>
              <p className="text-gray-600 mb-8">
                Navigate through the interconnected systems Ben describes in his handover overview
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyAreas.map((area, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.title}</h3>
                    <p className="text-gray-600 mb-4">{area.description}</p>
                    <div className="space-y-2">
                      {area.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          href={link.href}
                          className="block text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                        >
                          → {link.text}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/discover" className="bg-white p-3 rounded-lg text-center hover:shadow-sm transition-shadow">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="text-sm font-medium">Unified Search</div>
                  </Link>
                  <Link href="/apps" className="bg-white p-3 rounded-lg text-center hover:shadow-sm transition-shadow">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="text-sm font-medium">Apps</div>
                  </Link>
                  <Link href="/wiki" className="bg-white p-3 rounded-lg text-center hover:shadow-sm transition-shadow">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-sm font-medium">Knowledge Wiki</div>
                  </Link>
                  <Link href="/admin/sync" className="bg-white p-3 rounded-lg text-center hover:shadow-sm transition-shadow">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="text-sm font-medium">Admin Sync</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communications Handover Section */}
        {activeSection === 'comms-handover' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">📢</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Communications & Strategy Handover</h2>
                  <p className="text-gray-600">Complete transition document for Shyaka Farid Lwanyaaga (The Bard)</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
                  <h3 className="font-bold text-purple-900 mb-2">New Role</h3>
                  <p className="text-sm text-gray-700">Director of Communications & Strategy Lead</p>
                </div>
                <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 mb-2">Revenue Impact</h3>
                  <p className="text-sm text-gray-700">$80,000 actual incoming revenue</p>
                </div>
                <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
                  <h3 className="font-bold text-green-900 mb-2">Transition Date</h3>
                  <p className="text-sm text-gray-700">August 1, 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Executive Summary</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  This enhanced handover document incorporates additional critical details discovered through email analysis 
                  and provides a comprehensive transition for the Communications & Strategy role.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-amber-800 mb-2">Core Values & Approach</h4>
                  <ul className="text-amber-700 text-sm space-y-1">
                    <li>• Radical Humility</li>
                    <li>• Community-First Approach</li>
                    <li>• Project Transferred ✅</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Primary Focus Areas</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">📺</span>
                    <div>
                      <strong>Imagination Assembled</strong> - Global tour coordination and content strategy
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🏢</span>
                    <div>
                      <strong>VISA Office</strong> - Inside IMAGI-NATION and mailing list management
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">💝</span>
                    <div>
                      <strong>Sunday Kindness</strong> - Working closely with Kristy and Steph
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">🎬</span>
                    <div>
                      <strong>IMAGINE Film Rollout</strong> - Coordination and broader strategic plays
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">👥</span>
                    <div>
                      <strong>150 Custodians Initiative</strong> - Oversight and story coordination
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Team Positioning</h3>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm italic">
                    "Shyaka and Laurean as our comms base outta Africa"
                  </p>
                  <p className="text-blue-600 text-xs mt-1">- Jack's Vision</p>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Globally distributed team structure spanning:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">🇦🇺 Australia</div>
                  <div className="bg-gray-50 p-2 rounded">🇮🇳 India</div>
                  <div className="bg-gray-50 p-2 rounded">🇺🇸 America</div>
                  <div className="bg-gray-50 p-2 rounded">🇨🇷 Costa Rica</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Critical Technical Infrastructure</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-4 text-purple-900">River Runs System</h4>
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <p className="text-purple-800 font-medium mb-2">🗺️ Major Discovery: Private Google Sites</p>
                    <p className="text-sm text-purple-700 mb-2">
                      <strong>Access:</strong> Requires AIME Gmail account
                    </p>
                    <a 
                      href="https://sites.google.com/aimementoring.com/riverruns/home"
                      className="text-purple-600 hover:text-purple-800 underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      → River Runs Playlist
                    </a>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Holds map for 5 Action VISAs</li>
                    <li>• Screened during weekly UNCX5 meetings</li>
                    <li>• Must be studied like a map</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4 text-blue-900">Hoodie Economics - Live System</h4>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-medium mb-2">🎯 Status: LIVE & Active</p>
                    <p className="text-sm text-blue-700 mb-2">
                      <strong>Current Direction:</strong> 5 hoodies/month, return to Bank in October
                    </p>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Airtable tracking system</li>
                    <li>• "JOY-Kindness" River Run tracking</li>
                    <li>• Active Issue: Jean Makki tracking question</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Enhanced Content Strategy Framework</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="text-lg font-medium mb-3 text-purple-900">Imagination Assembled</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>Format:</strong> Global tour of mentors (similar to Cirque du Soleil / band touring emails)
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-medium text-purple-800 mb-2">Content Components:</h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Meet a Mentor - Big photo features</li>
                      <li>• 5 Questions with the Bard - Interview format</li>
                      <li>• Showcase Photos - 5 photos from recent events</li>
                      <li>• Testimonials - 3 quotes from kids & teachers</li>
                      <li>• Booking Options: Film Screening, I'm Responsible Show, Workshop</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-medium mb-3 text-blue-900">VISA Office - Human Stories</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>New Initiative:</strong> "Humans of IMAGI-NATION" approach
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 mb-2">Template Structure:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• IMAGI-NATION VISA Office - Meet [Name] from [Country]</li>
                      <li>• Standard Info: Name, age, latest connection, favourite River Run</li>
                      <li>• Conversation Transcript: Who, why, what learned</li>
                      <li>• Visual: Big photo (FBI info "AIMEified"), icons, tour links</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="text-lg font-medium mb-3 text-green-900">Sunday Kindness - University Publication</h4>
                  <p className="text-gray-700 mb-3">
                    <strong>Enhanced Vision:</strong> Official IMAGI-NATION University publication
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700">
                      <strong>Leadership:</strong> Stephani Beck with Benjamin Knight support during transition
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Weekly Communication Rhythms</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-400">Monday</h4>
                  <p className="text-sm text-gray-300">Post weekly plan in Signal</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-purple-400">Wednesday</h4>
                  <p className="text-sm text-gray-300">Wednesday Dreams conversations (starting August 13)</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-green-400">Friday</h4>
                  <p className="text-sm text-gray-300">Reflect on week's accomplishments in Signal</p>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-yellow-400">Critical Success Factors</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-white mb-2">Essential Knowledge Areas:</h5>
                    <ul className="text-gray-300 space-y-1">
                      <li>• River Runs Mastery</li>
                      <li>• IMAGI-NATION Geography</li>
                      <li>• Hoodie Economics Operations</li>
                      <li>• Signal Ecosystem Participation</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-white mb-2">Relationship Priorities:</h5>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Jack Manning Bancroft - Vision alignment</li>
                      <li>• Kristy & Steph - Content partnership</li>
                      <li>• Global team - Connection maintenance</li>
                      <li>• VISA Holders - Story amplification</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">Final Message from Jack</h3>
              <blockquote className="text-lg italic mb-4">
                "Tonight after talking to Shyaka about taking this role I thought... yeah man you've arrived. 
                you have done the work. Done all the river runs. you know this world we've built. 
                if you haven't done that. You don't know the other side of IMAGI-NATION. Shyaka does, he can lead us now."
              </blockquote>
              
              <div className="bg-white/10 rounded-lg p-4 mt-6">
                <p className="text-sm">
                  <strong>Contact for Transition Support:</strong> benjamin@act.place<br/>
                  <strong>Available Through:</strong> August 30, 2025
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm italic">
                  "AIME calls in the intelligence from all species, from all time, today and into the future, 
                  reminding us all we are in relation, we are a custodial species. Sending you joy, kindness, hope and vibes."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 bg-gray-900 text-white rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Thank you, Ben! 🎉</h3>
            <p className="text-gray-300 mb-6">
              This incredible knowledge architecture represents 20 years of AIME wisdom, 
              innovation, and dedication to Indigenous knowledge systems and mentoring.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/discover" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore the Knowledge Universe
              </Link>
              <Link 
                href="/apps/imagination-tv" 
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Watch Imagination TV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}