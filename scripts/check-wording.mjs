import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const WORD = "รถ", USE = "ยานพาหนะ";
export const SPELL = { "ไฮโดรลิก": "ไฮดรอลิก", "ไฮดรอลิค": "ไฮดรอลิก", "ไฮโดรลิค": "ไฮดรอลิก" };
export const ALLOW = ["สามารถ", "รถพ่วงฉีดน้ำ", "รถเสีย", "อะไรถ", "ผู้ใช้รถฯ", "ทะเบียนรถ", "รถกระเช้า", "รถบรรทุกขนาดใหญ่", "รถส่วนกลาง", "รถยนต์บรรทุกส่วนบุคคล"];
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
  const hits = [];
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
