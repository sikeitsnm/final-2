import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout, { ScrollToTop } from './components/Layout'
import { SiteContentProvider } from './context/SiteContentContext'
import Home from './pages/public/Home'
import AboutPage from './pages/public/AboutPage'
import GalleryPage from './pages/public/GalleryPage'
import ContactPage from './pages/public/ContactPage'
import Admin from './pages/admin/Admin'

export default function App() {
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ScrollToTop />
    <SiteContentProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteContentProvider>
  </BrowserRouter>
}
