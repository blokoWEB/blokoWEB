import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloko.com.pt";

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** Imagem OG/Twitter customizada (ex: cartaz de um torneio). Por omissão usa a imagem geral do site. */
  image?: string;
}): Metadata {
  const ogImage = image || "/images/og-image.jpg";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: "BLOKO",
      type: "website",
      locale: "pt_PT",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "BLOKO — Padel, Ginásio & Lounge em Bragança",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
