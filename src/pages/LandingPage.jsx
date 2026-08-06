import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/landing/Hero.jsx'
import TrustedBy from '../components/landing/TrustedBy.jsx'
import Features from '../components/landing/Features.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import DemoSection from '../components/landing/DemoSection.jsx'
import FAQ from '../components/landing/FAQ.jsx'
import Contact from '../components/landing/Contact.jsx'
import CTA from '../components/landing/CTA.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <DemoSection />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
