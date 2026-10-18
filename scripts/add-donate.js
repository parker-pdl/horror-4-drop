// Run after `npx expo export -p web`: adds the Parker Data Link donate banner
// to every exported page. (pdl-donate.js itself is copied from public/.)
const fs = require("fs"), path = require("path");
const dist = path.join(__dirname, "..", "dist");
for (const f of fs.readdirSync(dist).filter((n) => n.endsWith(".html"))) {
  const p = path.join(dist, f);
  let t = fs.readFileSync(p, "utf8");
  if (t.includes("pdl-donate.js")) continue;
  t = t.replace(/<\/body>/i, '<script src="/pdl-donate.js" data-mode="float" defer></script></body>');
  fs.writeFileSync(p, t);
}
