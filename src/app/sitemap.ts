import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloko.com.pt";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/padel", priority: 0.9, changeFrequency: "weekly" },
    { path: "/ginasio", priority: 0.9, changeFrequency: "weekly" },
    { path: "/aulas", priority: 0.8, changeFrequency: "daily" },
    { path: "/padel/aulas", priority: 0.7, changeFrequency: "weekly" },
    { path: "/academia", priority: 0.7, changeFrequency: "weekly" },
    { path: "/torneios", priority: 0.7, changeFrequency: "weekly" },
    { path: "/blokos", priority: 0.6, changeFrequency: "monthly" },
    { path: "/patrocinadores", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contactos", priority: 0.6, changeFrequency: "monthly" },
  ];

  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
