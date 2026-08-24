import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloko.com.pt";
const isProduction = siteUrl === "https://bloko.com.pt";

export default function robots(): MetadataRoute.Robots {
  // Block crawling entirely on any non-final domain (e.g. the Vercel preview
  // URL) so it never gets indexed instead of bloko.com.pt. This flips on
  // automatically once NEXT_PUBLIC_SITE_URL is set to the real domain.
  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
