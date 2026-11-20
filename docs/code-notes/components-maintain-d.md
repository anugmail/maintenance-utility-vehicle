# โน้ตของโค้ด: src/components/maintain-d

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/components/maintain-d/HandoverSignature.tsx

**หัวไฟล์**

```text
Figma: "HandoverSignature" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/HandoverSignature.json (CLAUDE.md ข้อ 12)
  ลงนามการรับมอบรถ (S10 รับรถ) · variant: State = Default (ยังไม่เลือกชื่อ) | Filled (เลือกชื่อแล้ว) | Signed (ลงนามแล้ว) — ต่อฝั่ง
  ค่า: Section header (Title) → ห่าง 16 → แถว 2 กล่อง ช่องไฟ 16 (มือถือเรียงลง) · กล่อง = ช่องเลือกชื่อ (Input dropdown ตาม S10) → ห่าง 16 → ปุ่ม
       ปุ่ม Secondary button md "เซ็นลงนาม" (Disabled จนกว่าจะเลือกชื่อ) · ลงนามแล้ว = "แก้ไขลงนาม" + ป้าย "เซ็นลงนามแล้ว" ช่องไฟ 16
       ป้าย "เซ็นลงนามแล้ว" ของไฟล์ (ไม่ใช่ instance ไลบรารี): รัศมี 9999 ขอบใน 2/10 พื้น success-50 ขอบ 1 success-200 ตัวอักษร 14 Medium success-700
```

## src/components/maintain-d/IncidentPhotoGallery.tsx

**หัวไฟล์**

```text
Figma: "IncidentPhotoGallery" — ไฟล์ Maintain-D หน้า รายละเอียดงานซ่อม (node 175:79986) · สเปก figma-spec/IncidentPhotoGallery.json (CLAUDE.md ข้อ 12)
  แถวภาพ desktop ที่ photoGallery() ใน screens.js ยืมมา · มือถือ = patterns/PhotoGallery (2 ภาพ)
  ค่า: Section label (Title) → ห่าง 8 → Gallery ช่องไฟ 16: Images Size=sm Type=Image 175×156 รัศมี 8 × สูงสุด 4 (ไม่มีปุ่ม/จุดเลื่อน)
       + Icon button keyboard_arrow_right เมื่อมีมากกว่า 4 ภาพ (เลื่อนดูชุดถัดไป)
```

## src/components/maintain-d/InspectionChecklist.tsx

**หัวไฟล์**

```text
Figma: "InspectionChecklist" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/InspectionChecklist.json (CLAUDE.md ข้อ 12)
  ตรวจสภาพรถ (S10 รับรถ / ปิดงาน) · variant: Breakpoint = Desktop | Mobile · State = Default | Filled · property: AfterRepair (ปิดงาน)
  ค่าเริ่มหัวข้อของไฟล์ "รายละเอียดการตรวจสภาพก่อนซ่อม" · หัวกลุ่ม "การตรวจสอบสภาพซ่อมจากสาเหตุส่งซ่อม" — S10 ปิดงานส่ง Title "ตรวจสภาพรถปิดงาน"
  Desktop: Section header (Title + Badge) → ตาราง 2 ส่วนเท่ากัน: รายการ (หัวสูง 88 = 2 ชั้น) | MA table section: หัวกลุ่ม 44 + ปกติ 100 · ต้องแก้ไข 100 · หมายเหตุ 448 (44)
           แถว 56 พื้นสลับ · ปกติ/ต้องแก้ไข = Radio button · หมายเหตุ = Text input "ระบุหมายเหตุ" · แถวท้าย Secondary button lg "เพิ่มรายการ"
  Mobile: การ์ดละรายการ (InspectionChecklistCard): Section label ชื่อ → Radio text card "ปกติ"/"ต้องแก้ไข" (ข้อความ 14) → Text area "หมายเหตุ" (ถ้ามี) · "เพิ่มรายการ" lg เต็มกว้าง
```

**ท้ายบรรทัด `export interface InspectionItem { name: string;`**

```text
ปกติ = true · ต้องแก้ไข = false · ยังไม่เลือก = null
```

## src/components/maintain-d/ModalSignature.tsx

**หัวไฟล์**

```text
Figma: "Modal Signature" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/Modal Signature.json (CLAUDE.md ข้อ 12)
  popup เซ็นลงนาม · variant: State = Default (ยังไม่เซ็น — ปุ่มบันทึก Disabled) | Filled (เซ็นแล้ว)
  ค่า: Background overlay + Modal กว้าง 607 รัศมี 12 · Modal header Alignment=Left (Title · ปุ่มปิด · เส้นคั่น Content divider)
       Form ขอบในข้าง 24 ช่องไฟ 16: กล่องข้อมูล พื้น gray-50 รัศมี 8 ขอบใน 8/16 = _Content item base Text with label (ผู้ลงนาม: ชื่อ)
       + ช่องเซ็น = Container ของ Text area สูง 249 (ขอบ 1 gray-300 รัศมี 8) วาดลายเซ็นได้ · ปุ่มล้าง close 24 มุมขวาบน
       Modal footer Alignment=Horizontal right (เส้นคั่นบน): Secondary "ปิด" + Primary "บันทึก"
  มือถือ: ไฟล์ไม่มีแบบมือถือ → Bottom sheet + เนื้อหาเดียวกัน + Bottom sheet footer (COMPOSED.md ก.)
```

**ก่อน `signer: [string, string];`**

```text
ป้ายและชื่อผู้ลงนามในกล่องข้อมูล เช่น ["ผู้ส่งมอบรถ", "นายสุรชัย แก้วมณี"]
```

**ก่อน `value?: string | null;`**

```text
ลายเซ็นเดิม (data URL) — State=Filled
```

## src/components/maintain-d/PartRequestStepPanel.tsx

**หัวไฟล์**

```text
Figma: "PartRequestStepPanel" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/PartRequestStepPanel.json (CLAUDE.md ข้อ 12)
  แผงเลือกอะไหล่ 2 ฝั่ง (S21 desktop): PartsInventoryPanel (กว้าง 421) | RequestedPartsPanel (เติมที่เหลือ) ช่องไฟ 16
  มือถือ: ไฟล์ไม่มีแบบมือถือ → เรียงลง (คลังอะไหล่บน · อะไหล่ที่เลือกล่าง) ช่องไฟ 16 (COMPOSED.md ก.)
```

## src/components/maintain-d/PartsInventoryPanel.tsx

**หัวไฟล์**

```text
Figma: "PartsInventoryPanel" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/PartsInventoryPanel.json (CLAUDE.md ข้อ 12)
  คลังอะไหล่ (S21 อะไหล่ของรถ) · variant: State = Default | Not Found | API error
  ค่า: กล่อง พื้น white ขอบ 1 gray-200 (สีไฟล์ไม่มี token — COMPOSED.md ข.) รัศมี 16 ขอบใน 16 · ด้านใน ช่องไฟ 16
       Section header "คลังอะไหล่" + Supporting text "อะไหล่ทั้งหมดจาก Smart Inventory และ คลังสำรอง" · Text input ค้นหา (ไอคอน search) placeholder "ค้นหาชื่อหรือรหัสอะไหล่"
       รายการ = Spare Part Card Item อะไหล่=รายการในคลัง ช่องไฟ 16 (เลื่อนในกล่อง)
       Not Found: Empty state/Search not found "ไม่พบข้อมูล" / "เปลี่ยนคำค้นหาแล้วลองใหม่อีกครั้ง" (ขอบในบน/ล่าง 10)
       API error: Empty state/Search not found "ไม่สามารถแสดงข้อมูลได้" / "อาจเกิดจากปัญหาการเชื่อมต่อระบบ กรุณารีเฟรชหน้าจอหรือลองใหม่อีกครั้ง"
```

## src/components/maintain-d/ReceiptChecklist.tsx

**หัวไฟล์**

```text
Figma: "ReceiptChecklist" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/ReceiptChecklist.json (CLAUDE.md ข้อ 12)
  รายการเอกสารรับรถ (S10 รับรถเข้าบำรุงรักษา) · variant: Breakpoint = Desktop | Mobile · State = Default (ยังไม่กรอก) | Filled
  Desktop: Section header (Title + Badge จำนวน) → ห่าง 16 → ตาราง คอลัมน์ รายการ 446 (เติมที่เหลือ) · มี 100 · ไม่มี 100 · ชำรุด 100 · ผิดรุ่น 100 · หมายเหตุ 450
           หัวสูง 74 · มี/ไม่มี = Radio button · ชำรุด/ผิดรุ่น = Checkbox (เลือกได้เมื่อ "มี") · หมายเหตุ = Text input (placeholder "ระบุหมายเหตุ")
           แถว "แบตเตอรี่" มี Text input ยี่ห้อ (149) + จำนวน (98) + หน่วย "ลูก" ต่อท้ายชื่อ (ช่องไฟ 8) · แถวท้าย Secondary button lg "เพิ่มรายการ" (ไอคอน add)
  Mobile: การ์ดละรายการ (ReceiptChecklistCard State=Available/NotAvailable): Section label ชื่อ → Radio text card "มี"/"ไม่มี" 2 ใบ ช่องไฟ 16 (ข้อความ 14)
           → มี: Input label "สภาพ" (ถ้ามี) + Checkbox text card "ชำรุด"/"ผิดรุ่น" ช่องไฟ 16 → Text area "หมายเหตุ" (ถ้ามี) · ปุ่ม "เพิ่มรายการ" lg เต็มกว้างท้ายสุด
```

**ก่อน `has?: boolean | null;`**

```text
มี = true · ไม่มี = false · ยังไม่เลือก = null
```

**ก่อน `battery?: { brand: string; qty: string; unit?: string };`**

```text
แถวแบตเตอรี่: ยี่ห้อ + จำนวน + หน่วย
```

**ก่อน `Badge?: string | number | null;`**

```text
ป้ายจำนวน (ค่าเริ่ม = จำนวนรายการ)
```

**ก่อน `readonly?: boolean;`**

```text
ดูอย่างเดียว (ไม่มีปุ่มเพิ่ม · ช่องอ่านอย่างเดียว)
```

## src/components/maintain-d/RepairFeedback.tsx

**หัวไฟล์**

```text
Figma: "RepairFeedback" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/RepairFeedback.json (CLAUDE.md ข้อ 12)
  คะแนนความพึงพอใจ 1–5 (S13 รับทราบรายคัน · เดิม S14 ตัดออก 10 พ.ย. 2569) · ค่าเริ่มหัวข้อของไฟล์ "คะแนนประเมินคุณภาพงานซ่อมบำรุง" — S13 ส่ง Title เอง
  ค่า: Section header (Title · Supporting text ถ้ามี) → ห่าง 16 → Radio แถวเดียว ช่องไฟ 12 (มือถือ 8 ยังแถวเดียว) Radio text card "1"…"5" กว้างเท่ากัน ไม่มี Supporting text
  มือถือ: การ์ด 5 ใบในแถวเดียวกว้างไม่พอขอบใน 16 → ขอบในข้าง 12 (COMPOSED.md จ.)
```

## src/components/maintain-d/RequestedPartsPanel.tsx

**หัวไฟล์**

```text
Figma: "RequestedPartsPanel" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/RequestedPartsPanel.json (CLAUDE.md ข้อ 12)
  อะไหล่ที่เลือก (S21 อะไหล่ของรถ) · variant: State = Default (ยังไม่เลือก) | Filled
  ค่าเริ่มหัวข้อของไฟล์ "อะไหล่ที่ต้องการใช้งาน" — S21 ส่ง Title "อะไหล่ของรถคันนี้" + Supporting text + Badge
  ค่า: กล่อง พื้น white ขอบ 1 gray-200 รัศมี 16 ขอบใน 17 · ด้านใน ช่องไฟ 16
       Default: ข้อความกลาง "ยังไม่ได้เพิ่มอะไหล่" 16 SemiBold / "กรุณาเลือกอะไหล่จากคลังอะไหล่หรือระบุอะไหล่เพิ่มเติม" 12 (สีของไฟล์ไม่มี token → black / gray-600 — COMPOSED.md ข.)
       Filled: Spare Part Card Item (V2 รายการที่เลือก / เพิ่มอะไหล่) ช่องไฟ 16
       Secondary button lg "ระบุอะไหล่เพิ่มเติม" (ไอคอน add) · เส้นคั่น gray-200 → Section header "รวมค่าอะไหล่" + แถว (14 gray-600 ซ้าย · 14 SemiBold ขวา) ช่องไฟ 8 + "รวมทั้งหมด"
```

**ก่อน `children?: ReactNode;`**

```text
การ์ด SparePartCardItem (V2 รายการที่เลือก / เพิ่มอะไหล่) · ไม่ส่ง = State Default
```

**ก่อน `costs: [string, number][];`**

```text
แถวรวมค่าอะไหล่ เช่น [["เบิกจากคลัง", 3600], ["ต้องจัดซื้อ", 0]]
```

## src/components/maintain-d/SelecteSparePart.tsx

**หัวไฟล์**

```text
Figma: "Selecte Spare Part" — ไฟล์ Maintain-D หน้า Local Component (node 8:133440) · สเปก figma-spec/Selecte Spare Part.json (ชื่อตามไฟล์ — สะกด "Selecte") (CLAUDE.md ข้อ 12)
  ปุ่มเลือกอะไหล่ท้ายการ์ด Spare Part Card Item · variant: State = Add | Checked | Text
  ค่า: Add = Secondary button md ไอคอน add 20 อย่างเดียว 44×44 · Checked = Primary button md ไอคอน check 20 · Text = ราคารวม 16 SemiBold gray-600
```

## src/components/maintain-d/SparePartCardItem.tsx

**หัวไฟล์**

```text
Figma: "Spare Part Card Item" — ไฟล์ Maintain-D หน้า Local Component (node 8:133440) · สเปก figma-spec/Spare Part Card Item.json (CLAUDE.md ข้อ 12)
  การ์ดอะไหล่ใน PartsInventoryPanel / RequestedPartsPanel · variant: อะไหล่ = รายการในคลัง | รายการที่เลือก | V2 รายการที่เลือก | เพิ่มอะไหล่
  ค่า: การ์ด พื้น white ขอบ 1 รัศมี 12 ขอบใน 16 (สีขอบของไฟล์ไม่มี token → gray-200 ใกล้สุด — COMPOSED.md ข.)
       หัว: ชื่อ 16 SemiBold black + Pill outline Info "แนะนำ" (Suggestion) ช่องไฟ 8 · บรรทัดรหัส: รหัส 14 gray-600 · "·" "1 <หน่วย>" · "|" "<ราคา> บาท" ช่องไฟ 8
       คลัง: "<คลัง> : คงเหลือ <n> <หน่วย>" 14 gray-600 (+ "| ซื้อเพิ่ม n หน่วย" + ข้อความแจ้ง error-600 "อะไหล่ที่จัดซื้อจะใช้เวลา 30 วันทำการ" เมื่อของไม่พอ)
       รายการในคลัง: แถวเดียว ช่องไฟ 16 · ท้าย Selecte Spare Part (Add / Checked)
       รายการที่เลือก (V2): เรียงลง ช่องไฟ 16 · ไอคอนลบ delete 24 ท้ายหัว (สีไอคอนของไฟล์ไม่มี token → Tertiary button ไอคอนอย่างเดียว — COMPOSED.md ข.) · แถวล่าง ราคารวม 16 SemiBold gray-600 ซ้าย + Number input กว้าง 120 ขวา
       รายการที่เลือก (V1): + "เลือกผู้จัดซื้ออะไหล่เพิ่ม" Radio text card 2 ใบ (ส่ง buyerOptions)
       เพิ่มอะไหล่: หัว "รายการเพิ่มเติม" + ไอคอนลบ · Text input 3 ช่อง ช่องไฟ 16 · ราคารวม + Number input
```

**ก่อน `picked?: boolean;`**

```text
รายการในคลัง: เลือกแล้ว (Selecte Spare Part State=Checked)
```

**ก่อน `qty?: number;`**

```text
รายการที่เลือก / เพิ่มอะไหล่
```

**ก่อน `buyMore?: number;`**

```text
จำนวนที่ต้องซื้อเพิ่ม (ของไม่พอ)
```

**ก่อน `manual?: { name: string; code: string; price: string };`**

```text
เพิ่มอะไหล่: ช่องกรอก
```

## src/components/maintain-d/SummaryRequestedParts.tsx

**หัวไฟล์**

```text
Figma: "SummaryRequestedParts" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/SummaryRequestedParts.json (CLAUDE.md ข้อ 12)
  popup สรุปรายการเบิก/จองอะไหล่ (S4) · ค่าเริ่มหัวข้อของไฟล์ "สรุปรายการอะไหล่" — S4 ส่ง Title "สรุปรายการเบิก/จองอะไหล่"
  ค่า: Background overlay + Modal กว้าง 500 รัศมี 12 · Modal header Alignment=Left (Title · ปุ่มปิด · เส้นคั่น) · Form ขอบในข้าง 24 ช่องไฟ 24
       กลุ่ม = Section label (ชื่อกลุ่ม) → ห่าง 8 → กล่อง พื้น gray-50 รัศมี 8 ขอบใน 24 ช่องไฟ 16: หัวย่อย 14 SemiBold gray-600 → แถว "<ชื่อ> x<n>" / "<ราคา> บาท" 14 gray-600 ช่องไฟ 8 · คั่นหัวย่อยด้วย Content divider
       รวม = Section header "รวมค่าอะไหล่" + แถว 14 gray-600 / 14 SemiBold ช่องไฟ 8 + "รวม" (SemiBold)
       Modal footer Alignment=Horizontal right (เส้นคั่นบน): Secondary + Primary (ค่าเริ่มไฟล์ "ปิด" / "ยืนยัน")
  มือถือ: ไฟล์ไม่มีแบบมือถือ — S4 ใช้ ConfirmDialog (library fallback) · ถ้าเปิดบนมือถือ = Bottom sheet + เนื้อหาเดียวกัน (COMPOSED.md ก.)
```

## src/components/maintain-d/VehicleAndReporterInfo.tsx

**หัวไฟล์**

```text
Figma: "VehicleAndReporterInfo" — ไฟล์ Maintain-D หน้า รายละเอียดงานซ่อม (node 175:79986) · สเปก figma-spec/VehicleAndReporterInfo.json (CLAUDE.md ข้อ 12)
  กล่องแสดงข้อมูล desktop ที่ vehicleInfo() ใน screens.js ยืมมา · มือถือ = patterns/DisplayBox (แถวละ 2) ตามปลั๊กอิน
  ค่า: Section label (Title · ไม่มี Supporting/Actions) → ห่าง 8 → Content พื้น gray-50 รัศมี 8 ขอบใน 24 ช่องไฟแถว 16
       แถว = Content item row Column width=Full ช่องไฟ 16 · ช่อง = _Content item base Type="Text with label" ไม่มีไอคอน (Label 16 SemiBold · Text 16 Regular black)
       แถวละ 4 ช่อง (ช่องที่ 2–4 เปิดตามจำนวน · Item 2/3/4) · BudgetSource ในกล่องซ่อนตาม vehicleInfo()
```

## src/components/maintain-d/_checklist.tsx

**หัวไฟล์**

```text
ฐานร่วมของ ReceiptChecklist / InspectionChecklist (ไฟล์ Maintain-D) — ไม่ใช่ component ของไฟล์เอง
  ตาราง desktop ของสองตัวนี้เป็น Table header cell + Table cell วางเป็นคอลัมน์ (เกินขนาด Table ของไลบรารี 8×10)
  ค่า: หัว พื้น gray-100 ขอบใน 12/16 ตัวอักษร 14 SemiBold black (มุมซ้ายบน 12) · แถว สูง 56 ขอบใน 8/16 พื้นสลับ white / gray-50 ไม่มีเส้น (sws มีแต่ไม่มีสีเส้น)
  การ์ดมือถือ (ReceiptChecklistCard / InspectionChecklistCard): พื้น white ขอบ 1 gray-300 รัศมี 12 ขอบใน 16 ช่องไฟ 16 · Section label = ชื่อรายการ
```
