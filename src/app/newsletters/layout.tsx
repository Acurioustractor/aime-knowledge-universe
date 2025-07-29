import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter Archive | IMAGI-NATION Research Wiki',
  description: 'Archive of IMAGI-NATION newsletters and updates',
}

export default function NewslettersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}