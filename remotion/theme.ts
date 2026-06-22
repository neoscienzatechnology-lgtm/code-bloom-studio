// Paleta/escala CodeTier para os vídeos de teoria (Remotion).
export const C = {
  bg: "#0A0E0C",
  bg2: "#0E1613",
  panel: "rgba(255,255,255,0.035)",
  panelSolid: "#0C1411",
  border: "rgba(77,232,74,0.18)",
  borderSoft: "rgba(255,255,255,0.08)",
  neon: "#4DE84A",
  neon2: "#37D32C",
  neonDeep: "#1C8F2A",
  text: "#EAF2EC",
  dim: "#8DA294",
  mono: "#86F0A8",
} as const;

// pseudo-aleatório determinístico (mesma saída por frame → render estável)
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
