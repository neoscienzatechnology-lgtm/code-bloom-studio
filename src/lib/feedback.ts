// Feedback sensorial dos momentos-chave: sons curtos gerados por WebAudio
// (zero assets, funciona na web e no WebView Android) + vibração no app
// nativo. Tudo best-effort: falha de áudio/vibração nunca quebra o fluxo.
//
// Os sons disparam apenas a partir de interações do usuário (clique em
// Executar/opção), então a política de autoplay não os bloqueia.

import { Capacitor } from "@capacitor/core";

let ctx: AudioContext | null = null;

function audioCtx(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, startAt: number, duration: number, type: OscillatorType, peak: number) {
  const ac = audioCtx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const t = ac.currentTime + startAt;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  } catch {
    /* ignore */
  }
}

async function haptic(kind: "success" | "error" | "light"): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
    if (kind === "light") {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else {
      await Haptics.notification({
        type: kind === "success" ? NotificationType.Success : NotificationType.Error,
      });
    }
  } catch {
    /* ignore */
  }
}

/** Acertou: duas notas subindo + vibração de sucesso. */
export function feedbackCorrect(): void {
  tone(659, 0, 0.12, "sine", 0.11);
  tone(988, 0.09, 0.16, "sine", 0.11);
  void haptic("success");
}

/** Errou: tom grave curto + vibração de erro. Gentil, não punitivo. */
export function feedbackWrong(): void {
  tone(196, 0, 0.18, "triangle", 0.09);
  tone(155, 0.1, 0.2, "triangle", 0.08);
  void haptic("error");
}

/** Celebração: arpejo de quatro notas. */
export function feedbackCelebrate(): void {
  [523, 659, 784, 1047].forEach((freq, index) => tone(freq, index * 0.09, 0.18, "sine", 0.1));
  void haptic("success");
}
