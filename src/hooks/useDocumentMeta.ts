import { useEffect } from "react";

// Título/descrição/canonical por rota. Num SPA o `index.html` é o mesmo para
// todas as páginas, então sem isto o Google via 13 cursos com o mesmo título.
//
// Expectativa honesta: isto vale para o Google (que executa JS). WhatsApp,
// Facebook e Twitter leem só o HTML servido, então a prévia de link continua
// sendo a do `index.html` — a menos que a página passe a ser pré-renderizada.
// #revisao-lote10

const SITE_URL = "https://codetier.vercel.app";

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export interface DocumentMeta {
  title: string;
  description?: string;
  /** Caminho canônico (ex.: "/cursos/1"); vazio usa a rota atual. */
  canonicalPath?: string;
  /** Páginas que só existem para uma pessoa (certificado) saem do índice. */
  noIndex?: boolean;
}

export function useDocumentMeta({ title, description, canonicalPath, noIndex }: DocumentMeta): void {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);

    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }

    const path = canonicalPath ?? window.location.pathname;
    const url = `${SITE_URL}${path}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    setMeta('meta[property="og:url"]', "property", "og:url", url);

    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noIndex) {
      setMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, canonicalPath, noIndex]);
}

const JSON_LD_ID = "ct-jsonld";

/**
 * Dados estruturados (schema.org) da rota atual. Sai do documento quando a
 * página desmonta, para uma rota não herdar o schema da anterior.
 */
export function useJsonLd(data: Record<string, unknown> | null): void {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = JSON_LD_ID;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data]);
}

export { SITE_URL };
