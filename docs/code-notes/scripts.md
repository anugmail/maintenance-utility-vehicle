# โน้ตของโค้ด: scripts/ และไฟล์ตั้งค่า

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## next.config.ts

**ก่อน `const nextConfig: NextConfig = {`**

```text
ส่งออกเป็นไฟล์ static ขึ้น GitHub Pages (ไม่มีเซิร์ฟเวอร์)
  basePath มาจาก env ตอน build: NEXT_PUBLIC_BASE_PATH=/maintenance-utility-vehicle (ตั้งใน .github/workflows/pages.yml)
  ลิงก์ทุกอันผ่าน next/link หรือ router · URL ไฟล์ดิบใช้ asset() ใน src/lib/basePath.ts
```

## scripts/check-wording.mjs

**หัวไฟล์**

```text
R80 คำว่า "ยานพาหนะ" แทน "รถ" (เจ้าของงาน 6 พ.ย. 2569 · component-rules.md §5.33 ของรีโป Maintenance-Request-Form)
  _"คำว่า รถ ที่อยู่ใน โปรแกรม อยากให้เปลี่ยนเป็นคำว่า ยานพาหนะ แทน โดยถ้าเป็นข้อมูลที่ดึงมาจาก api จะไม่ต้องแก้ไข แต่ถ้าเป็น คอลัมม์ แล้วมีคำว่ารถ เช่น รถเช่า เปลี่ยนเป็นยานพาหนะเช่า เป็นต้น ไล่แก้ และตั้งเป็นเงื่อนไข ในโปรแกรมให้ด้วย"_
  แบบเดียวกับ checkSourceWording (figma-export/check-component-rules.js) ของปลั๊กอิน Figma: ตรวจข้อความใน string literal / template / JSX text ของ src/ ทุกไฟล์ .ts .tsx
  ข้ามคอมเมนต์ (คำพูดเจ้าของงานในคอมเมนต์คงตามจริง) · ALLOW = ข้อมูลจาก API ที่คงคำว่ารถ + คำที่มี "รถ" แต่ไม่ได้แปลว่ารถ — ต้องตรง allow ของ R80 ใน component-rules.json
  ใช้: npm run check-wording (เจอ = exit 1) · node scripts/check-wording.mjs --fix (แทนคำในข้อความเท่านั้น ไม่แตะคอมเมนต์)
```

**ก่อน `export const SPELL = { "ไฮโดรลิก": "ไฮดรอลิก", "ไฮดรอลิค": "ไฮดรอลิก", "ไฮโดรลิค": "ไฮดรอล`**

```text
ตัวสะกดที่ห้าม (เจ้าของงาน · Figma c1196dd 10 พ.ย. 2569 สะกด "ไฮดรอลิก" ตามราชบัณฑิตทุกจอ) — ตรวจในข้อความเหมือน R80 · --fix แทนให้
```

**ท้ายบรรทัด `export const ALLOW = ["สามารถ", "รถพ่วงฉีดน้ำ", "รถเสีย", "อะไรถ", "ผู้ใช้รถฯ", "ทะเบียนรถ`**

```text
R80 allow ของ component-rules.json ("รถเสีย" = ประเภทการซ่อมของระบบ · Figma d6ce03a) + "อะไรถ" (อะไร + ถูก ไม่ใช่คำว่ารถ · ข้อความโหมดพาดู)
```

**ก่อน `const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "src");`**

```text
+ "ผู้ใช้รถฯ" "ทะเบียนรถ" = ข้อความของแบบสำรวจ กบค. ที่ลอกตรงตัว (S13 แบบประเมิน R94 · 11 พ.ย. 2569 · lib/mock/survey.ts)
+ "รถกระเช้า" = ประเภทยานพาหนะและชื่อแผนจากข้อมูล Overhaul (API · ORZ6900002 "Overhaul ประจำปีงบ 2569 — รถกระเช้า" · 72-6648 สงขลา) ในแบบประเมินความพึงพอใจ (12 พ.ย. 2569 · BACKLOG ข้อ 75)
+ "รถบรรทุกขนาดใหญ่" "รถส่วนกลาง" "รถยนต์บรรทุกส่วนบุคคล" = ค่าจาก API ของ VMS+ ในแท็บข้อมูลยานพาหนะ (หมวดหมู่ยานพาหนะหลัก · ลักษณะการใช้งาน · ประเภทยานพาหนะตามกรมการขนส่งทางบก รย.3 · ตัวเลือกในเฟรม Create vehicle ของ UI Release#2 หน้า 5.2 · 12 พ.ย. 2569 · BACKLOG ข้อ 83)
```

**ท้ายบรรทัด `const hits = [];`**

```text
[start, end] ของข้อความ (ไม่รวมเครื่องหมายคำพูด)
```

**ก่อน `const SPEC = path.join(ROOT, "..", "figma-spec");`**

```text
ดัมป์สเปกจาก Figma (figma-spec/*.json) — แก้ตัวสะกดด้วยมือแล้ว 10 พ.ย. 2569 · npm run figma-spec ดึงตัวสะกดเดิมกลับมาได้ ⇒ ตรวจตัวสะกดทั้งไฟล์ (--fix แทนให้)
```

## scripts/figma-spec.mjs

**หัวไฟล์**

```text
ดึงสเปกรายตัวของ component ที่ต้นแบบใช้ จากดัมป์ไฟล์ Figma 2 แหล่ง (CLAUDE.md ข้อ 12)
  - components.json "components" → ไลบรารี "(Component) VMS Plus" (VmOC07pKEsDkHZagOgcSU2) · ดัมป์ slug `component`
  - components.json "maintainD"  → ไฟล์ Figma งานซ่อม "Maintain-D" · ดัมป์ slug `maintain-d`
  ต้นทาง: Maintenance-Request-Form/design-system/.figma-extract/<slug>/*.json (ดัมป์ด้วยปลั๊กอิน figma-export/dump-plugin · รอบ 4 พ.ย. 2569
  มี vars effects paint sws strokeAlign justify sizing visible opacity ระยะ/จัดแนวตัวอักษร และ svg ของ component กราฟิก)
  ผลลัพธ์: figma-spec/<ชื่อ component>.json (ทุก variant) + figma-spec/svg/<ชื่อ>.svg (กราฟิก · สำเนาที่ public/figma-svg/) + figma-spec/INDEX.md
  รัน: npm run figma-spec [-- <โฟลเดอร์ดัมป์ component> [<โฟลเดอร์ดัมป์ maintain-d>]] · component React ทุกตัวต้องอ้างค่าจากไฟล์เหล่านี้
```

**ท้ายบรรทัด `const SVG_PUBLIC = path.join(ROOT, "public", "figma-svg");`**

```text
สำเนาให้หน้าเว็บโหลดได้ (asset("/figma-svg/<ชื่อ>.svg"))
```

**ก่อน `const KEEP = ["name", "type", "visible", "opacity", "w", "h", "sizing", "pl", "pr", "pt", `**

```text
เก็บเฉพาะค่าที่ใช้ทำ UI · svg ของ component กราฟิก (ปลายสุด) เขียนแยกเป็นไฟล์ ไม่ฝังใน json
```

**ท้ายบรรทัด `if (n.svg && !(n.kids || []).some((k) => k.svg)) {`**

```text
ปลายสุดเท่านั้น
```

**ท้ายบรรทัด `if (n.kids && d < ctx.depth && !(ctx.skipHidden && n.visible === false)) o.kids = n.kids.m`**

```text
Maintain-D: ชั้นที่ซ่อนไม่เก็บลูก (แผงใหญ่)
```

**ท้ายบรรทัด `const want = new Set(src.want), hits = new Map();`**

```text
ชื่อ → { set, file } · COMPONENT_SET มาก่อน COMPONENT · อ่านแต่ละหน้าครั้งเดียว
```

**ก่อน `const inFrames = (n, d) => { for (const k of n.kids || []) { if (k.type === "COMPONENT" ||`**

```text
component ที่วางอยู่ในกรอบ (FRAME/SECTION) ของหน้า เช่น ไอคอน resize-right ในกรอบ "Icon" ของหน้า Icons — ใช้เมื่อไม่มีตัวบนสุดชื่อเดียวกัน
```

## scripts/sync-tokens.mjs

**หัวไฟล์**

```text
ก๊อป tokens.css จาก design system ของ Maintain-D แล้วสร้าง Tailwind theme (src/styles/theme.css) จากชื่อ token
  แหล่งความจริง: Maintenance-Request-Form/design-system/tokens.css (ค่าตรงไลบรารี (Component) VMS Plus)
  รัน: npm run sync-tokens [-- <path tokens.css>]  ห้ามแก้ src/styles/tokens.css และ theme.css มือ
```
