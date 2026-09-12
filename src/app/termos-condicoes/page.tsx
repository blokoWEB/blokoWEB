import Link from "next/link";
import LegalPageLayout from "@/components/LegalPageLayout";
import { legalEntity, site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Termos e Condições",
  description: "Termos e condições de utilização do site do BLOKO.",
  path: "/termos-condicoes",
});

export default function TermosCondicoesPage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Termos e Condições" updated="12 de setembro de 2026">
      <h2>1. Âmbito</h2>
      <p>
        Estes Termos e Condições regulam o acesso e utilização do site do BLOKO — Padel, Gym &amp;
        Lounge, em Bragança, operado pela sociedade <strong>{legalEntity.name}</strong> (NIF{" "}
        {legalEntity.nif}), com sede em {site.address}. Ao utilizares este site, aceitas estes
        termos.
      </p>

      <h2>2. O que este site é (e não é)</h2>
      <p>
        Este site tem carácter essencialmente informativo: apresenta os nossos espaços, aulas,
        preços e eventos. Marcações de campos e aulas são feitas diretamente via WhatsApp ou
        Playtomic, e as inscrições na Academia são submetidas através do formulário próprio. Este
        site não processa pagamentos.
      </p>

      <h2>3. Preços e disponibilidade</h2>
      <p>
        Os preços apresentados podem ser alterados sem aviso prévio. Antes de tomares uma decisão,
        confirma sempre o valor atualizado connosco — por telefone, email ou WhatsApp.
      </p>

      <h2>4. Reservas e marcações externas</h2>
      <p>
        As marcações de campos são geridas através da Playtomic e/ou WhatsApp, plataformas de
        terceiros com os seus próprios termos de utilização. Não somos responsáveis pelo
        funcionamento dessas plataformas.
      </p>

      <h2>5. Utilização das instalações</h2>
      <p>
        A utilização dos espaços desportivos do BLOKO está sujeita ao regulamento interno do clube e
        às regras de conduta desportiva aplicáveis a cada modalidade — consulta o{" "}
        <Link href="/torneios#regulamento">Regulamento de Torneios</Link> para os Nonstops semanais.
        A prática desportiva envolve riscos inerentes; cada praticante é responsável por avaliar a
        sua condição física antes de jogar ou treinar.
      </p>

      <h2>6. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo deste site — textos, imagens, logótipos e marca BLOKO — é propriedade do
        BLOKO ou é utilizado com a devida autorização, não podendo ser reproduzido sem consentimento
        prévio.
      </p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>
        Fazemos o possível para manter a informação deste site correta e atualizada, mas não
        garantimos a ausência de erros. Não nos responsabilizamos por danos resultantes do uso do
        site ou da sua indisponibilidade temporária.
      </p>

      <h2>8. Livro de Reclamações</h2>
      <p>
        Enquanto consumidor, tens acesso ao livro de reclamações através do{" "}
        <a href="https://www.livroreclamacoes.pt/inicio/" target="_blank" rel="noreferrer">
          Livro de Reclamações Eletrónico
        </a>
        .
      </p>

      <h2>9. Lei aplicável e foro</h2>
      <p>
        Estes Termos regem-se pela lei portuguesa. Para a resolução de qualquer litígio é competente
        o tribunal da comarca de Bragança, sem prejuízo do recurso a mecanismos de resolução
        alternativa de litígios de consumo.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para qualquer questão sobre estes Termos, contacta-nos:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.phoneHref}>{site.phone}</a>.
      </p>
    </LegalPageLayout>
  );
}
