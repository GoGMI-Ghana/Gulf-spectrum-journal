import type { Metadata } from 'next'
import Link from 'next/link'
import { getEditorialBoard } from '@/lib/content'
import PageBanner from '@/components/PageBanner'
import Initials from '@/components/Initials'

export const metadata: Metadata = {
  title: 'Editorial Board',
  description: "Meet Gulf Spectrum Journal's current editorial board.",
}

export default async function EditorialBoardPage() {
  const board = await getEditorialBoard()

  return (
    <div>
      <PageBanner
        eyebrow="Gulf Spectrum Journal"
        title="Editorial Board"
        description="The editors who review and publish Gulf Spectrum Journal's research."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {board.length === 0 ? (
          <p className="text-slate-500">No editorial board members are listed yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-px bg-slate-200 mb-12">
            {board.map((member) => {
              const card = (
                <div className="flex items-start gap-4 p-5 bg-white h-full">
                  {/* Plain <img>, not next/image: photo_url can be any
                      hosted URL an editor pasted in the admin panel. */}
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt="" className="w-14 h-14 object-cover shrink-0 rounded-full" />
                  ) : (
                    <Initials name={member.name} size="md" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-royal-blue">{member.name}</p>
                    <p className="text-sm text-gold font-medium mb-1.5">{member.title}</p>
                    {member.bio && <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{member.bio}</p>}
                  </div>
                </div>
              )
              return member.authorSlug ? (
                <Link key={member.id} href={`/authors/${member.authorSlug}`} className="hover:bg-soft-gold/40 transition-colors">
                  {card}
                </Link>
              ) : (
                <div key={member.id}>{card}</div>
              )
            })}
          </div>
        )}

        <div className="border-l-4 border-royal-blue p-6 bg-slate-50">
          <h3 className="kicker text-royal-blue mb-3">Interested in joining?</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Gulf Spectrum Journal periodically brings on new editorial board members from among its
            registered readers and contributors.
          </p>
          <Link href="/editorial-board/apply" className="text-ocean-blue text-sm font-medium hover:underline">
            Apply for the editorial board →
          </Link>
        </div>
      </section>
    </div>
  )
}
