import { randomUUID } from "node:crypto";

function first(rows) {
  return rows[0] ?? null;
}

function asDate(value) {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
}

function asJson(value) {
  if (typeof value === "string") return JSON.parse(value);
  return value;
}

function userFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    oidcIssuer: row.oidc_issuer,
    oidcSubject: row.oidc_subject,
    email: row.email,
    displayName: row.display_name,
    createdAt: asDate(row.created_at),
    updatedAt: asDate(row.updated_at),
  };
}

function sessionFromRow(row) {
  if (!row) return null;
  return {
    idHash: row.id_hash,
    userId: row.user_id,
    accessTokenCiphertext: row.access_token_ciphertext,
    refreshTokenCiphertext: row.refresh_token_ciphertext,
    idTokenCiphertext: row.id_token_ciphertext,
    providerExpiresAt: asDate(row.provider_expires_at),
    expiresAt: asDate(row.expires_at),
    createdAt: asDate(row.created_at),
  };
}

function subscriptionFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    trialStartedAt: asDate(row.trial_started_at),
    trialEndsAt: asDate(row.trial_ends_at),
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    pendingCheckoutSessionId: row.pending_checkout_session_id,
    pendingCheckoutExpiresAt: asDate(row.pending_checkout_expires_at),
    currentPeriodEnd: asDate(row.current_period_end),
    createdAt: asDate(row.created_at),
    updatedAt: asDate(row.updated_at),
  };
}

function recipeFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    story: row.story,
    ingredients: asJson(row.ingredients),
    method: asJson(row.method),
    serves: row.serves,
    minutes: row.minutes,
    forkedFrom: row.forked_from ?? undefined,
    createdAt: asDate(row.created_at)?.getTime() ?? Date.now(),
  };
}

const recipeColumns = `
  id, title, subtitle, story, ingredients, method, serves, minutes, forked_from, created_at
`;

export function tenantCacheKey(userId, namespace, resourceId = "collection") {
  if (!userId || !namespace || !resourceId) throw new Error("Tenant cache keys require user, namespace, and resource");
  return `user:${userId}:${namespace}:${resourceId}`;
}

export function createRepositories(db) {
  return Object.freeze({
    async upsertVerifiedOidcUser({ issuer, subject, email, displayName, now = new Date() }) {
      const id = randomUUID();
      const rows = await db.query(`
        INSERT INTO users (id, oidc_issuer, oidc_subject, email, display_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $6)
        ON CONFLICT (oidc_issuer, oidc_subject) DO UPDATE SET
          email = EXCLUDED.email,
          display_name = EXCLUDED.display_name,
          updated_at = EXCLUDED.updated_at
        RETURNING *
      `, [id, issuer, subject, email, displayName, now]);
      return userFromRow(first(rows));
    },

    async getUserById(userId) {
      const rows = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
      return userFromRow(first(rows));
    },

    async createSession({
      idHash, userId, accessTokenCiphertext, refreshTokenCiphertext, idTokenCiphertext,
      providerExpiresAt, expiresAt, now = new Date(),
    }) {
      await db.query("DELETE FROM sessions WHERE expires_at <= $1", [now]);
      await db.query(`
        INSERT INTO sessions (
          id_hash, user_id, access_token_ciphertext, refresh_token_ciphertext,
          id_token_ciphertext, provider_expires_at, expires_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
      `, [
        idHash, userId, accessTokenCiphertext, refreshTokenCiphertext, idTokenCiphertext,
        providerExpiresAt, expiresAt, now,
      ]);
    },

    async getSessionByHash(idHash) {
      const rows = await db.query("SELECT * FROM sessions WHERE id_hash = $1", [idHash]);
      return sessionFromRow(first(rows));
    },

    async updateSessionTokensForUser({
      idHash, userId, accessTokenCiphertext, refreshTokenCiphertext,
      idTokenCiphertext, providerExpiresAt, now = new Date(),
    }) {
      const rows = await db.query(`
        UPDATE sessions SET
          access_token_ciphertext = $3,
          refresh_token_ciphertext = $4,
          id_token_ciphertext = $5,
          provider_expires_at = $6,
          updated_at = $7
        WHERE id_hash = $1 AND user_id = $2
        RETURNING id_hash
      `, [
        idHash, userId, accessTokenCiphertext, refreshTokenCiphertext,
        idTokenCiphertext, providerExpiresAt, now,
      ]);
      return rows.length === 1;
    },

    async revokeSession(idHash) {
      const rows = await db.query("DELETE FROM sessions WHERE id_hash = $1 RETURNING id_hash", [idHash]);
      return rows.length === 1;
    },

    async revokeSessionForUser(idHash, userId) {
      const rows = await db.query(
        "DELETE FROM sessions WHERE id_hash = $1 AND user_id = $2 RETURNING id_hash",
        [idHash, userId],
      );
      return rows.length === 1;
    },

    async createOidcAttempt({ idHash, stateHash, pkceVerifierCiphertext, nonce, returnTo, expiresAt, now = new Date() }) {
      await db.query("DELETE FROM oidc_login_attempts WHERE expires_at <= $1", [now]);
      await db.query(`
        INSERT INTO oidc_login_attempts (
          id_hash, state_hash, pkce_verifier_ciphertext, nonce, return_to, expires_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [idHash, stateHash, pkceVerifierCiphertext, nonce, returnTo, expiresAt, now]);
    },

    async consumeOidcAttempt(idHash, stateHash, now = new Date()) {
      const rows = await db.query(`
        DELETE FROM oidc_login_attempts
        WHERE id_hash = $1 AND state_hash = $2 AND expires_at > $3
        RETURNING *
      `, [idHash, stateHash, now]);
      const row = first(rows);
      return row ? {
        idHash: row.id_hash,
        pkceVerifierCiphertext: row.pkce_verifier_ciphertext,
        nonce: row.nonce,
        returnTo: row.return_to,
        expiresAt: asDate(row.expires_at),
      } : null;
    },

    async ensureTrialForUser(userId, { trialDays, now = new Date() }) {
      const id = randomUUID();
      const trialEndsAt = new Date(now.getTime() + trialDays * 86_400_000);
      const rows = await db.query(`
        INSERT INTO subscriptions (
          id, user_id, status, trial_started_at, trial_ends_at, created_at, updated_at
        ) VALUES ($1, $2, 'trialing', $3, $4, $3, $3)
        ON CONFLICT (user_id) DO UPDATE SET user_id = subscriptions.user_id
        RETURNING *
      `, [id, userId, now, trialEndsAt]);
      return subscriptionFromRow(first(rows));
    },

    async getSubscriptionForUser(userId) {
      const rows = await db.query("SELECT * FROM subscriptions WHERE user_id = $1", [userId]);
      return subscriptionFromRow(first(rows));
    },

    async setStripeCustomerForUser(userId, stripeCustomerId, now = new Date()) {
      const rows = await db.query(`
        UPDATE subscriptions
        SET stripe_customer_id = $2, updated_at = $3
        WHERE user_id = $1
          AND (stripe_customer_id IS NULL OR stripe_customer_id = $2)
        RETURNING *
      `, [userId, stripeCustomerId, now]);
      return subscriptionFromRow(first(rows));
    },

    async setPendingCheckoutForUser(userId, sessionId, expiresAt, now = new Date()) {
      const rows = await db.query(`
        UPDATE subscriptions
        SET pending_checkout_session_id = $2,
            pending_checkout_expires_at = $3,
            updated_at = $4
        WHERE user_id = $1
        RETURNING *
      `, [userId, sessionId, expiresAt, now]);
      return subscriptionFromRow(first(rows));
    },

    async updateSubscriptionForUser(userId, {
      status, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd, now = new Date(),
    }) {
      const rows = await db.query(`
        UPDATE subscriptions SET
          status = $2,
          stripe_customer_id = COALESCE($3, stripe_customer_id),
          stripe_subscription_id = COALESCE($4, stripe_subscription_id),
          current_period_end = $5,
          pending_checkout_session_id = NULL,
          pending_checkout_expires_at = NULL,
          updated_at = $6
        WHERE user_id = $1
        RETURNING *
      `, [userId, status, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd, now]);
      return subscriptionFromRow(first(rows));
    },

    async getSubscriptionByStripeCustomer(stripeCustomerId) {
      const rows = await db.query("SELECT * FROM subscriptions WHERE stripe_customer_id = $1", [stripeCustomerId]);
      return subscriptionFromRow(first(rows));
    },

    async updateSubscriptionByVerifiedStripeCustomer(stripeCustomerId, {
      status, stripeSubscriptionId, currentPeriodEnd, now = new Date(),
    }) {
      const rows = await db.query(`
        UPDATE subscriptions SET
          status = $2,
          stripe_subscription_id = COALESCE($3, stripe_subscription_id),
          current_period_end = $4,
          pending_checkout_session_id = NULL,
          pending_checkout_expires_at = NULL,
          updated_at = $5
        WHERE stripe_customer_id = $1
        RETURNING *
      `, [stripeCustomerId, status, stripeSubscriptionId, currentPeriodEnd, now]);
      return subscriptionFromRow(first(rows));
    },

    async claimStripeEvent(eventId, eventType, now = new Date()) {
      const rows = await db.query(`
        INSERT INTO stripe_events (id, event_type, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET
          event_type = EXCLUDED.event_type,
          created_at = EXCLUDED.created_at
        WHERE stripe_events.processed_at IS NULL
          AND stripe_events.created_at < EXCLUDED.created_at - INTERVAL '5 minutes'
        RETURNING id
      `, [eventId, eventType, now]);
      return rows.length === 1;
    },

    async completeStripeEvent(eventId, now = new Date()) {
      await db.query("UPDATE stripe_events SET processed_at = $2 WHERE id = $1", [eventId, now]);
    },

    async releaseStripeEvent(eventId) {
      await db.query("DELETE FROM stripe_events WHERE id = $1 AND processed_at IS NULL", [eventId]);
    },

    async getWorkspaceForUser(userId) {
      const rows = await db.query(
        "SELECT document, version, updated_at FROM user_workspaces WHERE user_id = $1",
        [userId],
      );
      const row = first(rows);
      return row ? { document: asJson(row.document), version: Number(row.version), updatedAt: asDate(row.updated_at) } : null;
    },

    async putWorkspaceForUser(userId, document, now = new Date()) {
      const rows = await db.query(`
        INSERT INTO user_workspaces (user_id, document, version, updated_at)
        VALUES ($1, $2::jsonb, 1, $3)
        ON CONFLICT (user_id) DO UPDATE SET
          document = EXCLUDED.document,
          version = user_workspaces.version + 1,
          updated_at = EXCLUDED.updated_at
        WHERE user_workspaces.user_id = $1
        RETURNING document, version, updated_at
      `, [userId, JSON.stringify(document), now]);
      const row = first(rows);
      return { document: asJson(row.document), version: Number(row.version), updatedAt: asDate(row.updated_at) };
    },

    async listRecipesForUser(userId) {
      const rows = await db.query(`
        SELECT ${recipeColumns}
        FROM user_recipes
        WHERE user_id = $1
        ORDER BY created_at DESC, id DESC
      `, [userId]);
      return rows.map(recipeFromRow);
    },

    async getRecipeForUser(userId, recipeId) {
      const rows = await db.query(`
        SELECT ${recipeColumns}
        FROM user_recipes
        WHERE id = $2 AND user_id = $1
      `, [userId, recipeId]);
      return recipeFromRow(first(rows));
    },

    async createRecipeForUser(userId, recipe, now = new Date()) {
      const id = randomUUID();
      const rows = await db.query(`
        INSERT INTO user_recipes (
          id, user_id, title, subtitle, story, ingredients, method,
          serves, minutes, forked_from, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10, $11, $11)
        RETURNING ${recipeColumns}
      `, [
        id, userId, recipe.title, recipe.subtitle, recipe.story,
        JSON.stringify(recipe.ingredients), JSON.stringify(recipe.method),
        recipe.serves, recipe.minutes, recipe.forkedFrom ?? null, now,
      ]);
      return recipeFromRow(first(rows));
    },

    async updateRecipeForUser(userId, recipeId, changes, now = new Date()) {
      const allowed = ["title", "subtitle", "story", "ingredients", "method", "serves", "minutes", "forkedFrom"];
      const columns = {
        title: "title", subtitle: "subtitle", story: "story", ingredients: "ingredients",
        method: "method", serves: "serves", minutes: "minutes", forkedFrom: "forked_from",
      };
      const assignments = [];
      const params = [userId, recipeId];
      for (const key of allowed) {
        if (!Object.prototype.hasOwnProperty.call(changes, key)) continue;
        const value = key === "ingredients" || key === "method" ? JSON.stringify(changes[key]) : changes[key];
        params.push(value ?? null);
        assignments.push(`${columns[key]} = $${params.length}${key === "ingredients" || key === "method" ? "::jsonb" : ""}`);
      }
      if (assignments.length === 0) return this.getRecipeForUser(userId, recipeId);
      params.push(now);
      assignments.push(`updated_at = $${params.length}`);
      const rows = await db.query(`
        UPDATE user_recipes
        SET ${assignments.join(", ")}
        WHERE user_id = $1 AND id = $2
        RETURNING ${recipeColumns}
      `, params);
      return recipeFromRow(first(rows));
    },

    async deleteRecipeForUser(userId, recipeId) {
      const rows = await db.query(`
        DELETE FROM user_recipes
        WHERE user_id = $1 AND id = $2
        RETURNING id
      `, [userId, recipeId]);
      return rows.length === 1;
    },

    async exportDataForUser(userId) {
      const [workspace, recipes] = await Promise.all([
        this.getWorkspaceForUser(userId),
        this.listRecipesForUser(userId),
      ]);
      return { workspace: workspace?.document ?? null, recipes };
    },

    async importDataForUser(userId, { workspace, recipes }, now = new Date()) {
      return db.transaction(async (transaction) => {
        const scoped = createRepositories(transaction);
        await scoped.putWorkspaceForUser(userId, workspace, now);
        await transaction.query("DELETE FROM user_recipes WHERE user_id = $1", [userId]);
        for (const recipe of recipes) {
          await scoped.createRecipeForUser(userId, recipe, now);
        }
        return scoped.exportDataForUser(userId);
      });
    },

    async recordAffiliateClickForUser(userId, { vendor, destinationHost, itemCount }, now = new Date()) {
      const id = randomUUID();
      await db.query(`
        INSERT INTO affiliate_clicks (id, user_id, vendor, destination_host, item_count, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [id, userId, vendor, destinationHost, itemCount, now]);
      return id;
    },

    async getInstacartLinkForUser(userId, requestHash, now = new Date()) {
      const rows = await db.query(`
        SELECT destination_url
        FROM instacart_links
        WHERE user_id = $1 AND request_hash = $2 AND expires_at > $3
      `, [userId, requestHash, now]);
      return first(rows)?.destination_url ?? null;
    },

    async putInstacartLinkForUser(userId, requestHash, destinationUrl, expiresAt, now = new Date()) {
      const id = randomUUID();
      await db.query(
        "DELETE FROM instacart_links WHERE user_id = $1 AND expires_at <= $2",
        [userId, now],
      );
      const rows = await db.query(`
        INSERT INTO instacart_links (
          id, user_id, request_hash, destination_url, expires_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $6)
        ON CONFLICT (user_id, request_hash) DO UPDATE SET
          destination_url = EXCLUDED.destination_url,
          expires_at = EXCLUDED.expires_at,
          updated_at = EXCLUDED.updated_at
        WHERE instacart_links.user_id = $2
        RETURNING destination_url
      `, [id, userId, requestHash, destinationUrl, expiresAt, now]);
      return first(rows)?.destination_url ?? null;
    },
  });
}
