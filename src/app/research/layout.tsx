import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research Synthesis | IMAGI-NATION Research Wiki',
  description: 'AI-powered analysis and insights from the IMAGI-NATION Research Synthesis project',
}

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}