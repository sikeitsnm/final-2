import { useSiteContent } from '../../context/useSiteContent'

function Arrow() { return <span aria-hidden="true">↗</span> }

export default function ContactPage() {
  const { settings } = useSiteContent()
  const whatsappUrl = settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}` : '#'

  return <section className="contact-section page-entrance page-entrance--content"><p className="eyebrow">INQUIRIES</p><h2>Find a work<br /><em>to live with.</em></h2><a className="dark-button" href={whatsappUrl} target="_blank" rel="noreferrer">Message on WhatsApp <Arrow /></a></section>
}
