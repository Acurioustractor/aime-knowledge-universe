import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Content Archive | IMAGI-NATION Research Wiki',
  description: 'Browse all IMAGI-NATION content including videos, workshops, and research materials',
}

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}