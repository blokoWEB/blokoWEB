import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de Privacidade",
  description: "Como o BLOKO recolhe, utiliza e protege os teus dados pessoais.",
  path: "/politica-privacidade",
});

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Política de Privacidade" updated="12 de setembro de 2026">
      <h2>1. Quem somos</h2>
      <p>
        O BLOKO — Padel, Gym &amp; Lounge (&quot;BLOKO&quot;, &quot;nós&quot;) é responsável pelo
        tratamento dos dados pessoais recolhidos através deste site. Podes contactar-nos em{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ou na morada {site.address}.
      </p>

      <h2>2. Que dados recolhemos</h2>
      <ul>
        <li>
          <strong>Inscrição na Academia:</strong> nome, contacto (telefone e/ou email) e nível
          pretendido, submetidos através do formulário de inscrição do site.
        </li>
        <li>
          <strong>Formulário de contacto:</strong> o formulário de contactos abre diretamente o teu
          cliente de email — os dados que preenches (nome, email, mensagem) são enviados para o teu
          próprio email e não passam pelos nossos servidores nem ficam armazenados por nós.
        </li>
        <li>
          <strong>Área reservada (administração):</strong> acesso restrito a colaboradores
          autorizados do BLOKO, mediante autenticação própria.
        </li>
      </ul>

      <h2>3. Para que finalidades usamos os teus dados</h2>
      <p>
        Usamos os dados submetidos na inscrição da Academia exclusivamente para gerir a tua
        inscrição, contactar-te sobre a turma e horário, e enviar informação relacionada com essa
        atividade. Não usamos estes dados para fins de marketing sem o teu consentimento explícito.
      </p>

      <h2>4. Base legal</h2>
      <p>
        O tratamento assenta na execução de diligências pré-contratuais solicitadas por ti e no
        consentimento dado ao submeteres o formulário de inscrição.
      </p>

      <h2>5. Prazo de conservação</h2>
      <p>
        Conservamos os dados de inscrição enquanto durar a tua relação com o clube e pelo prazo
        adicional exigido por lei. Findo esse prazo, os dados são eliminados ou anonimizados.
      </p>

      <h2>6. Com quem partilhamos os teus dados</h2>
      <p>
        Os dados de inscrição são armazenados de forma segura através da Supabase, nosso
        subcontratante de alojamento de base de dados. Não vendemos nem cedemos os teus dados a
        terceiros para fins de marketing.
      </p>

      <h2>7. Os teus direitos</h2>
      <p>
        Tens direito a aceder, retificar, apagar, limitar ou opor-te ao tratamento dos teus dados, e
        à portabilidade dos mesmos. Podes exercer estes direitos a qualquer momento através de{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Tens também o direito de apresentar
        reclamação junto da Comissão Nacional de Proteção de Dados (CNPD) —{" "}
        <a href="https://www.cnpd.pt" target="_blank" rel="noreferrer">
          www.cnpd.pt
        </a>
        .
      </p>

      <h2>8. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizativas adequadas para proteger os teus dados contra
        acesso não autorizado, perda ou alteração.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Para informação sobre cookies e tecnologias semelhantes utilizadas neste site, consulta a
        nossa <Link href="/politica-cookies">Política de Cookies</Link>.
      </p>

      <h2>10. Alterações a esta política</h2>
      <p>
        Podemos atualizar esta política periodicamente. A data da última atualização está indicada
        no topo desta página.
      </p>

      <h2>11. Contacto</h2>
      <p>
        Para qualquer questão sobre esta política, contacta-nos: {" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
        <a href={site.phoneHref}>{site.phone}</a> · {site.address}.
      </p>
    </LegalPageLayout>
  );
}
