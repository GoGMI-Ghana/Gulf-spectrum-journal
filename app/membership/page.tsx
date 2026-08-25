import type { Metadata } from 'next'
import { membershipTiers } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import TierCard from '@/components/TierCard'

export const metadata: Metadata = {
  title: 'Membership',
  description: 'Join the Gulf of Guinea Maritime Institute — Student, Associate, Professional, Fellow, Institution, Corporate, and Strategic Partner tiers.',
}

export default function Membership() {
  return (
    <div>
      <PageBanner
        eyebrow="Join GoGMI"
        title="Membership"
        description="Members of the Gulf of Guinea Maritime Institute are part of a global community contributing to ocean governance and maritime safety in the Gulf of Guinea — connect, build, impact."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipTiers.map((tier) => (
            <TierCard key={tier.slug} tier={tier} />
          ))}
        </div>
      </section>
    </div>
  )
}
