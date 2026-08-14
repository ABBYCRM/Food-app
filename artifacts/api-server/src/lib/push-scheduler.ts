/**
 * Daily push-notification scheduler.
 *
 * Every minute we check whether it is 19:00 UTC.  When it is, we fetch all
 * push subscriptions, look at each user's stored meal plan, find tomorrow's
 * meals, and send one notification per meal slot.
 *
 * Notification format:
 *   Title : "Tomorrow's [Breakfast | Lunch | Dinner | Snack] 🍽"
 *   Body  : "Miso-Mole Short Rib Tacos"
 *   Data  : { url: "/recipe/<slug>" }
 */
import webpush from "web-push";
import { db, pushSubscriptions } from "@workspace/db";
import type { Logger } from "pino";

const SLOT_EMOJI: Record<string, string> = {
  breakfast: "☀️",
  lunch:     "🥗",
  dinner:    "🌙",
  snack:     "🍵",
};

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
] as const;

/** Returns the weekday name for tomorrow (UTC). */
function tomorrowDayName(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return DAYS[d.getUTCDay()];
}

async function sendDailyReminders(log: Logger) {
  const tomorrow = tomorrowDayName();
  log.info({ tomorrow }, "push-scheduler: sending daily reminders");

  let rows: Awaited<ReturnType<typeof db.select>>; 
  try {
    rows = await db.select().from(pushSubscriptions);
  } catch (err) {
    log.error({ err }, "push-scheduler: failed to fetch subscriptions");
    return;
  }

  for (const row of rows) {
    const dayPlan = (row.mealPlan as Record<string, Record<string, string>>)[tomorrow] ?? {};
    const slots = Object.entries(dayPlan); // [["breakfast","slug"], ...]

    for (const [slot, slug] of slots) {
      const emoji  = SLOT_EMOJI[slot] ?? "🍽";
      const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1);
      const title  = `Tomorrow's ${slotLabel} ${emoji}`;
      const body   = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const url    = `/recipe/${slug}`;

      const pushPayload = JSON.stringify({ title, body, url });
      const pushSub = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      };

      try {
        await webpush.sendNotification(pushSub, pushPayload);
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        // 410 = subscription expired / unsubscribed — clean it up
        if (status === 410 || status === 404) {
          await db.delete(pushSubscriptions)
            .where((t: typeof pushSubscriptions) => t.endpoint === row.endpoint);
          log.info({ endpoint: row.endpoint }, "push-scheduler: removed stale subscription");
        } else {
          log.warn({ err, endpoint: row.endpoint }, "push-scheduler: send failed");
        }
      }
    }
  }
}

let lastSentDate = "";

/** Call once at server start. Fires reminders at 19:00 UTC every day. */
export function startPushScheduler(log: Logger) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    log.warn("push-scheduler: VAPID keys not set — scheduler disabled");
    return;
  }

  setInterval(() => {
    const now = new Date();
    const hh   = now.getUTCHours();
    const mm   = now.getUTCMinutes();
    const date = now.toISOString().slice(0, 10);

    if (hh === 19 && mm === 0 && date !== lastSentDate) {
      lastSentDate = date;
      sendDailyReminders(log).catch(err => log.error({ err }, "push-scheduler: unexpected error"));
    }
  }, 60_000); // check every minute

  log.info("push-scheduler: started (fires at 19:00 UTC)");
}
