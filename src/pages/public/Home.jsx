import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../context/useSiteContent'
import ArtistIntro from '../../components/ArtistIntro'
import videoPoster from '../../assets/bg-poster.jpg'

function Arrow() { return <span aria-hidden="true">↗</span> }

export default function Home() {
  const { settings, artistIntro, paintings, loading } = useSiteContent()
  const [reducedMotion, setReducedMotion] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth <= 768
  )
  const videoRef = useRef(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  // Detect screen size for responsive video selection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Delay video loading until after initial render using requestIdleCallback
  useEffect(() => {
    if (reducedMotion) return

    const loadVideo = () => setVideoLoaded(true)
    
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(loadVideo, { timeout: 2000 })
      return () => cancelIdleCallback(id)
    } else {
      const timeoutId = setTimeout(loadVideo, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [reducedMotion])

  const latestPaintings = [...paintings]
    .filter((painting) => painting.image_url)
    .sort((firstPainting, secondPainting) => new Date(secondPainting.created_at || 0) - new Date(firstPainting.created_at || 0))
    .slice(0, 4)
  const featuredPaintings = latestPaintings.length > 0 ? latestPaintings : paintings.slice(0, 4)

  return <>
    <section className="video-hero page-entrance page-entrance--hero">
      <div className="video-hero__media" aria-hidden="true" tabIndex={-1}>
        {reducedMotion ? <img
          className="video-hero__poster"
          src={videoPoster}
          alt=""
          width="100%"
          height="100%"
        /> : videoLoaded ? <video
          ref={videoRef}
          className="video-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={videoPoster}
          tabIndex={-1}
          width="100%"
          height="100%"
          style={{ 
            objectFit: 'cover',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          <source src={isMobile ? '/videos/bg-1080-30-optimized.mp4' : '/videos/bg-4k-30-optimized.mp4'} type="video/mp4" />
        </video> : <img
          className="video-hero__poster"
          src={videoPoster}
          alt=""
          width="100%"
          height="100%"
        />}
        <div className="video-hero__overlay" />
      </div>
      <div className="video-hero__content">
        <p className="video-hero__eyebrow">SUGAM / THE ARTIST</p>
        <h1>{settings.artist_name}</h1>
        {settings.hero_tagline && !settings.hero_tagline.startsWith('Add your tagline') && <p className="video-hero__bio">{settings.hero_tagline}</p>}
        <Link className="dark-button video-hero__cta" to="/gallery">Explore the work <span aria-hidden="true">↗</span></Link>
      </div>
    
    </section>

    <ArtistIntro intro={artistIntro} loading={loading} />

    <div className="marquee"><div>{settings.artist_name} · ORIGINAL WORKS · {settings.artist_name} · ORIGINAL WORKS ·</div></div>
    <section className="home-gallery-cta page-reveal"><p className="eyebrow">THE COLLECTION</p><h2>Original works.</h2><Link className="outline-link" to="/gallery">View the gallery <span>↗</span></Link>{featuredPaintings.length > 0 && <div className="art-grid featured-home-grid">{featuredPaintings.map((painting) => <Link className="art-card page-entrance" key={painting.id} to={`/gallery?painting=${painting.id}`} aria-label={`View ${painting.title}`}><div className="art-image-wrap">{painting.image_url ? <img src={painting.image_url} alt={painting.title} className="art-image" loading="lazy" decoding="async" /> : <div className="missing-image">IMAGE COMING SOON</div>}<span className="art-index">{String(painting.display_order || '').padStart(2, '0')}</span><span className="view-art">View work <Arrow /></span></div><div className="art-details"><div><h3>{painting.title}</h3><p>{painting.medium || 'Original artwork'}</p></div><div className="art-meta"><span>{painting.size || ''}</span><strong>{painting.price ? Number(painting.price).toLocaleString() : ''}</strong></div></div></Link>)}</div>}</section>
  </>
}
