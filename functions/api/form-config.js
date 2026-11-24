// GET /api/form-config: public settings the quote form needs in the browser.
// Only the Turnstile *site* key (public by design) is exposed, never the secret.
export function onRequestGet({ env }) {
  return new Response(JSON.stringify({ turnstileSiteKey: env.TURNSTILE_SITE_KEY || null }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
