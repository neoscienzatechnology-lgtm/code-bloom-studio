import {
  AbsoluteFill,
  Audio,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/FiraCode";
import { C, rand } from "./theme";

// Short vertical (1080x1920) para YouTube Shorts / Reels / TikTok.
//
// Difere do vídeo de teoria (16:9) em três coisas que decidem se alguém assiste:
//  1. GANCHO nos primeiros segundos — uma tensão, não um resumo;
//  2. LEGENDA QUEIMADA sincronizada por palavra — a maioria assiste sem som;
//  3. ÁREAS SEGURAS — a interface do app cobre topo e rodapé, então nada de
//     essencial encosta nas bordas verticais.
// #aquisicao-shorts

const display = loadDisplay("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const body = loadBody("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export const SHORT_W = 1080;
export const SHORT_H = 1920;
export const SHORT_FPS = 30;

// Zonas ocupadas pela interface das plataformas (perfil/legenda/botões).
// O conteúdo vive entre elas; o rodapé real do vídeo fica vazio de propósito.
const SAFE_TOP = 250;
const CAPTION_TOP = 1340;
const SAFE_BOTTOM = 1700;

export type ShortWord = { text: string; from: number; to: number };
export type ShortClip = { src: string; durationInFrames: number; words?: ShortWord[] };
export type ShortSceneKey = "hook" | "concept" | "code" | "points" | "outro";

export type ShortProps = {
  id: string;
  language: string;
  hook: string;
  concept: string;
  code: string;
  codeOutput: string;
  points: string[];
  cta: string;
  narration?: Partial<Record<ShortSceneKey, ShortClip>>;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function computeShortScenes(p: ShortProps) {
  const pointsList = (p.points ?? []).filter((x) => x && x.trim().length > 0).slice(0, 3);
  const hasCode = !!p.code && p.code.trim().length > 0;
  const hasOutput = !!p.codeOutput && p.codeOutput.trim().length > 0;
  const typing = clamp(Math.round((p.code ?? "").length * 1.5), 40, 150);

  // Com narração a cena dura pelo menos a fala + respiro; sem narração cai
  // num tempo de leitura confortável.
  const PAD = 14;
  const narr = (scene: ShortSceneKey, base: number) => {
    const clip = p.narration?.[scene];
    return clip ? Math.max(base, clip.durationInFrames + PAD) : base;
  };

  const hook = narr("hook", 72);
  const concept = narr("concept", 96);
  const code = hasCode ? narr("code", 40 + typing + (hasOutput ? 60 : 20)) : 0;
  const points = pointsList.length ? narr("points", 40 + pointsList.length * 34) : 0;
  const outro = narr("outro", 84);

  return {
    hook,
    concept,
    code,
    points,
    outro,
    total: hook + concept + code + points + outro,
    hasCode,
    hasOutput,
    pointsList,
    typing,
  };
}

// ---- animação ----
const reveal = (frame: number, delay = 0, dur = 14) =>
  interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Up: React.FC<{ d?: number; dur?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  d = 0,
  dur = 14,
  y = 28,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = reveal(frame, d, dur);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>;
};

const HexMark: React.FC<{ size?: number; glow?: boolean }> = ({ size = 72, glow }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: glow ? `drop-shadow(0 0 16px ${C.neon}aa)` : undefined }}>
    <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" fill="rgba(77,232,74,0.06)" stroke={C.neon} strokeWidth={3.5} />
    <text x="50" y="50" dominantBaseline="central" textAnchor="middle" fontFamily={mono} fontSize="30" fontWeight={700} fill={C.neon}>
      {"</>"}
    </text>
  </svg>
);

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 26;
  const particles = new Array(22).fill(0).map((_, i) => {
    const baseX = rand(i) * SHORT_W;
    const baseY = rand(i + 99) * SHORT_H;
    const y = ((baseY + frame * (0.4 + rand(i + 7) * 0.8)) % (SHORT_H + 60)) - 30;
    const s = 2 + rand(i + 5) * 4;
    const o = 0.12 + rand(i + 3) * 0.3;
    return { x: baseX, y, s, o };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(110% 45% at ${35 + drift}% -5%, rgba(55,211,44,0.18), transparent 60%), radial-gradient(100% 45% at ${75 - drift}% 105%, rgba(28,143,42,0.2), transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.borderSoft} 1px, transparent 1px), linear-gradient(90deg, ${C.borderSoft} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.32,
          maskImage: "radial-gradient(90% 60% at 50% 40%, black, transparent 85%)",
        }}
      />
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: "50%", background: C.neon, opacity: p.o, filter: "blur(0.5px)" }} />
      ))}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 110px rgba(0,0,0,0.72)" }} />
    </AbsoluteFill>
  );
};

/** Coluna central: tudo entre o topo seguro e a faixa de legenda. */
const Stage: React.FC<{ children: React.ReactNode; center?: boolean }> = ({ children, center }) => (
  <AbsoluteFill
    style={{
      paddingLeft: 76,
      paddingRight: 76,
      paddingTop: SAFE_TOP,
      paddingBottom: SHORT_H - CAPTION_TOP + 40,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: center ? "center" : "flex-start",
      textAlign: center ? "center" : "left",
      fontFamily: body,
      color: C.text,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: mono, color: C.neon, fontSize: 32, letterSpacing: 2, textTransform: "uppercase" }}>
    {"// "}
    {children}
  </div>
);

// ---- legenda queimada ----
// Agrupa as palavras em blocos curtos (uma "linha de legenda") e destaca a
// palavra que está sendo falada. Sem isto o vídeo só funciona com som — e a
// maior parte do feed roda mudo.
function groupWords(words: ShortWord[], maxChars = 30): ShortWord[][] {
  const groups: ShortWord[][] = [];
  let current: ShortWord[] = [];
  let size = 0;
  const flush = () => {
    if (current.length > 0) groups.push(current);
    current = [];
    size = 0;
  };
  for (const word of words) {
    if (current.length > 0 && size + word.text.length + 1 > maxChars) flush();
    current.push(word);
    size += word.text.length + 1;
    // Quebra natural no fim da frase: prende a legenda ao ritmo da fala em vez
    // de cortar no meio de uma ideia só porque estourou o número de letras.
    if (/[.!?…:;]$/.test(word.text) && size > maxChars * 0.4) flush();
  }
  flush();
  return groups;
}

const Captions: React.FC<{ words?: ShortWord[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  if (!words || words.length === 0) return null;

  const groups = groupWords(words);
  const active = groups.find((g) => frame >= g[0].from && frame <= g[g.length - 1].to) ??
    (frame < groups[0][0].from ? groups[0] : groups[groups.length - 1]);
  if (!active) return null;

  const appear = reveal(frame, active[0].from - 3, 6);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: CAPTION_TOP,
        height: SAFE_BOTTOM - CAPTION_TOP - 120,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: 0.35 + appear * 0.65,
          padding: "26px 34px",
          borderRadius: 24,
          background: "rgba(6,10,8,0.72)",
          border: `1px solid ${C.borderSoft}`,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.2,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        {active.map((word, i) => {
          const on = frame >= word.from && frame <= word.to;
          return (
            <span
              key={`${word.text}-${i}`}
              style={{
                color: on ? C.neon : C.text,
                textShadow: on ? `0 0 26px ${C.neon}66` : undefined,
                marginRight: 12,
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Marca discreta no topo + barra de progresso do vídeo inteiro. */
const Chrome: React.FC<{ progress: number }> = ({ progress }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 96, left: 76, display: "flex", alignItems: "center", gap: 14, opacity: 0.92 }}>
      <HexMark size={52} />
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 34, color: C.text }}>
        Code<span style={{ color: C.neon }}>Tier</span>
      </span>
    </div>
    <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: `${clamp(progress, 0, 1) * 100}%`, background: `linear-gradient(90deg, ${C.neon}, ${C.neonDeep})`, boxShadow: `0 0 18px ${C.neon}88` }} />
  </AbsoluteFill>
);

// ---- cenas ----
const HookScene: React.FC<{ hook: string; language: string }> = ({ hook, language }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const size = hook.length <= 26 ? 128 : hook.length <= 40 ? 106 : 88;
  return (
    <Stage center>
      {/* O gancho tem que estar legível em ~0,5s: no feed, o que aparece
          depois de um segundo já perdeu metade da audiência. */}
      <div style={{ transform: `scale(${0.92 + pop * 0.08})` }}>
        <Up d={0} dur={8}>
          <Eyebrow>{language}</Eyebrow>
        </Up>
        <Up d={2} dur={12} y={40}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 1.06, marginTop: 26 }}>{hook}</div>
        </Up>
        <Up d={16}>
          <div
            style={{
              margin: "38px auto 0",
              height: 8,
              width: interpolate(reveal(frame, 22, 26), [0, 1], [0, 320]),
              borderRadius: 8,
              background: `linear-gradient(90deg, ${C.neon}, ${C.neonDeep})`,
              boxShadow: `0 0 24px ${C.neon}88`,
            }}
          />
        </Up>
      </div>
    </Stage>
  );
};

const ConceptScene: React.FC<{ text: string }> = ({ text }) => (
  <Stage>
    <Up d={2}>
      <Eyebrow>Por quê</Eyebrow>
    </Up>
    <Up d={10} y={32} style={{ width: "100%" }}>
      <div style={{ fontFamily: display, fontWeight: 500, fontSize: text.length <= 90 ? 76 : 64, lineHeight: 1.26, marginTop: 26 }}>{text}</div>
    </Up>
  </Stage>
);

const CodeScene: React.FC<{ code: string; output: string; typingFrames: number; hasOutput: boolean }> = ({
  code,
  output,
  typingFrames,
  hasOutput,
}) => {
  const frame = useCurrentFrame();
  const lines = code.split("\n");
  const longest = Math.max(...lines.map((l) => l.length), 10);
  // 0.6em por caractere em fonte mono: a linha mais longa manda no tamanho.
  const fontSize = clamp(Math.floor(830 / (longest * 0.6)), 26, 52);
  const total = code.length;
  const shown = Math.floor(
    interpolate(frame, [12, 12 + typingFrames], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const caretOn = shown < total && frame % 16 < 8;
  const outT = reveal(frame, 12 + typingFrames + 10, 18);

  let remaining = shown;
  const renderedLines = lines.map((line) => {
    const take = clamp(remaining, 0, line.length);
    remaining -= line.length + 1;
    return { full: line, take, active: take > 0 && take < line.length };
  });

  return (
    <Stage>
      <Up d={2}>
        <Eyebrow>Na prática</Eyebrow>
      </Up>
      <Up d={8} y={28} style={{ width: "100%" }}>
        <div
          style={{
            marginTop: 24,
            borderRadius: 22,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 0 60px rgba(77,232,74,0.08)",
            background: C.panelSolid,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 24px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#FEBC2E" }} />
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.neon }} />
          </div>
          {/* Sem ligaturas: a Fira Code desenha "<=" como "≤" e "==" como "⩵",
              e quem está aprendendo precisa ver as teclas que vai digitar. */}
          <div style={{ padding: "30px 32px", fontFamily: mono, fontSize, lineHeight: 1.5, fontVariantLigatures: "none" }}>
            {renderedLines.map((ln, i) => (
              <div key={i} style={{ whiteSpace: "pre", display: "flex" }}>
                <span style={{ color: C.dim, width: 42, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ color: C.mono }}>{ln.full.slice(0, ln.take)}</span>
                {ln.active && caretOn && <span style={{ color: C.neon }}>▋</span>}
              </div>
            ))}
          </div>
        </div>
      </Up>
      {hasOutput && (
        <div style={{ opacity: outT, transform: `translateY(${(1 - outT) * 16}px)`, marginTop: 26, width: "100%" }}>
          <div style={{ fontFamily: mono, fontSize: 28, color: C.dim, marginBottom: 10 }}>{"// saída"}</div>
          <div
            style={{
              fontFamily: mono,
              fontSize: clamp(fontSize, 26, 46),
              color: C.text,
              padding: "24px 28px",
              borderRadius: 16,
              background: "rgba(77,232,74,0.08)",
              border: `1px solid ${C.border}`,
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </div>
        </div>
      )}
    </Stage>
  );
};

const PointsScene: React.FC<{ points: string[] }> = ({ points }) => (
  <Stage>
    <Up d={2}>
      <Eyebrow>Guarde isto</Eyebrow>
    </Up>
    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
      {points.map((p, i) => (
        <Up key={i} d={10 + i * 14} y={26} style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                width: 62,
                height: 62,
                flexShrink: 0,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(77,232,74,0.12)",
                border: `1px solid ${C.border}`,
                fontFamily: mono,
                fontWeight: 700,
                color: C.neon,
                fontSize: 32,
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontFamily: body, fontWeight: 500, fontSize: p.length <= 30 ? 56 : 46, lineHeight: 1.24 }}>{p}</span>
          </div>
        </Up>
      ))}
    </div>
  </Stage>
);

const OutroScene: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  return (
    <Stage center>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.86 + pop * 0.14})` }}>
        <HexMark size={170} glow />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 92, marginTop: 28 }}>
          Code<span style={{ color: C.neon }}>Tier</span>
        </div>
        <Up d={12}>
          <div style={{ fontFamily: body, fontSize: 44, color: C.dim, marginTop: 18, maxWidth: 820 }}>{cta}</div>
        </Up>
        <Up d={22}>
          <div
            style={{
              marginTop: 34,
              padding: "20px 40px",
              borderRadius: 999,
              border: `2px solid ${C.neon}`,
              fontFamily: mono,
              fontSize: 40,
              color: C.neon,
              boxShadow: `0 0 40px ${C.neon}33`,
            }}
          >
            codetier.vercel.app
          </div>
        </Up>
      </div>
    </Stage>
  );
};

const Narr: React.FC<{ clip?: ShortClip }> = ({ clip }) => (clip ? <Audio src={staticFile(clip.src)} /> : null);

/** Cena + narração + legenda daquela cena, num invólucro só. */
const Scene: React.FC<{ clip?: ShortClip; children: React.ReactNode; noCaptions?: boolean }> = ({
  clip,
  children,
  noCaptions,
}) => (
  <AbsoluteFill>
    <Narr clip={clip} />
    {children}
    {!noCaptions && <Captions words={clip?.words} />}
  </AbsoluteFill>
);

export const Short: React.FC<ShortProps> = (props) => {
  const { hook, concept, code, codeOutput, cta, language } = props;
  const frame = useCurrentFrame();
  const s = computeShortScenes(props);
  const n = props.narration ?? {};
  return (
    <AbsoluteFill>
      <Backdrop />
      <Series>
        <Series.Sequence durationInFrames={s.hook}>
          <Scene clip={n.hook}>
            <HookScene hook={hook} language={language} />
          </Scene>
        </Series.Sequence>
        <Series.Sequence durationInFrames={s.concept}>
          <Scene clip={n.concept}>
            <ConceptScene text={concept} />
          </Scene>
        </Series.Sequence>
        {s.hasCode && (
          <Series.Sequence durationInFrames={s.code}>
            <Scene clip={n.code}>
              <CodeScene code={code} output={codeOutput} typingFrames={s.typing} hasOutput={s.hasOutput} />
            </Scene>
          </Series.Sequence>
        )}
        {s.pointsList.length > 0 && (
          <Series.Sequence durationInFrames={s.points}>
            <Scene clip={n.points}>
              <PointsScene points={s.pointsList} />
            </Scene>
          </Series.Sequence>
        )}
        {/* Sem legenda no fecho: a narração soletra o domínio ("ponto app")
            para o TTS, e ler isso escrito ficaria estranho — a tela já mostra
            codetier.vercel.app do jeito certo. */}
        <Series.Sequence durationInFrames={s.outro}>
          <Scene clip={n.outro} noCaptions>
            <OutroScene cta={cta} />
          </Scene>
        </Series.Sequence>
      </Series>
      <Chrome progress={frame / Math.max(1, s.total)} />
    </AbsoluteFill>
  );
};
