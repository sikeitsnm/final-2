import { useEffect } from 'react'

import openGraphImage from '../assets/open.jpeg'

export default function SEO({
  title = 'Sugam Tamang',
  description = 'Original paintings by Sugam Tamang.',
  canonical = '/',
  ogImage = openGraphImage,
  ogType = 'website',
  jsonLd,
}) {
  useEffect(() => {
    document.title = title

    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta')
    metaDescription.name = 'description'
    metaDescription.content = description
    if (!metaDescription.parentNode) document.head.appendChild(metaDescription)

    const metaCanonical = document.querySelector('link[rel="canonical"]') || document.createElement('link')
    metaCanonical.setAttribute('rel', 'canonical')
    metaCanonical.setAttribute('href', `${window.location.origin}${canonical}`)
    if (!metaCanonical.parentNode) document.head.appendChild(metaCanonical)

    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    ogTitle.setAttribute('content', title)
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle)

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDescription.setAttribute('property', 'og:description')
    ogDescription.setAttribute('content', description)
    if (!ogDescription.parentNode) document.head.appendChild(ogDescription)

    const ogTypeMeta = document.querySelector('meta[property="og:type"]') || document.createElement('meta')
    ogTypeMeta.setAttribute('property', 'og:type')
    ogTypeMeta.setAttribute('content', ogType)
    if (!ogTypeMeta.parentNode) document.head.appendChild(ogTypeMeta)

    const ogImageMeta = document.querySelector('meta[property="og:image"]') || document.createElement('meta')
    ogImageMeta.setAttribute('property', 'og:image')
    ogImageMeta.setAttribute('content', ogImage)
    if (!ogImageMeta.parentNode) document.head.appendChild(ogImageMeta)

    const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta')
    twitterTitle.setAttribute('name', 'twitter:title')
    twitterTitle.setAttribute('content', title)
    if (!twitterTitle.parentNode) document.head.appendChild(twitterTitle)

    const twitterDescription = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta')
    twitterDescription.setAttribute('name', 'twitter:description')
    twitterDescription.setAttribute('content', description)
    if (!twitterDescription.parentNode) document.head.appendChild(twitterDescription)

    const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta')
    twitterImage.setAttribute('name', 'twitter:image')
    twitterImage.setAttribute('content', ogImage)
    if (!twitterImage.parentNode) document.head.appendChild(twitterImage)

    if (jsonLd) {
      let scriptTag = document.querySelector('script[data-seo-jsonld]')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.setAttribute('data-seo-jsonld', 'true')
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(jsonLd)
    }
  }, [title, description, canonical, ogImage, ogType, jsonLd])

  return null
}
