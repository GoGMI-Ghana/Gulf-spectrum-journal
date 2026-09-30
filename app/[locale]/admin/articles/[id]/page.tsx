import ArticleForm from '@/components/admin/ArticleForm'

export default async function AdminEditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ArticleForm articleId={id} />
}
