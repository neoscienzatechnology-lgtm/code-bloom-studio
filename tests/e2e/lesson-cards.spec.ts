import { test, expect, type Page } from "../../playwright-fixture";

const TEST_EMAIL = "qa-capytest-2026@capycode.dev";
const TEST_PASSWORD = "CapyTest#2026";

async function login(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(TEST_EMAIL);
  await page.locator('input[type="password"]').fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15_000 });
}

test.describe("Fluxo completo da lição em cartões", () => {
  test("atravessa todos os cartões, resolve o código e libera a próxima lição", async ({ page }) => {
    await login(page);
    await page.goto("/editor/10/10-1");

    // Cartão 1: check de confiança visível
    await expect(page.getByRole("button", { name: /1 - Nunca vi isso/i })).toBeVisible({
      timeout: 10_000,
    });

    const abrirEditor = page.getByRole("button", { name: /Abrir editor/ });
    const continuar = page.getByRole("button", { name: /^Continuar/ });

    // Atravessa os cartões; cartões interativos exigem resposta antes do avanço.
    // O laço é tolerante a lição já concluída (gates relaxados) e a mudanças
    // na quantidade de cartões.
    for (let i = 0; i < 25; i += 1) {
      if (await abrirEditor.isVisible().catch(() => false)) break;

      if (await continuar.isEnabled().catch(() => false)) {
        await continuar.click();
        await page.waitForTimeout(250);
        continue;
      }

      if (await page.getByText("Qual está certo?").isVisible().catch(() => false)) {
        await page.locator("button:has(pre)").first().click();
      } else if (await page.getByText("Teste seu conhecimento").isVisible().catch(() => false)) {
        await page.getByRole("button", { name: /Dar instruções claras/ }).click();
        await page.getByRole("button", { name: "Ver Resultado" }).click();
      } else if (await page.getByText("Prática guiada").isVisible().catch(() => false)) {
        await page.locator("div.max-w-xl input").first().fill("mostrar");
        await page.getByRole("button", { name: "Verificar" }).click();
      }
      await page.waitForTimeout(300);
    }

    // Cartão final celebra e abre o editor
    await expect(page.getByText("Agora é código")).toBeVisible();
    await abrirEditor.click();

    // Fase de código: escreve a solução e executa
    await expect(page.getByRole("button", { name: /Executar/ })).toBeVisible({ timeout: 10_000 });
    const editor = page.locator(".cm-content");
    await editor.click();
    await page.keyboard.press("Control+a");
    await page.keyboard.type('mostrar("Estou programando");');
    await page.getByRole("button", { name: /Executar/ }).click();

    await expect(page.getByText("Correto!")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: /Próxima lição/ })).toBeEnabled();
  });
});
