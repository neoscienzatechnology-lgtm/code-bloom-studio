/**
 * Sobe os vídeos de teoria (out/videos/<curso>/<lição>.mp4) para um bucket
 * PÚBLICO do Supabase Storage e imprime a URL base para o app.
 *
 * As credenciais vêm do AMBIENTE (nunca commitadas):
 *   SUPABASE_URL          = https://<ref>.supabase.co
 *   SUPABASE_SERVICE_KEY  = a chave service_role (NÃO é a anon/publishable)
 *   THEORY_VIDEO_BUCKET   = opcional, default "theory-videos"
 *
 * PowerShell (na pasta do projeto):
 *   $env:SUPABASE_URL="https://xxxx.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="eyJ...service_role..."
 *   npm run video:upload
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_KEY?.trim();
const bucket = process.env.THEORY_VIDEO_BUCKET?.trim() || "theory-videos";

if (!url || !key) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_KEY no ambiente (veja o cabeçalho deste arquivo).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

// Garante um bucket público (vídeos servidos por URL pública).
const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
if (listErr) {
  console.error("Não consegui listar buckets (a chave é service_role?):", listErr.message);
  process.exit(1);
}
if (!buckets?.some((b) => b.name === bucket)) {
  const { error } = await supabase.storage.createBucket(bucket, { public: true });
  if (error) {
    console.error(`Erro criando o bucket "${bucket}":`, error.message);
    process.exit(1);
  }
  console.log(`Bucket público "${bucket}" criado.`);
} else {
  console.log(`Usando bucket existente "${bucket}".`);
}

const videosDir = join(root, "out", "videos");
let ok = 0;
let fail = 0;
for (const courseId of readdirSync(videosDir)) {
  const courseDir = join(videosDir, courseId);
  if (!statSync(courseDir).isDirectory()) continue;
  for (const file of readdirSync(courseDir)) {
    if (!file.endsWith(".mp4")) continue;
    const objectPath = `${courseId}/${file}`;
    const body = readFileSync(join(courseDir, file));
    const { error } = await supabase.storage.from(bucket).upload(objectPath, body, {
      contentType: "video/mp4",
      upsert: true,
    });
    if (error) {
      fail++;
      console.error(`  ✗ ${objectPath}: ${error.message}`);
    } else {
      ok++;
      if (ok % 20 === 0) console.log(`  ${ok} enviados...`);
    }
  }
}

const base = `${url.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}`;
console.log(`\nConcluído: ${ok} enviados, ${fail} falha(s).`);
console.log(`\nLigue o recurso no app definindo:\n  VITE_THEORY_VIDEO_BASE=${base}`);
console.log("Depois faça o deploy (Vercel) — o card 'Teoria em vídeo' aparece nas lições.");
