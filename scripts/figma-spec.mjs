#!/usr/bin/env node
/* ดึงสเปกรายตัวของ component ที่ต้นแบบใช้ จากดัมป์ไฟล์ Figma "(Component) VMS Plus" (VmOC07pKEsDkHZagOgcSU2)
   ต้นทาง: Maintenance-Request-Form/design-system/.figma-extract/component/*.json (ดัมป์ด้วยปลั๊กอิน figma-export/dump-plugin)
   ผลลัพธ์: figma-spec/<ชื่อ component>.json (ทุก variant: กว้าง สูง padding gap รัศมี พื้น ขอบ ฟอนต์ ลูก) + figma-spec/INDEX.md
   รัน: npm run figma-spec [-- <โฟลเดอร์ดัมป์>] · component React ทุกตัวต้องอ้างค่าจากไฟล์เหล่านี้ (ดู CLAUDE.md) */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = process.argv[2] || path.join(ROOT, "..", "Maintenance-Request", "Maintenance-Request-Form", "design-system", ".figma-extract", "component");
const WANT = JSON.parse(fs.readFileSync(path.join(ROOT, "figma-spec", "components.json"), "utf8")).components;

const files = fs.readdirSync(DIR).filter((f) => /^\d+-\d+\.json$/.test(f));
const pages = JSON.parse(fs.readFileSync(path.join(DIR, "00-pages.json"), "utf8"));
const pageName = (f) => { const id = f.replace(".json", "").replace("-", ":"); const p = (Array.isArray(pages) ? pages : pages.pages || []).find((x) => (x.id || x.node) === id); return p ? p.name.replace(/^\s*↳\s*/, "").trim() : id; };

function slim(n, d) {   // เก็บเฉพาะค่าที่ใช้ทำ UI
  const o = {};
  for (const k of ["name", "type", "w", "h", "pl", "pr", "pt", "pb", "gap", "r", "dir", "align", "fill", "stroke", "sw", "font", "text", "visible", "opacity", "effects", "variant"]) if (n[k] !== undefined) o[k] = n[k];
  if (n.component) o.component = n.component.name + (n.component.variant ? " [" + n.component.variant + "]" : "");
  if (n.kids && d < 4) o.kids = n.kids.map((k) => slim(k, d + 1));
  return o;
}
const index = [];
for (const name of WANT) {
  let hit = null, from = null;
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
    const s = (j.sets || []).find((x) => x.name === name && (x.type === "COMPONENT_SET" || x.type === "COMPONENT"));
    if (s) { hit = s; from = f; break; }
  }
  if (!hit) { index.push(`| ${name} | ✗ ไม่พบในดัมป์ | — |`); continue; }
  const out = { component: name, page: pageName(from), node: from.replace(".json", "").replace("-", ":"), props: hit.props || {}, variants: (hit.type === "COMPONENT_SET" ? hit.kids || [] : [hit]).filter((k) => k.type === "COMPONENT").map((k) => slim(k, 0)) };
  fs.writeFileSync(path.join(ROOT, "figma-spec", name.replace(/[\/\\]/g, "_") + ".json"), JSON.stringify(out, null, 1));
  index.push(`| ${name} | ${out.page} (${out.node}) | ${out.variants.length} |`);
}
fs.writeFileSync(path.join(ROOT, "figma-spec", "INDEX.md"),
  "# สเปก component จากไฟล์ Figma (Component) VMS Plus\n\nสร้างด้วย `npm run figma-spec` ห้ามแก้มือ · รายชื่อที่ดึงอยู่ใน `components.json`\n\n| component | หน้าในไฟล์ Component (node) | variant |\n|---|---|---|\n" + index.join("\n") + "\n");
console.log(index.filter((l) => l.includes("✗")).join("\n") || "ครบ " + WANT.length + " ตัว");
