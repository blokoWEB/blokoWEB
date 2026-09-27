import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jucvqopkwuwgkvguupqy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      // URLs antigos ainda indexados pelo Google (sitelinks), de antes da
      // reestruturação do site — redireciona para as páginas atuais em vez
      // de deixar cair em 404.
      { source: "/reservas-padel", destination: "/padel", permanent: true },
      { source: "/pt-ginasio", destination: "/ginasio/precario", permanent: true },
      { source: "/bloko-academy", destination: "/academia", permanent: true },
    ];
  },
};

export default nextConfig;
