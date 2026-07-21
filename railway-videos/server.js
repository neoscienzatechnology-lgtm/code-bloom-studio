// Servidor estático dos vídeos de teoria do CodeTier.
// Estrutura: videos/<courseId>/<lessonId>.mp4 — mesma URL-shape do bucket
// anterior: <base>/<courseId>/<lessonId>.mp4.
// express.static cuida de Range requests (seek do <video>), ETag e 404.
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const VIDEOS_DIR = path.join(__dirname, "videos");
const PORT = process.env.PORT || 3000;

// contagem para o healthcheck
function countMp4(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) n += countMp4(p);
    else if (entry.name.endsWith(".mp4")) n += 1;
  }
  return n;
}
const TOTAL = fs.existsSync(VIDEOS_DIR) ? countMp4(VIDEOS_DIR) : 0;

app.use((req, res, next) => {
  // vídeos são públicos e imutáveis (re-render = novo deploy)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  next();
});

app.get("/", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: true, service: "codetier-theory-videos", videos: TOTAL });
});

app.use(
  express.static(VIDEOS_DIR, {
    fallthrough: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) res.setHeader("Content-Type", "video/mp4");
    },
  }),
);

app.listen(PORT, () => {
  console.log(`codetier-theory-videos on :${PORT} — ${TOTAL} vídeos`);
});
