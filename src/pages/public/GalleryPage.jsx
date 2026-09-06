import { useEffect, useState } from 'react'
import { useSiteContent } from '../../context/useSiteContent'

function Arrow() { return <span aria-hidden="true">↗</span> }
function LoadingState() { return <div className="content-state" aria-live="polite"><span className="spinner" /> Loading the collection...</div> }

export default function GalleryPage() {
  const { settings, paintings, loading, error, loadContent } = useSiteContent()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const whatsappUrl = settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}` : '/contact'
  const visiblePaintings = selectedStatus === 'all' ? paintings : paintings.filter((painting) => painting.status === selectedStatus)

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

  return <>
    <section className="gallery-section reveal-on-scroll page-entrance"><div className="section-heading"><div><p className="eyebrow">02 / THE COLLECTION</p><h2>Original works.</h2></div><a href={whatsappUrl} className="outline-link" target="_blank" rel="noreferrer">Enquire privately <Arrow /></a></div>
      <div className="category-tabs" role="tablist" aria-label="Painting status"><button type="button" role="tab" aria-selected={selectedStatus === 'all'} className={selectedStatus === 'all' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('all')}>All works <sup>{paintings.length}</sup></button><button type="button" role="tab" aria-selected={selectedStatus === 'available'} className={selectedStatus === 'available' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('available')}>Available <sup>{paintings.filter((painting) => painting.status === 'available').length}</sup></button><button type="button" role="tab" aria-selected={selectedStatus === 'featured'} className={selectedStatus === 'featured' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('featured')}>Featured <sup>{paintings.filter((painting) => painting.status === 'featured').length}</sup></button><button type="button" role="tab" aria-selected={selectedStatus === 'sold'} className={selectedStatus === 'sold' ? 'category-tab active' : 'category-tab'} onClick={() => setSelectedStatus('sold')}>Sold <sup>{paintings.filter((painting) => painting.status === 'sold').length}</sup></button></div>
      {loading ? <LoadingState /> : error ? <div className="content-state error-state">{error}<button type="button" onClick={loadContent}>Try again</button></div> : visiblePaintings.length === 0 ? <div className="content-state">No paintings yet - check back soon.</div> : <div className="art-grid">{visiblePaintings.map((painting) => <article className="art-card reveal-on-scroll page-entrance" key={painting.id} onClick={() => setLightbox(painting)} onKeyDown={(event) => event.key === 'Enter' && setLightbox(painting)} role="button" tabIndex="0"><div className="art-image-wrap">{painting.image_url ? <img src={painting.image_url} alt={painting.title} className="art-image" /> : <div className="missing-image">IMAGE COMING SOON</div>}<span className="art-index">{String(painting.display_order).padStart(2, '0')}</span><span className="view-art">View work <Arrow /></span></div><div className="art-details"><div><h3>{painting.title}</h3><p>{painting.medium || 'Original artwork'}</p></div><div className="art-meta"><span>{painting.size || ''}</span><strong>{painting.price ? Number(painting.price).toLocaleString() : ''}</strong></div></div></article>)}</div>}
    </section>
    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={() => setLightbox(null)}><button type="button" className="close-lightbox" onClick={() => setLightbox(null)} aria-label="Close artwork">×</button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}>{lightbox.image_url && <img src={lightbox.image_url} alt={lightbox.title} />}<div><p className="eyebrow">{lightbox.status}</p><h2>{lightbox.title}</h2><p>{lightbox.medium} {lightbox.size && `· ${lightbox.size}`}</p><p>{lightbox.description}</p><strong>{lightbox.price ? Number(lightbox.price).toLocaleString() : ''}</strong><a className="dark-button" href={`${whatsappUrl}?text=${encodeURIComponent(`I am enquiring about ${lightbox.title}${lightbox.price ? ` (${lightbox.price})` : ''}`)}`} target="_blank" rel="noreferrer">Enquire about this work</a></div></div></div>}
  </>
}
