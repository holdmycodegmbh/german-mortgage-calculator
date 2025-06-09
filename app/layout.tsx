import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'German Mortgage Calculator Example',
  description: 'Example of a german mortgage calculator',
  generator: 'Gregor Doroschenko @ Hold My Code GmbH',
  authors: [{ name: 'Gregor Doroschenko', url: 'https://holdmycode.com' }],
  keywords: ['german', 'mortgage', 'calculator', 'example'],
  robots: 'index, follow',
  openGraph: {
    title: 'German Mortgage Calculator Example',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
