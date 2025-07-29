import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video Archive | IMAGI-NATION Research Wiki',
  description: 'Browse all IMAGI-NATION {"{TV}"} episodes and workshops',
}

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}