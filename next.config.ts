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
      { source: "/pt-padel", destination: "/padel/aulas", permanent: true },
      // Páginas de torneios/academia individuais do site antigo, consolidadas
      // hoje na página /torneios (com galeria e detalhes em modal) ou /academia.
      { source: "/regulamento-faqs-bloko-academy", destination: "/academia", permanent: true },
      { source: "/torneios-nonstop", destination: "/torneios#regulamento", permanent: true },
      { source: "/nonstop-m6", destination: "/torneios", permanent: true },
      { source: "/big-padel-masters-ii", destination: "/torneios", permanent: true },
      { source: "/torneio-social-mudda-domus", destination: "/torneios", permanent: true },
    ];
  },
};

export default nextConfig;
