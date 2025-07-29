import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

// Import our redesigned components
const Header = dynamic(() => import('@/components/Header'), { ssr: true })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true })

export const metadata: Metadata = {
  title: 'AIME Knowledge Universe - Indigenous Wisdom for Systems Transformation',
  description: 'Twenty years of Indigenous custodianship, mentoring methodology, and systems thinking made searchable and accessible. 2,700+ resources for transformational learning.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}