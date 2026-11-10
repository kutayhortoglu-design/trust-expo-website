// Runs before every request on Cloudflare Pages.
// The site is deployed from the repo root, so internal notes (CLAUDE.md, plans,
// spec drafts), dotfiles and source folders would otherwise be publicly served.
// Only the public website files get through.

const BLOCKED_PREFIXES = ["/functions/", "/images/source/", "/trust-expo stitch/", "/.claude/"];

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

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (isBlocked(url.pathname)) {
    return new Response("Not found", { status: 404, headers: { "content-type": "text/plain" } });
  }
  return next();
}
