// Web Worker que roda Python de verdade via Pyodide. O Pyodide (~10 MB wasm) é
// carregado sob demanda de um CDN na PRIMEIRA execução — não entra no bundle.
// Rodar fora da thread principal mantém a UI fluida e permite matar laços
// infinitos (a thread principal dá timeout e termina o worker).
//
// Segurança (checkup #9): a URL é PINADA numa versão imutável do jsdelivr
// (v0.26.4) — o risco de cadeia de suprimentos fica limitado (jsdelivr serve
// arquivos versionados imutáveis). Por isso `cdn.jsdelivr.net` está no
// script-src do CSP (vercel.json). Hardening máximo seria self-hostar os
// artefatos do Pyodide e remover o jsdelivr do CSP, mas isso adicionaria
// ~10 MB ao deploy — trade-off não justificado dado o pinning. Se for
// self-hostar no futuro, copie /full/ para public/pyodide/ e aponte as URLs
// abaixo + ajuste o CSP.

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs";
const PYODIDE_INDEX = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

interface PyodideLike {
  setStdout(opts: { batched: (line: string) => void }): void;
  setStderr(opts: { batched: (line: string) => void }): void;
  runPythonAsync(code: string): Promise<unknown>;
}

interface RunMessage {
  type: "run";
  id: number;
  code: string;
}

const ctx = self as unknown as {
  onmessage: ((event: MessageEvent<RunMessage>) => void) | null;
  postMessage: (message: unknown) => void;
};

let pyodidePromise: Promise<PyodideLike> | null = null;

async function getPyodide(): Promise<PyodideLike> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const url: string = PYODIDE_URL;
      const mod = (await import(/* @vite-ignore */ url)) as {
        loadPyodide: (opts?: { indexURL?: string }) => Promise<PyodideLike>;
      };
      return mod.loadPyodide({ indexURL: PYODIDE_INDEX });
    })();
  }
  return pyodidePromise;
}

ctx.onmessage = async (event) => {
  const data = event.data;
  if (data?.type !== "run") return;

  let stdout = "";
  let stderr = "";
  try {
    const py = await getPyodide();
    py.setStdout({ batched: (line) => { stdout += `${line}\n`; } });
    py.setStderr({ batched: (line) => { stderr += `${line}\n`; } });
    await py.runPythonAsync(data.code);
    ctx.postMessage({ id: data.id, stdout, stderr });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    ctx.postMessage({ id: data.id, stdout, stderr, error: message });
  }
};
