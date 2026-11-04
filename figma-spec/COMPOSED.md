# ส่วนที่ต้องประกอบเอง / ค่าที่ไลบรารีไม่มี

กติกา (CLAUDE.md ข้อ 2–3): ของที่ไลบรารีไม่มีหรือค่าที่ไม่มี token ต้องจดที่นี่พร้อมเหตุผล · รายการที่มี "รอเคาะ" ให้เจ้าของงานตัดสิน

## ก. ประกอบจากชิ้นไลบรารี

| ส่วน | ประกอบจาก | เหตุผล |
|---|---|---|
| `BottomSheet` | Background overlay + แผ่นพื้น white มุมบน 24 + Bottom sheet header + เนื้อหา + Bottom sheet footer | component Bottom sheet ของไลบรารีล็อกเนื้อหาตายตัว · ทำแบบเดียวกับ `sheet()` / `menuAt()` ใน `figma-export/plugin-lib/core.js` (และแผงตัวกรองของ UI Release#2) |
| แถบต้นแบบ (`shell/PrototypeBar`) | Input dropdown + Dropdown list (บทบาท) · Tertiary button (ล้างข้อมูลจำลอง) | ไม่ใช่จอของระบบ มีเฉพาะต้นแบบ (CLAUDE.md ข้อ 5, 7) · พื้น gray-50 เส้นล่าง gray-200 |
| หน้า `/scenarios/` (รายการ scenario) | Page header + Table / Mobile table | สารบัญของต้นแบบ ไม่มีในจอ Figma · ย้ายจาก `/` ไป `/scenarios/` 4 พ.ย. 2569 (รากเว็บเป็นรายการแผนแบบระบบจริง) |
| หน้า `/plans/` `/plans/new/` (`shell/MovedTo`) | ข้อความ + ลิงก์ (ไม่มี component) | ที่อยู่เดิมก่อนย้าย URL 4 พ.ย. 2569 · ส่งออก static ทำ redirect ฝั่งเซิร์ฟเวอร์ไม่ได้ ⇒ พาไป `/` และ `/new/` ฝั่งเบราว์เซอร์ |
| เมนูย่อย "บำรุงรักษาตามวาระ" ใน Sidebar navigation | Nav list item (State=Active) ต่อท้ายเมนูย่อยของ "งานซ่อมและบำรุงรักษา" | เจ้าของงานสั่ง 4 พ.ย. 2569 ให้ทางเข้าเป็นเมนูจาก Sidebar · หน้า "Sidebar Navigation" (277:230639) ของ UI Release#2 ไม่มีเมนูนี้ — วางท้ายกลุ่ม (ไม่สลับลำดับของเดิม) · **ตำแหน่งในกลุ่มรอเคาะ** |
| กลุ่มเมนูเปิด/ปิดได้ใน Sidebar navigation State=Expanded | Nav item (Trailing icon keyboard_arrow_down / keyboard_arrow_up) + sub items = Nav list item ช่องไฟ 4 | ไลบรารีไม่มีกลุ่มเมนูเป็น component — ยกโครงจาก component "Nav menu" (Nav state=Collapsed/Expanded) ในหน้า "Sidebar Navigation" ของ UI Release#2 |
| การขยาย Sidebar บน desktop | Sidebar navigation State=Collapsed ↔ State=Expanded (ลอยทับเนื้อหา) | ไลบรารีมีแค่ 2 state ไม่บอกวิธีสลับ ⇒ ชี้เมาส์ = Expanded ชั่วคราว · กดโลโก้/ปุ่มใน Collapsed หรือปุ่ม keyboard_tab หรือปุ่ม menu ของ Header navigation = ค้างไว้ · ย่อด้วยปุ่ม keyboard_tab / คลิกนอก / Esc · ลอยทับ (ไม่ดันเนื้อหา) ให้เนื้อหาวางตามจอ Figma ที่ Sidebar 80 เสมอ · **รอเคาะว่าระบบจริงดันเนื้อหาหรือไม่** |
| เมนูบนมือถือ | Header navigation Mobile (ปุ่ม menu) → Background overlay + Sidebar navigation State=Expanded ชิดซ้ายสูงเต็มจอ | ไลบรารีและ UI Release#2 ไม่มีจอเมนูมือถือ · ใช้ Sidebar Expanded ตัวเดียวกับ desktop (ปุ่ม keyboard_tab = ปิดเมนู · แตะพื้นหลัง/Esc = ปิด) |
| หน้า `/kit/` | ทุก component + Section label เป็นหัวแต่ละชุด | ให้เจ้าของงานเทียบกับไฟล์ Component |
| หน้า `/soon/` | Page header + Empty state/Data empty | ที่พักของ scenario ที่ยังไม่ทำ |
| `MobileCards` (ใน `MobileTable.tsx`) | Mobile table + Mobile table item | แปลงตารางเป็นการ์ดตาม `mobileCards()` ใน core.js |
| `patterns/ConfirmDialog` | Modal (Centered image / Destructive centered image with input) + Modal header Center + Modal footer · มือถือ Bottom sheet + Modal header + Bottom sheet footer | popup ยืนยันตาม `confirm()` ใน core.js ใช้ซ้ำทุก scenario |
| `patterns/RowMenu` | Dropdown menu ลอยใต้ปุ่ม "…" · มือถือ Bottom sheet + Dropdown menu | เมนูท้ายแถวตาม `menuAt()` / `planMenu()` ใน core.js |
| ช่อง "จำลองบันทึกไม่สำเร็จ" ในแถบต้นแบบ | Checkbox | ให้เปิดดูจอ "บันทึกไม่สำเร็จ" ของ S1 ได้ (ระบบจริงไม่มี) |
| ปุ่ม "ใส่อะไหล่ตัวอย่าง (ข้อมูลจำลอง)" ในหน้า `/soon/?s=S21` | Primary button | S21 ยังไม่ทำ — ใส่อะไหล่ CAR_PICK ของ screens.js ให้รถในฟอร์มสร้างแผน เพื่อให้เห็นจออะไหล่ในไตรมาส + ยืนยันเอาอะไหล่ออกของ S1 · เอาออกเมื่อทำ S21 |

## ข. ค่าที่ไลบรารีมีแต่ไม่มี token (ไม่ได้ hardcode — ใช้ค่าใกล้เคียงแทน · รอเคาะ)

| จุด | ค่าในไลบรารี | ที่ใช้แทน |
|---|---|---|
| Tab item Active — เส้นล่าง | สีม่วง (stroke ของ Tab item Active=True) | `brand-900` เส้นล่าง 2 px (ความหนาเส้นแยกด้านไม่อยู่ในดัมป์) |
| Pill outline / Featured icon `Color=Purple` | พื้น/ขอบ/ตัวอักษรม่วง | ไม่รองรับ variant นี้ (ต้นแบบไม่ใช้) |
| Avatar (Header navigation · Dropdown list item · แถวผู้ใช้ใน Sidebar navigation) | วงกลมม่วงอ่อน | `gray-200` · Avatar ใน Dropdown list item ปิดไว้ |
| เงา Dropdown menu / Dropdown list / Modal | ดัมป์ไม่เก็บค่า effect | token `--shadow-pop` (`shadow-float`) |
| ความทึบ Background overlay | ดัมป์มีแค่สีพื้น black ไม่มีความทึบ | black 60% |
| เส้นของ Table cell / Tab item / Mobile table item | ดัมป์บอกสีแต่ไม่บอกว่าเส้นด้านไหน (ความหนาแยกด้าน) | เส้นล่าง 1 px |

## ค. asset ที่ดัมป์ไม่มี

| จุด | ที่ทำ |
|---|---|
| PEA logo (Sidebar navigation) · Brand logo (Header navigation Tablet/Mobile) | `public/pea-logo.svg` ยก path จากภาพส่งออกหน้าจอ Figma `Maintenance-Request-Form/figma/สรุปรายการอะไหล่.svg` (ไม่ได้วาดเอง) · Brand logo ของ Header ใช้ตัวเดียวกัน (ไลบรารีมีตัวอักษรต่อท้ายที่ยังไม่มีไฟล์) |
| ภาพ Graphic 200×200 ของ Empty state/Data empty | ยังไม่แสดง (ดัมป์ไม่มีรูป) — รอส่งออกรูปจาก Figma |
| ไอคอนและข้อความเมนูใน Sidebar navigation | ไลบรารีเป็นไอคอนตั้งต้น (crop_free) และข้อความ "Text" → ใช้ชุดของ component "Sidebar" ในหน้า "Sidebar Navigation" (277:230639) ของ UI Release#2: หน้าหลัก (home) · ระบบจองยานพาหนะ (car_rental) · จัดการคำขอใช้ยานพาหนะ (traffic_jam) · ข้อมูลพนักงานและยานพาหนะ (database) · การอัดประจุไฟฟ้า (ev_station) · งานซ่อมและบำรุงรักษา (build) · จัดการเหตุการณ์ (e911_emergency) · รายงาน (news) / โหมดสว่าง (light_mode) · ล็อกหน้าจอ (lock) · ใบอนุญาตขับขี่ (id_card) · ผู้ใช้ (Avatar + logout) · เมนูย่อย "บันทึกการอัดประจุ Wall Charger" ตาม Sidebar (component Nav menu EV ซ้ำ "อัตราค่าไฟฟ้า") |
| Brand logo (Light mode) แบบมีตัวอักษรใน Sidebar navigation State=Expanded | ไม่มีไฟล์ตัวอักษร → ใช้ `pea-logo.svg` 32 ตัวเดียวกับ Collapsed |
| ชื่อไอคอนที่ฟอนต์ Material Symbols ไม่มี | `warning_circle` → `error` · `cancel_circle` → `cancel` (ใน `Ms.tsx`) |

## ง. ข้อความที่จอ Figma ไม่ได้ระบุ (รอเคาะ)

| จุด | ที่ใช้ |
|---|---|
| S1 ยืนยันเอา **ภาค** / **ประเภทรถ** ออก | จอ Figma มีแค่ "ยืนยันการเอาเขตออก" → ใช้รูปเดียวกัน "ยืนยันการเอาภาคออก" / "ยืนยันการเอาประเภทรถออก" + "รถของ {ค่า} ที่จัดไว้ {n} คัน จะถูกเอาออกจากทุกไตรมาส" (Condition: "ถามยืนยันแบบเดียวกับเขต") |
| S1 toast บันทึกไม่สำเร็จ | จอ Figma เขียน "general error" → ใช้ข้อความนี้ตรงตัว |
| S1 ค้นทะเบียนไม่เจอในรายการเลือกรถ | "ไม่พบทะเบียนที่ค้นหา" (จอ Figma ไม่มี state นี้) |
| S1 ภาค/ประเภทรถในตารางรายการ เมื่อเลือกหลายค่า | ต่อด้วย ", " |
| S1 ปุ่ม "ตัวกรอง" | ยังไม่มีจอแผงตัวกรองใน S1 → ปุ่มยังไม่ทำงาน |

## จ. ที่ variant ไม่ได้บอก

| จุด | ที่ทำ |
|---|---|
| Page header Desktop — Back action | variant Desktop ไม่มีปุ่มย้อนกลับ (มีใน Mobile) → desktop ย้อนกลับด้วย Breadcrumbs |
| ขนาดตัวอักษร 24 (Empty state) | เพิ่ม `--text-xl: 24px / 36px` ใน `scripts/sync-tokens.mjs` (สเกลไลบรารี) |
| ตำแหน่ง Notification | ตาม `notify()` ใน core.js — มุมล่างขวา (มือถือ ล่างเต็มกว้าง ขอบ 16) |
| Nav item แถวที่มี Show Description (แถวผู้ใช้) | instance สูง 40 แต่ Text + Description สูง 39 ⇒ ให้สูงตามเนื้อหา (ขั้นต่ำ 40) |
| ป้าย Badge ใน Nav item / Nav list item | Sidebar ของ UI Release#2 ปิด Badge ทุกแถว ⇒ ต้นแบบไม่แสดง (component รองรับ `Badge` + Pill color) |
| Mobile table item — Supporting text | ช่อง `{text, sub}` ของตาราง → `SupportingText` (12 gray-600) แทนการต่อท้าย Text ด้วย " · " (เจ้าของงาน 4 พ.ย. 2569) |
