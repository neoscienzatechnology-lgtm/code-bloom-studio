import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/FiraCode";
import { C, rand } from "./theme";

const display = loadDisplay("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const body = loadBody("normal", { weights: ["400", "500", "700"], subsets: ["latin"] }).fontFamily;
const mono = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;

export type TheoryProps = {
  module: string;
  title: string;
  concept: string;
  analogy: string;
  code: string;
  codeOutput: string;
  points: string[];
  cta: string;
};

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const readFrames = (text: string | undefined, perChar = 0.5, min = 90, max = 230) =>
  clamp(Math.round((text?.length ?? 0) * perChar) + 44, min, max);

// Calcula a duração de cada cena a partir do conteúdo (vídeos curtos = pouco texto,
// vídeos com código longo = mais tempo de digitação). Usado tanto na timeline
// quanto no calculateMetadata, para o vídeo nunca cortar uma cena no meio.
export function computeScenes(p: TheoryProps) {
  const hasAnalogy = !!p.analogy && p.analogy.trim().length > 0;
  const hasOutput = !!p.codeOutput && p.codeOutput.trim().length > 0;
  const pointsList = (p.points ?? []).filter((x) => x && x.trim().length > 0).slice(0, 4);
  const hasPoints = pointsList.length > 0;
  const hasCode = !!p.code && p.code.trim().length > 0;

  const codeLen = (p.code ?? "").length;
  const typing = clamp(Math.round(codeLen * 1.7), 36, 160);

  const intro = 96;
  const concept = readFrames(p.concept, 0.5, 120, 240);
  const analogy = hasAnalogy ? readFrames(p.analogy, 0.5, 110, 210) : 0;
  const code = hasCode ? 44 + typing + (hasOutput ? 76 : 28) : 0;
  const points = hasPoints ? 54 + pointsList.length * 38 : 0;
  const outro = 102;

  const total = intro + concept + analogy + code + points + outro;
  return { intro, concept, analogy, code, points, outro, total, hasAnalogy, hasOutput, hasPoints, hasCode, pointsList, typing };
}

// tamanho de fonte que encolhe para textos longos
const fitText = (text: string, big: number, mid: number, small: number) => {
  const n = text?.length ?? 0;
  if (n <= 130) return big;
  if (n <= 260) return mid;
  return small;
};

// ---- helpers de animação ----
const reveal = (frame: number, delay = 0, dur = 18) =>
  interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Up: React.FC<{ d?: number; dur?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  d = 0,
  dur = 18,
  y = 26,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = reveal(frame, d, dur);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>;
};

const HexMark: React.FC<{ size?: number; glow?: boolean }> = ({ size = 72, glow }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: glow ? `drop-shadow(0 0 14px ${C.neon}aa)` : undefined }}>
    <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" fill="rgba(77,232,74,0.06)" stroke={C.neon} strokeWidth={3.5} />
    <text x="50" y="50" dominantBaseline="central" textAnchor="middle" fontFamily={mono} fontSize="30" fontWeight={700} fill={C.neon}>
      {"</>"}
    </text>
  </svg>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: mono, color: C.neon, fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>
    {"// "}
    {children}
  </div>
);

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 30;
  const particles = new Array(26).fill(0).map((_, i) => {
    const baseX = rand(i) * 1920;
    const baseY = rand(i + 99) * 1080;
    const y = ((baseY + frame * (0.3 + rand(i + 7) * 0.6)) % 1140) - 30;
    const s = 1.5 + rand(i + 5) * 3.5;
    const o = 0.12 + rand(i + 3) * 0.32;
    return { x: baseX, y, s, o };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at ${30 + drift}% -10%, rgba(55,211,44,0.16), transparent 55%), radial-gradient(90% 70% at ${85 - drift}% 115%, rgba(28,143,42,0.18), transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.borderSoft} 1px, transparent 1px), linear-gradient(90deg, ${C.borderSoft} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.35,
          maskImage: "radial-gradient(120% 90% at 50% 40%, black, transparent 80%)",
        }}
      />
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: "50%", background: C.neon, opacity: p.o, filter: "blur(0.5px)" }} />
      ))}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 80px rgba(0,0,0,0.7)" }} />
    </AbsoluteFill>
  );
};

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ padding: 110, justifyContent: "center", fontFamily: body, color: C.text }}>{children}</AbsoluteFill>
);

// ---- cenas ----
const IntroScene: React.FC<{ module: string; title: string }> = ({ module, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const titleSize = fitText(title, 96, 78, 62);
  return (
    <Frame>
      <div style={{ transform: `scale(${0.9 + pop * 0.1})` }}>
        <Up d={4}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
            <HexMark size={66} glow />
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 30, letterSpacing: 0.5 }}>
              Code<span style={{ color: C.neon }}>Tier</span>
            </span>
          </div>
        </Up>
        <Up d={12}>
          <Eyebrow>{module}</Eyebrow>
        </Up>
        <Up d={20} y={34}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: titleSize, lineHeight: 1.04, marginTop: 14, maxWidth: 1500 }}>{title}</div>
        </Up>
        <Up d={34}>
          <div
            style={{
              marginTop: 30,
              height: 6,
              width: interpolate(reveal(frame, 34, 40), [0, 1], [0, 360]),
              borderRadius: 6,
              background: `linear-gradient(90deg, ${C.neon}, ${C.neonDeep})`,
              boxShadow: `0 0 22px ${C.neon}88`,
            }}
          />
        </Up>
      </div>
    </Frame>
  );
};

const TextScene: React.FC<{ tag: string; text: string }> = ({ tag, text }) => (
  <Frame>
    <Up d={4}>
      <Eyebrow>{tag}</Eyebrow>
    </Up>
    <Up d={16} y={30}>
      <div style={{ fontFamily: display, fontWeight: 500, fontSize: fitText(text, 62, 50, 42), lineHeight: 1.3, maxWidth: 1500, marginTop: 22 }}>{text}</div>
    </Up>
  </Frame>
);

const AnalogyScene: React.FC<{ text: string }> = ({ text }) => (
  <Frame>
    <Up d={2}>
      <Eyebrow>Analogia</Eyebrow>
    </Up>
    <Up d={14} y={30}>
      <div
        style={{
          marginTop: 24,
          padding: "44px 52px",
          borderRadius: 26,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderLeft: `6px solid ${C.neon}`,
          maxWidth: 1500,
          fontSize: fitText(text, 56, 46, 38),
          lineHeight: 1.36,
          fontStyle: "italic",
        }}
      >
        {text}
      </div>
    </Up>
  </Frame>
);

const CodeScene: React.FC<{ code: string; output: string; typingFrames: number; hasOutput: boolean }> = ({ code, output, typingFrames, hasOutput }) => {
  const frame = useCurrentFrame();
  const lines = code.split("\n");
  const longest = Math.max(...lines.map((l) => l.length), 12);
  const fontSize = clamp(Math.round(1180 / longest), 24, 48);
  const total = code.length;
  const shown = Math.floor(interpolate(frame, [16, 16 + typingFrames], [0, total], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typingDone = shown >= total;
  const caretOn = !typingDone && frame % 16 < 8;
  const outT = reveal(frame, 16 + typingFrames + 14, 22);

  // reconstrói o texto digitado char a char através das linhas
  let remaining = shown;
  const renderedLines = lines.map((line) => {
    const take = clamp(remaining, 0, line.length);
    remaining -= line.length + 1; // +1 por causa do \n
    return { full: line, take, active: take > 0 && take < line.length };
  });

  return (
    <Frame>
      <Up d={2}>
        <Eyebrow>Veja na prática</Eyebrow>
      </Up>
      <Up d={10} y={28}>
        <div
          style={{
            marginTop: 22,
            borderRadius: 18,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 50px rgba(77,232,74,0.08)`,
            maxWidth: 1500,
            background: C.panelSolid,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E" }} />
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: C.neon }} />
            <span style={{ marginLeft: 14, fontFamily: mono, fontSize: 22, color: C.dim }}>main</span>
          </div>
          <div style={{ padding: "34px 40px", fontFamily: mono, fontSize, lineHeight: 1.5 }}>
            {renderedLines.map((ln, i) => (
              <div key={i} style={{ whiteSpace: "pre", display: "flex" }}>
                <span style={{ color: C.dim, width: 44, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ color: C.mono }}>{ln.full.slice(0, ln.take)}</span>
                {ln.active && caretOn && <span style={{ color: C.neon }}>▋</span>}
              </div>
            ))}
          </div>
        </div>
      </Up>
      {hasOutput && (
        <div style={{ opacity: outT, transform: `translateY(${(1 - outT) * 18}px)`, marginTop: 24, maxWidth: 1500 }}>
          <div style={{ fontFamily: mono, fontSize: 24, color: C.dim, marginBottom: 8 }}>{"// saída"}</div>
          <div style={{ fontFamily: mono, fontSize: clamp(fontSize - 4, 22, 44), color: C.text, padding: "20px 30px", borderRadius: 14, background: "rgba(77,232,74,0.07)", border: `1px solid ${C.border}`, whiteSpace: "pre-wrap" }}>{output}</div>
        </div>
      )}
    </Frame>
  );
};

const PointsScene: React.FC<{ points: string[] }> = ({ points }) => (
  <Frame>
    <Up d={2}>
      <Eyebrow>Para levar com você</Eyebrow>
    </Up>
    <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22, maxWidth: 1520 }}>
      {points.map((p, i) => (
        <Up key={i} d={14 + i * 16} y={24}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(77,232,74,0.12)", border: `1px solid ${C.border}`, fontFamily: mono, fontWeight: 700, color: C.neon, fontSize: 24 }}>{i + 1}</div>
            <span style={{ fontFamily: body, fontSize: fitText(p, 46, 38, 32), lineHeight: 1.3 }}>{p}</span>
          </div>
        </Up>
      ))}
    </div>
  </Frame>
);

const OutroScene: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 26 });
  return (
    <Frame>
      <div style={{ alignItems: "center", textAlign: "center", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.85 + pop * 0.15})` }}>
          <HexMark size={150} glow />
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 76, marginTop: 26 }}>
            Code<span style={{ color: C.neon }}>Tier</span>
          </div>
          <Up d={16}>
            <div style={{ fontFamily: body, fontSize: 40, color: C.dim, marginTop: 14 }}>{cta}</div>
          </Up>
        </div>
      </div>
    </Frame>
  );
};

export const TheoryVideo: React.FC<TheoryProps> = (props) => {
  const { module, title, concept, analogy, code, codeOutput, cta } = props;
  const s = computeScenes(props);
  return (
    <AbsoluteFill>
      <Backdrop />
      <Series>
        <Series.Sequence durationInFrames={s.intro}>
          <IntroScene module={module} title={title} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={s.concept}>
          <TextScene tag="O que acontece" text={concept} />
        </Series.Sequence>
        {s.hasAnalogy && (
          <Series.Sequence durationInFrames={s.analogy}>
            <AnalogyScene text={analogy} />
          </Series.Sequence>
        )}
        {s.hasCode && (
          <Series.Sequence durationInFrames={s.code}>
            <CodeScene code={code} output={codeOutput} typingFrames={s.typing} hasOutput={s.hasOutput} />
          </Series.Sequence>
        )}
        {s.hasPoints && (
          <Series.Sequence durationInFrames={s.points}>
            <PointsScene points={s.pointsList} />
          </Series.Sequence>
        )}
        <Series.Sequence durationInFrames={s.outro}>
          <OutroScene cta={cta} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
