
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/Hero';
import EditorialSection from '@/components/EditorialSection';
import HighlightsSection from '@/components/HighlightsSection';
import DualCTA from '@/components/DualCTA';
import OfficialLinks from '@/components/OfficialLinks';
import PressLogos from '@/components/PressLogos';
import HypnoticBackground from '@/components/HypnoticBackground';

const HomePage = () => {
  const pageTitle = "Movsum Mirzazada – Official Website";
  const pageDescription = "Official portfolio of Movsum Mirzazada, an international award-winning actor, founder, and creative director. Explore his work in cinema, creative projects, and entrepreneurial ventures.";
  const pageImage = "https://horizons-cdn.hostinger.com/c7dad59a-68cf-4683-81b9-922e45c5685c/1761746969690-1-mtaiw.jpg";

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Movsum Mirzazada",
    "alternateName": ["Mir-Movsum Mirzazade", "Mövsüm Mirzəzadə", "Mimo"],
    "jobTitle": "Actor",
    "description": "Movsum Mirzazada is an award-winning international actor known for his lead roles in 'End of Season' and 'Torn'. He is a recipient of the FIPRESCI Prize and Best Male Actor award.",
    "url": "https://www.movsummirzazada.com/",
    "image": pageImage,
    "nationality": {
      "@type": "Country",
      "name": "Azerbaijan"
    },
    "knowsAbout": [
      "Cinematic Arts",
      "Acting",
      "Creative Direction",
      "Film Production"
    ],
    "sameAs": [
      "https://www.imdb.com/name/nm6487941/",
      "https://www.wikidata.org/wiki/Q95766272",
      "https://www.instagram.com/movsum_mirzazada/",
      "https://www.linkedin.com/in/movsum-mirzazada/",
      "https://de.wikipedia.org/wiki/End_of_Season",
      "https://en.wikipedia.org/wiki/Draft:Movsum_Mirzazada",
      "https://www.facebook.com/movsum.mirzazada",
      "https://www.tiktok.com/@movsummirzazadeh"
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Movsum Mirzazada, Mimo, actor, End of Season, Torn, Cannes, IFFR, Azerbaijani actor" />

        {/* Canonical Link */}
        <link rel="canonical" href="https://www.movsummirzazada.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.movsummirzazada.com/" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.movsummirzazada.com/" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={pageImage} />

        <script type="application/ld+json" data-rh="true">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <HypnoticBackground />

      <div className="relative z-10 min-h-screen text-[#EBE8E3] overflow-x-hidden selection:bg-[#E0A995] selection:text-[#0A1612]">
        <Hero />
        <EditorialSection />
        <HighlightsSection />
        <DualCTA />
        <OfficialLinks />
        <PressLogos />

        {/* Crawlable Internal Links */}
        <nav aria-label="Site navigation" className="sr-only">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/media">Media</a></li>
            <li><a href="/media?tab=filmography">Filmography</a></li>
            <li><a href="/media?tab=gallery">Gallery</a></li>
            <li><a href="/media?tab=press">Press</a></li>
            <li><a href="/media?tab=press-kit">Press Kit</a></li>
            <li><a href="/mimo-collective/shop">Shop</a></li>
            <li><a href="/mimo-collective/legal-complaint-service">Legal</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HomePage;
