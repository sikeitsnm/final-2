import { useEffect, useRef, useState } from 'react'
import { fetchSiteContent } from '../lib/content'
import { preloadImages } from '../lib/imageCache'
import { SiteContentContext } from './SiteContent'

const fallbackSettings = {
  artist_name: 'Sugam Tamang',
  hero_tagline: 'Add your tagline in the admin panel',
  about_text: 'Sugam Tamang is an artist whose paintings explore quiet landscapes, natural light, and the emotional space between memory and place.',
  profile_photo_url: null,
  hero_image_url: null,
  instagram_url: null,
  youtube_url: null,
  whatsapp_number: null,
  tiktok_url: null,
  contact_email: null,
}

const contentCacheKey = 'rang-site-content'

function shuffleAvailable(paintingList) {
  const available = paintingList.filter((painting) => painting.status === 'available')
  for (let index = available.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[available[index], available[randomIndex]] = [available[randomIndex], available[index]]
  }
  let availableIndex = 0
  return paintingList.map((painting) => painting.status === 'available' ? available[availableIndex++] : painting)
}

function getCachedContent() {
  try {
    return JSON.parse(localStorage.getItem(contentCacheKey))
  } catch {
    return null
  }
}

function normalizeContent(content) {
  const paintings = Array.isArray(content?.paintings) ? content.paintings : []
  return {
    settings: { ...fallbackSettings, ...(content?.settings || {}) },
    paintings,
  }
}

export function SiteContentProvider({ children }) {
  const cachedContent = getCachedContent()
  const [settings, setSettings] = useState(() => ({ ...fallbackSettings, ...(cachedContent?.settings || {}) }))
  const [paintings, setPaintings] = useState(() => shuffleAvailable(Array.isArray(cachedContent?.paintings) ? cachedContent.paintings : []))
  const [loading, setLoading] = useState(!cachedContent)
  const [error, setError] = useState('')
  const initialLoadStarted = useRef(false)

  async function loadContent() {
    setLoading(true)
    setError('')
    try {
      const nextContent = normalizeContent(await fetchSiteContent())
      await preloadImages([
        nextContent.settings.hero_image_url,
        nextContent.settings.profile_photo_url,
        ...nextContent.paintings.map((painting) => painting.image_url),
      ])
      setSettings(nextContent.settings)
      setPaintings(shuffleAvailable(nextContent.paintings))
      localStorage.setItem(contentCacheKey, JSON.stringify(nextContent))
    } catch (fetchError) {
      setSettings(fallbackSettings)
      setPaintings([])
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialLoadStarted.current) return
    initialLoadStarted.current = true
    loadContent()
  }, [])

  return <SiteContentContext.Provider value={{ settings, paintings, loading, error, loadContent }}>
    {children}
  </SiteContentContext.Provider>
}

