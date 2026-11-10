// Runs before every request on Cloudflare Pages.
// The site is deployed from the repo root, so internal notes (CLAUDE.md, plans,
// spec drafts), dotfiles and source folders would otherwise be publicly served.
// Only the public website files get through.

const BLOCKED_PREFIXES = ["/functions/", "/images/source/", "/tools/", "/trust-expo stitch/", "/.claude/"];

// Browser cache lifetimes. Images keep their names, so 30 days; the stylesheet
// URL carries ?v=<hash> (set by tools/stamp-version.js), so it can be cached for a year.
const MONTH = 60 * 60 * 24 * 30;
const YEAR = 60 * 60 * 24 * 365;

function cacheControlFor(url) {
  const path = url.pathname;
  if (path === "/assets/styles.css" && url.searchParams.has("v")) return `public, max-age=${YEAR}, immutable`;
  if (path.startsWith("/images/") || /^\/(favicon\.(ico|svg)|apple-touch-icon\.png|icon-\d+\.png|og-image\.jpg)$/.test(path)) {
    return `public, max-age=${MONTH}`;
  }
  return null;
}

function isBlocked(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname).toLowerCase();
  } catch {
    return true;
  }
  if (path.endsWith(".md") || path.endsWith(".py")) return true;
  if (path.split("/").some((part) => part.startsWith(".") && part !== "." && part !== "..")) return true;
  if (BLOCKED_PREFIXES.some((p) => path.startsWith(p))) return true;
  if (path === "/email_signature.html" || path === "/email_signature") return true;
  return false;
}

const CANONICAL_HOST = "trust-expo.com";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // One canonical address for SEO: www.trust-expo.com -> trust-expo.com
  if (url.hostname === "www." + CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  if (isBlocked(url.pathname)) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
  }

  const response = await next();
  const cacheControl = response.ok ? cacheControlFor(url) : null;
  if (!cacheControl) return response;
  const cached = new Response(response.body, response);
  cached.headers.set("cache-control", cacheControl);
  return cached;
}
