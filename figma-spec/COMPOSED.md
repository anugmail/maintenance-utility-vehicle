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
| S10 หน้างานรายคัน "บำรุงรักษาไม่ได้" ของแผนตรวจเอง (`src/app/trips/job/CannotView.tsx`) | VehicleAndReporterInfo × 3 (ข้อมูลยานพาหนะ · การนัดหมาย · บำรุงรักษาไม่ได้) + Section label "อะไหล่ส่งคืน (n)" + Table RET_COLS | screens.js ไม่ได้วางจอนี้ (S10 Condition "ไม่มีปุ่ม ดูอย่างเดียว") → ยกโครงคันที่แจ้งบำรุงรักษาไม่ได้ของ `hireJob()` (S23/S11) · **รอเคาะ** |
| S10 หน้าปิดงาน: แก้ไขแถว "รายการสภาพวัสดุอะไหล่" | กดแถว Table → popup (PopupModal) โครง `partEditModal()` ของ S23 เดิม (ลบจาก screens.js พร้อม S23 4 พ.ย. 2569 — ดูหัวข้อ ฐ.) (รายการงาน · จำนวนตามแผน · จำนวนที่ใช้จริง · จำนวนที่คืน) + ช่อง "จำนวนอะไหล่เก่า" "หมายเหตุ" (ชื่อหัวคอลัมน์ตาราง) | Table cell ของไลบรารีไม่มีช่องกรอก (จอ Figma เป็นข้อความ) แต่ userflow ให้แก้จำนวนที่ใช้/อะไหล่เก่า/หมายเหตุได้ · ปุ่ม "เพิ่มรายการ" ใช้ popup "เพิ่มอะไหล่ที่ใช้จริง" (`partAddModal()`) · **รอเคาะ** |
| ปุ่ม "เพิ่มรายการ" ของรายการเอกสารรับรถ / ตรวจสภาพรถปิดงาน / บันทึกตรวจสอบเอกสารปิดงาน · ปุ่ม "อัพโหลดเอกสาร" | ปุ่มของ component (ยังไม่ทำงาน · อัพโหลดเอกสารเปิดเลือกไฟล์แล้วเก็บชื่อไฟล์ ไม่แสดงรายการ) | จอ Figma ไม่ได้บอกว่ารายการที่เพิ่มเองตั้งชื่ออย่างไร และไม่มีจอแสดงไฟล์เอกสาร (S10 ยังไม่เคาะ) |
| `?sample=` ของหน้า `/trips/detail/` (ลิงก์ S10 S12 ในหน้า `/scenarios/`) | — (ข้อมูลจำลองอย่างเดียว) | ใส่สถานะงานชุด JOB_SETS ของ screens.js (`T1_start` `T1_afterClose` `T1_afterCannot` `TV_start` `TV_vendor` `TV_kbk`) ให้เปิดดูจอตามลำดับได้ทันที · ระบบจริงไม่มี |
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

## ฉ. ชุด C (S10 S12 S13 S14 — งานรายคัน แผนจ้างดำเนินการ ยอมรับผล · S23 S11 ตัดออก 4 พ.ย. 2569 ดูหัวข้อ ฐ.)

รวมชุด C1 (S10 S12) กับ C2 (S13 S14 · เดิมมี S23 S11) เป็นชุดเดียว: หน้ารายละเอียดแผนเดินทาง `/trips/detail/` และหน้างานรายคัน `/trips/job/` ใช้ทั้งแผนตรวจเอง (T1) และแผนจ้าง (TV) · ชิ้นประกอบอยู่ที่ `src/app/trips/_lib/ui.tsx` ที่เดียว

| ส่วน | ประกอบจาก | เหตุผล |
|---|---|---|
| `src/app/trips/_lib/ui.tsx` `ButtonRow` | แถวปุ่ม Secondary + Primary (ชิดซ้าย–ขวา · ปุ่มเดียวชิดขวา · มือถือแบ่งเท่ากัน) | btnRow() ของ core.js ไม่มี component แถวปุ่มในไลบรารี (แบบเดียวกับท้ายฟอร์ม `/new/`) · หน้ายอมรับผล `/acceptance/*` ใช้ตัวเดียวกัน |
| `src/app/acceptance/_lib/ui.tsx` `DocList` | Input label + _File upload item base (Download action อย่างเดียว ไม่มีแถบ) | carResult() (S13) ต้องการไฟล์ดาวน์โหลดได้อย่างเดียว — File upload `readonly` ของไลบรารีซ่อนทั้งดาวน์โหลดและลบ |
| `PartEditModal` · `PartAddModal` · `CannotPopup` ใน `src/app/trips/_lib/ui.tsx` (ใช้ทั้งหน้างานรายคัน หน้าปิดงาน และแผนจ้าง) | `patterns/PopupModal` + Text input / Input dropdown / Text area + Section header + Table | partEditModal · partAddModal · cannotModal ของ screens.js · หน้าปิดงานเปิด PartEditModal แบบ `extra` (+ จำนวนอะไหล่เก่า หมายเหตุ) · ไม่มีข้อความ error ของ popup อะไหล่ในสเปก ⇒ ปุ่มหลัก Disabled จนกรอกครบ / ใช้จริงเกินแผน (**รอเคาะข้อความ error**) |
| `?sample=TV_mid` · `S13` `S14` | (ไม่มี component) — `src/lib/useSample.ts` | ของต้นแบบ: ลิงก์จาก `/scenarios/` ใส่ข้อมูลตั้งต้นของ scenario + สลับบทบาท แล้วเอา sample ออกจาก URL · `?sample=S23` `S11` เดิมไม่รู้จักแล้ว = ข้ามไป (ไม่ใส่ข้อมูล ไม่พัง) |

## ช. รวมงาน (integrate · 4 พ.ย. 2569) — ทางเชื่อมข้ามชุด

screens.js ไม่ได้วาดปุ่มไปขั้นถัดไปในหน้ารายละเอียดแผน (planDetail() มีแค่ ลบแผน + แก้ไข) ⇒ ใช้แบบที่มีอยู่แล้วในหน้าเดียวกัน (ปุ่มใน Page header · ปุ่มใน Section label) ข้อความปุ่มยกจากชื่อหน้าปลายทางในจอ Figma/userflow

| จุด | ประกอบจาก / ที่ทำ | เหตุผล |
|---|---|---|
| `/detail/` แท็บไตรมาสที่กำลังทำ (plan.nowQ) ของแผนอนุมัติแล้ว/ดำเนินการ (กบค.) | Section label "รถในแผน" + Secondary action **Tertiary button "ความคืบหน้าอะไหล่"** (→ `/quarter/parts/?id=&q=`) + Primary action **Tertiary brand button "แผนเดินทาง"** (→ `/quarter/trips/?id=&q=`) | เจ้าของงาน 4 พ.ย. 2569 ให้เข้า S4 และแผนเดินทางของไตรมาสจากหน้ารายละเอียดแผน · ข้อความ = หัวหน้า S4 "ความคืบหน้าอะไหล่ · ไตรมาส n" / breadcrumb + Section label "แผนเดินทาง" ของ S6 · Section label มี property Primary/Secondary action อยู่แล้ว (ใช้แบบเดียวกับ "สร้างแผนเดินทาง" ของ S6) |
| `/detail/` ปุ่มหัว "ส่งประวัติ" (กบค.) | Page header Actions + Primary button "ส่งประวัติ" (→ `/closeout/history/?id=`) · แสดงเมื่อแผน "ดำเนินการ" และรถทุกคันในแผนเดินทางที่อนุมัติแล้วเสร็จสิ้น/บำรุงรักษาไม่ได้ (หรือหน่วยงานยอมรับทั้งแผนแล้ว) | userflow S15 "ส่งประวัติ" · ปุ่มเดียวในหัวแบบ planIssue() ("ออกเลขงาน") · ตอนนั้นไม่มีปุ่มแก้ไขแล้ว (ดำเนินการ = ซ่อน) |
| `/detail/` ปุ่มหัว "รายงานผลการบำรุงรักษา" (กบค.) | Page header Actions + Primary button (→ `/closeout/report/?id=`) · แผน "ประวัติผ่านแล้ว" / "ปิดงานแล้ว" | userflow S17 "กด รายงานผลการบำรุงรักษา" · ชื่อหน้าปลายทาง |
| แผน "อนุมัติแล้ว" → "ดำเนินการ" | เมื่อ กบค. กดยืนยันเบิก/จองอะไหล่ครั้งแรก (S4) | screens.js วาดหน้า S4–S17 ด้วยสถานะ active แต่ไม่ได้บอกจุดเปลี่ยน — **รอเคาะ** |
| Breadcrumbs หน้า `/trips/*` | "แผน MR …" → `/detail/?id=` · "แผนเดินทาง ไตรมาส n" → `/quarter/trips/?id=&q=` · ทุกบทบาทชุดเดียวกัน (แบบข้อความเฉย ๆ ของผู้รับจ้างเอาออกพร้อม S23) | — |
| หน้าเริ่มของบทบาท (เข้าราก `/`) | หัวหน้า กบค. → `/head-review/` · กรย. / หน่วยงานเจ้าของรถ → `/trips-view/` · หน่วยงานเจ้าของรถที่มีรถรอยอมรับผล → `/acceptance/` · ผู้อนุมัติที่มีแผนเดินทางรออนุมัติ → `/approvals/trips/` · (บทบาทผู้รับจ้างเอาออก 4 พ.ย. 2569 พร้อม S23) | Sidebar navigation เมนูอื่นยังไม่พาไปไหน (CLAUDE.md ข้อ 10) — ไม่มีทางกดเข้าหน้าของบทบาทอื่น |
| ที่เก็บแผนเดินทางที่เดียว | `MockState.trips` (trips.ts) — หน้างานรายคันอ่านใบที่อนุมัติแล้วผ่าน `jobsOf()` (jobs.ts) · แก้เบอร์/สถานที่/เอารถออก เขียนกลับใบเดียวกัน · ชุดตัวอย่าง `?seed=` / `?sample=` ตั้งใบ T1/TV ในที่เก็บนี้ | ไม่มีบนจอ |
| รายการยอมรับผล (S13) | แถวจากงานรายคันที่เสร็จสิ้น/บำรุงรักษาไม่ได้ของแผนเดินทางที่อนุมัติแล้ว (แทนแถวคงที่ ACCEPTANCE_CARS) · แถว "ทั้งแผน (n คัน)" ขึ้นเมื่อรถทุกคันในแผนเดินทางของแผนถึงขั้นนี้และยอมรับครบ · ช่วงวัน = วันแรก–วันสุดท้ายของแถว · ผู้ทำ = กบค. (ตรวจเอง) / ชื่อผู้รับจ้าง (ตามใบจ้าง — ผู้บันทึกรายคันเป็น กบค.) | screens.js มีแค่ 3 แถวตัวอย่าง ("04–12/11/2569") — ชุดตัวอย่าง `?sample=S13/S14` ใส่ 3 คันนั้นเป็นงานเสร็จสิ้นของแผนเดินทาง T1 · คันบำรุงรักษาไม่ได้แสดงสถานะ "รอหน่วยงานยอมรับ" (ACC มี 2 สถานะ) |

ข้อความบนจอที่ตัดรหัสอ้างอิงภายในออก (เจ้าของงาน 4 พ.ย. 2569 — ไม่แสดงรหัส scenario/บอร์ดบนจอ): "กบค. ออกรายงานผลและปิดงานได้ (S17)" → "กบค. ออกรายงานผลและปิดงานได้" · "ไปขั้นคำนวณต้นทุน (S18) ได้" → "ไปขั้นคำนวณต้นทุนได้" · "บอร์ด: "บำรุงรักษาเสร็จทั้งหมดหรือไม่?" — ครบแล้วจึง…" → "ครบแล้วจึงบันทึกและส่งประวัติให้หัวหน้า กบค. ตรวจสอบได้" · "แก้ไขไม่ได้จนกว่าหัวหน้าจะตีกลับ (S16)" → "แก้ไขไม่ได้จนกว่าหัวหน้าจะตีกลับ"

## ซ. S24 ข้อมูลการบำรุงรักษารายคัน (`/vehicles/maintenance/` · `/vehicles/detail/` · 4 พ.ย. 2569)

ที่มา: `maList()` `maDetail()` `filterPanel()` `searchNotFound()` ของ screens.js / core.js · Vehicle list + Filter + Vehicle detail ของหน้า "Vehicle Management" ใน UI Release#2 · ชิ้นประกอบอยู่ที่ `src/app/vehicles/_lib/ui.tsx` ที่เดียว

| ส่วน | ประกอบจาก | เหตุผล |
|---|---|---|
| `MaTable` (desktop) | Table header cell + Table cell วางเป็นตารางแบบ `Table` + Table pagination | ช่อง "กำหนดครั้งถัดไป" / "ครบกำหนด" ต้องมีบรรทัดรองสีเตือน/แดง (`toneText()` ใน core.js · Supporting text ผูก Color/text/warning · Color/text/error ตาม Vehicle list) แต่ Table cell ของต้นแบบมี Supporting text สี gray-600 อย่างเดียว ⇒ ส่งข้อความ + บรรทัดรอง (12 · สีตามสถานะ) เป็น Text ของ Table cell |
| `MaCards` (มือถือ) | Mobile table + Mobile table item (Supporting text · Action icons) | เหตุผลเดียวกัน · บรรทัดรองสีอยู่ใต้ค่า (ตำแหน่ง Supporting text) · ปุ่ม … = ไอคอนดู (กติกาข้อ 14) |
| `FilterPanel` (desktop) | Background overlay + แผ่น white กว้าง 480 ชิดขวาเต็มสูง (ตาม filterPanel()) + **Side panel header** (ขอบใน 24 ช่องไฟ 16 เส้นล่าง gray-300 · Featured icon Gray md `filter_list` · หัวข้อ 20 SemiBold black "ตัวกรอง" · Supporting text 14 gray-600 · ปุ่มปิด close = Tertiary button แบบ Modal header · Tabs ปิด) + Input dropdown (Optional "(ถ้ามี)") ×4 ขอบในข้าง 24 ช่องไฟ 24 + **Side panel footer** (ขอบใน 16/24 ช่องไฟ 12 เส้นบน gray-300 · Tertiary brand button "ล้างตัวกรอง" ซ้าย · Secondary "ยกเลิก" + Primary "ตกลง" ขวา) | Side panel header / Side panel footer มีในไลบรารี (หน้า Side panel 1931:12930 ของดัมป์ `component`) แต่ยังไม่มีเป็น component ในต้นแบบ (ห้ามแก้ `src/components/`) ⇒ ประกอบตามค่าในดัมป์ · **รอเพิ่มเป็น component** |
| `FilterPanel` (มือถือ) | Bottom sheet "ตัวกรอง" + ปุ่ม "ล้างตัวกรอง" ที่หัว + Input dropdown lg ×4 + Bottom sheet footer ยกเลิก / ตกลง | ตาม `sheet()` ของ filterPanel() มือถือ (ไม่มี Supporting text) |
| แท็บ ปฏิทินการจอง · ยานพาหนะ (รายการ) · แท็บอื่นของหน้ารายละเอียดรถ | Tab item (ไม่มีลิงก์) | ไม่อยู่ใน scenario — แสดงตาม Figma แต่ไม่พาไปไหน |
| ทางเข้า | หน้า `/scenarios/` แถว S24 → `/vehicles/maintenance/?sample=S24` | เมนู "ข้อมูลพนักงานและยานพาหนะ > ข้อมูลยานพาหนะ" ของ Sidebar อยู่ใน `SIDEBAR_MENU` (`src/components/vms/SidebarNavigation.tsx`) และ AppFrame ไม่ส่ง `menu`/`active` ⇒ ใส่ลิงก์/Active ไม่ได้โดยไม่แตะ `src/components/` (Sidebar ยัง Active ที่ "บำรุงรักษาตามวาระ") · **รอ lead เพิ่ม href + active** |
| `?sample=S24` | ชุดงานรายคัน `T1_afterClose` ของ S10 + เอกสาร Safety Inspection ตอนปิดงานของ 82-6789 (`SAFETY_FILES[0]`) | ให้แถว 82-6789 ตรง MA_ROWS (ครั้งล่าสุด 04/11/2569 มาจากงานที่ปิดใน S10 ไม่ใช่ประวัติตั้งต้น) · ของต้นแบบเท่านั้น |

ค่าที่ไม่มี token: บรรทัดรอง "ใกล้ครบกำหนดบำรุงรักษา" — Color/text/warning ในไลบรารีเป็น #DC6803 ไม่มี token ตรง ⇒ ใช้ `warning-600` (#F79009 ชื่อเดียวกับตัวแปรของ Untitled UI ที่ไลบรารีอิง · ใกล้สุด) · "ครบกำหนดบำรุงรักษา" Color/text/error #D92D20 = `error-600` ตรง

ข้อความที่จอไม่ได้ระบุ (S24): ประวัติแถว "บำรุงรักษาไม่ได้" = งานที่ทำ `WSTAT.cannot` + บรรทัดรองสาเหตุ · เลขไมล์/ชั่วโมง/น้ำมัน "-" · รถที่ยังไม่มีบันทึก: หน้ารายละเอียด กำหนดครั้งถัดไป "-" ทุกช่อง + ประวัติเป็น Empty state/Data empty "ยังไม่มีข้อมูลการบำรุงรักษา" · "ล้างตัวกรอง" ในแผง = ทุกช่องกลับเป็น ทั้งหมด (กดตกลงจึงใช้) · ใน Empty state = ล้างคำค้นและตัวกรองทั้งหมด

ข้อมูล (ไม่ใช่ component): `src/lib/mock/maintenance.ts` — ประวัติตั้งต้นจาก MA_ROWS / MA_HIST + งานรายคันสถานะ เสร็จสิ้น / บำรุงรักษาไม่ได้ ใน `MockState.jobs` (อ่านสด) · วันนี้ = 04/11/2569 (`SIGN_DATE`) · ค่าที่คำนวณได้ต่างจากค่าวาดใน screens.js: 82-1145 ชั่วโมงเครื่องจักร "ประมาณ 02/2571" (จอวาด 10/2570) · 80-9981 ครั้งถัดไป 10/01/2570 รอบเวลา (จอวาด 15/01/2570 ชั่วโมงเครื่องจักร — มีบันทึกเดียว ประมาณวันไม่ได้) · 80-4458 วันครบรอบเวลากับ Safety เท่ากัน → แสดง รอบเวลา (จอวาด Safety Inspection) · เปลี่ยนน้ำมันล่าสุดของ 82-1145 ตาม MA_ROWS 12/03/2567 ต่างจาก LAST_OIL ของหน้างานรายคัน (12/03/2568)

## ฌ. S6 E.1 เพิ่ม ลด แก้ไข รถในไตรมาส (E.16–E.20 · BACKLOG ข้อ 3)

| ส่วน | ประกอบจาก / ที่ทำ | เหตุผล |
|---|---|---|
| ปุ่ม "เพิ่มรถ" ของ Section label "รถในไตรมาส n" | Secondary button ไอคอน add (Actions ของ Section label) | `sectionLabel(..., { buttons: [Secondary button 'เพิ่มรถ'] })` ใน tripList() |
| popup "เพิ่มรถเข้าไตรมาส n" | `app/quarter/_shared/TripCarPicker` ตัวเดิม + `title` `sub` `okText` `emptyText` | qAddModal() = tripCarModal() ที่ส่ง o.cars o.title o.sub o.okText · **รถหมด**: screens.js ไม่มีจอ ⇒ Empty state/Data empty "ไม่มีรถที่เพิ่มเข้าไตรมาสนี้ได้" (รอเคาะข้อความ) |
| รถที่เพิ่มได้ | แผนตัวอย่าง (ไม่มีการจัดรถรายคัน) = Q_EXTRA 3 คัน · แผนจากฟอร์ม = รถใน CAND ที่อยู่ในภาค เขต ประเภทรถของแผน และยังไม่อยู่ในไตรมาสใด | Condition S6 "รถในขอบเขตของแผน (ภาค เขต ประเภทรถเดียวกัน) ที่ยังไม่อยู่ในไตรมาสใด" |
| แบ่งหน้ารถในไตรมาส | `PagedTable` ใน `app/quarter/_shared/ui.tsx` (Table / Mobile table + Table pagination กดเปลี่ยนหน้า) | รถเกิน 10 คัน (Table ของไลบรารี 10 แถว R8) |
| ไอคอนแก้ไขของคันที่อยู่ในแผนเดินทางแล้ว | แก้เบอร์/สถานที่ของใบนั้น (TripCarEditModal) | screens.js วาดแค่คันที่ยังไม่มีใบ · คันที่มีใบ ตารางแสดงเบอร์ของใบ ⇒ แก้ที่ใบเพื่อให้ค่าที่เห็นเปลี่ยน (**รอเคาะ**) |
| ข้อความ toast | "เพิ่มรถเข้าไตรมาส n สำเร็จ" · "เอารถออกจากไตรมาส n สำเร็จ" (เว้นวรรคก่อน สำเร็จ ตาม userflow / BACKLOG) | screens.js ต่อข้อความ 'เพิ่มรถเข้า' + NOW_Q + 'สำเร็จ' ไม่มีเว้นวรรค (**รอเคาะ** ให้ตรงกัน) |
| เอารถออกแล้วอะไหล่ออกจากรายการเบิก | แผนจากฟอร์ม: เอาออกจาก plan.alloc (+ picks qty manual ของคันนั้น) ⇒ จำนวนรถของแผน รถรายไตรมาส และรายการอะไหล่ของไตรมาส (S22 คลัง · quarterRows) ตามทันที | หน้าความคืบหน้าอะไหล่ S4 ของต้นแบบยังเป็นตัวเลขตัวอย่าง PARTS (ไม่ได้รวมรายคัน) ⇒ ไม่เปลี่ยน · แผนตัวอย่างไม่มีอะไหล่รายคัน |

## ญ. อะไหล่ตามแผนบนหน้างานรายคัน กบค. แก้ไข ลบ เพิ่ม (BACKLOG ข้อ 4)

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| ไอคอนแก้ไข / ปุ่ม "เพิ่มอะไหล่" ของ กบค. (ยังไม่เริ่ม · อยู่ระหว่างบำรุงรักษา) | popup เดิมของผู้รับจ้าง (S23 ตัดออกแล้ว · ดูหัวข้อ ฐ.): `PartEditModal` (partEditModal) · `PartAddModal` (partAddModal) · ลบ = ConfirmDialog PART_DEL_CONFIRM · ปุ่มเพิ่ม = Secondary button (ตาม jobPage()) | เจ้าของงาน 3 พ.ย. "อะไหล่ตามแผนสามารถแก้ไข ลบ เพิ่มได้" · เดิมลิงก์ไป `/soon/?s=S21` · comment ใน jobPage() ยังเขียน "แก้ไข / เพิ่ม = หน้าอะไหล่ของรถ (S21)" แต่ S21 เป็นหน้าของฟอร์มสร้างแผน ไม่ใช่ของงานรายคัน ⇒ ใช้ popup ของ partEditModal/partAddModal (**รอเคาะ**) |
| ค่าที่แก้ | เก็บเป็นร่างของหน้าปิดงาน (`job.close` ผ่าน `workItems` / `editPartUsed` / `addJobPart` / `deleteJobPart` ใน `lib/mock/jobs.ts` — ย้ายจาก `hire.ts` ที่ลบแล้ว) ⇒ เป็นค่าตั้งต้นของ "รายการสภาพวัสดุอะไหล่" ตอนปิดงาน | ตาราง "รายการงานและอะไหล่ตามแผน" แสดงจำนวนตามแผน (ไม่เปลี่ยน) · จำนวนที่ใช้จริงที่แก้เห็นในหน้าปิดงาน |

## ฎ. S15 S16 S17 อ่านจากงานรายคันจริง (BACKLOG ข้อ 6)

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| แถวประวัติ (HIST_COLS) · ความคืบหน้ารายคัน · สรุปรายงานผล | `src/lib/mock/history.ts` `planHistory()` — รถของแผน = รถในแผนเดินทางที่อนุมัติแล้วของแผน (ไม่มีใบ = จำนวนรถของแผน) · 1 แถว = คันที่ "เสร็จสิ้น" / "บำรุงรักษาไม่ได้" · อะไหล่ที่ใช้รวมตามหน่วย ("30 ลิตร · 5 ชิ้น") · ผลน้ำมัน = Pill ผ่าน/ไม่ผ่าน (ยังไม่มีผลหรือไม่ได้เก็บตัวอย่าง = ช่องว่าง) · ผู้ทำ = ชื่อผู้บันทึกตัดวงเล็บบทบาท · การยอมรับ = ACC | แทนแถวตัวอย่าง HIST_ROWS / PROGRESS_DONE / reportSummary คงที่ |
| แถว "บำรุงรักษาไม่ได้" | งานที่ทำ = "บำรุงรักษาไม่ได้" · อะไหล่ที่ใช้ "-" | จอ Figma วาดเฉพาะคันที่ทำเสร็จ (**รอเคาะ**) |
| Alert "ยังบำรุงรักษาไม่ครบทุกคันตามแผน (เหลือ n คัน)" | แสดงเมื่อยังมีคันที่รอทำ · รถครบแต่หน่วยงานยังไม่ยอมรับทั้งแผน = ไม่มี Alert ปุ่มส่งยัง Disabled | ไม่มีข้อความของกรณีนี้ในจอ (**รอเคาะ**) |
| `?seed=S15` `S16` `S17` | ใส่งานชุด S14 (แผนเดินทาง T1 3 คันเสร็จสิ้น ยอมรับครบ) ก่อนตั้งสถานะแผน | ประวัติอ่านจากงานจริง ไม่มีงาน = ตารางว่าง |

## ฏ. เมนู "…" (`patterns/RowMenu`) — พฤติกรรม (BACKLOG ข้อ 7 · หน้าตาเดิม)

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| ตำแหน่ง | portal ที่ body · พิกัดของหน้า (รวมระยะเลื่อน) ใต้ปุ่ม ชิดขวาของปุ่ม · ใต้ปุ่มไม่พอ (ล้นขอบล่างจอ เหลือ 8) และเหนือปุ่มพอ = พลิกขึ้นเหนือปุ่ม | menuAt() ใน core.js วางใต้ปุ่มเสมอ (จอ Figma ไม่มีแถวล่างสุดของจอ) · แถวล่างของจอรายการหลุดจอ |
| เลื่อนหน้า / เปลี่ยนขนาดจอ | ไม่ปิด · เลื่อนหน้าแล้วเมนูเลื่อนตามปุ่ม · เปลี่ยนขนาดจอ = คำนวณตำแหน่งใหม่จากปุ่ม · ปิดเมื่อคลิกนอก หรือ Esc | เดิมปิดทุกครั้งที่เลื่อน (รวมตอนเลื่อนให้เห็นปุ่ม) |

## ฐ. ตัด S23 S11 — กบค. ปิดงานรายคันของแผนจ้างดำเนินการเอง (4 พ.ย. 2569)

เจ้าของงาน _"อยากตัด scen ผู้รับจ้าง หรือ vendor ตรวจรับทีละคัน ออก คือ S23 และ S11"_ แล้วเลือกให้ กบค. ปิดงานรายคันของแผนจ้างเองด้วยหน้างานรายคันและหน้าปิดงานเดียวกับ S10 · จอ Figma: S10 I.22 (`tripDetail({ trip: HIRE_T, st: HIRE_ST, menu: true })`) · I.23 (`jobPage({ hire: true, st: 'doing' })`) · หน้ารับรถ ปิดงาน บำรุงรักษาไม่ได้ ใช้จอเดิม I.6–I.17 · อ้างอิง Page header · Section label · Table · Dropdown menu ของไฟล์ Component + VehicleAndReporterInfo · IncidentPhotoGallery ของไฟล์ Maintain-D + หน้า RP & MA Job ของ UI Release#2

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| ตัวเลือกพนักงาน กบค. ของใบจ้าง (ผู้รับมอบรถตอนเริ่มงาน · ผู้ส่งมอบรถตอนปิดงาน · พนักงานในค่าใช้จ่ายรายคน) | `staffOf()` ใน `lib/mock/jobs.ts` = พนักงาน กบค. ทั้งหมด (TRIP.staff 3 คน) เมื่อใบไม่มีพนักงาน · ใบตรวจเอง = พนักงานของใบ | ใบจ้างไม่มีพนักงานในใบ · เดิมใช้ชื่อผู้รับจ้าง · จอ I.6–I.17 ป้ายช่องเป็น "(กบค.)" · userflow "ยังไม่เคาะ: ฝ่ายผู้รับมอบ/ผู้ส่งมอบเป็นผู้รับจ้างหรือ กบค." (**รอเคาะ**) |
| ค่าใช้จ่ายของรถคันนี้ในหน้าปิดงานของใบจ้าง | คงส่วนเดิม (ตั้งต้น 1 แถวว่าง) | จอ Figma ใช้หน้าปิดงานเดิม · userflow ยังไม่เคาะว่าแสดงไหม หรือเปลี่ยนเป็นค่าจ้าง (**รอเคาะ**) |
| เวลาเริ่มงาน/ปิดงานของใบจ้าง | เริ่ม HIRE_START "17/11/2569 09:10 น." · ปิดงาน "17/11/2569 13:25 น." (ค่าเดิมของใบจ้าง) · บำรุงรักษาไม่ได้ = เวลาจริง (แบบใบตรวจเอง) | จอ I.23 มีแค่เวลาเริ่มงาน |
| popup แก้ไขอะไหล่ / เพิ่มอะไหล่ที่ใช้จริง / ยืนยันการเอาอะไหล่ออก (หน้างานรายคัน · หน้าปิดงาน) | คงตามเดิม (BACKLOG ข้อ 4) ใช้ทั้งใบตรวจเองและใบจ้าง | `partEditModal` `partAddModal` `PART_DEL_CONFIRM` ของ screens.js ถูกลบไปพร้อม S23 ⇒ **ไม่มีจอ Figma รองรับแล้ว** · userflow S10 ให้ไอคอนแก้ไขและปุ่ม "เพิ่มอะไหล่" ไปหน้าอะไหล่ของรถ (S21) — ยังไม่เปลี่ยนในรอบนี้ (**รอเคาะ** ว่าจะเปลี่ยนเป็นหน้า S21 ไหม) |
| หน้างานรายคันที่บำรุงรักษาไม่ได้ (`CannotView`) | โครงเดิม (ข้อมูลยานพาหนะ · การนัดหมาย · บำรุงรักษาไม่ได้ · อะไหล่ส่งคืน) | เดิมยืมจาก hireJob() ของ S23/S11 ซึ่งตัดออกแล้ว ⇒ ไม่มีจอ Figma |
| ชุดตัวอย่าง `?sample=TV_mid` | HIRE_ST: คันแรก 80-5738 อยู่ระหว่างบำรุงรักษา (กบค. เริ่มงานแทน) · คันที่ 2 81-2210 เสร็จสิ้น (เลือก "เปลี่ยนน้ำมัน" ให้ไม่มีป้ายผลตรวจน้ำมัน ตามจอ I.22) · ที่เหลือยังไม่เริ่ม | ของต้นแบบ — แถว S11 S23 (ตัดออก) ในหน้า `/scenarios/` พาไปที่นี่ |
| แถว S11 S23 ในหน้า `/scenarios/` | คงไว้ท้ายตาราง ช่วงงาน "ตัดออกแล้ว" · ชื่อ + บรรทัดรองเหตุผล · Pill "ตัดออก" (Error) · ปุ่มเปิด = S10 แผนจ้าง | SCEN_CUT ของ screens.js (กลุ่ม "ตัดออกแล้ว" ท้ายตาราง scenario) · ลิงก์เดิมไม่ 404 |
| ข้อมูลเก่าในที่เก็บ (`mt-next-v1`) | `normJob()` แปลงสถานะ ดำเนินการบำรุงรักษาแล้ว/แจ้งบำรุงรักษาไม่ได้/รอตรวจรับ/ส่งกลับแก้ไข → มีสาเหตุ = บำรุงรักษาไม่ได้ · ปิดงานแล้ว = เสร็จสิ้น · เริ่มแล้ว = อยู่ระหว่างบำรุงรักษา · อื่นๆ = ยังไม่เริ่ม · ทิ้งฟิลด์ส่งตรวจ/ส่งกลับ · บทบาท "ผู้รับจ้าง" ที่เก็บไว้ = กลับเป็น กบค. | ไม่มีบนจอ · กันหน้าพัง |

## ฑ. รีวิวทีมออกแบบ 5 พ.ย. 2569 — S1 S2 S6 S7 S9 (BACKLOG ข้อ 9)

อ้างอิง: `listScreen` `planForm` `assignModal` `planDetail` `planDetailQ` `decisionSection` `planReview` `tripReview` `tripList` `tripForm` `tripCarModal` ใน screens.js + Table header (2096:36080) · Table cell · Tabs · Radio text card · Empty state ของไฟล์ Component + 5.2 Vehicle Management (Vehicle list · Export reports - Select vehicles) · 5.5 Repair & Maintenance Job (Admin) ของ UI Release#2

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| ตารางติ๊กเลือกรถ (`app/new/CheckTable.tsx`) | Table header cell (Checkbox=True) + Table cell Style=Lead checkbox (Checkbox State=Disabled แถวที่เลือกไม่ได้) เรียงเป็นตาราง · มือถือ List with checkbox | Table ของไลบรารีรับช่องติ๊กไม่ได้ (เหมือน popup เพิ่มรถเดิม) · ใช้ร่วมฟอร์มแผน S1 และ popup เพิ่มรถเข้าแผนเดินทาง S6 S9 |
| ปุ่ม "ตัวกรอง" ในฟอร์มแผน S1 | Pill = จำนวนชิป (ภาค เขต ประเภทรถ) · กดแล้วไม่เปิดอะไร | จอ Figma ไม่มีแผงตัวกรองของหน้านี้ (userflow S1 "แผงของปุ่มตัวกรองมีช่องอะไรเพิ่ม" ยังไม่เคาะ) |
| ปุ่ม "ล้างตัวกรอง" (Search not found ของฟอร์มแผน) | ล้างคำค้น เขต ประเภทรถ (คงภาค) | จอไม่ได้บอกว่าล้างอะไร · คงภาคไว้ให้ตารางยังมีรถ |
| แท็บ "ทั้งหมด" เมื่อเอาภาค เขต ประเภทรถออกหมดแต่มีรถในแผน | Empty state "ยังไม่มีรายการรถ" (ข้อความเดียวกับก่อนเลือก · R69) | screens.js ให้ Search not found · ไม่มีเงื่อนไขให้ค้น ⇒ ใช้ข้อความของสถานะยังไม่เลือก |
| popup จัดลงไตรมาส | Radio text card 4 ใบเรียงลง ช่องไฟ 12 · ยังไม่เลือกตอนเปิด · ปุ่มยืนยัน Disabled จนกว่าเลือก · มือถือ bottom sheet ไม่มีบรรทัดรอง | `assignModal` (`sheet()` ของ core.js ไม่มีบรรทัดรอง) |
| Validation out of focus | Text input = onBlur · Input dropdown = ปิดรายการโดยยังไม่เลือก · ช่องวันที่ (desktop) = ปิดปฏิทิน | จอ Figma "Validation กรณีไม่ได้ระบุข้อมูล, Out of focus" เป็นภาพนิ่ง ไม่ได้บอกจังหวะ |
| ปุ่ม "ไปหน้าไตรมาส n" | Section label Primary action (Tertiary brand button) ตามแท็บที่เปิด · ทุกแท็บของแผนอนุมัติแล้ว/ดำเนินการ | planDetailQ + userflow S6 "ตามแท็บที่เปิด" (ชื่อปุ่มเสนอ Q54) |
| ปุ่ม "ความคืบหน้าอะไหล่" (S4) | คงเป็น Secondary action ของ Section label "รถในแผน" เฉพาะแท็บไตรมาสที่กำลังทำ | จอ Figma รอบนี้ไม่มีทางเข้า S4 (breadcrumb S4 อยู่ใต้ "ไตรมาส 1") · เอาออกแล้ว S4 เข้าไม่ได้ (**รอเคาะ** BACKLOG ค.) |
| รายละเอียดแผนตัวอย่าง (ไม่มีรถรายคัน) | แท็บไตรมาสที่กำลังทำ = รถของหน้าไตรมาส (10 คันของ S6) น้ำมัน เปลี่ยนล่าสุด อะไหล่ ตาม planDetailQ | เดิมตารางว่าง |
| Breadcrumbs หน้ารับรถ / ปิดงาน | บำรุงรักษาตามวาระ › ไตรมาส n › <แผนเดินทาง> › รับรถ (ไม่มีทะเบียน) | jobPage crumbs 4 ระดับ + ไลบรารีมีลิงก์ 3 ช่อง (ช่องที่ 4 ไม่แสดงตามจอ) |

## ฒ. อะไหล่รายคัน S1 S21 (BACKLOG ข้อ 11 · Figma เสร็จ 5 พ.ย. 2569)

อ้างอิง: `planForm` (Q_COLS · oilCell · partCell · qAgg · noParts) · `carPartsScreen` · `carWarehouse` · `MANUAL_FIELDS` ใน screens.js + Section header · Radio text card · Input dropdown · Table · Modal Type=Form (Card form row) ของไฟล์ Component + PartsInventoryPanel ของไฟล์ Maintain-D

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| ที่เก็บน้ำมันไฮโดรลิกรายคัน | `oils` (ลำดับ OIL_PLAN_OPTS) + `oilSpec` (เบอร์ รหัส ลิตร) · เปลี่ยนน้ำมัน = น้ำมันไฮโดรลิก (PARTS 0) อยู่ใน picks และลิตรเป็นจำนวน (qty) | ยอดอะไหล่ในไตรมาส S4 S22 คิดจาก picks × จำนวน ชุดเดียวกับเดิม ไม่ต้องคิดแยก |
| แผนตัวอย่าง/ที่เก็บเก่าที่ไม่มี `oils` | มี picks = กำหนดแล้ว (มีน้ำมันใน picks = เปลี่ยนน้ำมัน · ไม่มี = เก็บตัวอย่าง) · ไม่มี picks = "ยังไม่กำหนด" | ไม่ให้แผนเดิมกลายเป็นยังไม่กำหนดทั้งหมด |
| ไอคอนแก้ไขของแถวอะไหล่จากคลัง (หน้า S21) | popup ช่องเดียวกับ "ระบุอะไหล่เพิ่มเติม" หัว "แก้ไขอะไหล่" แก้ได้แค่จำนวน (ช่องอื่น Readonly) · แถวที่ระบุเองแก้ได้ทุกช่อง · ลบไม่มี confirm | จอมีไอคอนแก้ไข ลบ แต่ไม่มีจอ popup แก้ไข (**รอเคาะ**) |
| ช่องบังคับของ popup ระบุอะไหล่เพิ่มเติม | ชื่อ ยี่ห้อ รุ่น จำนวน หน่วย (รหัส "(ถ้ามี)") · ปุ่ม "เพิ่ม" Disabled จนครบ | MANUAL_FIELDS มีป้าย "(ถ้ามี)" ที่รหัสอย่างเดียว |
| มือถือหน้า S21 | แผงคลังอะไหล่เรียงลงตามเดิม | carWarehouse() ไม่มีแผงบนมือถือ (ไม่มี component) แต่ถ้าไม่มีแผง มือถือเลือกไส้กรองไม่ได้ |
| ช่องเบอร์ รหัส ลิตร | ไม่บังคับ · ลิตรว่าง = 0 · เลือกเปลี่ยนน้ำมันแล้วรหัส OL-0011 และ 30 ลิตรตั้งต้น เบอร์ให้เลือกเอง | จอ "เลือกเปลี่ยนน้ำมัน — ระบุเบอร์น้ำมัน รหัส จำนวนลิตร" |
| S4 ของแผนที่จัดรถรายคัน | ยอดจาก quarterRows (ชุดเดียวกับฟอร์มและ S22) · รายการที่ระบุเอง คงเหลือ "-" ไม่นับยอดในสรุปเบิก/จอง | เดิม S4 ใช้ PARTS ตัวอย่างทุกแผน |

## ณ. S25 ย้ายรถที่บำรุงรักษาไม่ได้ไปไตรมาสอื่น (BACKLOG ข้อ 12)

อ้างอิง: `moveMenu` `moveCard` `moveModal` `moveQuarter` · `tripList` (o.jobs o.subs) · `partsProgress` (o.q o.qty o.subs) ใน screens.js + Dropdown menu (เมนูเดียว "คืนยานพาหนะ" ของ Request list หน้า 5.10 Vehicle In Use (EV)) · Mobile table item Style=Action buttons · Radio text card State=Disabled ของไฟล์ Component

| จุด | ที่ทำ | เหตุผล |
|---|---|---|
| การ์ดมือถือ ปุ่ม "ย้ายไปไตรมาสอื่น" | `MobileCards` รับ `mobileButtons` → Mobile table item Style=Action buttons (แก้ component ข้อนี้ข้อเดียว) | moveCard() · ไอคอนดู แก้ไข ลบ (R50) ไม่มีช่องให้คำนี้ |
| ที่เก็บ | `moves` [{ แผน รถ ไตรมาสเดิม ไตรมาสใหม่ แผนเดินทาง }] + รถเข้าไตรมาสใหม่ / ออกจากไตรมาสเดิม ด้วยกลไกเพิ่ม/เอารถออกจากไตรมาส (E.1) · แผนที่จัดรถรายคันเปลี่ยนไตรมาสของรถใน alloc (อะไหล่ตามรถ) | ที่เก็บเก่าไม่มี `moves` = ยังไม่มีการย้าย |
| รถของไตรมาสอื่นในแผนตัวอย่าง (MR Z7000001) | ไตรมาสที่กำลังทำ = 10 คันของ S6 · ไตรมาส 2 = MOVE_Q2 3 คัน · ไตรมาส 3 = MOVE_Q3_OTHER 1 คัน · ไตรมาส 4 ว่าง · S4 ไตรมาส 2 ยอดรถเดิม MOVE_Q2_BASE | เดิมทุกไตรมาสของแผนตัวอย่างแสดง 10 คันชุดเดียวกัน |
| อะไหล่ที่ย้ายไปด้วย | แผนที่จัดรถรายคัน = อะไหล่ที่กำหนดในหน้า S21 · แผนตัวอย่าง = อะไหล่ตามแผนของงานรายคัน (WORK) | screens.js ใช้ WORK |
| ไตรมาส 4 | เมนู/ปุ่ม Disabled (แสดงแต่กดไม่ได้) | moveMenu(off) · แผนปีถัดไปยังไม่เคาะ |
