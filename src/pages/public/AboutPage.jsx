import { useEffect } from 'react'
import { useSiteContent } from '../../context/useSiteContent'
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

  return <section className="statement-section about-page reveal-on-scroll page-entrance page-entrance--content">
    <div className="about-page__intro">
      <span className="section-number">01 / 03</span>
      <div>
        <p className="eyebrow">ABOUT THE ARTIST</p>
        <h1>{settings.artist_name}</h1>
      </div>
      <span className="about-page__mark" aria-hidden="true">✳</span>
    </div>
    <div className="about-page__body">
      <div className="about-page__portrait-wrap">
        <span className="about-page__portrait-label">PORTRAIT / 01</span>
        <div className="profile-photo">
          {settings.profile_photo_url ? <img src={settings.profile_photo_url} alt={settings.artist_name} /> : <span>PROFILE PHOTO COMING SOON</span>}
        </div>
      </div>
      <div className="about-page__copy">
        <h2>Made with patience.<br /><em>Held in color.</em></h2>
        <p className="statement-copy">{settings.about_text}</p>
      </div>
    </div>
  </section>
}
  