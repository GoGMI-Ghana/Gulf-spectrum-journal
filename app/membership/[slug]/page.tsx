import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Download, ShieldCheck, Globe2 } from 'lucide-react'
import { membershipTiers } from '@/lib/content'
import JoinForm from '@/components/JoinForm'

const benefitIcons = [Download, ShieldCheck, Globe2]

export async function generateStaticParams() {
  return membershipTiers.map((tier) => ({ slug: tier.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tier = membershipTiers.find((t) => t.slug === slug)
  if (!tier) return { title: 'Membership tier not found' }
  return { title: `Join — ${tier.name}`, description: tier.audience }
}

export default async function JoinTier({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tier = membershipTiers.find((t) => t.slug === slug)
  if (!tier) notFound()

  const invitationOnly = tier.price === 'By Invitation Only'
  const highlightBenefits = tier.benefits.slice(0, 3)

  return (
    <div className="bg-ink min-h-[calc(100vh-1px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/membership" className="text-white/50 hover:text-gold text-sm">
          ← All membership tiers
        </Link>
        <div className="flex items-baseline gap-3 mt-4">
          <span className="font-display text-white text-2xl tracking-wide">GULF SPECTRUM</span>
          <span className="font-display text-gold text-2xl font-bold">Membership</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: "checkout" card — no payment fields, see JoinForm */}
        <div className="bg-white p-8">
          <h1 className="font-display text-royal-blue text-2xl mb-1">{tier.name}</h1>
          {tier.subtitle && <p className="text-sm text-slate-500 mb-4">{tier.subtitle}</p>}
          <p className="numeral text-3xl font-bold text-royal-blue mb-2">{tier.price}</p>
          <p className="text-sm text-slate-600 leading-relaxed mb-6 pb-6 border-b border-slate-200">
            {tier.audience}
          </p>
          <JoinForm tierName={tier.name} invitationOnly={invitationOnly} />
        </div>

        {/* Right: real benefits, no fabricated testimonials */}
        <div className="text-white lg:pt-2">
          <p className="kicker text-gold mb-3">Why Join GoGMI?</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6">
            Membership funds GoGMI&apos;s research, advocacy, and capacity-building
            work across the Gulf of Guinea.
          </h2>

          <div className="space-y-6 mb-10">
            {highlightBenefits.map((benefit, i) => {
              const Icon = benefitIcons[i % benefitIcons.length]
              return (
                <div key={benefit} className="flex gap-4">
                  <Icon className="text-gold shrink-0 mt-0.5" size={22} />
                  <p className="text-white/80 leading-relaxed">{benefit}</p>
                </div>
              )
            })}
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/60 text-sm leading-relaxed">
              GoGMI is a non-profit maritime think tank headquartered in Ghana, operating
              across the Gulf of Guinea region.{' '}
              <a
                href="https://www.gogmi.org.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:underline"
              >
                Learn more at gogmi.org.gh →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
