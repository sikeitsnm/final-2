import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'

function Arrow() { return <span aria-hidden="true">↗</span> }
function LoadingState() { return <div className="content-state" aria-live="polite"><span className="spinner" /> Loading the collection...</div> }

export default function GalleryPage() {
  const { settings, paintings, loading, error, loadContent } = useSiteContent()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
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

  useEffect(() => {
    const activePainting = visiblePaintings.find((painting) => String(painting.id) === selectedPaintingId)
    if (selectedPaintingId && activePainting) {
      setLightbox(activePainting)
    } else if (!selectedPaintingId) {
      setLightbox(null)
    }
  }, [selectedPaintingId, visiblePaintings])

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
    setSearchParams({ painting: String(painting.id) })
  }

  function closePainting() {
    setLightbox(null)
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('painting')
      return next
    })
  }

  return <>
    <section className="gallery-section reveal-on-scroll page-entrance"><div className="section-heading"><div><p className="eyebrow">02 / THE COLLECTION</p><h2>Original works.</h2></div><a href={whatsappUrl} className="outline-link" target="_blank" rel="noreferrer">Enquire privately <Arrow /></a></div>
      <div className="category-tabs" role="tablist" aria-label="Painting status"><button type="button" role="tab" aria-selected={selectedStatus === 'all'} className={selectedStatus === 'all' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('all')}>All works <sup>{paintings.length}</sup></button>{categoryTabs.map((category) => <button type="button" role="tab" aria-selected={selectedStatus === category.value} className={selectedStatus === category.value ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus(category.value)} key={category.value}>{category.label} <sup>{category.count}</sup></button>)}</div>
      {loading ? <LoadingState /> : error ? <div className="content-state error-state">{error}<button type="button" onClick={loadContent}>Try again</button></div> : visiblePaintings.length === 0 ? <div className="content-state">No paintings yet - check back soon.</div> : <div className="art-grid">{visiblePaintings.map((painting) => <article className="art-card reveal-on-scroll page-entrance" key={painting.id} onClick={() => openPainting(painting)} onKeyDown={(event) => event.key === 'Enter' && openPainting(painting)} role="button" tabIndex="0"><div className="art-image-wrap">{painting.image_url ? <img src={painting.image_url} alt={painting.title} className="art-image" loading="lazy" decoding="async" /> : <div className="missing-image">IMAGE COMING SOON</div>}<span className="art-index">{String(painting.display_order).padStart(2, '0')}</span><span className="view-art">View work <Arrow /></span></div><div className="art-details"><div><h3>{painting.title}</h3><p>{painting.medium || 'Original artwork'}</p></div><div className="art-meta"><span>{painting.size || ''}</span><strong>{painting.price ? Number(painting.price).toLocaleString() : ''}</strong></div></div></article>)}</div>}
    </section>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={closePainting}><button type="button" className="close-lightbox" onClick={closePainting} aria-label="Close artwork">×</button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}>{lightbox.image_url && <img src={lightbox.image_url} alt={lightbox.title} loading="eager" decoding="async" />}<div><p className="eyebrow">{lightbox.status}</p><h2>{lightbox.title}</h2><p>{lightbox.medium} {lightbox.size && `· ${lightbox.size}`}</p><p>{lightbox.description}</p><strong>{lightbox.price ? Number(lightbox.price).toLocaleString() : ''}</strong><a className="dark-button" href={`${whatsappUrl}?text=${encodeURIComponent(`Hello, I am interested in ${lightbox.title}${lightbox.price ? ` for ${lightbox.price}` : ''}. Please share more details.`)}`} target="_blank" rel="noreferrer" aria-label={`Enquire about ${lightbox.title}`}>Enquire about this painting <Arrow /></a></div></div></div>}
  </>
}
