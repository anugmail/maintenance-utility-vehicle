# ต้นแบบบำรุงรักษาตามวาระ (Next.js) — เงื่อนไขการเขียนเว็บ

> เจ้าของงานสั่ง 4 พ.ย. 2569: _"อยาก gen prototype ของงานบำรุงรักษา โดยลบของเดิมที่เคยทำไว้ และทำของใหม่ขึ้นมาโดยอิงจาก scenario ที่ทำแล้วเท่านั้น"_ · _"ใช้ NextJs Tailwind ในการสร้างขึ้นมา component ใช้ให้ตรง"_ · _"ต้นแบบที่เป็น HTML ไม่ใช้ อยากให้เขียนใหม่ โดยอ้างอิงจาก component จาก design figma และเขียนในเงื่อนไขการเขียนเว็บครั้งต่อไปด้วย"_ · _"แยกออกจากส่วนอื่นเลย ไม่ร่วมกับงานซ่อม"_

## 🔴 เงื่อนไขบังคับทุกครั้งที่เขียนเว็บ

1. **Stack:** Next.js (App Router · `src/`) + Tailwind CSS 4 + TypeScript · ส่งออก static (`output: "export"`) ขึ้น GitHub Pages ด้วย `.github/workflows/pages.yml` · ไม่มีไลบรารี UI อื่น (ไม่มี DaisyUI/shadcn/MUI)
2. **component อ้างอิงไฟล์ Figma เท่านั้น** — ไลบรารี **(Component) VMS Plus** (`VmOC07pKEsDkHZagOgcSU2`) + หน้าจอจริง **(UI) VMS Plus – Release#2** (`fYD1yA1uzWsJSjHlcWKMNe`)
   - **ไม่อ้างต้นแบบ HTML** (โฟลเดอร์ `mock/` `design-mock/` `maintainance-yearly/` ของรีโปงานซ่อม และ `components.css`) ไม่ก๊อปคลาส/ค่า/โครงจากที่นั่น
   - ค่าทุกตัว (กว้าง สูง padding gap รัศมี สี ขอบ ฟอนต์) ยกจาก `figma-spec/<ชื่อ component>.json` ที่ดึงจากดัมป์ไฟล์ Component ด้วย `npm run figma-spec`
   - ไฟล์ component React 1 ไฟล์ = 1 component ของไลบรารี **ชื่อเดียวกับใน Figma** · มาจาก component ไหน หน้าไหน (node) และ variant/property ที่รองรับ จดใน `docs/code-notes/components-vms.md` ใต้หัวข้อชื่อไฟล์ ไม่เขียนเป็น comment หัวไฟล์ (ข้อ 20)
   - prop ของ component ใช้ชื่อ variant/property ของ Figma (เช่น `Size="md"` `Color="Success"` `State`) ไม่ตั้งชื่อเอง
   - component ที่ไลบรารีไม่มี → หยุด ถามเจ้าของงานก่อน ห้ามออกแบบเอง · ต้องประกอบจากชิ้นไลบรารีให้จดไว้ใน `figma-spec/COMPOSED.md` พร้อมเหตุผล
3. **สีและ token:** มาจาก `src/styles/tokens.css` (ก๊อปจาก design system ด้วย `npm run sync-tokens`) · Tailwind theme สร้างจาก token (`src/styles/theme.css`) palette ตั้งต้นของ Tailwind ถูกล้างทิ้ง · ห้าม hex ในไฟล์ `.tsx` · ห้าม `style=` ยกเว้นค่าที่คำนวณตอนรัน
4. **หน้าจอ:** ทำเฉพาะ scenario ที่เคาะแล้วในไฟล์ userflow `Diagram/01-บำรุงรักษาตามวาระ/14-บำรุงรักษา-userflow.md` (รีโปนี้) · โครงจอ ข้อความ ปุ่ม toast ตรงกับจอ Figma ที่ปลั๊กอิน `figma-export/maintainance-plugin/screens.js` สร้าง (state ละจอ) · เงื่อนไขตามตาราง Condition ของ scenario นั้น · ไม่เพิ่มหน้า/ปุ่มที่ไม่มีใน scenario
5. **ข้อมูลจำลอง:** อยู่ใน `src/lib/mock/` เก็บ `localStorage` คีย์ `mt-next-v1` · ค่าตัวอย่างชุดเดียวกับปลั๊กอิน Figma (แผน MRZ7000001 … รถ 82-6789 ขอนแก่น … · เลขที่ MR ติดกันไม่เว้นวรรค 9 พ.ย. 2569) · เปลี่ยนรูปแบบข้อมูลที่เก็บ → ขึ้นรุ่น `MOCK_V` ใน `store.ts` · ปุ่ม "ล้างข้อมูลจำลอง" กลับค่าตั้งต้น
6. **มือถือ:** ตามแบบ Mobile ของจอ Figma (402 กว้าง) — ตารางเป็น `Mobile table` · popup เป็น bottom sheet · ปุ่มหัวหน้าอยู่ใต้หัวข้อ
7. **บทบาท:** สลับบทบาทได้จากแถบต้นแบบบนสุด (หน่วยงาน กบผ. · กปส. · กรย. · กส.1 · กส.2 ผู้สร้างแผนที่เห็นเฉพาะแผนของตัวเอง (persona 9 พ.ย. 2569 · 12 พ.ย. 2569 แต่ละกองของสำนักงานใหญ่สร้างแผนเอง กกฟ.1 → กบผ. · กกฟ.2 → กปส. · เพิ่ม กส.1 กส.2 · BACKLOG ข้อ 70) · กบค. เห็นทุกหน่วยงาน · ผู้อนุมัติ · กรย. ผู้รับแจ้งเตือนแผนเดินทาง S8 · ผู้ดูแลยานพาหนะ (10 พ.ย. 2569 แทน "หน่วยงานเจ้าของยานพาหนะ" · S8 แจ้งเตือน · S13 รับทราบและประเมินรายคัน) · ผู้รับจ้าง (S23 เอากลับ 10 พ.ย. 2569 R87 · เดิมเอาออก 4 พ.ย.)) เห็นเมนูและปุ่มตาม Permission ในไฟล์ userflow · ข้อความบนจอเรียกผู้ทำตามบทบาท ผู้สร้างแผน · ผู้ดำเนินการ · ผู้ดูแลยานพาหนะ · ผู้อนุมัติ · กรย. · ผู้รับจ้าง (Figma 9607c3b · หน่วยงานเป็นข้อมูลสังกัด) · กบค. คลัง เอาออก 6 พ.ย. 2569 พร้อม S22 (อนุมัติแผนแล้วระบบแจ้ง Smart Inventory แทน) · S14 S15 S16 S17 ตัดออก 10 พ.ย. 2569 พร้อมบทบาทหัวหน้าหน่วยงาน (รับทราบครบทุกคันแล้วแผนปิดงานเอง)
8. **ภาษา:** ข้อความบนจอเป็นภาษาไทยตามจอ Figma ตรงตัว · ไม่มีอีโมจิ
9. **แยกจากงานซ่อม:** รีโปนี้เป็นของบำรุงรักษาตามวาระเท่านั้น ไม่ลิงก์หรือใช้โค้ดร่วมกับ Maintenance-Request-Form (งานซ่อม)

10. **URL และเมนูแบบระบบจริง** (เจ้าของงาน 4 พ.ย. 2569 _"ทางเข้าหน้า เป็น url = maintenance-utility-vehicle เป็นเมนูจาก sidebar กด แล้ว expand ออกมา … แก้ url ให้เหมือนของจริงไปเลย"_)
    - รากเว็บ `/` = หน้ารายการแผน (S1) · ฟอร์มสร้างแผน `/new/` · หน้าถัดไปของงานบำรุงรักษาวางใต้รากนี้ (ไม่ขึ้นต้นด้วย `/plans/`)
    - ของต้นแบบเท่านั้น: `/scenarios/` (รายการ scenario — ลิงก์ "ต้นแบบบำรุงรักษาตามวาระ" ในแถบต้นแบบ) · `/guide/` (เมนูพาดูทีละเรื่อง — ปุ่ม "พาดูทีละเรื่อง" ในแถบต้นแบบ และเมนูย่อยต่อจาก "บำรุงรักษาตามวาระ" ใน Sidebar) · `/kit/` · `/soon/`
    - ที่อยู่เดิม `/plans/` `/plans/new/` เหลือเป็นหน้าพาไปที่อยู่ใหม่ (`shell/MovedTo.tsx`) ห้ามลิงก์ไปที่อยู่เดิมอีก
    - Sidebar navigation ใช้เมนูจริงตามหน้า "Sidebar Navigation" (277:230639) ของ UI Release#2 · งานนี้อยู่ที่ "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" (Active) · เมนูอื่นแสดงแต่ไม่พาไปไหน
11. **มือถือ — บรรทัดรองของตาราง** (`{ text, sub }`) ลง Supporting text ของ Mobile table item เสมอ ห้ามต่อท้าย Text ด้วย " · " (เจ้าของงาน 4 พ.ย. 2569)

12. **ต้องเป็น component เท่านั้น** (เจ้าของงาน 4 พ.ย. 2569 _"ต้องมี component เท่านั้นในการทำเว็บ"_) — ทุกชิ้นบนจอ (ยกเว้นแถบต้นแบบ หน้า /kit/ /scenarios/ /guide/ /soon/) ต้องชี้กลับ component จริงใน Figma ได้ · แหล่ง component ที่ใช้ได้มี 2 ไฟล์:
    - ไลบรารี **(Component) VMS Plus** — ดัมป์ slug `component`
    - ไฟล์ Figma ของงานซ่อม **Maintain-D** (ReceiptChecklist · HandoverSignature · Modal Signature · InspectionChecklist · PartRequestStepPanel · PartsInventoryPanel · Spare Part Card Item · IncidentPhotoGallery · VehicleAndReporterInfo ฯลฯ) — เจ้าของงาน _"ใช้ได้ เอามาเป็นข้อมูลในการใช้ครั้งต่อไปด้วยเลย"_ · ดัมป์ slug `maintain-d` (`Maintenance-Request-Form/design-system/.figma-extract/maintain-d/` หรือ `figma-export/out/figma-dump/maintain-d/`) · ดึงสเปกแบบเดียวกับไลบรารี (figma-spec)
13. **ของที่ทั้งสองไฟล์ไม่มี** (เช่น Bottom sheet ที่ใส่เนื้อหาได้ · หน้าต่างยืนยัน · เมนูมือถือ) — เจ้าของงาน _"ออกแบบได้แต่ต้องสอดคล้องกับเว็บเดวที่ออกแบบเรื่องพวกนี้ไปแล้ว"_ ⇒ ประกอบจากชิ้นไลบรารีเท่านั้น โดยหน้าตาและพฤติกรรมตามระบบจริงฝั่ง dev (vmsplus-dev · vms-plus-uat.odds.team/maintain-d) · จดใน `figma-spec/COMPOSED.md` ทุกครั้ง (ประกอบจากอะไร · อิงหน้าไหนของระบบ dev)

14. **มือถือ — ไอคอนดู แก้ไข ลบ กางบนการ์ด** (เจ้าของงาน 4 พ.ย. 2569 _"ส่วนที่เป็น mobile อยากให้ expand view edit delete icon ออกมาแบบตัวอย่างทั้งหมด"_) — ช่องเมนู "…" ของตารางต้องส่ง `mobileActions` ตามรายการที่ทำได้ในสถานะนั้น (Mobile table item Style=Action icons · View/Edit/Delete) · มือถือไม่เปิดเมนู … / bottom sheet เมนู · desktop คงปุ่ม "…" + Dropdown menu

15. **คำว่า "ยานพาหนะ" แทน "รถ"** (R80 · เจ้าของงาน 6 พ.ย. 2569 _"คำว่า รถ ที่อยู่ใน โปรแกรม อยากให้เปลี่ยนเป็นคำว่า ยานพาหนะ แทน โดยถ้าเป็นข้อมูลที่ดึงมาจาก api จะไม่ต้องแก้ไข … ไล่แก้ และตั้งเป็นเงื่อนไข ในโปรแกรมให้ด้วย"_) — ทุกข้อความบนจอ (ป้าย หัวคอลัมน์ ปุ่ม หัวข้อ แท็บ toast ข้อความว่าง ข้อความยืนยัน) · ข้อมูลจาก API (ชื่อประเภทยานพาหนะ ชื่อแผนที่ผู้ใช้ตั้ง) คงเดิม · คำที่ยอมให้มี "รถ" อยู่ใน `ALLOW` ของ `scripts/check-wording.mjs` (ตรงกับ allow ของ R80 ใน `component-rules.json` ของรีโป Maintenance-Request-Form) · ตารางอะไหล่รวมของไตรมาส/แผนใช้ `QPART_COLS` ชุดเดียว (R81)
16. **สะกด "ไฮดรอลิก"** (ราชบัณฑิต · เจ้าของงาน 10 พ.ย. 2569 · Figma c1196dd) — ทุกข้อความที่เราเขียน (ป้าย หัวคอลัมน์ เมนู toast รายการตรวจ ข้อมูลจำลอง เอกสาร) ห้ามใช้ "ไฮโดรลิก" "ไฮดรอลิค" "ไฮโดรลิค" · คำพูดเจ้าของงานที่ยกมาคงเดิม · `npm run check-wording` ตรวจตัวสะกดด้วย (`SPELL` ใน `scripts/check-wording.mjs`)
17. **ปุ่มต้นแบบ "กรอกข้อมูลตัวอย่าง" · "ล้างค่า"** (เจ้าของงาน 10 พ.ย. 2569) — หน้า/ขั้นที่มีฟอร์มต้องเรียก `useProtoForm({ fill, clear, dirty })` (`src/lib/protoForm.ts`) · fill กรอกค่าที่ผ่านเงื่อนไขของหน้า (ปุ่มหลักกดได้) · clear กลับค่าเริ่มต้นของฟอร์มนั้นเท่านั้น · ปุ่มอยู่ในแถบต้นแบบเท่านั้น ไม่ใส่ในแถวปุ่มของหน้า ไม่ใส่ใน Figma
18. **แดชบอร์ดแบบ VMS+ เฉพาะ S4 S24** (เจ้าของงาน 12 พ.ย. 2569 _"อยากให้ออกแบบเป็นสไตล์นี้ เฉยๆ วิธีการวิชชัลข้อมูล หรือวิธีการแสดงข้อมูล โดยไม่ต้องตรง component ของ pea ให้เฉพาะ dashboard ที่ทำสิ่งนี้ได้ หน้าอื่นๆ ยังคงต้องตาม component เหมือนเดิม"_) — เฉพาะหน้าแดชบอร์ด S24 (`/vehicles/maintenance/`) และ S4 (`/parts/`) ใช้หน้าตาแบบ vmsplus.pea.co.th/dashboard ได้ (การ์ดตัวเลขสีไล่เฉด · เรื่องที่ควรดู · แผงตัวกรองพับได้ · กราฟ ชิ้นอยู่ `src/components/dashboard/`) แม้ไลบรารีไม่มี · ยังต้องสีจาก token · ข้อมูลชุดเดิมของหน้า · กรอบหน้า ตาราง ช่องกรอก popup เป็น component เดิม · หน้าอื่นทั้งหมดยังต้องเป็น component ตามข้อ 12 · จดชิ้นใหม่ใน `figma-spec/COMPOSED.md` หัวข้อ "แดชบอร์ดแบบ VMS+"
19. **แก้ต้นแบบแล้วต้องอัปเดตหน้าสรุปและการ์ด FLO** (เจ้าของงาน 19 พ.ย. 2569 _"ถ้ามีการแก้ไขใน prototype ต้องอัพเดทที่ flo ด้วย"_) — แก้แล้วทำให้ journey หน้า case toast สิทธิ์ หรือสถานะเปลี่ยน ต้องทำตามหัวข้อ "แก้ต้นแบบบำรุงรักษา → อัปเดตหน้าสรุปและการ์ด FLO ในงานเดียวกัน" ข้างล่าง ก่อนบอกว่าเสร็จ: แก้เอกสาร Feature ไฟล์ 40–44 · publish ทับ artifact https://claude.ai/artifact/ApmsruZ1AgACrtvQG1FoFn · อัปเดตการ์ด [MTD-212](https://flo.odt.co.th/products/205/items/212) พร้อม comment ว่าแก้อะไร · แก้เฉพาะหน้าตาที่ไม่กระทบเรื่องเหล่านี้ และงานทดลองที่ยังไม่ commit ไม่ต้องทำ
20. **โค้ดไม่มี comment** (เจ้าของงาน 19 พ.ย. 2569 _"code ที่เป็น comment แบบนี้ไม่ต้องเอาใว้เลย เอาออกให้หมด จดใว้แค่ใน plan.md หรือที่อื่น ที่ไม่อยู่ใน code"_) — ไฟล์ `.ts` `.tsx` `.mjs` `.css` ไม่เขียน comment ทั้งหัวไฟล์ ระหว่างบรรทัด ท้ายบรรทัด และ `{/* */}` ใน JSX · โน้ตของหน้า (scenario ที่ทำ · ที่มาของ component · เหตุผลของเงื่อนไข · ประวัติการแก้ · คำพูดเจ้าของงาน) จดใน `docs/code-notes/<โฟลเดอร์>.md` ใต้หัวข้อชื่อไฟล์โค้ด สารบัญอยู่ `plan.md` · ยกเว้นคำสั่งที่เครื่องมืออ่าน (`eslint-disable-next-line` · `@ts-expect-error`) · `src/styles/tokens.css` `theme.css` ถูกตัด comment ตอน `npm run sync-tokens`

21. **เอกสารงานบำรุงรักษาอยู่รีโปนี้** (เจ้าของงาน 20 พ.ย. 2569 _"plugin ใช้เหมือนกันได้ แต่อยากแก้ส่วนของเอกสาร ให้แยกออกจากกัน"_) — `Diagram/01-บำรุงรักษาตามวาระ/` ย้ายมาจากรีโป Maintenance-Request-Form (userflow · AC · เอกสาร Feature 40–46 · `artifact/` หน้าสรุป · `sources/` ต้นทาง) · เอกสาร Overhaul ปลั๊กอิน Figma และต้นแบบ HTML ยังอยู่รีโปงานซ่อม · ปลั๊กอินอ่านเอกสารที่นี่ข้ามรีโป (`figma-export/plugin-lib/maint-docs.js` ของรีโปงานซ่อม) ⇒ ห้ามเปลี่ยนชื่อโฟลเดอร์หรือชื่อไฟล์ที่ปลั๊กอินอ่าน (14 23 24 26 27 และ 40–44) โดยไม่แก้ `build.json` ของปลั๊กอินด้วย

## ตรวจก่อนบอกว่าเสร็จ

```bash
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/maintenance-utility-vehicle npm run build     # ต้องผ่าน · ได้ out/
grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.tsx'        # ต้องว่าง (สีต้องมาจาก token)
npm run check-wording                                        # R80 ข้อความบนจอใช้ "ยานพาหนะ" แทน "รถ" + สะกด "ไฮดรอลิก" (ต้องผ่าน)
```

แล้วเปิดดูจริงทั้ง desktop และมือถือ (Playwright + Chrome ที่ติดเครื่อง) ไม่มี error ใน console

## 🔴 แก้ต้นแบบบำรุงรักษา → อัปเดตหน้าสรุปและการ์ด FLO ในงานเดียวกัน — เจ้าของงานสั่ง 19 พ.ย. 2569 (ย้ายมาจาก CLAUDE.md ของรีโปงานซ่อม 20 พ.ย. 2569)

> _"เมื่อมีการแก้ไข อยากให้ปรับใน flo ด้วย … ถ้ามีการแก้ไขใน prototype ต้องอัพเดทที่ flo ด้วย"_

| ของ | อยู่ที่ |
|---|---|
| หน้าสรุป "บำรุงรักษาตามวาระ 5 Feature" (artifact) | https://claude.ai/artifact/ApmsruZ1AgACrtvQG1FoFn |
| การ์ด FLO ใบรวม | [MTD-212](https://flo.odt.co.th/products/205/items/212) โปรดักต์ MTD (maintain-d) |
| การ์ด FLO ที่แตก (19 พ.ย. 2569) | Epic ละ 1 Feature MTD-214 ถึง MTD-218 · การ์ดราย journey MTD-222 ถึง MTD-247 · **AC ไม่มีการ์ดแยก** อยู่ในการ์ด journey ที่ใช้ หัวข้อ "Acceptance Criteria" (เจ้าของงาน 19 พ.ย. 2569 _"ac ควรอยู่ใน เรื่องนั้นๆ"_ · AC-S1 แบ่งตามเรื่องใน MTD-222 ถึง MTD-226 · AC-S2 ใน MTD-229 · AC-S6 ใน MTD-230 · การ์ด AC เดิม MTD-219 MTD-220 MTD-221 ลบแล้ว · ข้อของ AC-S6 เรื่องแก้ไขใบที่ถูกส่งกลับอยู่ MTD-232 และเรื่องยานพาหนะในไตรมาสอยู่ MTD-235 · journey ที่ไฟล์ 28 ไม่มี AC 19 ใบ ใช้ `Diagram/01-บำรุงรักษาตามวาระ/46-บำรุงรักษา-AC-ราย-journey.md`) · เลขการ์ดของแต่ละเรื่องอยู่ใน `artifact/flo-cards.json` · ชื่อการ์ดขึ้นต้น `[บำรุงรักษาตามวาระ]` · **เรื่อง ปจ.2 ยังไม่รวม** ทั้งใน FLO และหน้าสรุป (เจ้าของงาน 19 พ.ย. 2569) |
| ตัวสร้างหน้า | `Diagram/01-บำรุงรักษาตามวาระ/artifact/build.py` + `shell.html` อ่านเอกสาร Feature ไฟล์ 40–44 หัวข้อ 1 2 3 5 6 และ `flo-cards.json` (ลิงก์การ์ดท้ายชื่อ journey) |

**นับเป็นการแก้ต้นแบบ** เมื่อแก้อย่างใดอย่างหนึ่งของงานบำรุงรักษาตามวาระ: ต้นแบบเว็บ (รีโปนี้) · จอ Figma (`figma-export/maintainance-plugin` `maintainance-feature-plugin` ของรีโป Maintenance-Request-Form) · ต้นแบบ HTML (`maintainance-feature-proto/` ของรีโป Maintenance-Request-Form) · เอกสาร Feature ไฟล์ 40–45 — ถ้าแก้แล้วทำให้ journey หน้า case toast สิทธิ์ สถานะ หรือรายการ "ยังไม่มีจอ" "ยังไม่เคาะ" เปลี่ยน · แก้เฉพาะหน้าตา (สี ระยะ ตัวสะกด) ที่ไม่กระทบเรื่องเหล่านี้ ไม่ต้องทำ

**ลำดับ** (ทำก่อนบอกว่าเสร็จ)

1. แก้เอกสาร Feature ไฟล์ 40–44 ให้ตรงกับต้นแบบที่แก้ (เจ้าของความจริงของหน้าสรุป) · จำนวน journey หน้า จอ toast เปลี่ยน → แก้ `FEATURES` ใน `build.py` ด้วย
2. สร้างหน้าใหม่ `python3 "Diagram/01-บำรุงรักษาตามวาระ/artifact/build.py" "Diagram/01-บำรุงรักษาตามวาระ" <ไฟล์ .html ใน scratchpad>` แล้ว publish ทับ artifact เดิมด้วย `url` ข้างบน (อ่านด้วย `action: "read"` ก่อน · ห้ามสร้าง artifact ใหม่) · เลขคอมมิตและวันที่ในบรรทัดที่มาของ `shell.html` ต้องตรงฉบับที่ใช้
3. อัปเดต MTD-212 ด้วย `mcp__flo__update_item`: ตารางตัวเลขและบรรทัดที่มาใน description ให้ตรง (แก้เฉพาะส่วนที่เปลี่ยน ส่วนอื่นคงเดิม) แล้วเพิ่ม comment ด้วย `mcp__flo__add_comment` บอกว่าแก้อะไร เพราะอะไร พร้อมลิงก์คอมมิต · อ่าน `get_agent_instructions` ของ MTD ก่อนเขียนทุกครั้ง
4. อัปเดตการ์ดของเรื่องที่เปลี่ยน: journey ที่เปลี่ยน → แก้ description ของการ์ด journey ใบนั้น (หัวข้อ "รายละเอียด" ลอกจากเอกสาร Feature หัวข้อ 2 ตรงตัว) · ภาพรวม สิทธิ์ หรือสถานะของ Feature เปลี่ยน → แก้ epic ของ Feature นั้น · AC ในไฟล์ 28 หรือไฟล์ 46 (AC ราย journey) เปลี่ยน หรือมี AC ใหม่ → แก้ไฟล์นั้นก่อน แล้วแก้หัวข้อ "Acceptance Criteria" ในการ์ด journey ที่ใช้ AC นั้นให้ข้อความตรงกัน (AC ที่ใช้หลาย journey ให้แบ่งตามเรื่องลงแต่ละใบ) ห้ามสร้างการ์ด AC แยก · ข้อความ AC เขียนเป็นภาษาคน บอกตรงๆ ว่าระบบต้องทำอะไร ไม่เขียนประวัติการตัดสินใจ ("เจ้าของงานเคาะเมื่อ…" · "ปรับ <วันที่>" · รหัส R/Q · เลขไฟล์ · รหัสจอ) (เจ้าของงาน 19 พ.ย. 2569 _"ให้เขียนเป็น ภาษามนุษย์เขียน ไม่เขียน เจ้าของแนะนำ เคาะเมื่อนั่น เมื่อนี่"_) · journey ใหม่ → สร้างการ์ดใหม่ใน epic เดิม แล้วเพิ่มใน `flo-cards.json` · journey ถูกตัด → comment ที่การ์ดว่าถูกตัดเพราะอะไร ไม่ลบการ์ดเอง · ทุกใบที่แก้ต้องมี comment ว่าแก้อะไร
5. งานที่แก้เป็นของการ์ด FLO ใบอื่นด้วย (ค้นด้วย `search_items`) → comment ที่การ์ดใบนั้นด้วย · ห้ามย้ายคอลัมน์ ปิดการ์ด หรือเปลี่ยนผู้รับผิดชอบเอง

**ทำไม่ได้ให้บอก** — FLO ต่อไม่ติด หรือ publish ไม่ผ่าน ให้แจ้งเจ้าของงานว่าขั้นไหนยังค้าง ห้ามบอกว่าเสร็จ · ทดลองที่ยังไม่ commit ยังไม่ต้องอัปเดต ทำเมื่อเจ้าของงานเคาะให้ใช้จริง

## โครงไฟล์

| ที่ | อะไร |
|---|---|
| `figma-spec/` | สเปก component จากไฟล์ Figma (สร้างด้วยสคริปต์) · `components.json` รายชื่อที่ใช้ (`components` ไลบรารี · `maintainD` ไฟล์ Maintain-D) · `svg/` กราฟิก (สำเนา `public/figma-svg/`) · `COMPOSED.md` ส่วนที่ต้องประกอบเอง |
| `src/components/vms/` | component ตามไลบรารี ชื่อเดียวกับ Figma |
| `src/components/maintain-d/` | component จากไฟล์ Figma งานซ่อม Maintain-D (ข้อ 12) ชื่อเดียวกับ Figma · สเปกจาก `maintainD` ใน `figma-spec/components.json` |
| `src/components/patterns/` | ชุดประกอบจากชิ้นไลบรารี (ข้อ 13) ConfirmDialog · RowMenu · FormModal · PopupModal · NotificationPanel · DisplayBox · PhotoGallery · CheckTable — จดใน `COMPOSED.md` |
| `src/components/shell/` | กรอบหน้า (Header navigation + Sidebar navigation) และแถบต้นแบบ (สลับบทบาท) |
| `src/app/` | หน้าตาม scenario (`page.tsx` = รายการแผน · `new/` ฟอร์มสร้างแผน · `scenarios/` `kit/` `soon/` ของต้นแบบ · `plans/` ที่อยู่เดิมที่พาไปที่ใหม่) |
| `src/lib/mock/` | ข้อมูลจำลอง |
| `scripts/` | `sync-tokens.mjs` · `figma-spec.mjs` |
| `figma-plugin/` | ปลั๊กอิน Figma **I AM A lnw** (สร้างจอ 5 Feature ลง Figma · ส่งภาพไป FigJam) สำเนาจาก liinux-cw/figma-plugin fea7f8e (20 พ.ย. 2569) · ไม่ใช่ส่วนของเว็บ ไม่ build ด้วย Next · วิธีใช้ดู `figma-plugin/README.md` |
| `Diagram/01-บำรุงรักษาตามวาระ/` | เอกสารงานบำรุงรักษา (ข้อ 21) · `artifact/` ตัวสร้างหน้าสรุป · `sources/` ไฟล์ต้นทาง |
| `plan.md` · `docs/code-notes/` | โน้ตของโค้ดที่ไม่อยู่ในโค้ด (ข้อ 20) · `plan.md` เป็นสารบัญ · `docs/code-notes/<โฟลเดอร์>.md` หัวข้อละ 1 ไฟล์โค้ด |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
