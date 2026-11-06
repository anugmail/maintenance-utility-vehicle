/* R80 คำว่า "ยานพาหนะ" แทน "รถ" (เจ้าของงาน 6 พ.ย. 2569 · component-rules.md §5.33 ของรีโป Maintenance-Request-Form)
   _"คำว่า รถ ที่อยู่ใน โปรแกรม อยากให้เปลี่ยนเป็นคำว่า ยานพาหนะ แทน โดยถ้าเป็นข้อมูลที่ดึงมาจาก api จะไม่ต้องแก้ไข แต่ถ้าเป็น คอลัมม์ แล้วมีคำว่ารถ เช่น รถเช่า เปลี่ยนเป็นยานพาหนะเช่า เป็นต้น ไล่แก้ และตั้งเป็นเงื่อนไข ในโปรแกรมให้ด้วย"_
   แบบเดียวกับ checkSourceWording (figma-export/check-component-rules.js) ของปลั๊กอิน Figma: ตรวจข้อความใน string literal / template / JSX text ของ src/ ทุกไฟล์ .ts .tsx
   ข้ามคอมเมนต์ (คำพูดเจ้าของงานในคอมเมนต์คงตามจริง) · ALLOW = ข้อมูลจาก API ที่คงคำว่ารถ + คำที่มี "รถ" แต่ไม่ได้แปลว่ารถ — ต้องตรง allow ของ R80 ใน component-rules.json
   ใช้: npm run check-wording (เจอ = exit 1) · node scripts/check-wording.mjs --fix (แทนคำในข้อความเท่านั้น ไม่แตะคอมเมนต์) */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const WORD = "รถ", USE = "ยานพาหนะ";
export const ALLOW = ["สามารถ", "รถพ่วงฉีดน้ำ", "อะไรถ"];   // R80 allow ของ component-rules.json + "อะไรถ" (อะไร + ถูก ไม่ใช่คำว่ารถ · ข้อความโหมดพาดู)
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
  if (!src.includes(WORD)) continue;
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
  const wrong = hits.filter(([a, b]) => strip(src.slice(a, b)).includes(WORD));
  if (!wrong.length) continue;
  if (fix) {
    let out = src;
    for (const [a, b] of [...wrong].sort((x, y) => y[0] - x[0])) out = out.slice(0, a) + swap(out.slice(a, b)) + out.slice(b);
    fs.writeFileSync(file, out);
    console.log("แก้ " + path.relative(ROOT, file) + " " + wrong.length + " จุด");
  } else {
    for (const [a, b] of wrong) {
      bad++;
      const line = src.slice(0, a).split("\n").length;
      console.log("⚠ R80 src/" + path.relative(ROOT, file) + ":" + line + ' ยังมีคำว่า "' + WORD + '" ต้องใช้ "' + USE + '": ' + src.slice(a, b).trim().slice(0, 80));
    }
  }
}
if (!fix) {
  if (bad) { console.log("R80 ไม่ผ่าน " + bad + " จุด"); process.exit(1); }
  console.log('R80 ข้อความใน src/ ไม่มีคำว่า "' + WORD + '" นอกข้อมูลจาก API ✓ (' + files.length + " ไฟล์)");
}
