import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Implementation | IMAGI-NATION Research Wiki',
  description: 'How to activate the insights from the IMAGI-NATION Research Synthesis',
}

export default function ImplementationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}