import '../globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AIME Knowledge Wiki - Complete Knowledge Repository',
  description: 'Comprehensive wiki-style access to all AIME knowledge resources, tools, and content.',
}

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}