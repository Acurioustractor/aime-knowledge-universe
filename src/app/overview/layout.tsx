import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Project Overview | IMAGI-NATION Research Wiki',
  description: 'Overview of the IMAGI-NATION Research Synthesis project and its vision',
}

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}