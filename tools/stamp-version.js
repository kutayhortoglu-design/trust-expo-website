// Writes a content hash into the stylesheet URL (styles.css?v=<hash>) in every page,
// so browsers can cache the CSS for a year but still pick up changes immediately.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(root, "assets", "styles.css"));
const hash = crypto.createHash("sha256").update(css).digest("hex").slice(0, 10);

for (const page of ["index.html", "404.html"]) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, "utf8");
  const updated = html.replace(/\/assets\/styles\.css\?v=[^"]*/g, `/assets/styles.css?v=${hash}`);
  fs.writeFileSync(file, updated);
  console.log(`${page}: styles.css?v=${hash}`);
}
