import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Voices | IMAGI-NATION Research Wiki',
  description: 'Participants from 52 countries sharing their visions for the future',
}

export default function VoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}