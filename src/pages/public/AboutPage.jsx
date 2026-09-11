import { useEffect } from 'react'
import { useSiteContent } from '../../context/useSiteContent'
import SEO from '../../components/SEO'
import '../../styles/AboutPage.css'

export default function AboutPage() {
  const { settings, loading } = useSiteContent()

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
  }, [loading])

  return <>
    <SEO
      title="About Sugam Tamang | SugamArtz"
      description="Learn about Sugam Tamang, a Nepali artist creating contemporary paintings shaped by memory, light, and the landscape of Nepal."
      canonical="/about"
      ogImage="/og-image.svg"
      ogType="profile"
    />
    <section className="statement-section about-page reveal-on-scroll page-entrance page-entrance--content">
    <div className="about-page__body">
      <div className="about-page__portrait-wrap">
        <span className="about-page__portrait-label">PORTRAIT / 01</span>
        <div className="profile-photo">
          {settings.profile_photo_url ? <img src={settings.profile_photo_url} alt={`${settings.artist_name || 'Sugam Tamang'} portrait by the artist`} loading="lazy" decoding="async" width="800" height="1000" /> : <span>PROFILE PHOTO COMING SOON</span>}
        </div>
      </div>
      <div className="about-page__intro">
        <div>
          <p className="eyebrow">ABOUT THE ARTIST</p>
          <h1>{settings.artist_name}</h1>
        </div>
      </div>
      <div className="about-page__copy">
        <h2>Made with patience.<br /><em>Held in color.</em></h2>
        <p className="statement-copy">{settings.about_text}</p>
      </div>
    </div>
  </section>
  </>
}
  