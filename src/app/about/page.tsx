'use client';

import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-light text-gray-900 mb-4">
                        About AIME
                    </h1>
                    <p className="text-xl text-gray-600">
                        Twenty years of Indigenous wisdom, mentoring methodology, and systems thinking
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-light text-gray-900 mb-6">Our Story</h2>

                    <p className="text-gray-700 leading-relaxed mb-6">
                        AIME (Australian Indigenous Mentoring Experience) was founded in 2005 with a simple but powerful idea:
                        that mentoring relationships could transform educational outcomes and life trajectories for Indigenous young people.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-6">
                        Over two decades, we've evolved from a local mentoring program into a global movement that applies
                        Indigenous wisdom to systems transformation. Our approach combines traditional knowledge systems
                        with modern organizational thinking to create lasting change.
                    </p>

                    <h2 className="text-2xl font-light text-gray-900 mb-6 mt-12">Our Approach</h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Indigenous Wisdom</h3>
                            <p className="text-gray-700">
                                We center Indigenous knowledge systems, including seven-generation thinking,
                                relational economics, and community-centered approaches to change.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Systems Thinking</h3>
                            <p className="text-gray-700">
                                We understand that lasting change requires transformation at multiple levels -
                                individual, organizational, and systemic.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Mentoring Methodology</h3>
                            <p className="text-gray-700">
                                Our relationship-first approach builds trust, unlocks imagination, and
                                creates pathways for sustainable transformation.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Global Movement</h3>
                            <p className="text-gray-700">
                                We work with organizations, communities, and individuals worldwide to
                                implement Indigenous-led approaches to change.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-light text-gray-900 mb-6">Key Concepts</h2>

                    <div className="space-y-6 mb-12">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Hoodie Economics</h3>
                            <p className="text-gray-700">
                                A relational approach to value creation that prioritizes relationships,
                                reciprocity, and community benefit over traditional profit maximization.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Joy Corps</h3>
                            <p className="text-gray-700">
                                Our organizational transformation methodology that helps institutions
                                embed Indigenous wisdom into their operations and culture.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Imagination as Currency</h3>
                            <p className="text-gray-700">
                                We believe imagination is the most valuable resource in creating positive change,
                                and we work to unlock and amplify imaginative capacity.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-lg">
                        <h2 className="text-2xl font-light text-gray-900 mb-4">Explore Further</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Link
                                href="/discover"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Browse Our Knowledge →
                            </Link>
                            <Link
                                href="/learn"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Start Learning →
                            </Link>
                            <Link
                                href="/understand"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Understand Connections →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}