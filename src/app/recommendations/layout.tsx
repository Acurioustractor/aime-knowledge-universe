import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Key Recommendations | IMAGI-NATION Research Wiki',
  description: 'The top 10 transformative insights from the IMAGI-NATION Research Synthesis',
}

export default function RecommendationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}