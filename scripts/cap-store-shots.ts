/**
 * Captura os prints crus da loja em resolução de celular (412×892 @2.62 ≈ 1080
 * de largura). Saída: out/store/screenshots/raw/.
 *   npx tsx scripts/cap-store-shots.ts [--base=http://localhost:4390]
 *
 * Só rotas PÚBLICAS, de propósito: as capturas antigas mostravam o usuário de
 * teste "QA Capy" no topo da tela, e print de loja com dado de teste é motivo
 * de recusa além de passar má impressão. O `/experimentar` resolve isso — é uma
 * lição inteira, com editor e execução de verdade, sem cadastro.
 */
import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out", "store", "screenshots", "raw");
mkdirSync(out, { recursive: true });

const argv = process.argv.slice(2);
const BASE = argv.find((a) => a.startsWith("--base="))?.split("=").slice(1).join("=") ?? "https://codetier.vercel.app";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 892 },
  deviceScaleFactor: 2.62,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36",
});

async function go(path: string) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
}

async function shot(file: string) {
  await page.screenshot({ path: join(out, file) });
  console.log(`✓ raw/${file}`);
}

/**
 * A barra de marketing ("Entrar" / "Criar conta grátis") aparece em
 * /experimentar porque a rota é pública, mas NÃO existe na tela de aula do app
 * instalado. Print de loja precisa mostrar o app como ele é depois de baixado.
 */
async function esconderNavbar(page: Page) {
  await page.evaluate(() => {
    document.querySelector("nav")?.remove();
    document.querySelector<HTMLElement>('a[href="#conteudo"]')?.remove();
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

// "Abrir editor" é o rótulo do último cartão e "Ver Resultado" fecha o quiz —
// sem os dois o laço fica preso no meio da lição.
const AVANCAR = /continuar|avançar|próximo|começar|abrir editor|ver resultado/i;
const CONTROLES =
  /continuar|avançar|próximo|começar|abrir editor|executar|rodar|voltar|dica|pular|entrar|criar conta|verificar|ver resultado|tentar de novo/i;

/**
 * Alguns cartões só liberam o avanço depois da resposta — e a prática guiada
 * exige a resposta CERTA ("Complete 0/1 atividades para liberar o desafio").
 * Em vez de embutir gabarito aqui (que envelheceria junto com a lição),
 * tentamos alternativa por alternativa, confirmando no "Verificar" quando ele
 * existe, até o avanço destravar.
 */
async function responderSeNecessario(page: Page) {
  const continuar = page.getByRole("button", { name: AVANCAR }).first();
  if (await continuar.isEnabled().catch(() => true)) return;

  // As alternativas são <button> soltos dentro do cartão — a tela da lição não
  // fica sob <main>, então filtrar por container não acha nada. Pegamos todos os
  // botões e descartamos os controles pelo texto (os de ícone não têm texto).
  const alternativas = page.locator("button:visible");
  const total = await alternativas.count().catch(() => 0);
  for (let i = 0; i < total; i++) {
    const alternativa = alternativas.nth(i);
    const texto = (await alternativa.textContent().catch(() => "")) ?? "";
    if (CONTROLES.test(texto) || !texto.trim()) continue;
    await alternativa.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(400);

    // Prática guiada: a escolha só conta depois do "Verificar".
    const verificar = page.getByRole("button", { name: /^verificar$/i }).first();
    if (await verificar.isVisible().catch(() => false)) {
      await verificar.click({ force: true }).catch(() => undefined);
      await page.waitForTimeout(900);
    }

    if (await continuar.isEnabled().catch(() => false)) {
      console.log(`  · respondeu: "${texto.trim().slice(0, 40)}"`);
      return;
    }
  }
  console.log(`  ⚠ nenhuma das ${total} alternativas destravou o avanço`);
}

/**
 * O cartão "Monte o código" pede os blocos NA ORDEM certa — tentativa por
 * alternativa não resolve. Montamos por prefixo contra a linha que a lição de
 * demonstração (10-1, fixa em /experimentar) pede. Se a lição da porta de
 * entrada mudar, isto precisa mudar junto; o script avisa quando não chega ao
 * editor.
 */
const LINHA_ALVO = 'mostrar("Estou programando");';

async function montarCodigo(page: Page) {
  if (!(await page.getByText(/monte o código/i).first().isVisible().catch(() => false))) return;

  let restante = LINHA_ALVO;
  for (let passo = 0; passo < 12 && restante.length > 0; passo++) {
    const blocos = page.locator("button:visible");
    const total = await blocos.count().catch(() => 0);
    let clicou = false;

    for (let i = 0; i < total; i++) {
      const texto = ((await blocos.nth(i).textContent().catch(() => "")) ?? "").trim();
      if (!texto || CONTROLES.test(texto)) continue;
      if (!restante.startsWith(texto)) continue;
      await blocos.nth(i).click({ force: true }).catch(() => undefined);
      restante = restante.slice(texto.length).trimStart();
      clicou = true;
      await page.waitForTimeout(250);
      break;
    }
    if (!clicou) break;
  }

  const verificar = page.getByRole("button", { name: /^verificar$/i }).first();
  if (await verificar.isVisible().catch(() => false)) {
    await verificar.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(900);
  }
  console.log(restante.length === 0 ? "  · montou a linha de código" : `  ⚠ sobrou do alvo: "${restante}"`);
}

/** Avança o carrossel até a etapa de código (o botão Executar aparecer). */
async function avancarAteOEditor(page: Page, maxPassos = 24) {
  for (let i = 0; i < maxPassos; i++) {
    const executar = page.getByRole("button", { name: /executar|rodar/i }).first();
    if (await executar.isVisible().catch(() => false)) return true;

    const botao = page.getByRole("button", { name: AVANCAR }).first();
    if (!(await botao.isVisible().catch(() => false))) return false;
    await montarCodigo(page);
    await responderSeNecessario(page);
    if (!(await botao.isEnabled().catch(() => false))) return false;
    await botao.click().catch(() => undefined);
    await page.waitForTimeout(650);
  }
  return false;
}

// 1. Landing — a promessa
await go("/");
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await shot("01-landing.png");

// 2. Catálogo público — o tamanho do conteúdo
await go("/cursos");
await shot("02-cursos.png");

// 3. Uma trilha por dentro
await go("/cursos/10");
await shot("03-trilha.png");

// 4. A aula aberta: teoria em cartões
await go("/experimentar");
await esconderNavbar(page);
await shot("04-aula.png");

// 5. A mesma aula na etapa de código (é o que diferencia o app de um blog)
const chegouNoEditor = await avancarAteOEditor(page);
if (!chegouNoEditor) {
  console.log("⚠ não cheguei na etapa de código — 05/06 vão sair errados");
}

// Dispensa o balão de primeira vez, que só atrapalha o print.
const entendi = page.getByRole("button", { name: /^entendi$/i }).first();
if (await entendi.isVisible().catch(() => false)) {
  await entendi.click().catch(() => undefined);
  await page.waitForTimeout(400);
}

// Escreve a solução: rodar com o editor vazio produziria um print de ERRO,
// que é o oposto do que a loja deve mostrar.
const editor = page.locator(".cm-content").first();
if (await editor.isVisible().catch(() => false)) {
  await editor.click().catch(() => undefined);
  await page.keyboard.press("Control+End");
  await page.keyboard.type(`\n${LINHA_ALVO}`, { delay: 35 });
  await page.waitForTimeout(600);
} else {
  console.log("⚠ editor de código não encontrado — o print vai sair sem solução");
}
await esconderNavbar(page);
await shot("05-editor.png");

// 6. Execução: clica em Executar e espera a saída de sucesso
const executar = page.getByRole("button", { name: /executar|rodar/i }).first();
if (await executar.isVisible().catch(() => false)) {
  await executar.click().catch(() => undefined);
  await page.waitForTimeout(7000); // o runtime da linguagem carrega sob demanda
  await esconderNavbar(page);
  await shot("06-saida.png");
} else {
  console.log("• botão Executar não apareceu — 06-saida.png não foi gerado");
}

await browser.close();
console.log(`Concluído (base: ${BASE}).`);
