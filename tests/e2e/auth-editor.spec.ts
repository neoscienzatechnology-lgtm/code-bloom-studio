import { test, expect } from "../../playwright-fixture";

const TEST_EMAIL = "qa-capytest-2026@capycode.dev";
const TEST_PASSWORD = "CapyTest#2026";

test.describe("Auth → editor smoke", () => {
  test("logs in and reaches the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();

    await expect(page).toHaveURL(/\/(dashboard|onboarding)/, { timeout: 15_000 });
  });

  test("opens lesson 10-1 with the confidence check rendered", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15_000 });

    await page.goto("/editor/10/10-1");

    const confidenceOne = page.getByRole("button", { name: /1 - Nunca vi isso/i });
    await expect(confidenceOne).toBeVisible({ timeout: 10_000 });
    for (const n of [2, 3, 4, 5]) {
      await expect(page.getByRole("button", { name: new RegExp(`^${n} - `) })).toBeVisible();
    }
  });
});

test.describe("Daily review surface", () => {
  test("renders the adaptive review page with a recommended lesson", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15_000 });

    await page.goto("/revisao");

    await expect(page.getByRole("heading", { name: /revisão inteligente/i })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText(/aula recomendada/i).first()).toBeVisible();
    await expect(page.getByText(/foco de hoje/i)).toBeVisible();
  });
});

test.describe("Routing edges", () => {
  test("unknown routes render the NotFound page", async ({ page }) => {
    await page.goto("/route-que-nao-existe");
    await expect(page.getByText(/404|não.*encontrad/i).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test("missing lesson id redirects back to the courses list", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15_000 });

    await page.goto("/editor/10/aula-inexistente");
    await expect(page).toHaveURL(/\/cursos$/, { timeout: 5_000 });
  });
});

test.describe("Theme toggle", () => {
  test("persists the chosen theme across reloads on public pages", async ({ page }) => {
    await page.goto("/termos");
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload();

    const html = page.locator("html");
    const initialClass = (await html.getAttribute("class")) ?? "";

    await page.getByRole("button", { name: /ativar tema (claro|escuro)/i }).click();
    await page.waitForFunction(
      (initial) => document.documentElement.className !== initial,
      initialClass,
      { timeout: 5_000 },
    );
    const toggledClass = await html.getAttribute("class");
    expect(toggledClass).not.toBe(initialClass);

    await page.reload();
    await expect(html).toHaveClass(toggledClass!);
  });
});
