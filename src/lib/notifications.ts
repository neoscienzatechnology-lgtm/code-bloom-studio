// Lembrete diário de sequência (apenas no app Android; no-op na web).
//
// A permissão de notificação é pedida UMA vez, no momento certo: logo após
// o aluno concluir uma lição (contexto de valor), nunca na abertura do app.
// Se negar, não insistimos. A cada lição concluída o lembrete é reagendado
// para as 19h30 com a sequência atual na mensagem.

import { Capacitor } from "@capacitor/core";
import { readJson, writeJson, STORAGE_KEYS } from "@/lib/storage";

const REMINDER_ID = 7301;

interface ReminderState {
  permissionAsked: boolean;
}

export async function scheduleStreakReminder(streak: number): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");

    let permission = await LocalNotifications.checkPermissions();
    if (permission.display !== "granted") {
      const state = readJson<ReminderState>(STORAGE_KEYS.reminder, { permissionAsked: false });
      if (state.permissionAsked) return;
      writeJson(STORAGE_KEYS.reminder, { permissionAsked: true });
      permission = await LocalNotifications.requestPermissions();
      if (permission.display !== "granted") return;
    }

    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: streak >= 2 ? `🔥 Sequência de ${streak} dias em risco!` : "🦫 A Capy está esperando",
          body:
            streak >= 2
              ? "Cinco minutos hoje mantêm sua sequência viva."
              : "Uma lição curta hoje e seu ritmo continua.",
          schedule: { on: { hour: 19, minute: 30 } },
        },
      ],
    });
  } catch {
    /* lembrete é best-effort */
  }
}
