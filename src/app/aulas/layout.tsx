import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Marca a tua Aula",
  description:
    "Mapa de aulas de ginásio e academia de padel do BLOKO em Bragança. Marca sem precisares de conta — só nome, email e número de sócio ou voucher.",
  path: "/aulas",
});

export default function AulasLayout({ children }: LayoutProps<"/aulas">) {
  return children;
}
