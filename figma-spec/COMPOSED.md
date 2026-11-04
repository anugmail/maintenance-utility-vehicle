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
| หน้า `/scenarios/sample/` (เปิด scenario จากรายการ scenario) | ข้อความ (ไม่มี component) แล้วพาไปหน้าแรกของ scenario | ของต้นแบบ — ใส่แผนตัวอย่าง MR Z7000004 (NEW_PLAN + EDIT_FORM ของ screens.js) ในสถานะที่ S2 S19 S20 S22 เริ่ม / ฟอร์มสร้างแผนที่จัดรถครบ (S21 T.1) + ตั้งบทบาท · แทนปุ่ม "ใส่อะไหล่ตัวอย่าง" ของ `/soon/?s=S21` เดิม (เอาออกแล้ว — S21 ทำแล้วที่ `/car-parts/`) |
| หน้าเริ่มของบทบาท (S2 S22) | รากเว็บ `/` พาไป `/approvals/plans/` (ผู้อนุมัติ) · `/warehouse/` (กบค. คลัง) · หน้าที่บทบาทไม่มีสิทธิ์ (`/edit/` `/car-parts/` `/approvals/*` `/warehouse/*`) พากลับราก | routes.md §2 · Sidebar มีเมนู "บำรุงรักษาตามวาระ" อันเดียว (href `/`) ⇒ ต้นแบบให้รากพาไปหน้าเริ่มของบทบาท · **รอเคาะชื่อเมนูของแต่ละบทบาทใน Sidebar** |
| S21 อะไหล่ของรถ บนมือถือ | PartRequestStepPanel เรียงลง (PartsInventoryPanel บน · RequestedPartsPanel ล่าง) + การ์ด "รายการเพิ่มเติม" (Spare Part Card Item อะไหล่=เพิ่มอะไหล่) | จอ Figma มือถือใช้แบบสำรอง (Section header + ตาราง + popup "รายการเพิ่มเติม") ซึ่งเลือกอะไหล่จากคลังไม่ได้ — ต้นแบบใช้แผงของไฟล์ Maintain-D ทั้ง 2 ขนาดให้เลือกจากคลังได้ · **รอเคาะ** |
| S21 ปุ่ม "บันทึกอะไหล่ของรถ" State=Disabled | Primary button | การ์ด "รายการเพิ่มเติม" ของไฟล์ Maintain-D ไม่มี Helper text/Error ⇒ ปิดปุ่มบันทึกจนกว่าจะกรอกชื่ออะไหล่และราคาต่อหน่วยครบ (Condition: ชื่อ ราคา บังคับ) แทนข้อความ error ที่ไม่มีในจอ |

| `patterns/FormModal` | Modal Type=Form + Modal header Left (ไม่มี Featured icon) + Card form row (Text input / Text area) + Modal footer Horizontal right · มือถือ Bottom sheet + Bottom sheet footer | formModal() ใน core.js ใช้ซ้ำหลาย scenario (S2 S7 ส่งกลับ · S6 แก้ไขเบอร์/สถานที่ · S21 รายการเพิ่มเติม) |
| `patterns/PopupModal` | Background overlay + กล่อง white รัศมี 12 กว้าง 640/800 + Modal header Left + เนื้อหาอิสระ + Modal footer Horizontal right · มือถือ Bottom sheet | popupModal() ใน screens.js — Modal ของไลบรารีมีแค่ md/lg/xl และเนื้อหาตายตัว ใช้กับตาราง/อัปโหลดใน popup (S6 เพิ่มรถ · S10 ฯลฯ) |
| `patterns/NotificationPanel` | Notification card + _Notification item base + Status ลอยใต้ Header navigation (ขวา 24 · ใต้หัว 8) · มือถือ Bottom sheet "แจ้งเตือน (n)" + การ์ดไม่มีหัว/ท้าย + ปุ่ม "ลบข้อความแจ้งเตือนทั้งหมด" | notiPanel() ใน screens.js (S8) — Notification card ไม่มี variant มือถือ · desktop ไม่มีพื้นทึบ (คลิกนอกแผง = ปิด) |
| `patterns/DisplayBox` | Section label + กล่อง gray-50 รัศมี 8 ขอบใน 24 ช่องไฟ 24 + Content item row (Text with label) แถวละ 4 / มือถือ 2 | kv() + displayBox() ใน core.js (กล่องแสดงข้อมูลหน้า Detail) · desktop ใช้ VehicleAndReporterInfo ของไฟล์ Maintain-D ได้ (ช่องไฟ 16) |
| `patterns/PhotoGallery` | Section label + Images Size=sm × สูงสุด 4 (มือถือ 2) ช่องไฟ 16 | photoGallery() fallback ใน screens.js · desktop ใช้ IncidentPhotoGallery ของไฟล์ Maintain-D |
| มือถือของ `ModalSignature` · `SummaryRequestedParts` · `PartRequestStepPanel` | Bottom sheet + เนื้อหาเดียวกับ desktop + Bottom sheet footer · PartRequestStepPanel เรียงลง | ไฟล์ Maintain-D มีแต่ desktop · S4 มือถือใช้ ConfirmDialog ตาม spec (SummaryRequestedParts บนมือถือเป็นทางเลือก) |
| ช่องเลือกชื่อใน `HandoverSignature` | Input dropdown + Dropdown list | ไฟล์ Maintain-D วาดเป็น Text input + ลูกศร keyboard_arrow_down · S10 spec ระบุ Input dropdown → ใช้ Input dropdown ของไลบรารี (หน้าตาเดียวกัน) |
| ช่องวาดลายเซ็นใน `ModalSignature` | Container ของ Text area (สูง 249) + canvas วาดด้วยเมาส์/นิ้ว + Tertiary button close (ล้าง) | ไฟล์ Maintain-D แสดงภาพลายเซ็นในกรอบ Text area — ต้นแบบให้วาดได้จริง (ผลเป็นภาพ data URL ในข้อมูลจำลอง) |
| แบตเตอรี่ใน `ReceiptChecklist` มือถือ | Text input ยี่ห้อ + จำนวน + หน่วย ใต้ชื่อรายการในการ์ด | ไฟล์มีช่องนี้เฉพาะตาราง desktop · การ์ดมือถือของไฟล์ไม่ได้แสดงช่องแบตเตอรี่ |
| `src/app/kit/KitBlocks.tsx` `KitMore.tsx` | Section label เป็นหัวแต่ละชุด | หน้า /kit/ ของต้นแบบ (แยกไฟล์ให้หน้า kit ไม่ยาวเกิน) |

## ข. ค่าที่ไลบรารีมีแต่ไม่มี token (ไม่ได้ hardcode — ใช้ค่าใกล้เคียงแทน · รอเคาะ)

ตรวจใหม่กับดัมป์ 4 พ.ย. 2569 (มี `vars` `effects` `paint` `sws`) — รายการที่กลายเป็นค่าตรงแล้ว (overlay 40% · เงา Dropdown/Notification · Modal ไม่มีเงา · เส้นแยกด้าน · Purple · Tab item Active · วงโฟกัส) ย้ายออกจากตารางนี้แล้ว ดูท้ายหัวข้อ

| จุด | ค่าในไลบรารี | ที่ใช้แทน |
|---|---|---|
| Avatar (Header navigation · แถวผู้ใช้ใน Sidebar navigation) | วงกลม พื้น #DCD3FF (ไม่ผูก Variable) + ภาพคน (paint `image`) | `purple-200` (#DDD6FE ใกล้สุด) ไม่มีภาพ · Avatar ใน Dropdown list item ปิดไว้ · component "Avatar" (หน้า Avatar 2:20) มี SVG แต่ฝังภาพถ่าย ~460 KB ไม่ได้ใช้ |
| ขอบการ์ด/กล่องของ Spare Part Card Item · PartsInventoryPanel · RequestedPartsPanel (ไฟล์ Maintain-D) | #E9EAEB (ไม่ผูก Variable) | `gray-200` (#EAECF0) |
| ไอคอนลบในการ์ด Spare Part Card Item | delete 24 สี #1C1B1F | Tertiary button ไอคอนอย่างเดียว (gray-600) |
| ข้อความว่างของ RequestedPartsPanel | #181D27 / #535862 ขนาด 12.6 | `black` / `gray-600` ขนาด 12 |
| _Content item base Type=Attachment | ตัวอักษร #444CE7 | `info-700` (#3538CD ใกล้สุด) |
| ปุ่มท้าย Notification card | Primary button สูง 36 (instance ย่อ) | Primary button md 40 |
| พื้นหลังกรอบ Notification (520×240 · มือถือ 360×260) | paint GRADIENT_LINEAR ดำ 10% → 0% ที่ 95% · ดัมป์ไม่บอกทิศ (ไม่มี gradientTransform) | ยังไม่ทำ (มีแค่การ์ด) |

ค่าที่ตรงแล้ว (ดัมป์ 4 พ.ย. 2569):
- Background overlay = paint `#00000066` Variable `Color/background/overlay` → token `--overlay` (`bg-overlay`) 40%
- เงา Dropdown menu · Dropdown list · Notification (การ์ด) = DROP_SHADOW #10182814 y12 blur16 spread-4 → token `--shadow-lg` (`shadow-lg-lib`) · Tooltips ใน Nav button มีเงาเดียวกันแต่ `visible:false` (ไลบรารีซ่อน → ต้นแบบไม่แสดง)
- Modal · Bottom sheet (Sheet) ไม่มี effect ในไลบรารี → เอาเงาออก · Bottom sheet รัศมีบน Radius/600 = 24 ตรงกับ `rounded-t-sheet`
- เส้นแยกด้าน (`sws` [บน,ขวา,ล่าง,ซ้าย]): Table cell / Mobile table item (Text · Lead text · Badge) [0,0,1,0] Color/border/secondary = gray-200 · Tab item ไม่ Active [0,0,1,0] Color/border/primary = gray-300 · Tab item Active [0,0,2,0] Variable `Color/component/utility/brand/900` = brand-900 (hex ในดัมป์ #6E1AE7 เป็นค่าของโหมดในไฟล์ Component — ยึดชื่อ Variable) · Tabs [0,0,1,0] gray-300 · Header navigation [0,0,1,0] gray-200 · Sidebar navigation Expanded [0,1,0,0] / Collapsed [0,1,1,1] gray-200 · _Dropdown menu header [0,0,1,0] gray-200 (ต้นแบบยังไม่ใช้ header) · Modal header / Modal footer / Bottom sheet header / Bottom sheet footer / Table header / Table header cell / Page header / Section header / Section label / Mobile table item Action icons·Action buttons มี `sws` แต่ไม่มีสีเส้น = ไม่มีเส้นให้เห็น
- Pill outline `Color=Purple` = purple-50 / purple-200 / purple-700 · Featured icon `Color=Purple` พื้น purple-50 ไอคอน md purple-700 · sm purple-600 (token v0.74)
- วงโฟกัส State=Focused (ปุ่ม Primary/Secondary/danger · Text input · Input dropdown · Checkbox) = DROP_SHADOW spread 4 ทึบ 12% → token v0.74 `--focus-ring` (brand-900) · `--focus-ring-gray` (gray-500) · `--focus-ring-error` (error-600) = `shadow-ring` / `shadow-ring-gray` / `shadow-ring-error`
- Spacing/Radius Variable ↔ px ในดัมป์ไลบรารีตรงกันทุกจุด: Spacing/none 0 · 100 4 · 200 8 · 300 12 · 400 16 · 500 20 · 600 24 · 800 32 · 1000 40 · Radius/none 0 · 100 4 · 200 8 · 300 12 · 400 16 · 600 24 · full 9999 = สเกล Tailwind (4 px ต่อหน่วย) + `rounded-xs/md/lg/xl/pill/sheet` ที่ใช้อยู่ (ไม่มี `rounded-sm` 6 px ในโค้ด)

## ค. asset ที่ดัมป์ไม่มี

| จุด | ที่ทำ |
|---|---|
| PEA logo (Sidebar navigation) · Brand logo (Header navigation Tablet/Mobile) | `public/pea-logo.svg` ยก path จากภาพส่งออกหน้าจอ Figma `Maintenance-Request-Form/figma/สรุปรายการอะไหล่.svg` (ไม่ได้วาดเอง) · Brand logo ของ Header ใช้ตัวเดียวกัน (ไลบรารีมีตัวอักษรต่อท้ายที่ยังไม่มีไฟล์) |
| ภาพ Graphic 200×200 ของ Empty state/Data empty | ยังไม่แสดง — ดัมป์ 4 พ.ย. 2569 บอกว่าเป็นพื้นภาพ (paint `image`) ไม่ใช่ vector จึงไม่มี SVG — รอส่งออกรูปจาก Figma |
| ภาพใน Images / IncidentPhotoGallery / PhotoGallery / Images ของ File upload Type=Gallery | ต้นแบบไม่มีไฟล์ภาพจริง → ช่องภาพ Images Type=Empty (พื้น gray-200 ไอคอน imagesmode 48 gray-300) · ส่ง `src` เมื่อมีภาพ |
| ภาพ Graphic 200×200 ของ Empty state/Search not found | เหมือน Data empty — พื้นภาพ (paint image) ไม่มีไฟล์ → ยังไม่แสดง |
| ไอคอน resize-right ของ Text area | ไม่ใช่ฟอนต์ Material → ใช้ SVG ของ component "resize-right" (หน้า Icons) จากดัมป์ `figma-spec/svg/resize-right.svg` (สำเนา `public/figma-svg/`) |
| ไอคอนและข้อความเมนูใน Sidebar navigation | ไลบรารีเป็นไอคอนตั้งต้น (crop_free) และข้อความ "Text" → ใช้ชุดของ component "Sidebar" ในหน้า "Sidebar Navigation" (277:230639) ของ UI Release#2: หน้าหลัก (home) · ระบบจองยานพาหนะ (car_rental) · จัดการคำขอใช้ยานพาหนะ (traffic_jam) · ข้อมูลพนักงานและยานพาหนะ (database) · การอัดประจุไฟฟ้า (ev_station) · งานซ่อมและบำรุงรักษา (build) · จัดการเหตุการณ์ (e911_emergency) · รายงาน (news) / โหมดสว่าง (light_mode) · ล็อกหน้าจอ (lock) · ใบอนุญาตขับขี่ (id_card) · ผู้ใช้ (Avatar + logout) · เมนูย่อย "บันทึกการอัดประจุ Wall Charger" ตาม Sidebar (component Nav menu EV ซ้ำ "อัตราค่าไฟฟ้า") |
| Brand logo (Light mode) แบบมีตัวอักษรใน Sidebar navigation State=Expanded | ไม่มีไฟล์ตัวอักษร → ใช้ `pea-logo.svg` 32 ตัวเดียวกับ Collapsed · ดัมป์ 4 พ.ย. 2569 ยังไม่มี component โลโก้ PEA แบบมีตัวอักษรที่มี SVG (โลโก้ใน Header navigation เป็น vector ใน instance — SVG ดึงได้เฉพาะ component กราฟิก) |
| ชื่อไอคอนที่ฟอนต์ Material Symbols ไม่มี | `warning_circle` → `error` · `cancel_circle` → `cancel` (ใน `Ms.tsx`) |

## ง. ข้อความที่จอ Figma ไม่ได้ระบุ (รอเคาะ)

| จุด | ที่ใช้ |
|---|---|
| S1 ยืนยันเอา **ภาค** / **ประเภทรถ** ออก | จอ Figma มีแค่ "ยืนยันการเอาเขตออก" → ใช้รูปเดียวกัน "ยืนยันการเอาภาคออก" / "ยืนยันการเอาประเภทรถออก" + "รถของ {ค่า} ที่จัดไว้ {n} คัน จะถูกเอาออกจากทุกไตรมาส" (Condition: "ถามยืนยันแบบเดียวกับเขต") |
| S1 toast บันทึกไม่สำเร็จ | จอ Figma เขียน "general error" → ใช้ข้อความนี้ตรงตัว |
| S1 ค้นทะเบียนไม่เจอในรายการเลือกรถ | "ไม่พบทะเบียนที่ค้นหา" (จอ Figma ไม่มี state นี้) |
| S1 ภาค/ประเภทรถในตารางรายการ เมื่อเลือกหลายค่า | ต่อด้วย ", " |
| ข้อความใน Date picker | ค่าตั้งต้นไลบรารี Mo–Su · "Dec 2024" · Clear / Cancel / Apply (screens.js ไม่ได้เปลี่ยน) — component รับ `weekdays` `monthLabel` `ClearText` `CancelText` `ApplyText` · **รอเคาะว่าใช้ภาษาไทย/พ.ศ. หรือไม่** |
| หัวข้อตั้งต้นของ RepairFeedback / RequestedPartsPanel / SummaryRequestedParts | ค่าของไฟล์ Maintain-D (งานซ่อม) "คะแนนประเมินคุณภาพงานซ่อมบำรุง" / "อะไหล่ที่ต้องการใช้งาน" / "สรุปรายการอะไหล่" — scenario ส่งข้อความตาม spec (S14 S21 S4) |
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
| Mobile table ที่ไม่มีแถว Action icons | ไลบรารีมีแต่แบบที่ปิดท้ายด้วย Action icons (แถวนั้นไม่มีเส้น) · แถว Text มีเส้นล่างเสมอ ⇒ การ์ดที่ไม่มีปุ่ม แถวท้ายไม่ใส่เส้นล่าง (กันเส้นซ้อนกับขอบการ์ด gray-300) |
| วงโฟกัสตอนใช้งานจริง | variant State=Focused บอกหน้าตา ไม่บอกว่าเกิดเมื่อไร ⇒ ปุ่ม/Checkbox = `focus-visible` · ช่องกรอก = `focus-within` · Input dropdown = ตอนรายการเปิด · Checkbox State=Hover มีวงด้วย (ตามไลบรารี) |
| RepairFeedback บนมือถือ | การ์ด 5 ใบแถวเดียว (S14: ช่องไฟ 8) กว้างไม่พอขอบใน 16 → ขอบในข้าง 12 |
| หัวตาราง ReceiptChecklist / InspectionChecklist | ตามไฟล์: ReceiptChecklist หัวสูง 74 · InspectionChecklist "รายการ" สูง 88 (2 ชั้น) + หัวกลุ่ม 44 + หัวย่อย 44 · แถว 56 ไม่มีเส้น พื้นสลับ |
| ชำรุด / ผิดรุ่น ใน ReceiptChecklist | Checkbox กดได้เมื่อเลือก "มี" (เลือก "ไม่มี" ล้างค่า) — ไฟล์ไม่ได้บอกพฤติกรรม |
| Date picker วันนอกเดือน | แสดงเป็น Day State=Disabled ตามไลบรารี (ทั้งต้นและท้ายเดือน) · สัปดาห์เริ่มวันจันทร์ (Mo) ตามไลบรารี |
| File upload ปุ่มในแถวไฟล์ | In progress = close (ยกเลิก) · Error = restart_alt (ลองใหม่) + close · Completed = download + delete ตาม _File upload item base |
| S2 S19 แท็บไตรมาสที่ไม่มีรถ (รายละเอียดแผน) | ตารางว่าง (มีแต่หัวตาราง · มือถือไม่มีการ์ด) | จอ Figma วาดแค่ไตรมาส 1 · spec ให้ใช้ Empty state ของ S1 "ยังไม่มีรถในไตรมาสนี้" เมื่อเจ้าของงานเห็นด้วยเท่านั้น |
| S22 แถวรายการเพิ่มเติมในอะไหล่ที่ต้องเบิก | รหัส "-" · คงเหลือในคลัง "-" · ไม่พอ "-" | อะไหล่ที่ กบค. ระบุเองไม่มีในคลัง — จอ Figma ไม่ได้วาดแถวนี้ |
| S21 breadcrumb เมื่อเปิดจากฟอร์มแก้ไข | บำรุงรักษาตามวาระ › แก้ไขแผน MR … › อะไหล่ของรถ | จอ Figma วาดเฉพาะทางสร้างแผน ("สร้างแผน") |
| S22 แถบสถานะคลังในรายละเอียดแผน | ข้อความตามแท็บไตรมาสที่เปิด ("…ไตรมาส n…") | screens.js เช็คเฉพาะไตรมาส 1 · userflow "แถบในแท็บไตรมาส" |

## ฉ. batch B — S4 S6 S9 S7 S8 S15 S16 S17 (4 พ.ย. 2569)

| จุด | ประกอบจาก / ที่ทำ | เหตุผล |
|---|---|---|
| ตารางติ๊กเลือกรถใน popup เพิ่มรถเข้าแผนเดินทาง (`app/quarter/_shared/TripCarPicker`) | Table header cell (Checkbox ที่หัวคอลัมน์แรก · Unselected/Indeterminate/Selected) + Table cell Style=Lead checkbox วางเป็นตารางเอง · มือถือ List with checkbox (หัว "ทะเบียน") | `Table` ของต้นแบบรับช่องติ๊กในแถวไม่ได้ · ตาม tripCarModal() ใน screens.js (Select vehicles ของ UI Release#2) |
| ช่องค้นหาใน popup เพิ่มรถ | Text input ไม่มีป้าย ไอคอน search กว้าง 320 (ส่วนค้นหาของ Table header) | screens.js ซ่อน Actions (ปุ่มตัวกรอง) ของ Table header แต่ component `TableHeader` แสดงปุ่มตัวกรองเสมอ |
| ช่องค้นหาผู้รับจ้าง / พนักงาน กบค. ซ่อม | Input dropdown (property Cursor พิมพ์ค้นได้) + Dropdown list (ชื่อ + Supporting text ประเภทรถ) · ไม่พบ = ไม่แสดงรายการ | จอ "ค้นไม่พบ" ยังไม่ออกแบบ |
| Date picker ในฟอร์มแผนเดินทาง | Date picker Type=Dual ลอยใต้ช่องวันที่เริ่ม (desktop) · มือถือพิมพ์ วว/ดด/ปปปป ในช่อง | screens.js ไม่วาด date picker บนมือถือ · "เลือกก่อนวันนี้ไม่ได้" ยังไม่บังคับ (component ไม่มีวันต่ำสุด) |
| กดกระดิ่ง (S8) | หน้า `/trips-view/*` ดักคลิกปุ่ม aria-label "การแจ้งเตือน" ใน Header navigation แล้วเปิด patterns/NotificationPanel | AppFrame / HeaderNavigation ยังไม่มี prop กดกระดิ่ง — **รอ lead เพิ่ม `onBell` แล้วเปลี่ยนมาใช้** |
| สรุปเบิก/จอง (S4 desktop) | SummaryRequestedParts ของไฟล์ Maintain-D: กลุ่ม "เบิกจากคลัง Smart Inventory (3 รายการ)" หัวย่อย เบิกที่ Smart Inventory / เบิกที่คลังสำรอง · กลุ่ม "คงเหลือไม่พอ — รอจัดซื้อ ผพจ. (2 รายการ)" หัวย่อย จัดซื้ออะไหล่เพิ่มโดย Smart Inventory / ผพจ. · ยอดรวม 24,800 บาท | screens.js ตั้งแค่หัวกลุ่มและยอดรวม แถวในกลุ่มเป็นค่าตั้งต้นของ component — แถวในกลุ่มจัดตามคลัง/ผู้จัดซื้อ (รอเคาะ) |
| เปิด scenario จาก `/scenarios/` (`lib/mock/seedB.ts`) | ลิงก์ส่ง `?seed=S4…S17` ⇒ ตั้งข้อมูลจำลอง + บทบาทให้อยู่จุดเริ่มของ scenario แล้วลบออกจาก URL | ไม่มีบนจอ (ของต้นแบบ) |
| state ที่ไม่มีทางกดถึงในจอ | S4 `?sim=down` Smart Inventory ขัดข้อง (C.5) · `?sim=empty` ไม่มีอะไหล่ (C.6) · รอจัดซื้อ → เบิกแล้ว (C.3 → C.4) จำลองว่าของเข้าคลังเมื่อกลับมาเปิดหน้าใหม่ | จอไม่ได้วาดปุ่มลองใหม่/ช่วงรอของเข้าคลัง |

ข้อความที่จอไม่ได้ระบุ (batch B): ไม่มีข้อความใหม่ — S16 ตีกลับไม่มี toast/จอผล (กลับหน้ารายการ แถวเป็น "ตีกลับ" ตาม HST.back) · ปุ่ม "ตีกลับ" ใน popup กดไม่ได้จนกว่าจะพิมพ์เหตุผล (ข้อความ error ยังไม่มี) · "ลบข้อความแจ้งเตือนทั้งหมด" ลบแจ้งเตือนของบทบาทนั้น · "ดาวน์โหลดรายงาน" ยังไม่ทำอะไร (Q25)
