import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookmarksProvider } from '@/context/BookmarksContext'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-family-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-family-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Gulf Spectrum Journal — A Publication of the Gulf of Guinea Maritime Institute',
    template: '%s | Gulf Spectrum Journal',
  },
  description:
    'Gulf Spectrum Journal is the research journal of the Gulf of Guinea Maritime Institute (GoGMI), publishing locally produced, editorially reviewed research on maritime security and governance in the Gulf of Guinea.',
  // Favicon comes from app/icon.png (Next.js file-convention icon) — the
  // real GoGMI logo, no manual `icons` entry needed.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-white">
        <BookmarksProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </BookmarksProvider>
      </body>
    </html>
  )
}
