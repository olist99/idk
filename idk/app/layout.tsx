import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Snog - Social Discovery',
  description: 'Meet new people. Make connections. Snog, Marry, or Avoid?',
  keywords: ['social', 'dating', 'discovery', 'meet people', 'snog'],
  authors: [{ name: 'Snog Team' }],
  openGraph: {
    title: 'Snog - Social Discovery',
    description: 'Meet new people. Make connections.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
