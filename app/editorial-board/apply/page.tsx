import type { Metadata } from 'next'
import PageBanner from '@/components/PageBanner'
import EditorialBoardApplicationForm from '@/components/EditorialBoardApplicationForm'

export const metadata: Metadata = {
  title: 'Apply for the Editorial Board',
  description: 'Apply to join the Gulf Spectrum Journal editorial board.',
}

export default function ApplyEditorialBoardPage() {
  return (
    <div>
      <PageBanner
        eyebrow="Editorial Board"
        title="Apply for the Editorial Board"
        description="Applications are reviewed by Gulf Spectrum Journal's admin team."
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <EditorialBoardApplicationForm />
      </section>
    </div>
  )
}
