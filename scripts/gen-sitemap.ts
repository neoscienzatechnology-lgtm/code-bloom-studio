// Gera public/sitemap.xml a partir do catálogo de cursos, para o buscador não
// depender de descobrir as rotas por links dentro de um SPA. Roda no `prebuild`
// (npm run build), então o arquivo commitado nunca fica velho.
//
// Só entram rotas PÚBLICAS. Editor, dashboard e a página de certificado
// compartilhado (que é de uma pessoa só) ficam de fora.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { courseCatalog } from "../src/data/courseCatalog";

const SITE_URL = "https://codetier.vercel.app";
const OUT = join(fileURLToPath(new URL("../public", import.meta.url)), "sitemap.xml");

interface Entry {
  path: string;
  priority: string;
  changefreq: string;
}

const entries: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/cursos", priority: "0.9", changefreq: "weekly" },
  { path: "/experimentar", priority: "0.9", changefreq: "monthly" },
  ...courseCatalog.map((course) => ({
    path: `/cursos/${course.id}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  { path: "/privacidade", priority: "0.2", changefreq: "yearly" },
  { path: "/termos", priority: "0.2", changefreq: "yearly" },
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map(
    (entry) =>
      `  <url><loc>${SITE_URL}${entry.path}</loc>` +
      `<changefreq>${entry.changefreq}</changefreq>` +
      `<priority>${entry.priority}</priority></url>`,
  ),
  "</urlset>",
  "",
].join("\n");

writeFileSync(OUT, xml, "utf8");
console.log(`sitemap.xml: ${entries.length} URLs → ${OUT}`);
