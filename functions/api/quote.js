// Cloudflare Pages Function: POST /api/quote
// Receives the quote form and emails it to sales@ via the Brevo transactional API.
// Required environment variable (Cloudflare Pages > Settings > Variables and Secrets):
//   BREVO_API_KEY  - Brevo API key (type: Secret)
// Optional:
//   QUOTE_TO_EMAIL       - where enquiries go (default sales@trust-expo.com)
//   TURNSTILE_SECRET_KEY - Cloudflare Turnstile secret (type: Secret). When set, every
//                          submission must carry a valid Turnstile token (bot protection).
//   TURNSTILE_SITE_KEY   - Turnstile site key (public), served to the page by /api/form-config

const DEFAULT_TO = "sales@trust-expo.com";
const SENDER = { name: "Trust Expo Website", email: "sales@trust-expo.com" };
const PACKAGES = ["Compact (2.5m²)", "Standard (4m²)", "Premium (6m²)", "Custom size", "Not sure yet"];

const LIMITS = {
  name: 100,
  company: 150,
  email: 200,
  phone: 40,
  event: 150,
  venue: 150,
  dates: 100,
  package: 40,
  standSize: 100,
  message: 3000,
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function clean(value, max) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

// Bots usually post within a second or two of loading the page; people take longer.
const MIN_FILL_MS = 3000;

async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const out = await res.json();
    return out.success === true;
  } catch (err) {
    console.error("Turnstile verify failed", err);
    return false;
  }
}

// "1977-11-10" style answers: every year mentioned is in the past.
function datesLookPast(dates) {
  const years = (dates.match(/\b(?:19|20)\d{2}\b/g) || []).map(Number);
  const thisYear = new Date().getUTCFullYear();
  return years.length > 0 && years.every((y) => y < thisYear);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

async function readBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return await request.json();
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export async function onRequestPost({ request, env }) {
  let raw;
  try {
    raw = await readBody(request);
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (clean(raw.website, 200)) return json({ ok: true });

  // Submitted too fast (or not from our page script at all): pretend success, send nothing.
  const elapsed = Number(raw.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    console.log("Spam dropped: too fast", raw.elapsed);
    return json({ ok: true });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(raw["cf-turnstile-response"], env.TURNSTILE_SECRET_KEY, request.headers.get("CF-Connecting-IP"));
    if (!ok) return json({ ok: false, error: "Security check failed. Please try again, or email sales@trust-expo.com.", retryTurnstile: true }, 403);
  }

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) data[key] = clean(raw[key], max);
  // Match on the first word so encoding differences in "m²" can't drop the choice.
  const firstWord = data.package.split(/\s/)[0].toLowerCase();
  data.package = PACKAGES.find((p) => p.split(/\s/)[0].toLowerCase() === firstWord) || "Not sure yet";

  const errors = {};
  if (!data.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!data.dates) errors.dates = "Please tell us your event dates.";
  else if (datesLookPast(data.dates)) errors.dates = "These dates look like they're in the past. Please check the year.";
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);

  if (!env.BREVO_API_KEY) {
    return json({ ok: false, error: "Form is not configured yet. Please email sales@trust-expo.com." }, 503);
  }

  const rows = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Event / exhibition", data.event],
    ["Venue", data.venue],
    ["Event dates", data.dates],
    ["Package", data.package],
    ["Stand size", data.standSize],
    ["Message", data.message],
  ].filter(([, v]) => v);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="font-family:Arial,sans-serif">New quote request</h2>` +
    `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top"><b>${escapeHtml(k)}</b></td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
      )
      .join("") +
    `</table>`;

  const subjectBits = [data.company || data.name, data.event, data.dates].filter(Boolean).join(" · ");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: env.QUOTE_TO_EMAIL || DEFAULT_TO }],
      replyTo: { email: data.email, name: data.name },
      subject: `Quote request: ${subjectBits}`.slice(0, 200),
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    console.error("Brevo error", res.status, await res.text());
    return json({ ok: false, error: "We couldn't send your request. Please email sales@trust-expo.com." }, 502);
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
