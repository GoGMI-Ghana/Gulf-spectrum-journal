'use client'

import Link from 'next/link'
import Image from 'next/image'
import { journal } from '@/lib/staticContent'
import { useI18n } from '@/context/I18nContext'
import { fmt } from '@/lib/i18n/format'

export default function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-ink text-white/70 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/gogmi-logo.png" alt="GoGMI" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-display text-white text-lg">Gulf Spectrum Journal</span>
          </div>
          <p className="text-sm leading-relaxed max-w-md">{fmt(t.footer.blurb, { subtitle: t.journal.subtitle })}</p>
          <a
            href="https://www.gogmi.org.gh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-gold hover:text-soft-gold mt-4 border-b border-gold/50 hover:border-soft-gold"
          >
            gogmi.org.gh
          </a>
        </div>

        <div>
          <h3 className="kicker text-white mb-4">{t.footer.journalHeading}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-gold">{t.nav.about}</Link></li>
            <li><Link href="/issues" className="hover:text-gold">{t.nav.articlesAndIssues}</Link></li>
            <li><Link href="/topics" className="hover:text-gold">{t.nav.topics}</Link></li>
            <li><Link href="/authors" className="hover:text-gold">{t.nav.authors}</Link></li>
            <li><Link href="/editorial-board" className="hover:text-gold">{t.nav.editorialBoard}</Link></li>
            <li><Link href="/submissions" className="hover:text-gold">{t.nav.submissions}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="kicker text-white mb-4">{t.footer.moreHeading}</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/bookmarks" className="hover:text-gold">{t.nav.bookmarks}</Link></li>
            <li>
              <Link href="/contact" className="hover:text-gold">{t.footer.contactOffice}</Link>
            </li>
            <li>
              <Link href="/correction-policy" className="hover:text-gold">{t.footer.correctionPolicy}</Link>
            </li>
            <li>{journal.contactEmail}</li>
            <li>{journal.issn ?? t.journal.issnPending}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>{fmt(t.footer.rights, { year: new Date().getFullYear() })}</p>
          <p>{journal.domain}</p>
        </div>
      </div>
    </footer>
  )
}
