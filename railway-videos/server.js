// Servidor dos vídeos de teoria do CodeTier (Railway + Volume).
// Estrutura: <VIDEOS_DIR>/<courseId>/<lessonId>.mp4 — mesma URL-shape do
// bucket anterior: <base>/<courseId>/<lessonId>.mp4.
//
// Os MP4 (701MB) NÃO vão no deploy (o upload de código do Railway limita
// ~500MB): eles moram num Volume montado em /data e são enviados via
// PUT /upload/... protegido por UPLOAD_TOKEN. Sem o token configurado,
// o upload fica desligado.
const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const VIDEOS_DIR = process.env.VIDEOS_DIR || path.join(__dirname, "videos");
const UPLOAD_TOKEN = process.env.UPLOAD_TOKEN || "";
const PORT = process.env.PORT || 3000;
// Vídeos têm ~4MB; margem folgada, mas impede encher o volume num PUT só.
const MAX_UPLOAD_BYTES = 64 * 1024 * 1024;

// No Railway, rodar SEM o volume configurado gravaria em disco efêmero e
// perderia tudo no próximo deploy — melhor falhar alto do que falhar depois.
if (process.env.RAILWAY_ENVIRONMENT && !process.env.VIDEOS_DIR) {
  console.error("VIDEOS_DIR não configurado (aponte para o volume, ex.: /data/videos). Abortando.");
  process.exit(1);
}

fs.mkdirSync(VIDEOS_DIR, { recursive: true });

function countMp4(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countMp4(p);
    else if (entry.name.endsWith(".mp4")) n += 1;
  }
  return n;
}
// contagem cacheada: o healthcheck é público, não deixamos cada GET / varrer o volume
let countCache = { at: 0, value: 0 };
function countMp4Cached() {
  const now = Date.now();
  if (now - countCache.at > 60_000) countCache = { at: now, value: countMp4(VIDEOS_DIR) };
  return countCache.value;
}

function tokenOk(header) {
  if (!UPLOAD_TOKEN || typeof header !== "string") return false;
  // comparação em tempo constante (hash iguala os comprimentos)
  const a = crypto.createHash("sha256").update(header).digest();
  const b = crypto.createHash("sha256").update(`Bearer ${UPLOAD_TOKEN}`).digest();
  return crypto.timingSafeEqual(a, b);
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // uploads parciais nunca são servidos
  if (req.path.includes(".part")) return res.status(404).end();
  next();
});

app.get("/", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: true, service: "codetier-theory-videos", videos: countMp4Cached() });
});

// Upload autenticado: PUT /upload/<courseId>/<arquivo>.mp4 (corpo = bytes).
app.put("/upload/:course/:file", (req, res) => {
  if (!tokenOk(req.headers.authorization)) return res.status(403).json({ ok: false });
  const course = String(req.params.course);
  const file = String(req.params.file);
  if (!/^[\w-]+$/.test(course) || !/^[\w-]+\.mp4$/.test(file)) {
    return res.status(400).json({ ok: false, error: "nome inválido" });
  }
  const dir = path.join(VIDEOS_DIR, course);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, file);
  // tmp único por upload: PUTs concorrentes do mesmo arquivo não se corrompem
  const tmp = `${dest}.${crypto.randomBytes(6).toString("hex")}.part`;
  const out = fs.createWriteStream(tmp);
  let received = 0;
  let finished = false;

  const cleanup = () => {
    out.destroy();
    fs.promises.unlink(tmp).catch(() => {});
  };

  req.on("data", (chunk) => {
    received += chunk.length;
    if (received > MAX_UPLOAD_BYTES) {
      cleanup();
      req.destroy();
      if (!res.headersSent) res.status(413).json({ ok: false, error: "muito grande" });
    }
  });
  // cliente desistiu no meio: não deixa .part órfão nem fd aberto
  req.on("aborted", cleanup);
  req.on("error", cleanup);
  out.on("error", () => {
    cleanup();
    if (!res.headersSent) res.status(500).json({ ok: false });
  });

  req.pipe(out);
  out.on("finish", () => {
    if (received > MAX_UPLOAD_BYTES) return; // já respondido com 413
    finished = true;
    try {
      fs.renameSync(tmp, dest);
      countCache.at = 0; // força recontagem no próximo healthcheck
      res.json({ ok: true, bytes: fs.statSync(dest).size });
    } catch {
      cleanup();
      if (!res.headersSent) res.status(500).json({ ok: false });
    }
  });
  res.on("close", () => {
    if (!finished) cleanup();
  });
});

// GET/HEAD dos vídeos (Range/206 e 404 pelo express.static). Cache de 1 dia +
// ETag: barato via 304 e ainda atualizável se um vídeo for re-renderizado com
// o MESMO nome (immutable/1 ano prenderia a versão antiga por um ano).
app.use(
  express.static(VIDEOS_DIR, {
    fallthrough: false,
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) res.setHeader("Content-Type", "video/mp4");
    },
  }),
);

app.listen(PORT, () => {
  console.log(`codetier-theory-videos on :${PORT} — ${countMp4Cached()} vídeos em ${VIDEOS_DIR}`);
});
