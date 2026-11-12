/* R80 คำว่า "ยานพาหนะ" แทน "รถ" (เจ้าของงาน 6 พ.ย. 2569 · component-rules.md §5.33 ของรีโป Maintenance-Request-Form)
   _"คำว่า รถ ที่อยู่ใน โปรแกรม อยากให้เปลี่ยนเป็นคำว่า ยานพาหนะ แทน โดยถ้าเป็นข้อมูลที่ดึงมาจาก api จะไม่ต้องแก้ไข แต่ถ้าเป็น คอลัมม์ แล้วมีคำว่ารถ เช่น รถเช่า เปลี่ยนเป็นยานพาหนะเช่า เป็นต้น ไล่แก้ และตั้งเป็นเงื่อนไข ในโปรแกรมให้ด้วย"_
   แบบเดียวกับ checkSourceWording (figma-export/check-component-rules.js) ของปลั๊กอิน Figma: ตรวจข้อความใน string literal / template / JSX text ของ src/ ทุกไฟล์ .ts .tsx
   ข้ามคอมเมนต์ (คำพูดเจ้าของงานในคอมเมนต์คงตามจริง) · ALLOW = ข้อมูลจาก API ที่คงคำว่ารถ + คำที่มี "รถ" แต่ไม่ได้แปลว่ารถ — ต้องตรง allow ของ R80 ใน component-rules.json
   ใช้: npm run check-wording (เจอ = exit 1) · node scripts/check-wording.mjs --fix (แทนคำในข้อความเท่านั้น ไม่แตะคอมเมนต์) */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const WORD = "รถ", USE = "ยานพาหนะ";
/* ตัวสะกดที่ห้าม (เจ้าของงาน · Figma c1196dd 10 พ.ย. 2569 สะกด "ไฮดรอลิก" ตามราชบัณฑิตทุกจอ) — ตรวจในข้อความเหมือน R80 · --fix แทนให้ */
export const SPELL = { "ไฮโดรลิก": "ไฮดรอลิก", "ไฮดรอลิค": "ไฮดรอลิก", "ไฮโดรลิค": "ไฮดรอลิก" };
export const ALLOW = ["สามารถ", "รถพ่วงฉีดน้ำ", "รถเสีย", "อะไรถ", "ผู้ใช้รถฯ", "ทะเบียนรถ", "รถกระเช้า", "รถบรรทุกขนาดใหญ่", "รถส่วนกลาง", "รถยนต์บรรทุกส่วนบุคคล"];   // R80 allow ของ component-rules.json ("รถเสีย" = ประเภทการซ่อมของระบบ · Figma d6ce03a) + "อะไรถ" (อะไร + ถูก ไม่ใช่คำว่ารถ · ข้อความโหมดพาดู)
// + "ผู้ใช้รถฯ" "ทะเบียนรถ" = ข้อความของแบบสำรวจ กบค. ที่ลอกตรงตัว (S13 แบบประเมิน R94 · 11 พ.ย. 2569 · lib/mock/survey.ts)
// + "รถกระเช้า" = ประเภทยานพาหนะและชื่อแผนจากข้อมูล Overhaul (API · ORZ6900002 "Overhaul ประจำปีงบ 2569 — รถกระเช้า" · 72-6648 สงขลา) ในแบบประเมินความพึงพอใจ (12 พ.ย. 2569 · BACKLOG ข้อ 75)
// + "รถบรรทุกขนาดใหญ่" "รถส่วนกลาง" "รถยนต์บรรทุกส่วนบุคคล" = ค่าจาก API ของ VMS+ ในแท็บข้อมูลยานพาหนะ (หมวดหมู่ยานพาหนะหลัก · ลักษณะการใช้งาน · ประเภทยานพาหนะตามกรมการขนส่งทางบก รย.3 · ตัวเลือกในเฟรม Create vehicle ของ UI Release#2 หน้า 5.2 · 12 พ.ย. 2569 · BACKLOG ข้อ 83)
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src");
const fix = process.argv.includes("--fix");

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(f.name)) files.push(p);
  }
})(ROOT);

const strip = (s) => ALLOW.reduce((t, w) => t.split(w).join(""), s);
const swap = (s) => {
  let t = s;
  ALLOW.forEach((w, i) => { t = t.split(w).join("\u0001" + i + "\u0002"); });
  t = t.split(WORD).join(USE);
  ALLOW.forEach((w, i) => { t = t.split("\u0001" + i + "\u0002").join(w); });
  return t;
};

let bad = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const spellHit = (t) => Object.keys(SPELL).find((w) => t.includes(w));
  if (!src.includes(WORD) && !spellHit(src)) continue;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const hits = [];   // [start, end] ของข้อความ (ไม่รวมเครื่องหมายคำพูด)
  const visit = (n) => {
    const k = n.kind;
    if (k === ts.SyntaxKind.StringLiteral || k === ts.SyntaxKind.NoSubstitutionTemplateLiteral) hits.push([n.getStart(sf) + 1, n.getEnd() - 1]);
    else if (k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle) hits.push([n.getStart(sf) + 1, n.getEnd() - 2]);
    else if (k === ts.SyntaxKind.TemplateTail) hits.push([n.getStart(sf) + 1, n.getEnd() - 1]);
    else if (k === ts.SyntaxKind.JsxText) hits.push([n.getStart(sf), n.getEnd()]);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  const wrong = hits.filter(([a, b]) => strip(src.slice(a, b)).includes(WORD) || !!spellHit(src.slice(a, b)));
  if (!wrong.length) continue;
  if (fix) {
    let out = src;
    const respell = (t) => Object.entries(SPELL).reduce((x, [w, u]) => x.split(w).join(u), t);
    for (const [a, b] of [...wrong].sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + respell(swap(out.slice(a, b))) + out.slice(b);
    fs.writeFileSync(file, out);
    console.log("แก้ " + path.relative(ROOT, file) + " " + wrong.length + " จุด");
  } else {
    for (const [a, b] of wrong) {
      bad++;
      const line = src.slice(0, a).split("\n").length;
      const sp = spellHit(src.slice(a, b));
      console.log(sp ? "⚠ สะกด src/" + path.relative(ROOT, file) + ":" + line + ' "' + sp + '" ต้องใช้ "' + SPELL[sp] + '": ' + src.slice(a, b).trim().slice(0, 80)
        : "⚠ R80 src/" + path.relative(ROOT, file) + ":" + line + ' ยังมีคำว่า "' + WORD + '" ต้องใช้ "' + USE + '": ' + src.slice(a, b).trim().slice(0, 80));
    }
  }
}
/* ดัมป์สเปกจาก Figma (figma-spec/*.json) — แก้ตัวสะกดด้วยมือแล้ว 10 พ.ย. 2569 · npm run figma-spec ดึงตัวสะกดเดิมกลับมาได้ ⇒ ตรวจตัวสะกดทั้งไฟล์ (--fix แทนให้) */
const SPEC = path.join(ROOT, "..", "figma-spec");
const specFiles = [];
(function walkSpec(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walkSpec(p); else if (f.name.endsWith(".json")) specFiles.push(p);
  }
})(SPEC);
for (const file of specFiles) {
  const src = fs.readFileSync(file, "utf8");
  const found = Object.keys(SPELL).filter((w) => src.includes(w));
  if (!found.length) continue;
  if (fix) {
    fs.writeFileSync(file, Object.entries(SPELL).reduce((x, [w, u]) => x.split(w).join(u), src));
    console.log("แก้ figma-spec/" + path.relative(SPEC, file));
  } else for (const w of found) { bad++; console.log('⚠ สะกด figma-spec/' + path.relative(SPEC, file) + ' "' + w + '" ต้องใช้ "' + SPELL[w] + '" (' + (src.split(w).length - 1) + " จุด)"); }
}
if (!fix) {
  if (bad) { console.log("R80 / ตัวสะกด ไม่ผ่าน " + bad + " จุด"); process.exit(1); }
  console.log('R80 ข้อความใน src/ ไม่มีคำว่า "' + WORD + '" นอกข้อมูลจาก API · สะกด "ไฮดรอลิก" ✓ (' + files.length + " ไฟล์ src · " + specFiles.length + " ไฟล์ figma-spec)");
}
