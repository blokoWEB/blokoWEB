import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloko.com.pt";
// Safe by default: crawling stays blocked until this is explicitly set to
// "true" in the production environment (once bloko.com.pt is live), so a
// staging/preview URL never gets indexed by accident.
const indexingEnabled = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled) {
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
