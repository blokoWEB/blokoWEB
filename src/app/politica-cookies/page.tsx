import LegalPageLayout from "@/components/LegalPageLayout";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Política de Cookies",
  description: "Que cookies e tecnologias semelhantes o site do BLOKO utiliza.",
  path: "/politica-cookies",
});

export default function PoliticaCookiesPage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Política de Cookies" updated="12 de setembro de 2026">
      <h2>1. O que são cookies</h2>
      <p>
        Cookies são pequenos ficheiros guardados no teu dispositivo quando visitas um site, usados
        para o site funcionar corretamente ou para lembrar preferências.
      </p>

      <h2>2. O que utilizamos neste site</h2>
      <ul>
        <li>
          <strong>Cookie de sessão de administração:</strong> usado apenas pela nossa equipa, na
          área reservada de gestão, para manter a sessão de administrador autenticada. É
          estritamente necessário para essa funcionalidade e não é usado para seguir a tua
          navegação.
        </li>
        <li>
          <strong>Armazenamento local (localStorage):</strong> usamos armazenamento local do
          navegador para lembrar que já viste determinados avisos no site (por exemplo, o convite
          para deixares uma review no Google, ou uma campanha em destaque), para não te voltarmos a
          mostrar o mesmo aviso. Esta informação fica guardada apenas no teu dispositivo e nunca é
          enviada para os nossos servidores.
        </li>
      </ul>

      <h2>3. O que não utilizamos</h2>
      <p>
        Não utilizamos cookies de analítica, publicidade ou redes sociais de terceiros. Se isso vier
        a mudar no futuro, atualizaremos esta política e, sempre que exigido por lei, pediremos o teu
        consentimento antes de os ativar.
      </p>

      <h2>4. Como gerir ou apagar cookies</h2>
      <p>
        Podes gerir, bloquear ou apagar cookies e dados de armazenamento local a qualquer momento
        nas definições do teu navegador. Nota que bloquear o cookie de sessão de administração
        impede o acesso à área reservada da equipa — não afeta a navegação pública do site.
      </p>

      <h2>5. Alterações a esta política</h2>
      <p>
        Podemos atualizar esta política periodicamente. A data da última atualização está indicada
        no topo desta página.
      </p>

      <h2>6. Contacto</h2>
      <p>
        Para qualquer questão, contacta-nos: <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPageLayout>
  );
}
