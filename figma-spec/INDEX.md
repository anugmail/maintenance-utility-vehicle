# สเปก component จากไฟล์ Figma

สร้างด้วย `npm run figma-spec` ห้ามแก้มือ · รายชื่อที่ดึงอยู่ใน `components.json` (`components` = ไลบรารี (Component) VMS Plus · `maintainD` = ไฟล์ Figma งานซ่อม Maintain-D)
ภาพกราฟิก (SVG) ของ component ปลายสุดอยู่ใน `svg/` · ช่อง `vars` = ชื่อ Figma Variable ที่ผูกกับค่า · `sws` = ความหนาเส้นแยกด้าน [บน, ขวา, ล่าง, ซ้าย] (มีเฉพาะเมื่อไม่เท่ากัน) · `paint` = พื้นที่มีความทึบ/gradient/ภาพ

| component | ไฟล์ Figma | หน้าในไฟล์ (node) | variant |
|---|---|---|---|
| Primary button | (Component) VMS Plus | ✅ Button (2:5) | 8 |
| Secondary button | (Component) VMS Plus | ✅ Button (2:5) | 8 |
| Tertiary button | (Component) VMS Plus | ✅ Button (2:5) | 4 |
| Tertiary brand button | (Component) VMS Plus | ✅ Button (2:5) | 4 |
| Primary danger button | (Component) VMS Plus | ✅ Button (2:5) | 8 |
| Secondary danger button | (Component) VMS Plus | ✅ Button (2:5) | 8 |
| Tertiary danger button | (Component) VMS Plus | ✅ Button (2:5) | 4 |
| Pill outline | (Component) VMS Plus | ✅ Badge (2:13) | 8 |
| Badge outline with remove icon | (Component) VMS Plus | ✅ Badge (2:13) | 3 |
| Text input | (Component) VMS Plus | ✅ Inputs (2:6) | 20 |
| Input dropdown | (Component) VMS Plus | ✅ Dropdowns (2:8) | 16 |
| Input dropdown with badges | (Component) VMS Plus | ✅ Dropdowns (2:8) | 8 |
| Input label | (Component) VMS Plus | ✅ Inputs (2:6) | 1 |
| Text area | (Component) VMS Plus | ✅ Inputs (2:6) | 10 |
| Checkbox | (Component) VMS Plus | ✅ Checkbox (2:18) | 12 |
| Radio button | (Component) VMS Plus | ✅ Radio button (2:17) | 8 |
| Horizontal radio groups | (Component) VMS Plus | ✅ Radio button (2:17) | 1 |
| Radio text card | (Component) VMS Plus | ✅ Radio button (2:17) | 8 |
| Table | (Component) VMS Plus | ✅ Table (2:14) | 2 |
| Table cell | (Component) VMS Plus | ✅ Table (2:14) | 27 |
| Table header cell | (Component) VMS Plus | ✅ Table (2:14) | 2 |
| Table header | (Component) VMS Plus | ✅ Table headers (2096:36080) | 2 |
| Table pagination | (Component) VMS Plus | ✅ Pagination (2:15) | 2 |
| Mobile table | (Component) VMS Plus | ✅ Table (2:14) | 2 |
| Mobile table item | (Component) VMS Plus | ✅ Table (2:14) | 7 |
| Page header | (Component) VMS Plus | ✅ Page headers (1983:21158) | 2 |
| Breadcrumbs | (Component) VMS Plus | ✅ Breadcrumbs (2:7) | 1 |
| Section label | (Component) VMS Plus | ✅ Section headers (2011:6955) | 2 |
| Section header | (Component) VMS Plus | ✅ Section headers (2011:6955) | 2 |
| Tab item | (Component) VMS Plus | ✅ Tabs (2:9) | 6 |
| Tabs | (Component) VMS Plus | ✅ Tabs (2:9) | 1 |
| Dropdown menu | (Component) VMS Plus | ✅ Dropdowns (2:8) | 1 |
| Dropdown list | (Component) VMS Plus | ✅ Dropdowns (2:8) | 1 |
| Dropdown list item | (Component) VMS Plus | ✅ Dropdowns (2:8) | 5 |
| Modal | (Component) VMS Plus | ✅ Modals (2:16) | 8 |
| Modal header | (Component) VMS Plus | ✅ Modals (2:16) | 2 |
| Modal footer | (Component) VMS Plus | ✅ Modals (2:16) | 3 |
| Background overlay | (Component) VMS Plus | ✅ Background overlay (2428:4927) | 1 |
| Bottom sheet header | (Component) VMS Plus | Bottom sheets (1180:2) | 1 |
| Alert | (Component) VMS Plus | ✅ Alerts (2:11) | 6 |
| Notification | (Component) VMS Plus | ✅ Notifications (1873:44383) | 10 |
| Empty state/Data empty | (Component) VMS Plus | ✅ Table (2:14) | 1 |
| Empty state/Search not found | (Component) VMS Plus | ✅ Table (2:14) | 1 |
| File upload | (Component) VMS Plus | ✅ File upload (2123:5261) | 2 |
| Content item row | (Component) VMS Plus | Cards (2413:11354) | 3 |
| Featured icon | (Component) VMS Plus | Featured icon (2861:54686) | 16 |
| Progress bar | (Component) VMS Plus | ✅ Progress bar (2843:13902) | 11 |
| Header navigation | (Component) VMS Plus | Header navigation (2:4) | 3 |
| Sidebar navigation | (Component) VMS Plus | ✅Sidebar navigation (2:2) | 2 |
| Nav button | (Component) VMS Plus | ✅Sidebar navigation (2:2) | 5 |
| Badge outline | (Component) VMS Plus | ✅ Badge (2:13) | 5 |
| Button groups pagination item | (Component) VMS Plus | ✅ Pagination (2:15) | 12 |
| Sort icon | (Component) VMS Plus | ✅ Table (2:14) | 3 |
| _Dropdown menu item | (Component) VMS Plus | ✅ Dropdowns (2:8) | 9 |
| Bottom sheet footer | (Component) VMS Plus | Bottom sheets (1180:2) | 1 |
| _Breadcrumbs item / Link | (Component) VMS Plus | ✅ Breadcrumbs (2:7) | 3 |
| Horizontal scrollbar | (Component) VMS Plus | Scrollbar (2230:14068) | 3 |
| Nav item | (Component) VMS Plus | ✅Sidebar navigation (2:2) | 5 |
| Nav list item | (Component) VMS Plus | ✅Sidebar navigation (2:2) | 5 |
| Pill color | (Component) VMS Plus | ✅ Badge (2:13) | 7 |
| _File upload item base | (Component) VMS Plus | ✅ File upload (2123:5261) | 3 |
| _File icon | (Component) VMS Plus | ✅ File upload (2123:5261) | 2 |
| _Content item base | (Component) VMS Plus | Cards (2413:11354) | 5 |
| Images | (Component) VMS Plus | Images (2648:43267) | 4 |
| List with checkbox | (Component) VMS Plus | List (3285:58382) | 1 |
| List with checkbox item | (Component) VMS Plus | List (3285:58382) | 5 |
| List header item | (Component) VMS Plus | List (3285:58382) | 1 |
| Number input | (Component) VMS Plus | ✅ Inputs (2:6) | 14 |
| Date picker | (Component) VMS Plus | ✅ Date picker (855:376) | 4 |
| Checkbox text card | (Component) VMS Plus | ✅ Checkbox (2:18) | 8 |
| Notification card | (Component) VMS Plus | Header navigation (2:4) | 1 |
| _Notification item base | (Component) VMS Plus | Header navigation (2:4) | 1 |
| Status | (Component) VMS Plus | Header navigation (2:4) | 5 |
| Card form row | (Component) VMS Plus | Cards (2413:11354) | 3 |
| Content divider | (Component) VMS Plus | ✅ Content divider (2635:20181) | 2 |
| resize-right | (Component) VMS Plus | Icons (21:163) | 1 |
| _File upload base | (Component) VMS Plus | ✅ File upload (2123:5261) | 5 |
| _Date picker calendar item base | (Component) VMS Plus | ✅ Date picker (855:376) | 12 |
| _Date picker calendar | (Component) VMS Plus | ✅ Date picker (855:376) | 1 |
| Badge outline with leading icon | (Component) VMS Plus | ✅ Badge (2:13) | 5 |
| Icon button | (Component) VMS Plus | ✅ Button (2:5) | 4 |
| _Notification header | (Component) VMS Plus | Header navigation (2:4) | 1 |
| _Notification footer | (Component) VMS Plus | Header navigation (2:4) | 1 |
| Progress steps | (Component) VMS Plus | ✅ Progress steps (2:10) | 2 |
| Horizontal step item | (Component) VMS Plus | ✅ Progress steps (2:10) | 3 |
| _Step item base | (Component) VMS Plus | ✅ Progress steps (2:10) | 4 |
| Mobile progress steps | (Component) VMS Plus | ✅ Progress steps (2:10) | 2 |
| Step circles / 4 steps | (Component) VMS Plus | ✅ Progress steps (2:10) | 5 |
| ReceiptChecklist | Maintain-D | Design (0:1) | 4 |
| HandoverSignature | Maintain-D | Design (0:1) | 3 |
| Modal Signature | Maintain-D | Design (0:1) | 2 |
| InspectionChecklist | Maintain-D | Design (0:1) | 4 |
| PartRequestStepPanel | Maintain-D | Design (0:1) | 1 |
| PartsInventoryPanel | Maintain-D | Design (0:1) | 3 |
| RequestedPartsPanel | Maintain-D | Design (0:1) | 2 |
| Spare Part Card Item | Maintain-D | Local Component (8:133440) | 4 |
| Selecte Spare Part | Maintain-D | Local Component (8:133440) | 3 |
| IncidentPhotoGallery | Maintain-D | รายละเอียดงานซ่อม (175:79986) | 1 |
| VehicleAndReporterInfo | Maintain-D | รายละเอียดงานซ่อม (175:79986) | 1 |
| SummaryRequestedParts | Maintain-D | Design (0:1) | 1 |
| BudgetSource | Maintain-D | รายละเอียดงานซ่อม (175:79986) | 5 |
| RepairFeedback | Maintain-D | Design (0:1) | 1 |
| ReturnPart | Maintain-D | Design (0:1) | 2 |
