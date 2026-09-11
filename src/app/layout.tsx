import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewPopup from "@/components/ReviewPopup";
import CampaignPopup from "@/components/CampaignPopup";
import { site } from "@/lib/site-data";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloko.com.pt";
const indexingEnabled = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const defaultTitle = "BLOKO — Padel, Ginásio & Lounge | Bragança";
const defaultDescription =
  "BLOKO é um espaço único em Bragança com 4 campos de padel panorâmicos, ginásio moderno, aulas de grupo, torneios e lounge. Junta-te ao clube.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | BLOKO",
  },
  description: defaultDescription,
  keywords: [
    "padel Bragança",
    "ginásio Bragança",
    "aulas de padel",
    "aulas de ginásio",
    "campos de padel Bragança",
    "torneios de padel",
    "BLOKO",
  ],
  applicationName: "BLOKO",
  alternates: { canonical: "/" },
  robots: { index: indexingEnabled, follow: indexingEnabled },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: siteUrl,
    siteName: "BLOKO",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BLOKO — Padel, Ginásio & Lounge em Bragança",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "BLOKO",
  description: defaultDescription,
  url: siteUrl,
  telephone: site.phone,
  email: site.email,
  image: `${siteUrl}/images/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Coronel Teófilo Morais 40",
    addressLocality: "Bragança",
    addressRegion: "Bragança",
    postalCode: "5300-427",
    addressCountry: "PT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.78974969392072,
    longitude: -6.7826687937787,
  },
  sameAs: [site.instagramUrl, site.facebookUrl, site.youtubeUrl],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "14:00",
      closes: "23:59",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:30",
      closes: "13:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "15:00",
      closes: "19:30",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ReviewPopup />
        <CampaignPopup />
      </body>
    </html>
  );
}
