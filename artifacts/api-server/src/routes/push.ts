/**
 * Push-notification routes.
 *
 * GET  /api/push/vapid-public-key  → return VAPID public key for the browser
 * POST /api/push/subscribe         → upsert a push subscription + initial meal plan
 * POST /api/push/sync              → update meal plan for an existing subscription
 * DELETE /api/push/unsubscribe     → remove a subscription
 */
import { Router } from "express";
import webpush from "web-push";
import { z } from "zod/v4";
import { db, pushSubscriptions } from "@workspace/db";
import { eq } from "drizzle-orm";

// ── VAPID setup ───────────────────────────────────────────────────────────────

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY  ?? "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? "";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(
    "mailto:hello@mestizo-umami.com",
    VAPID_PUBLIC,
    VAPID_PRIVATE,
  );
}

// ── Zod schemas ───────────────────────────────────────────────────────────────

const SubscribeBody = z.object({
  subscription: z.object({
    endpoint: z.url(),
    keys: z.object({
      p256dh: z.string().min(1),
      auth:   z.string().min(1),
    }),
  }),
  mealPlan: z.record(z.string(), z.record(z.string(), z.string())).optional().default({}),
});

const SyncBody = z.object({
  endpoint: z.url(),
  mealPlan: z.record(z.string(), z.record(z.string(), z.string())),
});

const UnsubBody = z.object({ endpoint: z.url() });

// ── Router ────────────────────────────────────────────────────────────────────

const router = Router();

/** Return VAPID public key so the browser can build the PushSubscription. */
router.get("/push/vapid-public-key", (_req, res) => {
  if (!VAPID_PUBLIC) {
    res.status(503).json({ error: "Push not configured" });
    return;
  }
  res.json({ publicKey: VAPID_PUBLIC });
});

/** Upsert subscription + initial meal plan snapshot. */
router.post("/push/subscribe", async (req, res) => {
  const parsed = SubscribeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const { subscription, mealPlan } = parsed.data;
  await db
    .insert(pushSubscriptions)
    .values({
      endpoint: subscription.endpoint,
      p256dh:   subscription.keys.p256dh,
      auth:     subscription.keys.auth,
      mealPlan,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        p256dh:    subscription.keys.p256dh,
        auth:      subscription.keys.auth,
        mealPlan,
        updatedAt: new Date(),
      },
    });

  res.json({ ok: true });
});

/** Keep the server-side meal plan snapshot in sync as the user edits the planner. */
router.post("/push/sync", async (req, res) => {
  const parsed = SyncBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  await db
    .update(pushSubscriptions)
    .set({ mealPlan: parsed.data.mealPlan, updatedAt: new Date() })
    .where(eq(pushSubscriptions.endpoint, parsed.data.endpoint));

  res.json({ ok: true });
});

/** Remove subscription from DB and stop future notifications. */
router.delete("/push/unsubscribe", async (req, res) => {
  const parsed = UnsubBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, parsed.data.endpoint));

  res.json({ ok: true });
});

// ── Exported helper used by the scheduler ─────────────────────────────────────

export { webpush };
export default router;
