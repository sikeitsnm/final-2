import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'
import SEO from '../../components/SEO'

function Arrow() { return <span aria-hidden="true">↗</span> }
function LoadingState() { return <div className="content-state" aria-live="polite"><span className="spinner" /> Loading the collection...</div> }

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function GalleryPage() {
  const { settings, paintings, loading, error, loadContent } = useSiteContent()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { slug } = useParams()
  const navigate = useNavigate()
  const whatsappUrl = settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}` : '/contact'
  const categoryTabs = [
    { value: 'available', label: 'Available' },
    { value: 'featured', label: 'Featured' },
    { value: 'sold', label: 'Sold' },
    { value: 'murals', label: 'Murals' },
  ].map((category) => ({
    ...category,
    count: paintings.filter((painting) => painting.status === category.value).length,
  })).sort((firstCategory, secondCategory) => secondCategory.count - firstCategory.count || firstCategory.label.localeCompare(secondCategory.label))
  const visiblePaintings = [...(selectedStatus === 'all' ? paintings : paintings.filter((painting) => painting.status === selectedStatus))]
    .sort((firstPainting, secondPainting) => Number(secondPainting.display_order || 0) - Number(firstPainting.display_order || 0))
  const selectedPaintingId = searchParams.get('painting')
  const selectedPaintingFromSlug = useMemo(() => {
    if (!slug) return null
    return visiblePaintings.find((painting) => slugify(painting.title) === slug) || null
  }, [slug, visiblePaintings])

  useEffect(() => {
    const activePainting = selectedPaintingFromSlug || visiblePaintings.find((painting) => String(painting.id) === selectedPaintingId)
    if (activePainting) {
      setLightbox(activePainting)
    } else if (!selectedPaintingId && !slug) {
      setLightbox(null)
    }
  }, [selectedPaintingId, selectedPaintingFromSlug, slug, visiblePaintings])

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  useEffect(() => {
    if (loading) return undefined
    const elements = document.querySelectorAll('.reveal-on-scroll')
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [loading, paintings, selectedStatus])

  function openPainting(painting) {
    setLightbox(painting)
    const nextSlug = slugify(painting.title)
    navigate(`/gallery/${nextSlug}?painting=${painting.id}`, { replace: false })
  }

  function closePainting() {
    setLightbox(null)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('painting')
      return next
    })
    if (slug) navigate('/gallery', { replace: false })
  }

  const selectedPainting = useMemo(() => selectedPaintingFromSlug || visiblePaintings.find((painting) => String(painting.id) === selectedPaintingId) || null, [selectedPaintingFromSlug, selectedPaintingId, visiblePaintings])

  const galleryJsonLd = useMemo(() => {
    const personSchema = {
      '@type': 'Person',
      name: 'Sugam Tamang',
      jobTitle: 'Artist',
      nationality: 'Nepali',
      sameAs: [
        'https://www.instagram.com/sugamartz/',
        'https://www.youtube.com/@sugamartz',
        'https://www.tiktok.com/@sugamartz',
      ],
    }

    const artworkSchemas = visiblePaintings.map((painting) => ({
      '@type': 'VisualArtwork',
      name: painting.title,
      artist: personSchema,
      artMedium: painting.medium || 'Acrylic',
      size: painting.size || 'Original painting',
      image: painting.image_url || 'https://sugamartz.com/og-image.svg',
      description: painting.description || `Original painting by Sugam Tamang, a contemporary Nepali artist.`,
      offers: {
        '@type': 'Offer',
        price: painting.price ?? 0,
        priceCurrency: 'NPR',
        availability: 'https://schema.org/InStock',
        url: `https://sugamartz.com/gallery?painting=${painting.id}`,
      },
    }))

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Original Paintings by Sugam Tamang',
        url: 'https://sugamartz.com/gallery',
        author: personSchema,
      },
      personSchema,
      ...artworkSchemas,
    ]
  }, [visiblePaintings])

  const currentTitle = selectedPainting ? `${selectedPainting.title} by Sugam Tamang | SugamArtz` : 'Gallery – Original Paintings by Sugam Tamang | SugamArtz'
  const currentDescription = selectedPainting
    ? `${selectedPainting.title} is an original ${selectedPainting.medium || 'painting'} by Nepali artist Sugam Tamang, measuring ${selectedPainting.size || 'various dimensions'} and priced at NPR ${selectedPainting.price ? Number(selectedPainting.price).toLocaleString() : 'available on request'}.`
    : 'Browse original paintings by Nepali artist Sugam Tamang, featuring contemporary works in acrylic, charcoal, and other modern media.'

  return <>
    <SEO
      title={currentTitle}
      description={currentDescription}
      canonical={selectedPainting ? `/gallery?painting=${selectedPainting.id}` : '/gallery'}
      ogImage="/og-image.svg"
      ogType={selectedPainting ? 'article' : 'website'}
      jsonLd={galleryJsonLd}
    />
    <section className="gallery-section reveal-on-scroll page-entrance"><div className="section-heading"><div><p className="eyebrow">02 / THE COLLECTION</p><h1>Original Paintings by Sugam Tamang</h1></div><a href={whatsappUrl} className="outline-link" target="_blank" rel="noreferrer">Enquire privately <Arrow /></a></div>
      <div className="category-tabs" role="tablist" aria-label="Painting status"><button type="button" role="tab" aria-selected={selectedStatus === 'all'} className={selectedStatus === 'all' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('all')}>All works <sup>{paintings.length}</sup></button>{categoryTabs.map((category) => <button type="button" role="tab" aria-selected={selectedStatus === category.value} className={selectedStatus === category.value ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus(category.value)} key={category.value}>{category.label} <sup>{category.count}</sup></button>)}</div>
      {loading ? <LoadingState /> : error ? <div className="content-state error-state">{error}<button type="button" onClick={loadContent}>Try again</button></div> : visiblePaintings.length === 0 ? <div className="content-state">No paintings yet - check back soon.</div> : <div className="art-grid">{visiblePaintings.map((painting) => <article className="art-card reveal-on-scroll page-entrance" key={painting.id} onClick={() => openPainting(painting)} onKeyDown={(event) => event.key === 'Enter' && openPainting(painting)} role="button" tabIndex="0"><div className="art-image-wrap">{painting.image_url ? <img src={painting.image_url} alt={`${painting.title} – ${painting.medium || 'acrylic'} painting by Nepali artist Sugam Tamang`} className="art-image" loading="lazy" decoding="async" width="800" height="1000" /> : <div className="missing-image">IMAGE COMING SOON</div>}<span className="art-index">{String(painting.display_order).padStart(2, '0')}</span><span className="view-art">View work <Arrow /></span></div><div className="art-details"><div><h3>{painting.title}</h3><p>{painting.medium || 'Original artwork'}</p></div><div className="art-meta"><span>{painting.size || ''}</span><strong>{painting.price ? Number(painting.price).toLocaleString() : ''}</strong></div></div></article>)}</div>}
    </section>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={closePainting}><button type="button" className="close-lightbox" onClick={closePainting} aria-label="Close artwork">×</button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}>{lightbox.image_url && <img src={lightbox.image_url} alt={`${lightbox.title} – ${lightbox.medium || 'painting'} by Nepali artist Sugam Tamang`} loading="eager" decoding="async" width="1000" height="1200" />}<div><p className="eyebrow">{lightbox.status}</p><h2>{lightbox.title}</h2><p>{lightbox.medium} {lightbox.size && `· ${lightbox.size}`}</p><p>{lightbox.description}</p><strong>{lightbox.price ? Number(lightbox.price).toLocaleString() : ''}</strong><a className="dark-button" href={`${whatsappUrl}?text=${encodeURIComponent(`Hello, I am interested in ${lightbox.title}${lightbox.price ? ` for ${lightbox.price}` : ''}. Please share more details.`)}`} target="_blank" rel="noreferrer" aria-label={`Enquire about ${lightbox.title}`}>Enquire about this painting <Arrow /></a></div></div></div>}
  </>
}
