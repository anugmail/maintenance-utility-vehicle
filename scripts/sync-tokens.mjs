#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.argv[2] || path.join(ROOT, "..", "Maintenance-Request", "Maintenance-Request-Form", "design-system", "tokens.css");
const css = fs.readFileSync(SRC, "utf8");
const bare = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "");
fs.writeFileSync(path.join(ROOT, "src/styles/tokens.css"), bare(css));

const names = [...new Set([...css.matchAll(/^\s*--([a-z0-9-]+)\s*:/gm)].map((m) => m[1]))];
const COLOR = /^(brand|gray|success|warning|error|info|primary|secondary|chart|badge|purple)-/;
const colors = names.filter((n) => COLOR.test(n));
const theme = `@theme inline {
  --color-*: initial;
  --color-white: #fff;
  --color-black: #000;
  --color-transparent: transparent;
  --color-current: currentColor;
${colors.map((n) => `  --color-${n}: var(--${n});`).join("\n")}
  --color-ink: var(--color-text-primary);
  --color-ink-2: var(--color-text-secondary);
  --color-ink-3: var(--color-text-tertiary);
  --color-line: var(--color-border-primary);
  --color-disabled-bg: var(--color-bg-disabled);
  --color-disabled-fg: var(--color-fg-disabled);
  --color-overlay: var(--overlay);

  --text-*: initial;
  --text-xs: var(--fs-text-xs);
  --text-xs--line-height: 18px;
  --text-sm: var(--fs-text-sm);
  --text-sm--line-height: 20px;
  --text-md: var(--fs-text-md);
  --text-md--line-height: 24px;
  --text-lg: 20px;
  --text-lg--line-height: 30px;
  --text-xl: 24px;
  --text-xl--line-height: 36px;
  --text-title: 32px;
  --text-title--line-height: 48px;
  --text-title-m: 22px;
  --text-title-m--line-height: 32px;

  --radius-*: initial;
  --radius-xs: var(--rounded-xs);
  --radius-sm: var(--rounded-sm);
  --radius-md: var(--rounded-md);
  --radius-lg: var(--rounded-lg);
  --radius-xl: var(--r-lg);
  --radius-pill: var(--r-pill);
  --radius-sheet: 24px;

  --shadow-*: initial;
  --shadow-field: var(--shadow-xs);
  --shadow-float: var(--shadow-pop);
  --shadow-shell: var(--shadow-app);
  --shadow-lg-lib: var(--shadow-lg);
  --shadow-ring: 0 0 0 4px var(--focus-ring);
  --shadow-ring-gray: 0 0 0 4px var(--focus-ring-gray);
  --shadow-ring-error: 0 0 0 4px var(--focus-ring-error);

  --animate-sheet-up: sheet-up 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  --animate-fade-in: fade-in 0.2s ease-out;
  @keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
}
@theme {
  --font-*: initial;
  --font-sans: var(--font);
}
`;
fs.writeFileSync(path.join(ROOT, "src/styles/theme.css"), theme);
console.log("tokens: " + names.length + " ชื่อ · สี " + colors.length + " ตัว จาก " + SRC);
