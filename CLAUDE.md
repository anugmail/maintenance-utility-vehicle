# ต้นแบบบำรุงรักษาตามวาระ (Next.js) — เงื่อนไขการเขียนเว็บ

> เจ้าของงานสั่ง 4 พ.ย. 2569: _"อยาก gen prototype ของงานบำรุงรักษา โดยลบของเดิมที่เคยทำไว้ และทำของใหม่ขึ้นมาโดยอิงจาก scenario ที่ทำแล้วเท่านั้น"_ · _"ใช้ NextJs Tailwind ในการสร้างขึ้นมา component ใช้ให้ตรง"_ · _"ต้นแบบที่เป็น HTML ไม่ใช้ อยากให้เขียนใหม่ โดยอ้างอิงจาก component จาก design figma และเขียนในเงื่อนไขการเขียนเว็บครั้งต่อไปด้วย"_ · _"แยกออกจากส่วนอื่นเลย ไม่ร่วมกับงานซ่อม"_

## 🔴 เงื่อนไขบังคับทุกครั้งที่เขียนเว็บ

1. **Stack:** Next.js (App Router · `src/`) + Tailwind CSS 4 + TypeScript · ส่งออก static (`output: "export"`) ขึ้น GitHub Pages ด้วย `.github/workflows/pages.yml` · ไม่มีไลบรารี UI อื่น (ไม่มี DaisyUI/shadcn/MUI)
2. **component อ้างอิงไฟล์ Figma เท่านั้น** — ไลบรารี **(Component) VMS Plus** (`VmOC07pKEsDkHZagOgcSU2`) + หน้าจอจริง **(UI) VMS Plus – Release#2** (`fYD1yA1uzWsJSjHlcWKMNe`)
   - **ไม่อ้างต้นแบบ HTML** (โฟลเดอร์ `mock/` `design-mock/` `maintainance-yearly/` ของรีโปงานซ่อม และ `components.css`) ไม่ก๊อปคลาส/ค่า/โครงจากที่นั่น
   - ค่าทุกตัว (กว้าง สูง padding gap รัศมี สี ขอบ ฟอนต์) ยกจาก `figma-spec/<ชื่อ component>.json` ที่ดึงจากดัมป์ไฟล์ Component ด้วย `npm run figma-spec`
   - ไฟล์ component React 1 ไฟล์ = 1 component ของไลบรารี **ชื่อเดียวกับใน Figma** หัวไฟล์เขียนว่ามาจาก component ไหน หน้าไหน (node) และ variant/property ที่รองรับ
   - prop ของ component ใช้ชื่อ variant/property ของ Figma (เช่น `Size="md"` `Color="Success"` `State`) ไม่ตั้งชื่อเอง
   - component ที่ไลบรารีไม่มี → หยุด ถามเจ้าของงานก่อน ห้ามออกแบบเอง · ต้องประกอบจากชิ้นไลบรารีให้จดไว้ใน `figma-spec/COMPOSED.md` พร้อมเหตุผล
3. **สีและ token:** มาจาก `src/styles/tokens.css` (ก๊อปจาก design system ด้วย `npm run sync-tokens`) · Tailwind theme สร้างจาก token (`src/styles/theme.css`) palette ตั้งต้นของ Tailwind ถูกล้างทิ้ง · ห้าม hex ในไฟล์ `.tsx` · ห้าม `style=` ยกเว้นค่าที่คำนวณตอนรัน
4. **หน้าจอ:** ทำเฉพาะ scenario ที่เคาะแล้วในไฟล์ userflow `Diagram/01-บำรุงรักษาตามวาระ/14-บำรุงรักษา-userflow.md` ของรีโป Maintenance-Request-Form · โครงจอ ข้อความ ปุ่ม toast ตรงกับจอ Figma ที่ปลั๊กอิน `figma-export/maintainance-plugin/screens.js` สร้าง (state ละจอ) · เงื่อนไขตามตาราง Condition ของ scenario นั้น · ไม่เพิ่มหน้า/ปุ่มที่ไม่มีใน scenario
5. **ข้อมูลจำลอง:** อยู่ใน `src/lib/mock/` เก็บ `localStorage` คีย์ `mt-next-v1` · ค่าตัวอย่างชุดเดียวกับปลั๊กอิน Figma (แผน MR Z7000001 … รถ 82-6789 ขอนแก่น …) · ปุ่ม "ล้างข้อมูลจำลอง" กลับค่าตั้งต้น
6. **มือถือ:** ตามแบบ Mobile ของจอ Figma (402 กว้าง) — ตารางเป็น `Mobile table` · popup เป็น bottom sheet · ปุ่มหัวหน้าอยู่ใต้หัวข้อ
7. **บทบาท:** สลับบทบาทได้จากแถบต้นแบบบนสุด (กบค. · ผู้อนุมัติ · กบค. คลัง · กรย. · หน่วยงานเจ้าของรถ · ผู้รับจ้าง · หัวหน้า กบค.) เห็นเมนูและปุ่มตาม Permission ในไฟล์ userflow
8. **ภาษา:** ข้อความบนจอเป็นภาษาไทยตามจอ Figma ตรงตัว · ไม่มีอีโมจิ
9. **แยกจากงานซ่อม:** รีโปนี้เป็นของบำรุงรักษาตามวาระเท่านั้น ไม่ลิงก์หรือใช้โค้ดร่วมกับ Maintenance-Request-Form (งานซ่อม)

10. **URL และเมนูแบบระบบจริง** (เจ้าของงาน 4 พ.ย. 2569 _"ทางเข้าหน้า เป็น url = maintenance-utility-vehicle เป็นเมนูจาก sidebar กด แล้ว expand ออกมา … แก้ url ให้เหมือนของจริงไปเลย"_)
    - รากเว็บ `/` = หน้ารายการแผน (S1) · ฟอร์มสร้างแผน `/new/` · หน้าถัดไปของงานบำรุงรักษาวางใต้รากนี้ (ไม่ขึ้นต้นด้วย `/plans/`)
    - ของต้นแบบเท่านั้น: `/scenarios/` (รายการ scenario — ลิงก์ "ต้นแบบบำรุงรักษาตามวาระ" ในแถบต้นแบบ) · `/kit/` · `/soon/`
    - ที่อยู่เดิม `/plans/` `/plans/new/` เหลือเป็นหน้าพาไปที่อยู่ใหม่ (`shell/MovedTo.tsx`) ห้ามลิงก์ไปที่อยู่เดิมอีก
    - Sidebar navigation ใช้เมนูจริงตามหน้า "Sidebar Navigation" (277:230639) ของ UI Release#2 · งานนี้อยู่ที่ "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" (Active) · เมนูอื่นแสดงแต่ไม่พาไปไหน
11. **มือถือ — บรรทัดรองของตาราง** (`{ text, sub }`) ลง Supporting text ของ Mobile table item เสมอ ห้ามต่อท้าย Text ด้วย " · " (เจ้าของงาน 4 พ.ย. 2569)

12. **ต้องเป็น component เท่านั้น** (เจ้าของงาน 4 พ.ย. 2569 _"ต้องมี component เท่านั้นในการทำเว็บ"_) — ทุกชิ้นบนจอ (ยกเว้นแถบต้นแบบ หน้า /kit/ /scenarios/ /soon/) ต้องชี้กลับ component จริงใน Figma ได้ · แหล่ง component ที่ใช้ได้มี 2 ไฟล์:
    - ไลบรารี **(Component) VMS Plus** — ดัมป์ slug `component`
    - ไฟล์ Figma ของงานซ่อม **Maintain-D** (ReceiptChecklist · HandoverSignature · Modal Signature · InspectionChecklist · PartRequestStepPanel · PartsInventoryPanel · Spare Part Card Item · IncidentPhotoGallery · VehicleAndReporterInfo ฯลฯ) — เจ้าของงาน _"ใช้ได้ เอามาเป็นข้อมูลในการใช้ครั้งต่อไปด้วยเลย"_ · ดัมป์ slug `maintain-d` (`Maintenance-Request-Form/design-system/.figma-extract/maintain-d/` หรือ `figma-export/out/figma-dump/maintain-d/`) · ดึงสเปกแบบเดียวกับไลบรารี (figma-spec)
13. **ของที่ทั้งสองไฟล์ไม่มี** (เช่น Bottom sheet ที่ใส่เนื้อหาได้ · หน้าต่างยืนยัน · เมนูมือถือ) — เจ้าของงาน _"ออกแบบได้แต่ต้องสอดคล้องกับเว็บเดวที่ออกแบบเรื่องพวกนี้ไปแล้ว"_ ⇒ ประกอบจากชิ้นไลบรารีเท่านั้น โดยหน้าตาและพฤติกรรมตามระบบจริงฝั่ง dev (vmsplus-dev · vms-plus-uat.odds.team/maintain-d) · จดใน `figma-spec/COMPOSED.md` ทุกครั้ง (ประกอบจากอะไร · อิงหน้าไหนของระบบ dev)

## ตรวจก่อนบอกว่าเสร็จ

```bash
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/maintenance-utility-vehicle npm run build     # ต้องผ่าน · ได้ out/
grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.tsx'        # ต้องว่าง (สีต้องมาจาก token)
```

แล้วเปิดดูจริงทั้ง desktop และมือถือ (Playwright + Chrome ที่ติดเครื่อง) ไม่มี error ใน console

## โครงไฟล์

| ที่ | อะไร |
|---|---|
| `figma-spec/` | สเปก component จากไฟล์ Figma (สร้างด้วยสคริปต์) · `components.json` รายชื่อที่ใช้ (`components` ไลบรารี · `maintainD` ไฟล์ Maintain-D) · `svg/` กราฟิก (สำเนา `public/figma-svg/`) · `COMPOSED.md` ส่วนที่ต้องประกอบเอง |
| `src/components/vms/` | component ตามไลบรารี ชื่อเดียวกับ Figma |
| `src/components/maintain-d/` | component จากไฟล์ Figma งานซ่อม Maintain-D (ข้อ 12) ชื่อเดียวกับ Figma · สเปกจาก `maintainD` ใน `figma-spec/components.json` |
| `src/components/patterns/` | ชุดประกอบจากชิ้นไลบรารี (ข้อ 13) ConfirmDialog · RowMenu · FormModal · PopupModal · NotificationPanel · DisplayBox · PhotoGallery — จดใน `COMPOSED.md` |
| `src/components/shell/` | กรอบหน้า (Header navigation + Sidebar navigation) และแถบต้นแบบ (สลับบทบาท) |
| `src/app/` | หน้าตาม scenario (`page.tsx` = รายการแผน · `new/` ฟอร์มสร้างแผน · `scenarios/` `kit/` `soon/` ของต้นแบบ · `plans/` ที่อยู่เดิมที่พาไปที่ใหม่) |
| `src/lib/mock/` | ข้อมูลจำลอง |
| `scripts/` | `sync-tokens.mjs` · `figma-spec.mjs` |
