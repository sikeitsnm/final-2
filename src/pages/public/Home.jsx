import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'
import video1080 from '../../assets/bg-1080-30.mp4'
import video4k from '../../assets/bg-4k-30.mp4'
import videoPoster from '../../assets/bg-poster.jpg'

export default function Home() {
  const { settings, paintings } = useSiteContent()
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const latestPaintings = [...paintings]
    .filter((painting) => painting.image_url)
    .sort((firstPainting, secondPainting) => new Date(secondPainting.created_at || 0) - new Date(firstPainting.created_at || 0))
    .slice(0, 3)
  const featuredPaintings = latestPaintings.length > 0 ? latestPaintings : paintings.slice(0, 3)

  return <>
    <section className="video-hero page-entrance page-entrance--hero">
      <div className="video-hero__media" aria-hidden="true" tabIndex={-1}>
        {reducedMotion ? <img
          className="video-hero__poster"
          src={settings.hero_image_url || videoPoster}
          alt=""
          width="100%"
          height="100%"
        /> : <video
          className="video-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={settings.hero_image_url || videoPoster}
          tabIndex={-1}
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        >
          <source src={video1080} media="(max-width: 768px)" type="video/mp4" />
          <source src={video4k} type="video/mp4" />
        </video>}
        <div className="video-hero__overlay" />
      </div>
      <div className="video-hero__content">
        <p className="video-hero__eyebrow">SUGAM / THE ARTIST</p>
        <h1>{settings.artist_name}</h1>
        {settings.hero_tagline && !settings.hero_tagline.startsWith('Add your tagline') && <p className="video-hero__bio">{settings.hero_tagline}</p>}
        <Link className="dark-button video-hero__cta" to="/gallery">Explore the work <span aria-hidden="true">↗</span></Link>
      </div>
    
    </section>

    <div className="marquee"><div>{settings.artist_name} · ORIGINAL WORKS · {settings.artist_name} · ORIGINAL WORKS ·</div></div>
    <section className="home-gallery-cta page-reveal"><p className="eyebrow">THE COLLECTION</p><h2>Original works.</h2><Link className="outline-link" to="/gallery">View the gallery <span>↗</span></Link>{featuredPaintings.length > 0 && <div className="art-grid featured-home-grid">{featuredPaintings.map((painting) => <Link className="art-card page-entrance" key={painting.id} to="/gallery"><div className="art-image-wrap">{painting.image_url ? <img src={painting.image_url} alt={painting.title} className="art-image" /> : <div className="missing-image">IMAGE COMING SOON</div>}<span className="art-index">{String(painting.display_order || '').padStart(2, '0')}</span></div><div className="art-details"><div><h3>{painting.title}</h3><p>{painting.medium || 'Original artwork'}</p></div><div className="art-meta"><span>{painting.size || ''}</span><strong>{painting.price ? Number(painting.price).toLocaleString() : ''}</strong></div></div></Link>)}</div>}</section>
  </>
}
