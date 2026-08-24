import { useEffect } from 'react'

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Gulf Spectrum Journal` : 'Gulf Spectrum Journal — A Publication of the Gulf of Guinea Maritime Institute'

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }

    window.scrollTo(0, 0)
  }, [title, description])
}
