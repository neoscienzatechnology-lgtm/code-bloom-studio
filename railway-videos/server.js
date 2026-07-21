// Servidor dos vídeos de teoria do CodeTier (Railway + Volume).
// Estrutura: <VIDEOS_DIR>/<courseId>/<lessonId>.mp4 — mesma URL-shape do
// bucket anterior: <base>/<courseId>/<lessonId>.mp4.
//
// Os MP4 (701MB) NÃO vão no deploy (o upload de código do Railway limita
// ~500MB): eles moram num Volume montado em /data e são enviados via
// PUT /upload/... protegido por UPLOAD_TOKEN. Sem o token configurado,
// o upload fica desligado.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const VIDEOS_DIR = process.env.VIDEOS_DIR || path.join(__dirname, "videos");
const UPLOAD_TOKEN = process.env.UPLOAD_TOKEN || "";
const PORT = process.env.PORT || 3000;

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: true, service: "codetier-theory-videos", videos: countMp4(VIDEOS_DIR) });
});

// Upload autenticado: PUT /upload/<courseId>/<arquivo>.mp4 (corpo = bytes).
app.put("/upload/:course/:file", (req, res) => {
  if (!UPLOAD_TOKEN || req.headers.authorization !== `Bearer ${UPLOAD_TOKEN}`) {
    return res.status(403).json({ ok: false });
  }
  const course = String(req.params.course);
  const file = String(req.params.file);
  if (!/^[\w-]+$/.test(course) || !/^[\w-]+\.mp4$/.test(file)) {
    return res.status(400).json({ ok: false, error: "nome inválido" });
  }
  const dir = path.join(VIDEOS_DIR, course);
  fs.mkdirSync(dir, { recursive: true });
  const dest = path.join(dir, file);
  const tmp = `${dest}.part`;
  const out = fs.createWriteStream(tmp);
  req.pipe(out);
  out.on("finish", () => {
    fs.renameSync(tmp, dest);
    res.json({ ok: true, bytes: fs.statSync(dest).size });
  });
  out.on("error", () => res.status(500).json({ ok: false }));
});

// HEAD/GET dos vídeos (Range/206, ETag e 404 pelo express.static)
app.use(
  express.static(VIDEOS_DIR, {
    fallthrough: false,
    immutable: true,
    maxAge: "365d",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) res.setHeader("Content-Type", "video/mp4");
    },
  }),
);

app.listen(PORT, () => {
  console.log(`codetier-theory-videos on :${PORT} — ${countMp4(VIDEOS_DIR)} vídeos em ${VIDEOS_DIR}`);
});
