#!/usr/bin/env node
/* ก๊อป tokens.css จาก design system ของ Maintain-D แล้วสร้าง Tailwind theme (src/styles/theme.css) จากชื่อ token
   แหล่งความจริง: Maintenance-Request-Form/design-system/tokens.css (ค่าตรงไลบรารี (Component) VMS Plus)
   รัน: npm run sync-tokens [-- <path tokens.css>]  ห้ามแก้ src/styles/tokens.css และ theme.css มือ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.argv[2] || path.join(ROOT, "..", "Maintenance-Request", "Maintenance-Request-Form", "design-system", "tokens.css");
const css = fs.readFileSync(SRC, "utf8");
fs.writeFileSync(path.join(ROOT, "src/styles/tokens.css"),
  "/* ก๊อปจาก Maintenance-Request-Form/design-system/tokens.css ด้วย npm run sync-tokens — ห้ามแก้มือ */\n" + css);

const names = [...new Set([...css.matchAll(/^\s*--([a-z0-9-]+)\s*:/gm)].map((m) => m[1]))];
const COLOR = /^(brand|gray|success|warning|error|info|primary|secondary|chart|badge|purple)-/;
const colors = names.filter((n) => COLOR.test(n));
const theme = `/* สร้างจาก tokens.css ด้วย scripts/sync-tokens.mjs — ห้ามแก้มือ
   utility เช่น bg-brand-900 = var(--brand-900) · ล้าง palette/ขนาด/รัศมี/เงาตั้งต้นของ Tailwind ทิ้ง ใช้ได้เฉพาะค่าจาก token */
@theme inline {
  --color-*: initial;
  --color-white: #fff;
  --color-black: #000;
  --color-transparent: transparent;
  --color-current: currentColor;
${colors.map((n) => `  --color-${n}: var(--${n});`).join("\n")}
  /* ชื่อเชิงความหมายตั้งใหม่ กัน var อ้างตัวเอง: ink = --color-text-* · line = --color-border-primary */
  --color-ink: var(--color-text-primary);
  --color-ink-2: var(--color-text-secondary);
  --color-ink-3: var(--color-text-tertiary);
  --color-line: var(--color-border-primary);
  --color-disabled-bg: var(--color-bg-disabled);
  --color-disabled-fg: var(--color-fg-disabled);
  /* พื้นหลังทึบของ Background overlay (Variable Color/background/overlay · #000000 40%) — bg-overlay */
  --color-overlay: var(--overlay);

  /* ตัวอักษร: สเกล 12/14/16 ของไลบรารี + หัวข้อ */
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

  /* รัศมี */
  --radius-*: initial;
  --radius-xs: var(--rounded-xs);
  --radius-sm: var(--rounded-sm);
  --radius-md: var(--rounded-md);
  --radius-lg: var(--rounded-lg);
  --radius-xl: var(--r-lg);
  --radius-pill: var(--r-pill);
  --radius-sheet: 24px;

  /* เงา (ตั้งชื่อใหม่ กันชน --shadow-xs ของ tokens) */
  --shadow-*: initial;
  --shadow-field: var(--shadow-xs);
  --shadow-float: var(--shadow-pop);
  --shadow-shell: var(--shadow-app);
  --shadow-lg-lib: var(--shadow-lg);   /* ไลบรารี Dropdown menu · Dropdown list · Notification (y12 blur16 spread-4 #10182814) */
  /* วงโฟกัสของไลบรารี (effect DROP_SHADOW spread 4 ไม่เบลอ ความทึบ 12%): brand-900 · gray-500 (ปุ่มรอง Checkbox/Radio ไม่เลือก) · error-600
     สีจาก token + ความทึบ 12% จาก effect ในดัมป์ — token --focus-ring/--focus-ring-error เป็น .24 (ประมาณ) ไม่ตรงไลบรารี ดู figma-spec/COMPOSED.md ข. */
  --shadow-ring: 0 0 0 4px color-mix(in srgb, var(--brand-900) 12%, transparent);
  --shadow-ring-gray: 0 0 0 4px color-mix(in srgb, var(--gray-500) 12%, transparent);
  --shadow-ring-error: 0 0 0 4px color-mix(in srgb, var(--error-600) 12%, transparent);

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
