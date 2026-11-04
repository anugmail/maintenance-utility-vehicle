#!/usr/bin/env node
/* ดึงสเปกรายตัวของ component ที่ต้นแบบใช้ จากดัมป์ไฟล์ Figma 2 แหล่ง (CLAUDE.md ข้อ 12)
   - components.json "components" → ไลบรารี "(Component) VMS Plus" (VmOC07pKEsDkHZagOgcSU2) · ดัมป์ slug `component`
   - components.json "maintainD"  → ไฟล์ Figma งานซ่อม "Maintain-D" · ดัมป์ slug `maintain-d`
   ต้นทาง: Maintenance-Request-Form/design-system/.figma-extract/<slug>/*.json (ดัมป์ด้วยปลั๊กอิน figma-export/dump-plugin · รอบ 4 พ.ย. 2569
   มี vars effects paint sws strokeAlign justify sizing visible opacity ระยะ/จัดแนวตัวอักษร และ svg ของ component กราฟิก)
   ผลลัพธ์: figma-spec/<ชื่อ component>.json (ทุก variant) + figma-spec/svg/<ชื่อ>.svg (กราฟิก) + figma-spec/INDEX.md
   รัน: npm run figma-spec [-- <โฟลเดอร์ดัมป์ component> [<โฟลเดอร์ดัมป์ maintain-d>]] · component React ทุกตัวต้องอ้างค่าจากไฟล์เหล่านี้ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTRACT = path.join(ROOT, "..", "Maintenance-Request", "Maintenance-Request-Form", "design-system", ".figma-extract");
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, "figma-spec", "components.json"), "utf8"));
const SOURCES = [
  { key: "component", label: "(Component) VMS Plus", fileKey: "VmOC07pKEsDkHZagOgcSU2", dir: process.argv[2] || path.join(EXTRACT, "component"), want: LIST.components || [], depth: 4 },
  { key: "maintain-d", label: "Maintain-D", fileKey: null, dir: process.argv[3] || path.join(EXTRACT, "maintain-d"), want: LIST.maintainD || [], depth: 6 },
];
const OUT = path.join(ROOT, "figma-spec");
const SVG_DIR = path.join(OUT, "svg");
fs.rmSync(SVG_DIR, { recursive: true, force: true });
const safe = (s) => s.replace(/[\/\\:*?"<>|]/g, "_");

/* เก็บเฉพาะค่าที่ใช้ทำ UI · svg ของ component กราฟิก (ปลายสุด) เขียนแยกเป็นไฟล์ ไม่ฝังใน json */
const KEEP = ["name", "type", "visible", "opacity", "w", "h", "sizing", "pl", "pr", "pt", "pb", "gap", "r", "dir", "justify", "align",
  "fill", "paint", "stroke", "sw", "sws", "strokeAlign", "effects", "vars", "font", "text", "variant"];
function slim(n, d, ctx) {
  const o = {};
  for (const k of KEEP) if (n[k] !== undefined) o[k] = n[k];
  if (n.component) o.component = n.component.name + (n.component.variant ? " [" + n.component.variant + "]" : "");
  if (n.svg && !(n.kids || []).some((k) => k.svg)) {   // ปลายสุดเท่านั้น
    const base = safe(ctx.component + (n.type === "COMPONENT" && n.name !== ctx.component ? "--" + n.name : ""));
    const file = (ctx.used.has(base) ? base + "-" + ctx.used.size : base) + ".svg";
    ctx.used.add(base);
    fs.mkdirSync(SVG_DIR, { recursive: true });
    fs.writeFileSync(path.join(SVG_DIR, file), n.svg);
    o.svg = "svg/" + file;
  }
  if (n.kids && d < ctx.depth) o.kids = n.kids.map((k) => slim(k, d + 1, ctx));
  return o;
}

const index = [], missing = [];
for (const src of SOURCES) {
  if (!src.want.length) continue;
  const files = fs.readdirSync(src.dir).filter((f) => /^\d+-\d+\.json$/.test(f));
  const pagesJ = JSON.parse(fs.readFileSync(path.join(src.dir, "00-pages.json"), "utf8"));
  const pages = Array.isArray(pagesJ) ? pagesJ : pagesJ.pages || [];
  const pageName = (f) => { const id = f.replace(".json", "").replace("-", ":"); const p = pages.find((x) => (x.id || x.node) === id); return p ? p.name.replace(/^\s*↳\s*/, "").trim() : id; };
  const want = new Set(src.want), hits = new Map();   // ชื่อ → { set, file } · COMPONENT_SET มาก่อน COMPONENT · อ่านแต่ละหน้าครั้งเดียว
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(path.join(src.dir, f), "utf8"));
    for (const s of j.sets || []) {
      if (!want.has(s.name) || (s.type !== "COMPONENT_SET" && s.type !== "COMPONENT")) continue;
      const prev = hits.get(s.name);
      if (!prev || (prev.set.type === "COMPONENT" && s.type === "COMPONENT_SET")) hits.set(s.name, { set: s, file: f });
    }
  }
  for (const name of src.want) {
    const h = hits.get(name);
    if (!h) { index.push(`| ${name} | ${src.label} | ✗ ไม่พบในดัมป์ | — |`); missing.push(src.key + ": " + name); continue; }
    const ctx = { component: name, used: new Set(), depth: src.depth };
    const { kids, ...setOnly } = h.set;
    const out = {
      component: name, source: src.label, ...(src.fileKey ? { fileKey: src.fileKey } : {}), page: pageName(h.file), node: h.file.replace(".json", "").replace("-", ":"),
      props: h.set.props || {},
      ...(h.set.type === "COMPONENT_SET" ? { set: slim(setOnly, 0, ctx) } : {}),
      variants: (h.set.type === "COMPONENT_SET" ? kids || [] : [h.set]).filter((k) => k.type === "COMPONENT").map((k) => slim(k, 0, ctx)),
    };
    fs.writeFileSync(path.join(OUT, safe(name) + ".json"), JSON.stringify(out, null, 1));
    index.push(`| ${name} | ${src.label} | ${out.page} (${out.node}) | ${out.variants.length} |`);
  }
}
fs.writeFileSync(path.join(OUT, "INDEX.md"),
  "# สเปก component จากไฟล์ Figma\n\nสร้างด้วย `npm run figma-spec` ห้ามแก้มือ · รายชื่อที่ดึงอยู่ใน `components.json` (`components` = ไลบรารี (Component) VMS Plus · `maintainD` = ไฟล์ Figma งานซ่อม Maintain-D)\n" +
  "ภาพกราฟิก (SVG) ของ component ปลายสุดอยู่ใน `svg/` · ช่อง `vars` = ชื่อ Figma Variable ที่ผูกกับค่า · `sws` = ความหนาเส้นแยกด้าน [บน, ขวา, ล่าง, ซ้าย] (มีเฉพาะเมื่อไม่เท่ากัน) · `paint` = พื้นที่มีความทึบ/gradient/ภาพ\n\n" +
  "| component | ไฟล์ Figma | หน้าในไฟล์ (node) | variant |\n|---|---|---|---|\n" + index.join("\n") + "\n");
console.log(missing.length ? "ไม่พบ:\n" + missing.join("\n") : "ครบ " + SOURCES.reduce((a, s) => a + s.want.length, 0) + " ตัว");
