# โน้ตของโค้ด: src/components/vms

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/components/vms/Alert.tsx

**หัวไฟล์**

```text
Figma: "Alert" — ไฟล์ (Component) VMS Plus หน้า Alerts (node 2:11) · สเปก figma-spec/Alert.json
  variant: Color = Brand | Success | Warning | Error | Info | Gray
  property: Text · Supporting · Supporting text · Leading icon · Close icon
  ค่า: ขอบใน 12 · ช่องไฟ 12 · รัศมี 8 · ขอบ 1 · หัวข้อ 16 SemiBold black · Supporting text 14 gray-600 ห่าง 4
       ไอคอนนำ 24 ทึบ: Brand info brand-800 · Success check_circle success-600 · Warning warning_circle warning-600 · Error cancel_circle error-500 · Info info info-600 · Gray info gray-500
```

## src/components/vms/BackgroundOverlay.tsx

**หัวไฟล์**

```text
Figma: "Background overlay" — ไฟล์ (Component) VMS Plus หน้า Background overlay (node 2428:4927) · สเปก figma-spec/Background overlay.json
  สี่เหลี่ยมเต็มจอ พื้น black ทึบ 40% (paint ในดัมป์ · Variable Color/background/overlay) = token --overlay (bg-overlay)
```

## src/components/vms/BadgeOutline.tsx

**หัวไฟล์**

```text
Figma: "Badge outline" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline.json
  ใช้ซ้อนใน Page header / Section header (ป้ายจำนวน/สถานะข้างหัวข้อ)
  variant: Color = Brand | Gray | Disabled | Success | Error · property: Text
  ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 4 · ขอบ 1 · ตัวอักษร 12 SemiBold
```

## src/components/vms/BadgeOutlineWithIndicator.tsx

**หัวไฟล์**

```text
Figma: "Badge outline with indicator" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with indicator.json
  ป้ายสถานะแบบมีจุดนำ (Fleet card ของหน้า 5.2 Vehicle Management · UI Release#2 ใช้ Color=Success "ปกติ" / Color=Error "หมดอายุ")
  variant: Color = Gray | Brand | Info | Success | Warning | Error · property: Text
  ค่า: สูง 24 · ขอบใน 4/8 · ช่องไฟ 4 · รัศมี 4 · พื้น white ขอบ 1 gray-300 ทุกสี · ตัวอักษร 12 SemiBold gray-600 (Color/text/secondary)
       Indicator Size=sm สีจุด Color/component/utility/<สี>/500: gray-500 · brand-500 · info-600 · success-600 · warning-600 · error-500 (token ที่ค่าตรงกับ utility 500 ของไลบรารี)
```

## src/components/vms/BadgeOutlineWithLeadingIcon.tsx

**หัวไฟล์**

```text
Figma: "Badge outline with leading icon" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with leading icon.json
  variant: Color = Brand | Gray | Disabled | Success | Error · property: Text · Leading icon swap
  ค่า: สูง 24 · ขอบใน 4/8/4/6 · ช่องไฟ 4 · รัศมี 4 · ขอบ 1 · ไอคอน 12 (Brand brand-800 · Gray gray-500) · ตัวอักษร 12 SemiBold
  ใช้ใน Spare Part Card Item ("เลือกแล้ว" ไอคอน check)
```

## src/components/vms/BadgeOutlineWithRemoveIcon.tsx

**หัวไฟล์**

```text
Figma: "Badge outline with remove icon" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Badge outline with remove icon.json
  ใช้เป็นชิปค่าที่เลือกใน Input dropdown with badges (Color=Gray) และชิปตัวกรองใน Table header (Color=Brand)
  variant: Color = Brand | Gray | Disabled · property: Text
  ค่า: สูง 24 · ขอบใน 4 บน/ล่าง · ซ้าย 8 ขวา 4 · ช่องไฟ 4 · รัศมี 4 · ตัวอักษร 12 SemiBold · ไอคอนลบ _close_small 12 (Brand brand-800 · Gray gray-500)
```

## src/components/vms/BottomSheet.tsx

**หัวไฟล์**

```text
ประกอบจากชิ้นไลบรารี (ไม่มี component "Bottom sheet" ที่ใส่เนื้อหาได้ — ไลบรารีล็อกเนื้อหาตายตัว) ตาม sheet() / menuAt() ใน core.js
  = Background overlay + แผ่นพื้น white มุมบน 24 + Bottom sheet header + เนื้อหา (ขอบในข้าง 16 ช่องไฟ 16) + Bottom sheet footer
  บันทึกใน figma-spec/COMPOSED.md · ใช้แทน Modal / Dropdown menu บนมือถือ (กติกาข้อ 6)
```

**ก่อน `Footer?: ReactNode;`**

```text
BottomSheetFooter
```

**ก่อน `flush?: boolean;`**

```text
เนื้อหาชิดขอบ (เมนู / Modal header)
```

## src/components/vms/BottomSheetFooter.tsx

**หัวไฟล์**

```text
Figma: "Bottom sheet footer" — ไฟล์ (Component) VMS Plus หน้า Bottom sheets (node 1180:2) · สเปก figma-spec/Bottom sheet footer.json
  โครง: Padding top 24 · Divider (ปิด) · Actions ขอบในข้าง 16 ล่าง 16 ช่องไฟ 16 ปุ่ม Size=lg แบ่งครึ่ง (Secondary ซ้าย · Primary ขวา) · iOS Tab bar footer (ไม่แสดงบนเว็บ)
```

## src/components/vms/BottomSheetHeader.tsx

**หัวไฟล์**

```text
Figma: "Bottom sheet header" — ไฟล์ (Component) VMS Plus หน้า Bottom sheets (node 1180:2) · สเปก figma-spec/Bottom sheet header.json
  โครง: Drag handle (ขอบใน 18 บน/ล่าง · ขีด 32×4 รัศมี 4 gray-200) · Text and action (ขอบในข้าง 16 ช่องไฟ 4: ปุ่มย้อนกลับ · หัวข้อ 20 SemiBold black · Tertiary brand button)
        · Divider (ปิด R2/R13) · Padding bottom 24
  ใช้แบบ sheet() ใน core.js: ไม่มีหัวข้อ = ซ่อน Text and action
```

## src/components/vms/Breadcrumbs.tsx

**หัวไฟล์**

```text
Figma: "Breadcrumbs" — ไฟล์ (Component) VMS Plus หน้า Breadcrumbs (node 2:7) · สเปก figma-spec/Breadcrumbs.json + _Breadcrumbs item / Link.json
  โครง: Home (home 20 gray-600) · Link 1–3 · Truncate link (ซ่อน) · Current link — คั่นด้วย keyboard_arrow_right 20 gray-300 ช่องไฟ 4
  _Breadcrumbs item / Link: ขอบใน 4 · 12 Regular · Current=False gray-600 (Hover gray-700) · Current=True brand-900
```

**ท้ายบรรทัด `export interface Crumb { Text: string; href?: string;`**

```text
กดแล้วถามก่อนออก (ฟอร์มที่แก้ค้าง) แทนการไปทันที
```

## src/components/vms/ButtonGroupsPaginationItem.tsx

**หัวไฟล์**

```text
Figma: "Button groups pagination item" — ไฟล์ (Component) VMS Plus หน้า Pagination (node 2:15) · สเปก figma-spec/Button groups pagination item.json
  ชิ้นซ้อนใน Table pagination
  variant: Type = Previous | Next | Number · State = Default | Hover/Active | Focused | Disabled · property: Number
  ค่า: 40×40 · ขอบใน 8/12 · พื้น white (Hover/Active gray-200 · Focused gray-50) · เส้นคั่นขวา gray-300 · ตัวเลข 14 Regular gray-600 (Disabled gray-400)
       ลูกศร keyboard_arrow_left/right 20 gray-500 (Disabled gray-400)
```

## src/components/vms/CardFormRow.tsx

**หัวไฟล์**

```text
Figma: "Card form row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Card form row.json
  แถวช่องกรอกใน Modal Type=Form (formModal() ใน core.js — ปิด Input 2 · แถวยาวสลับเป็น Text area ด้วย Input 1 swap)
  variant: Width = Full | 50% | 25% · property: Input 1 swap · Input 2 · Input 2 swap
  ค่า: แถวเดียว ช่องไฟ 12 · Full = ช่องกว้างเท่ากัน · 50% = ช่อง + ที่ว่าง · 25% = ช่องเล็ก + ที่ว่าง
```

## src/components/vms/CardItemBase.tsx

**หัวไฟล์**

```text
Figma: "Card item base" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Card item base.json
  ช่องข้อมูล 1 ช่องของ Card item row (การ์ด "การใช้งานล่าสุด" ของหน้า 5.2 Vehicle Management · UI Release#2)
  variant: Type = Text | Text with supporting | Text with component | Text with label | Text with label and component | Vertical text with label
  property: Leading icon (เปิด/ปิด) · Icon swap (ไอคอน 24) · Label · Text · Supporting · Supporting text · Instance swap (ชิ้นที่วางในช่อง component)
  ค่า: แถวเดียว ช่องไฟ 8 จัดกลางแนวตั้ง · ไอคอน 24 brand-900 · Label 14 SemiBold black · Text 14 Regular black · Supporting text 14 gray-600
       Text with label: Label กับ Text กว้างเท่ากัน (FILL) · Vertical text with label: Label บน Text ล่าง ห่าง 4 (ไอคอนชิดบน)
  TextAlign="Right" = ค่าที่ instance ใน "Last usage" ของ UI Release#2 ตั้ง (Text ชิดขวา)
```

## src/components/vms/CardItemRow.tsx

**หัวไฟล์**

```text
Figma: "Card item row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Card item row.json
  แถวของการ์ด (การ์ด "การใช้งานล่าสุด" ของหน้า 5.2 Vehicle Management · UI Release#2: Type=1 Row ช่องเดียว · สูง 24)
  variant: Type = 1 Row (ช่องเรียงแนวนอน ช่องไฟ 8 กว้างเท่ากัน) | 2 Rows (ช่องเรียงแนวตั้ง ช่องไฟ 16)
  property: Item 1 · Item 2 (เปิด/ปิดช่อง — ส่งเฉพาะช่องที่เปิด) · ลูก = Card item base
```

## src/components/vms/Checkbox.tsx

**หัวไฟล์**

```text
Figma: "Checkbox" — ไฟล์ (Component) VMS Plus หน้า Checkbox (node 2:18) · สเปก figma-spec/Checkbox.json
  variant: State = Default | Hover | Focused | Disabled · Type = Unselected | Selected | Indeterminate
  ค่า: 20×20 รัศมี 4 · Unselected ขอบ 2 gray-300 · Selected/Indeterminate พื้น brand-900 ไอคอน check / check_indeterminate_small 20 white
       Disabled พื้น gray-200 ขอบ 2 gray-300 ไอคอน gray-300
       Hover/Focused วงโฟกัส 4 ทึบ 12% (effect ของ Surface): Unselected gray-500 · Selected/Indeterminate brand-900
```

## src/components/vms/CheckboxTextCard.tsx

**หัวไฟล์**

```text
Figma: "Checkbox text card" — ไฟล์ (Component) VMS Plus หน้า Checkbox (node 2:18) · สเปก figma-spec/Checkbox text card.json
  variant: State = Default | Hover | Focused | Disabled · Selected = False | True · property: Text · Supporting · Supporting text
  ค่า: กว้างตั้งต้น 240 · ขอบใน 16 · รัศมี 8 · พื้น white · ขอบ 1 gray-200 (Selected ขอบ 2 brand-900) · Hover/Focused ขอบ brand-800 (Focused + วงโฟกัส)
       Disabled พื้น gray-50 ขอบ gray-300 · Content: Checkbox + ข้อความ ช่องไฟ 12 · Text 14 SemiBold black · Supporting text 14 Regular gray-600 ห่าง 4
  ใช้ที่ S10 การ์ดเอกสารรับรถบนมือถือ ("ชำรุด" / "ผิดรุ่น")
```

## src/components/vms/ContentDivider.tsx

**หัวไฟล์**

```text
Figma: "Content divider" — ไฟล์ (Component) VMS Plus หน้า Content divider (node 2635:20181) · สเปก figma-spec/Content divider.json
  variant: Type = Default | Text · property: Text ("หรือ")
  ค่า: เส้น 1 gray-300 · Text: เส้น + ข้อความ 14 Regular gray-600 + เส้น ช่องไฟ 4
```

## src/components/vms/ContentItemBase.tsx

**หัวไฟล์**

```text
Figma: "_Content item base" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/_Content item base.json
  ช่องข้อมูล 1 ช่องใน Content item row
  variant: Type = Text | Text with label (ที่ต้นแบบใช้ · kv()) | Attachment | Big | Component swap
  property: Leading icon (ปิดตาม kv()) · Label · Text · Supporting · Supporting text · Instance swap (Component swap)
  ค่า: ช่องไฟ 8 · ไอคอนนำ 24 brand-900 · Text with label: Label 16 SemiBold black → Text 16 Regular black ห่าง 4
       Text: Text 16 black + Supporting text 16 gray-600 · Attachment: Text สีลิงก์ info-700 (token ใกล้สุด — COMPOSED.md ข.) · Big: 20/20
```

**ก่อน `InstanceSwap?: ReactNode;`**

```text
Component swap — ชิ้นที่วางแทน Text (เช่น Badge outline / Pill outline)
```

## src/components/vms/ContentItemRow.tsx

**หัวไฟล์**

```text
Figma: "Content item row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Content item row.json
  variant: Column width = Full (ที่ต้นแบบใช้) | 50% first column | 50% last column · property: Item 2 · Item 3 · Item 4 (ช่องที่ 2–4)
  ค่า: แถวเดียว ช่องไฟ 24 · ลูก = _Content item base สูงสุด 4 ช่อง กว้างเท่ากัน (ช่องที่ไม่ใช้เว้นว่างให้คอลัมน์ตรงกันทุกแถว)
  ใช้แบบ kv() ใน core.js: Type="Text with label" ไม่มีไอคอน · desktop แถวละ 4 · มือถือ แถวละ 2 (ส่ง perRow)
```

**ในบรรทัด `gap?: "gap-6" | "gap-4"; className?: string;`**

```text
ช่องไฟระหว่างช่อง (ไลบรารี 24 · VehicleAndReporterInfo 16)
```

## src/components/vms/DatePicker.tsx

**หัวไฟล์**

```text
Figma: "Date picker" — ไฟล์ (Component) VMS Plus หน้า Date picker (node 855:376) · สเปก figma-spec/Date picker.json + _Date picker calendar + _Date picker calendar item base
  variant: Type = Dual (ช่วงวัน · S6 ช่วงวันเดินทาง) | Single (Month/Year ต้นแบบไม่ใช้) · property: Time picker (ปิดตาม screens.js)
  ค่า: กล่อง รัศมี 16 พื้น white ขอบ 1 gray-300 ไม่มีเงา · Calendar กว้าง 312 ขอบใน 16 ช่องไฟ 12
       Header: Tertiary button ‹ · เดือน (Tertiary button 14 SemiBold black) · Tertiary button › (Dual: ปฏิทินซ้ายปิด › ปฏิทินขวาปิด ‹)
       _Date picker calendar 280×280 = 7 คอลัมน์ × แถวละ 40 (แถวแรกชื่อวัน 14 SemiBold)
       _Date picker calendar item base 40×40 รัศมี 9999 ตัวเลข 14 Regular: Day (Hover พื้น gray-200) · Today พื้น gray-100 ตัวอักษร brand-900
         · Day in range พื้น gray-100 + connector ซ้าย/ขวา gray-100 (แถบต่อเนื่อง) · Selected day พื้น brand-900 ตัวอักษร white (Hover brand-800) · Disabled ตัวอักษร gray-400 (วันนอกเดือน)
       _Date picker footer: ขอบใน 16 เส้นบน gray-300 · Tertiary brand button (ล้าง) ซ้าย · Secondary + Primary button md ขวา ช่องไฟ 12
  ข้อความตั้งต้นตามไลบรารี (Mo–Su · "Dec 2024" · Clear / Cancel / Apply) · ส่ง prop เพื่อเปลี่ยนได้ (COMPOSED.md ง.) · ClearText="" = ซ่อนปุ่มล้าง (Tertiary brand button ซ่อนตาม thaiDatePicker() ใน screens.js 5 พ.ย. 2569)
  9 พ.ย. 2569 (R83 วันดำเนินการ · rangeDays() ใน screens.js): min / max = วันนอกช่วงเป็น _Date picker calendar item base State=Disabled กดไม่ได้
    · range = Type=Single แต่เลือกเป็นช่วง (Selected day + Day in range แบบ Dual) · Today={false} = ไม่ทำเครื่องหมายวันนี้ (rangeDays ไม่มี Today) — พฤติกรรมเพิ่ม หน้าตาตามไลบรารีเดิม
```

**ก่อน `month?: Date;`**

```text
เดือนแรกที่แสดง (ค่าเริ่ม = เดือนของวันเริ่ม หรือวันนี้)
```

**ก่อน `min?: Date;`**

```text
วันแรก/วันสุดท้ายที่เลือกได้ (นอกช่วง = State Disabled)
```

**ก่อน `range?: boolean;`**

```text
Type=Single เลือกเป็นช่วงวัน
```

**ก่อน `Today?: boolean;`**

```text
ทำเครื่องหมายวันนี้ (Type Today)
```

**ท้ายบรรทัด `const lead = (start.getDay() + 6) % 7;`**

```text
จันทร์เป็นวันแรก (Mo–Su ตามไลบรารี)
```

**ท้ายบรรทัด `const off = (!!min && dayKey(d) < dayKey(min)) || (!!max && dayKey(d) > dayKey(max));`**

```text
นอกช่วงที่เลือกได้ = Disabled
```

## src/components/vms/DropdownList.tsx

**หัวไฟล์**

```text
Figma: "Dropdown list" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown list.json
  รายการใต้ Input dropdown / ช่องค้นหา (ตาม comboAt ใน core.js) · ลูก = Dropdown list item
  ค่า: ขอบใน 12/8 · ช่องไฟ 8 · รัศมี 8 · พื้น white · ขอบ 1 gray-300 · สูงสุด 256 แล้วเลื่อน
  เงา: effect DROP_SHADOW y12 blur16 spread-4 (gray-900 ทึบ 8%) = token --shadow-lg (shadow-lg-lib)
```

## src/components/vms/DropdownListItem.tsx

**หัวไฟล์**

```text
Figma: "Dropdown list item" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown list item.json
  variant: State = Default | Hover | Selected | Selected Hover | Disabled
  property: Text · Supporting · Supporting text · Supporting 2 · Supporting text 2 · Avatar (ปิด — สี avatar ไม่มี token ดู COMPOSED.md)
  ค่า: สูง 40 · ขอบในซ้าย/ขวา 8 · ช่องไฟ 8 · รัศมี 4 · ข้อความ 16 Regular black (Selected brand-900 · Disabled gray-400)
       บรรทัดรอง 12 gray-600 คั่นด้วยขีด gray-300 · Hover พื้น gray-200 · Selected มีไอคอน check 24 brand-900 ท้ายแถว
```

## src/components/vms/DropdownMenu.tsx

**หัวไฟล์**

```text
Figma: "Dropdown menu" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown menu.json
  เมนู "…" ท้ายแถว (ตาม menuAt / planMenu ใน core.js) · _Dropdown menu header ซ่อน · เส้นคั่นก่อนรายการที่ 3 (น้อยกว่า 3 รายการไม่มีเส้น)
  ค่า: กว้าง 240 · รัศมี 8 · พื้น white · ขอบ 1 gray-200 · Menu items ขอบในบน/ล่าง 4
  เงา: effect DROP_SHADOW y12 blur16 spread-4 (gray-900 ทึบ 8%) = token --shadow-lg (shadow-lg-lib)
  ขอบ 1 Color/border/secondary (gray-200) · รัศมี Radius/200 (8) · _Dropdown menu header (เส้นล่าง 1 gray-200) ต้นแบบยังไม่ใช้
  mobile: เมนูอยู่ใน bottom sheet (ไม่มีกรอบ) — ส่ง bare
```

## src/components/vms/DropdownMenuItem.tsx

**หัวไฟล์**

```text
Figma: "_Dropdown menu item" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/_Dropdown menu item.json
  ชิ้นซ้อนใน Dropdown menu
  variant: Type = Shortcut | Badge · State = Default | Hover | Focused | Disabled · Divider = False | True
  property: Text · Icon (swap) · Shortcut (ปิด) · Badge
  ค่า: สูง 40 · ขอบนอกซ้าย/ขวา 4 · Content ขอบใน 8/12 รัศมี 8 · ไอคอน 16 + ข้อความ 14 Medium black ห่าง 8
       Hover พื้น gray-100 · Focused พื้น gray-50 · Divider=True สูง 9 เส้น 1 gray-200
```

## src/components/vms/EmptyStateDataEmpty.tsx

**หัวไฟล์**

```text
Figma: "Empty state/Data empty" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Empty state_Data empty.json
  ใช้แทนตารางเมื่อไม่มีข้อมูล (noCarsInQ / noParts ใน screens.js — ซ่อน Actions)
  ค่า: ขอบในบน/ล่าง 40 · ช่องไฟ 24 · พื้น white · Content กว้าง 360 ช่องไฟ 12 · หัวข้อ 24 SemiBold black · ข้อความ 16 Regular gray-600 ห่าง 8 · Actions ช่องไฟ 16
  ภาพ Graphic 200×200 (พื้นภาพ paint image) — ส่งออกจากดัมป์ UI Release#2 4 พ.ย. 2569 ตามบริบทที่หน้าจอจริงใช้:
    "data" = แฟ้ม EMPTY ของ "ไม่พบข้อมูล / ไม่มีงานที่กำลังดำเนินการ" (MA Success · 58-42887)
    "vehicle" = รถกับแว่นขยาย ของ "ไม่มียานพาหนะ" (Contract vehicle list - Empty · 1-54) — ใช้กับรายการรถที่ว่าง
```

## src/components/vms/EmptyStateSearchNotFound.tsx

**หัวไฟล์**

```text
Figma: "Empty state/Search not found" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Empty state_Search not found.json
  ใช้เมื่อค้นหา/กรองแล้วไม่พบ · ค่าเริ่มของไลบรารี: "ไม่พบข้อมูล" / "เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง" · Actions = Secondary button "ล้างตัวกรอง" (Primary button ซ่อน)
  ค่า: ขอบในบน/ล่าง 40 · ช่องไฟ 24 · พื้น white · Content กว้าง 360 ช่องไฟ 12 · หัวข้อ 24 SemiBold black · ข้อความ 16 Regular gray-600 ห่าง 8 · Actions ช่องไฟ 16
  ภาพ Graphic 200×200 (พื้นภาพ paint image) — ส่งออกจากดัมป์ UI Release#2 4 พ.ย. 2569 หน้า Contract list - Search not found (1-54)
```

## src/components/vms/FeaturedIcon.tsx

**หัวไฟล์**

```text
Figma: "Featured icon" — ไฟล์ (Component) VMS Plus หน้า Featured icon (node 2861:54686) · สเปก figma-spec/Featured icon.json
  variant: Color = Gray | Info | Success | Warning | Error | Brand | Disabled | Purple · Size = md (48) | sm (36)
  Purple: พื้น purple-50 · ไอคอน md purple-700 · sm purple-600 (Variable Color/component/utility/purple/700 · /600)
  property: Icon swap (ค่าเริ่ม info-24-300-round) · วงกลม · ไอคอน 24
```

## src/components/vms/FileIcon.tsx

**หัวไฟล์**

```text
Figma: "_File icon" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File icon.json
  variant: Type = Document (draft) | Image (image) — เลือกตามนามสกุลไฟล์ (fileIconType) ตาม upload() ใน core.js
  ค่า: Featured icon Color=Gray Size=sm (36 · พื้น gray-100 · ไอคอน 24 gray-500)
```

## src/components/vms/FileUpload.tsx

**หัวไฟล์**

```text
Figma: "File upload" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/File upload.json
  variant: Type = Default (ที่ต้นแบบใช้) · property: File upload (กล่องเลือกไฟล์) · File queue · Helper · Helper text
  โครง: File upload with label (Input label → _File upload base ห่าง 8 → Helper text) → File queue ห่าง 16 (_File upload item base ช่องไฟ 12)
  ใช้แบบ upload() ใน core.js: Supporting text = "<hint> · <n>/10 ไฟล์" · readonly = ไม่มีกล่องอัปโหลด ไม่มีปุ่มลบ · error = Helper text error-600 + กล่อง State=Error
  ไฟล์: ไอคอนตามนามสกุล (_File icon Image/Document) · progress = กำลังอัปโหลด (n%) · bar = อัปโหลดเสร็จแสดงแถบ 100% · err = อัปโหลดไม่สำเร็จ
```

**ก่อน `hint?: string;`**

```text
ข้อความใน Supporting text ก่อนจำนวนไฟล์ (ค่าเริ่ม "PDF, JPG · สูงสุด 10 ไฟล์")
```

**ก่อน `readonly?: boolean;`**

```text
หน้ารายละเอียด: ไม่มีกล่องอัปโหลด ไม่มีปุ่มลบ · ส่ง onDownload = แสดงปุ่มดาวน์โหลด (Download action) ด้วย (S26 11 พ.ย. 2569)
```

**ก่อน `bar?: boolean;`**

```text
แสดงแถบ 100% ทุกไฟล์ที่อัปโหลดเสร็จ
```

## src/components/vms/FileUploadBase.tsx

**หัวไฟล์**

```text
Figma: "_File upload base" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File upload base.json
  กล่องเลือก/ลากไฟล์ใน File upload
  variant: State = Default | Hover | Focused | Disabled | Error · property: Supporting text
  ค่า: สูง 124 · ขอบใน 16 · รัศมี 8 · พื้น white ขอบ 1 gray-300 (Hover/Focused brand-800 · Error error-500 · Disabled พื้น gray-50)
       Featured icon Gray sm ไอคอน cloud_upload (Disabled = Color Disabled) → ข้อความ ห่าง 12 · "คลิกเพื่อเลือกไฟล์" 14 SemiBold brand-900 (Disabled gray-400)
       + "หรือลากไฟล์มาวางบริเวณนี้" 14 gray-600 ช่องไฟ 4 · Supporting text 12 gray-600 ห่าง 4 · จัดกลาง
```

## src/components/vms/FileUploadItemBase.tsx

**หัวไฟล์**

```text
Figma: "_File upload item base" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File upload item base.json
  แถวไฟล์ในคิวของ File upload
  variant: State = In progress | Completed | Error · property: File name · File size · Progress bar · Actions · Download action · Delete action
  ค่า: ขอบใน 16 · รัศมี 8 · พื้น white ขอบ 1 gray-300 (Error error-500) · _File icon + ชื่อไฟล์ ช่องไฟ 12 · ชื่อ 14 SemiBold gray-600 · ขนาด 12 gray-600 (Error ข้อความ error-600)
       Actions = Tertiary button ไอคอน 40: Completed download + delete · In progress close · Error restart_alt + close
       Progress bar Label=Right ห่าง 4: In progress brand-900 n% · Completed success-500 100%
```

**ก่อน `FileSize?: string;`**

```text
property File size (Error = ข้อความผิดพลาด)
```

**ก่อน `Progress?: number;`**

```text
In progress: เปอร์เซ็นต์ (ค่าเริ่ม 40)
```

**ก่อน `ProgressBar?: boolean;`**

```text
property Progress bar — Completed แสดงแถบ 100% เมื่อ true
```

## src/components/vms/HeaderNavigation.tsx

**หัวไฟล์**

```text
Figma: "Header navigation" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Header navigation.json
  variant: Breakpoint = Desktop | Tablet | Mobile — จอ desktop ใช้ Tablet (รีวิว 19 ต.ค. 2569 ใน shell() ของ core.js) · มือถือใช้ Mobile
  ค่า: สูง 64 · พื้น white · เส้นล่าง gray-200 · ช่องไฟ 8
       Desktop: ขอบใน 12/32 · ขวา Nav button (search · light_mode · notifications) + Avatar 36
       Tablet: ขอบใน 12/16 · ซ้าย Brand logo + Nav button menu · ขวาเหมือน Desktop
       Mobile: ขอบใน 12/16 · Brand logo 40 · ปุ่ม Menu (Icon button วงกลม ขอบ gray-300 ไอคอน 20 gray-600) · Search (Text input) · Nav button notifications + menu
  Brand logo / Avatar: ดู COMPOSED.md (โลโก้จากภาพส่งออกหน้าจอ · avatar พื้นม่วงอ่อน + ภาพ (ไม่ผูก Variable · ไม่มี token ตรง) → purple-200 ใกล้สุด)
```

**ก่อน `bell?: boolean;`**

```text
จุดแดงบนกระดิ่ง
```

## src/components/vms/HorizontalRadioGroups.tsx

**หัวไฟล์**

```text
Figma: "Horizontal radio groups" — ไฟล์ (Component) VMS Plus หน้า Radio button (node 2:17) · สเปก figma-spec/Horizontal radio groups.json
  ตัวเลือกสั้นๆ ไม่มีคำอธิบาย 2–4 ตัว (radioGroup() ใน core.js)
  ค่า: Label (ไอคอนนำ crop_free ปิด · ป้าย 16 SemiBold gray-600 · info ปิด) → Container ห่าง 8 · Container สูง 40 ช่องไฟ 16
       แต่ละตัว = Radio button + ข้อความ 16 Regular black ช่องไฟ 8 (ตัวที่เลือก 12) · Helper 12 gray-600 (มี error = error-600)
  มือถือ: ตัวเลือกขึ้นบรรทัดใหม่ได้ (flex-wrap)
```

**ก่อน `Label?: string;`**

```text
ข้อความป้าย (Label)
```

**ก่อน `value?: string | null;`**

```text
ตัวที่เลือก (ข้อความ)
```

**ก่อน `HelperText?: string;`**

```text
property Helper — ข้อความใต้กลุ่ม
```

## src/components/vms/IconButton.tsx

**หัวไฟล์**

```text
Figma: "Icon button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Icon button.json
  ปุ่มวงกลมไอคอนอย่างเดียว (ปุ่มเลื่อนภาพใน Images / IncidentPhotoGallery)
  variant: State = Default | Hover | Focused | Disabled · property: Icon swap
  ค่า: 40×40 · ขอบใน 8 · รัศมี 9999 · พื้น white ขอบ 1 gray-300 · ไอคอน 20 gray-600 · Hover พื้น gray-200 · Focused + วงโฟกัส gray · Disabled พื้น gray-100 ขอบ gray-200 ไอคอน gray-400
```

## src/components/vms/Images.tsx

**หัวไฟล์**

```text
Figma: "Images" — ไฟล์ (Component) VMS Plus หน้า Images (node 2648:43267) · สเปก figma-spec/Images.json
  variant: Size = md (รัศมี 12) | sm (รัศมี 8) · Type = Image | Empty · property: Indicator pagination · Buttons (ปุ่มเลื่อน Icon button)
  ค่า: Image = พื้นภาพ (src) · Empty = พื้น gray-200 + ไอคอน imagesmode 48 (เติม) gray-300 กลางกรอบ
  ต้นแบบไม่มีไฟล์ภาพจริง → ไม่ส่ง src = Type Empty (ช่องภาพของไลบรารี) · ขนาดกำหนดจากที่วาง (className) เช่น gallery 175×156
```

## src/components/vms/Indicator.tsx

**หัวไฟล์**

```text
Figma: "Indicator" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Indicator.json
  จุดสถานะในป้าย (Badge outline with indicator)
  variant: Size = sm (กรอบ 8 · จุด 6 · ขอบใน 1) | md (12 · 8 · 2) | lg (16 · 10 · 3)
  สีจุดตาม instance ที่วาง (ตั้งต้น Color/icon/success = success-500) — ส่งคลาส bg-* ผ่าน dot
```

## src/components/vms/InputDropdown.tsx

**หัวไฟล์**

```text
Figma: "Input dropdown" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Input dropdown.json
  variant: State = Default | Selected | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md | lg
  property: Label · Label text · Optional · Info icon · Text · Placeholder · Leading icon (swap) · Supporting · Supporting text · Helper · Helper text
  ค่า: เหมือน Text input (ป้าย → ช่อง 8 · ช่อง 40/48 · ขอบใน 8/12 · รัศมี 8) · ลูกศร keyboard_arrow_down 20 gray-500 (Focused = keyboard_arrow_up)
       Selected/Focused ค่า 16 black · Default placeholder gray-400 · Supporting text 16 gray-600 ต่อท้ายค่า
  property Cursor = ช่องพิมพ์ค้นได้ (ส่ง onQuery) — ใช้กับช่อง "เลือกรถ" แบบ carPick() ใน screens.js (Text = คำค้น · Leading icon search)
  รายการที่เปิด (Dropdown list) ส่งเป็น children — วางใต้ช่อง ห่าง 4 กว้างเท่าช่อง (ตาม comboAt ใน core.js)
```

**ก่อน `Text?: string;`**

```text
ค่าที่เลือก (property Text)
```

**ก่อน `Placeholder?: string;`**

```text
ข้อความเมื่อยังไม่เลือก
```

**ก่อน `open?: boolean;`**

```text
รายการเปิดอยู่ (State=Focused)
```

**ก่อน `onQuery?: (q: string) => void;`**

```text
property Cursor — ส่งเมื่อช่องพิมพ์ค้นได้ (Text = คำค้น)
```

**ก่อน `children?: ReactNode;`**

```text
Dropdown list ที่แสดงเมื่อเปิด
```

## src/components/vms/InputDropdownWithBadges.tsx

**หัวไฟล์**

```text
Figma: "Input dropdown with badges" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Input dropdown with badges.json
  เลือกได้หลายค่า ค่าที่เลือกเป็นชิป Badge outline with remove icon (Color=Gray) ในช่อง
  variant: State = Default | Selected | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md
  property: Label · Label text · Optional · Info icon · Text · Leading icon (swap) · Helper · Helper text
  ค่า: ช่องเหมือน Input dropdown (40 · ขอบใน 8/12 · รัศมี 8) · ชิปห่าง 8 · Selected แสดง 4 ชิป · Focused 2 ชิป + ช่องพิมพ์ (Text)
       ค่าเกินจำนวนชิป → ชิปสุดท้ายเป็น "+n" (ตาม multiDropdown ใน core.js)
```

**ก่อน `values: string[];`**

```text
ค่าที่เลือก = ชิป
```

**ก่อน `Placeholder?: string;`**

```text
ข้อความเมื่อยังไม่เลือก (property Text ตอนว่าง)
```

## src/components/vms/InputLabel.tsx

**หัวไฟล์**

```text
Figma: "Input label" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Input label.json
  ป้ายเหนือช่องกรอกทุกแบบ (Text input · Input dropdown · Input dropdown with badges)
  property: Label text · Optional ("(ถ้ามี)") · Info icon (ปิดตามกติกา R4) · button (Tertiary brand button ขวา)
  ค่า: สูง 24 · ช่องไฟ 4 · ป้าย 16 SemiBold gray-600 · "(ถ้ามี)" 16 Regular gray-400 · ไอคอน info 24 gray-300
```

**ก่อน `Button?: ReactNode;`**

```text
property button — ปุ่ม Tertiary brand button ท้ายป้าย
```

## src/components/vms/ListHeaderItem.tsx

**หัวไฟล์**

```text
Figma: "List header item" — ไฟล์ (Component) VMS Plus หน้า List (node 3285:58382) · สเปก figma-spec/List header item.json
  หัวของ List with checkbox: Title + Badge outline Gray (ปิดได้) + Checkbox เลือกทั้งหมด ชิดขวา
  ค่า: สูง 40 · ขอบในข้าง 16 · ช่องไฟ 16 · รัศมี 4 · พื้น gray-200 · Title 16 SemiBold black · Content ช่องไฟ 12
```

## src/components/vms/ListWithCheckbox.tsx

**หัวไฟล์**

```text
Figma: "List with checkbox" — ไฟล์ (Component) VMS Plus หน้า List (node 3285:58382) · สเปก figma-spec/List with checkbox.json
  รายการเลือกหลายตัวบนมือถือ (ตารางที่มี checkbox → List with checkbox ตาม mobileCards() ใน core.js · S6 เลือกรถเข้าแผนเดินทาง)
  โครง: List header item (Title + ป้าย ปิด + Checkbox ทั้งหมด) → List with checkbox item × n · Vertical scrollbar ซ่อน
```

## src/components/vms/ListWithCheckboxItem.tsx

**หัวไฟล์**

```text
Figma: "List with checkbox item" — ไฟล์ (Component) VMS Plus หน้า List (node 3285:58382) · สเปก figma-spec/List with checkbox item.json
  variant: State = Default | Hover | Selected | Selected Hover | Disabled · property: Text · Supporting · Supporting text · Supporting 2 · Supporting text 2 · Avatar (ปิดตาม mobileCards())
  ค่า: ขอบใน 8/16 · ช่องไฟ 16 · พื้น white (Hover gray-100) · เส้นล่าง 1 gray-200 (sws [0,0,1,0])
       Text 16 Regular black (Selected brand-900 · Disabled gray-400) · Supporting 12 gray-600 ช่องไฟ 4 · Checkbox ชิดขวา
```

## src/components/vms/MetricItem.tsx

**หัวไฟล์**

```text
Figma: "Metric item" — ไฟล์ (Component) VMS Plus หน้า Metrics (node 2011:13829) · สเปก figma-spec/Metric item.json
  variant: Breakpoint = Desktop | Mobile · property: Number · Text · Featured icon (instance ซ้อน · Color ตั้งได้แบบ metric() ใน screens.js)
  Desktop: กว้าง FILL สูง 156 · ขอบใน 20/16 · ช่องไฟ 20 (SPACE_BETWEEN) · รัศมี 12 (Radius/300) · พื้น white (Color/surface/primary) · ขอบ 1 gray-300 (Color/border/primary)
           Icon and text = Featured icon Size=md (48) + Text 16 SemiBold black ช่องไฟ 12 · Number 32 SemiBold black (IBM/Headline/03)
  Mobile: 156×104 (ในแถวยืดเต็มช่อง) · ขอบใน 12 · ช่องไฟ 12 · Icon and text = Text 14 SemiBold black (ซ้าย) + Featured icon Size=sm (36 · ขวา) ช่องไฟ 8 · Number 20 SemiBold (IBM/Title/01)
  Featured icon ค่าตั้งต้นของไลบรารี Color=Info ไอคอน info-24-300-round · แดชบอร์ด S4 ใช้ Brand / Success ตาม DASH_METRICS (ไอคอนคงเดิม)
```

**ก่อน `FeaturedIconColor?: FeaturedIconColor;`**

```text
Color ของ Featured icon ที่ซ้อนอยู่ (ค่าตั้งต้นของไลบรารี Info)
```

**ก่อน `IconSwap?: string;`**

```text
Icon swap ของ Featured icon ที่ซ้อนอยู่
```

## src/components/vms/MobileProgressSteps.tsx

**หัวไฟล์**

```text
Figma: "Mobile progress steps" (Collapsed=True) + "Step circles / 4 steps" — ไฟล์ (Component) VMS Plus หน้า Progress steps · สเปก figma-spec/Mobile progress steps.json · figma-spec/Step circles _ 4 steps.json
  property: Text · Supporting · Supporting text · Stepper item swap (วง Step circles) · Collapsed=True (ใช้)
  กรอบ ขอบใน 16 ช่องไฟ 16 พื้น white ขอบ 1 gray-300 รัศมี 8 · วง 72 (Track gray-300 Color/component/progress/track · Progress brand-900 Color/component/progress/progress)
  ตัวเลขกลางวง "ปัจจุบัน / ทั้งหมด" 12 (ตัวเลข SemiBold black · "/" gray-400) · ข้อความขั้น 16 SemiBold black · "ถัดไป:" 12 SemiBold gray-600 + ชื่อขั้นถัดไป 12 gray-600
  mtStepper() ใน screens.js: 2 ขั้น = วง Step=2 (ครึ่ง) / Step=4 (เต็ม) แสดง 1/2 · 2/2 · ไอคอน keyboard_arrow_down ท้าย (Collapsed — ต้นแบบไม่กางรายการขั้น)
  วงความคืบหน้า = conic-gradient ตามสัดส่วน + วงในสีพื้น (ดัมป์ไม่มีข้อมูล arc ของ ellipse — COMPOSED.md)
```

## src/components/vms/MobileTable.tsx

**หัวไฟล์**

```text
Figma: "Mobile table" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Mobile table.json
  variant: Alternating fills = False | True
  ค่า: รัศมี 8 · ขอบ 1 gray-300 · พื้น white (True = gray-50) · ขอบในบน 4 · ลูก = Mobile table item (แถวท้ายเป็น Action icons)
  ใช้แบบ mobileCards() ใน core.js: 1 แถวตาราง = 1 การ์ด · การ์ดห่างกัน 12 · แถวแรกเป็น Lead text · ช่อง {pills} = แถว Badge · ปุ่ม = แถวท้าย Action icons
  ช่อง {actions, mobileActions} → แถวท้าย Action icons ใช้ mobileActions ถ้ามี (ไอคอนดู แก้ไข ลบ กางออกเลย ไม่เปิดเมนู … · เจ้าของงาน 4 พ.ย. 2569 "ส่วนที่เป็น mobile อยากให้ expand view edit delete icon ออกมาแบบตัวอย่างทั้งหมด")
  ช่อง {text, sub} (บรรทัดรองของตาราง เช่น ชื่อแผน + ปีงบประมาณ) → Text + Supporting text ของ Mobile table item (12 gray-600) ไม่ต่อท้าย Text (เจ้าของงาน 4 พ.ย. 2569)
```

**ก่อน `export function MobileCards({ columns, rows, rowKey }: { columns: TableColumn[]; rows: Tab`**

```text
ตารางเดียวกับ Table แต่แสดงเป็นการ์ด (มือถือ)
```

## src/components/vms/MobileTableItem.tsx

**หัวไฟล์**

```text
Figma: "Mobile table item" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Mobile table item.json
  แถวในการ์ด Mobile table
  variant: Style = Text | Lead text | Badge | Action icons | Action buttons (Avatar · Lead avatar ไม่ใช้)
  property: Header · Text · Supporting · Supporting text · View · Edit · Print · Delete
  ค่า: Text/Lead text/Badge: ขอบใน 8/12 ช่องไฟ 8 เส้นล่าง 1 (sws [0,0,1,0]) Color/border/secondary = gray-200 (การ์ดที่ไม่มีแถว Action ไม่ใส่เส้นแถวท้าย — COMPOSED.md จ.) · หัว 14 SemiBold black ครึ่งซ้าย · ค่า 14 (Lead text Medium) ชิดขวา + Supporting text 12 gray-600
       Action icons/Action buttons ไม่มีเส้น (sws มีแต่ไม่มีสีเส้น) · Action icons: ขอบใน 12 ช่องไฟ 4 Tertiary button ไอคอน 40 · Action buttons: ขอบใน 16/12 ช่องไฟ 12 Secondary button Size=lg
```

**ก่อน `Buttons?: ReactNode;`**

```text
Action buttons — ปุ่ม Secondary button Size=lg
```

## src/components/vms/Modal.tsx

**หัวไฟล์**

```text
Figma: "Modal" — ไฟล์ (Component) VMS Plus หน้า Modals (node 2:16) · สเปก figma-spec/Modal.json
  variant: Type = Centered image | Centered image with input | Destructive centered image with input | Form | Card list | Left aligned image | Centered image carousel
           Size = md (กว้าง 500) | lg (800) | xl (1140)
  โครง: Background overlay + กล่อง Modal (รัศมี 12 พื้น white) = Modal header + เนื้อหา (Content / Form ขอบในข้าง 24 ช่องไฟ 12) + Modal footer
  ใช้แบบ confirm() / formModal() ใน core.js: confirm = Centered image ซ่อนรูป (Content) · ลบ = Destructive (ซ่อน Form) ปุ่มหลัก Primary danger button
  มือถือใช้ BottomSheet แทน (กติกาข้อ 6) · ไลบรารีไม่มีเงา (ดัมป์ 4 พ.ย. 2569 ไม่มี effect ที่ Modal) — มีแค่ Background overlay
```

**ก่อน `Header: ReactNode;`**

```text
ModalHeader
```

**ก่อน `children?: ReactNode;`**

```text
Content / Form
```

**ก่อน `Footer?: ReactNode;`**

```text
ModalFooter
```

## src/components/vms/ModalFooter.tsx

**หัวไฟล์**

```text
Figma: "Modal footer" — ไฟล์ (Component) VMS Plus หน้า Modals (node 2:16) · สเปก figma-spec/Modal footer.json
  variant: Alignment = Horizontal fill | Horizontal right | Vertical fill
  property: Secondary action · Primary action · Tertiary action · Divider (ปิด R2/R13) · Padding top
  ค่า: Padding top 24 · Actions ขอบในข้าง 24 ล่าง 24 ช่องไฟ 12 · Horizontal fill ปุ่มแบ่งครึ่ง · Horizontal right ปุ่มชิดขวา (Tertiary ซ้าย) · Vertical fill เรียงลง (Primary บน)
```

**ก่อน `Divider?: boolean;`**

```text
property Divider — เส้นคั่นเหนือปุ่ม (ค่าเริ่มปิดตาม R2/R13 · Modal Signature / SummaryRequestedParts เปิด)
```

**ก่อน `PaddingTop?: boolean;`**

```text
property Padding top (ค่าเริ่มเปิด 24 · SummaryRequestedParts ปิด)
```

**ก่อน `SecondaryAction?: ReactNode;`**

```text
ปุ่มรอง (ซ้าย) — SecondaryButton
```

**ก่อน `PrimaryAction?: ReactNode;`**

```text
ปุ่มหลัก (ขวา) — PrimaryButton / PrimaryDangerButton
```

**ก่อน `{Divider && <div className="-mx-6 pb-5"><div className="h-px bg-gray-300" /></div>}`**

```text
property Divider: Content divider เต็มกว้าง + ห่างปุ่ม 20 (Padding top 24 คงเดิม)
```

## src/components/vms/ModalHeader.tsx

**หัวไฟล์**

```text
Figma: "Modal header" — ไฟล์ (Component) VMS Plus หน้า Modals (node 2:16) · สเปก figma-spec/Modal header.json
  variant: Alignment = Center | Left
  property: Title · Supporting · Supporting text · Featured icon · Close icon · Back icon · Divider (ปิด R2/R13) · Padding bottom
  Center: ขอบใน 24 บน/ข้าง · Featured icon (Brand md 48) → ข้อความ ห่าง 16 จัดกลาง · หัวข้อ 20 SemiBold black · Supporting 16 gray-600 ห่าง 4 · ปุ่มปิดมุมขวาบน
  Left: แถวเดียว ช่องไฟ 8 · ปุ่มย้อนกลับ · Featured icon + ข้อความ ห่าง 16 · ปุ่มปิด · Padding bottom 16
```

**ก่อน `FeaturedIcon?: boolean;`**

```text
property Featured icon — ใส่ชื่อไอคอนเพื่อแสดง (ค่าเริ่มไลบรารี info)
```

**ก่อน `Divider?: boolean;`**

```text
property Divider (Alignment=Left) — เส้นคั่นใต้หัว ห่าง 20 (ค่าเริ่มปิดตาม R2/R13 · Modal Signature / SummaryRequestedParts เปิด)
```

## src/components/vms/Ms.tsx

**หัวไฟล์**

```text
ไอคอน Material Symbols Rounded — ไลบรารี (Component) VMS Plus ใช้ไอคอนชุดนี้ทั้งหมด ชื่อแบบ "search-24-300-round" / "check_circle-20-300-round-fill"
  ไม่ใช่ component ของไลบรารี (เป็นตัวแสดงไอคอนที่ทุก component ใช้ร่วม) · name รับได้ทั้งชื่อ Figma และชื่อ Material ตรงๆ
  size = กรอบไอคอนตามที่ instance วางใน component (เช่นในปุ่มเป็น 20 แม้ชื่อเป็น -24-)
```

**ก่อน `const ALIAS: Record<string, string> = { warning_circle: "error", cancel_circle: "cancel" }`**

```text
ชื่อในไฟล์ Figma ที่ฟอนต์ Material Symbols ไม่มี → ชื่อที่หน้าตาเดียวกัน
```

## src/components/vms/NavButton.tsx

**หัวไฟล์**

```text
Figma: "Nav button" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Nav button.json
  variant: State = Active | Default | Disabled | Focused | Hover · property: Icon swap · Indicator · Text (tooltip ตอน Hover)
  ค่า: 40×40 · ขอบใน 8 · รัศมี 8 · พื้น white (Active/Hover gray-200 · Focused gray-50) · ไอคอน 24 gray-500 (Active brand-900 · Disabled gray-400)
       Icon swap ในหน้าจอ UI Release#2 "Sidebar Navigation" (277:230639) สลับเป็น Avatar ที่ปุ่มผู้ใช้
       Indicator จุด 6 brand-900 (Disabled gray-400) — แสดงเมื่อ Indicator=true (เช่นกระดิ่งมีแจ้งเตือนใหม่ ตาม bell() ใน screens.js)
```

**ก่อน `IconSwap: string | ReactNode;`**

```text
property Icon swap — ชื่อไอคอน หรือ element (ปุ่มผู้ใช้ใน Footer menu สลับเป็น Avatar)
```

**ก่อน `Text: string;`**

```text
property Text — ป้ายบอก (title / aria-label)
```

## src/components/vms/NavItem.tsx

**หัวไฟล์**

```text
Figma: "Nav item" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Nav item.json
  แถวเมนูของ Sidebar navigation State=Expanded (หัวกลุ่มที่มีลูกศรก็ใช้ตัวนี้ ตาม Nav menu ในหน้า "Sidebar Navigation" 277:230639 ของ UI Release#2)
  variant: State = Default | Hover | Active | Focused | Disabled
  property: Text · Leading icon / Leading icon swap · Trailing icon / Trailing icon swap · Badge (Pill color) · Show Description / Supporting text
  ค่า: กว้างเต็ม (248) สูง 40 · ขอบใน 8 · ช่องไฟ 8 · รัศมี 8 · พื้น white (Hover/Active gray-200 · Focused gray-50)
       ไอคอนหน้า 24 gray-500 (Active brand-900 · Disabled gray-400) · Text 14 SemiBold black (Active brand-900 · Disabled gray-400)
       Supporting text 12 gray-600 (Disabled gray-400) · Pill color Brand (Disabled = Color Disabled) · ไอคอนท้าย 20 gray-500 (Disabled gray-400)
  Leading icon swap รับชื่อไอคอน หรือ element (แถวผู้ใช้ใน Footer menu สลับเป็น Avatar)
```

**ก่อน `Badge?: boolean;`**

```text
property Badge — แสดง Pill color
```

**ก่อน `BadgeText?: string;`**

```text
ข้อความใน Pill color
```

**ก่อน `expanded?: boolean;`**

```text
หัวกลุ่ม: กลุ่มเปิดอยู่ไหม (aria-expanded)
```

## src/components/vms/NavListItem.tsx

**หัวไฟล์**

```text
Figma: "Nav list item" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Nav list item.json
  เมนูย่อยใต้หัวกลุ่ม (Nav item) ใน "sub items" ของ Nav menu หน้า "Sidebar Navigation" (277:230639) ของ UI Release#2
  variant: State = Default | Hover | Active | Focused | Disabled · property: Text · Badge (Pill color)
  ค่า: กว้างเต็ม (248) สูง 40 · ขอบใน 8 / ซ้าย 40 / ขวา 16 · ช่องไฟ 4 · รัศมี 8 · พื้น white (Hover/Active gray-200 · Focused gray-50)
       Text 14 Regular black (Active brand-900 · Disabled gray-400) · Pill color Brand (Disabled = Color Disabled)
```

**ก่อน `Badge?: boolean;`**

```text
property Badge — แสดง Pill color
```

## src/components/vms/Notification.tsx

**หัวไฟล์**

```text
Figma: "Notification" — ไฟล์ (Component) VMS Plus หน้า Notifications (node 1873:44383) · สเปก figma-spec/Notification.json
  toast มุมล่างขวา (ตาม notify() ใน core.js: วางชิดขวาล่างของจอ · ปิด Supporting text และ Actions)
  variant: Type = Default | Success | Warning | Error | Info · Breakpoint = Desktop (กล่องกว้าง 400 · ขอบนอกบน/ขวา 24) | Mobile (กว้างเต็มลบขอบ 16)
  property: Text · Supporting text · Actions
  ค่า: ขอบใน 16 · ช่องไฟ 16 · รัศมี 12 · พื้น gray-950 · ขอบ 1 gray-dark-600 · ไอคอนทึบ 24 (Success/Default check_circle success-600 · Warning warning_circle warning-600 · Error cancel_circle error-500 · Info info info-600)
       เงา effect DROP_SHADOW y12 blur16 spread-4 (gray-900 ทึบ 8%) = token --shadow-lg (shadow-lg-lib)
       กรอบนอก (520×240) มีพื้น gradient ดำ 10% → 0% แต่ดัมป์ไม่บอกทิศ → ยังไม่ทำ (COMPOSED.md ข.)
       หัวข้อ 16 SemiBold gray-dark-50 · Supporting 14 gray-dark-300 · ปุ่มปิด Tertiary button gray-dark-300
```

**ก่อน `floating?: boolean;`**

```text
true = วางลอยมุมจอ (toast) · false = แสดงในที่ (หน้า kit)
```

## src/components/vms/NotificationCard.tsx

**หัวไฟล์**

```text
Figma: "Notification card" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Notification card.json
  แผงแจ้งเตือนใต้กระดิ่ง (notiPanel() ใน screens.js · S8) — ไลบรารีไม่มี variant มือถือ (มือถือวางใน BottomSheet ดู patterns/NotificationPanel)
  โครง: Container กว้าง 314 รัศมี 8 พื้น white ขอบ 1 gray-200 เงา --shadow-lg (Variable Color/effect/shadow-8)
       _Notification header: ขอบใน 12 เส้นล่าง gray-200 · "แจ้งเตือน" 18 SemiBold black · Badge outline Gray ("n แจ้งเตือนใหม่")
       Content สูง 400 (เลื่อนได้) = _Notification item base × n
       _Notification footer: ขอบใน 12 เส้นบน gray-200 · Primary button md เต็มกว้าง "ลบข้อความแจ้งเตือนทั้งหมด" (ค่าเริ่มไลบรารี)
```

## src/components/vms/NotificationItemBase.tsx

**หัวไฟล์**

```text
Figma: "_Notification item base" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/_Notification item base.json
  แถวแจ้งเตือนใน Notification card · property: Show status (Status) · Text · Supporting text (เวลา) · Show button (Secondary button — ปิดตาม fillNotiItem())
  ค่า: ขอบใน 12 · ช่องไฟ 8 · เส้นล่าง 1 gray-200 · Status 12 (ขอบในบน 5) · Text 14 Regular black · Supporting text 12 gray-600 ห่าง 4 · ปุ่มห่าง 12
```

## src/components/vms/NumberInput.tsx

**หัวไฟล์**

```text
Figma: "Number input" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Number input.json
  variant: State = Filled | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md (40) | lg (48)
  property: Label · Label text · Optional · Info icon · Number · Helper · Helper text
  ค่า: ป้าย → ช่อง ห่าง 8 · ช่อง รัศมี 8 ขอบ 1 (สีตาม State เหมือน Text input — containerTone) ช่องไฟ 8 ไม่มีขอบใน
       ปุ่มลด/เพิ่ม = Tertiary button ไอคอน remove / add 20 (Disabled ไอคอน gray-400) · ตัวเลข 16 Regular black จัดกลาง · Helper 12 gray-600 (Error error-600)
  ใช้ใน Spare Part Card Item (กว้าง 120 ไม่มีป้าย)
```

## src/components/vms/PageHeader.tsx

**หัวไฟล์**

```text
Figma: "Page header" — ไฟล์ (Component) VMS Plus หน้า Page headers (node 1983:21158) · สเปก figma-spec/Page header.json
  variant: Breakpoint = Desktop | Mobile
  property: Title · Badge · Supporting text · Back action · Copy action (ปิด) · More actions (ปิด) · Actions · Divider (ปิด R2/R13)
  Desktop: Breadcrumbs → (24) → Content: หัวข้อ 32 SemiBold black + Badge outline ห่าง 12 · Supporting text 16 gray-600 · Actions ขวา ช่องไฟ 12 (ปุ่ม md)
  Mobile: ไม่มี Breadcrumbs · แถว Title = ปุ่มย้อนกลับ (Tertiary button keyboard_arrow_left) + หัวข้อ 20 SemiBold · Actions ใต้หัวข้อ ช่องไฟ 16 (ปุ่ม lg)
  ใช้แบบ pageHead() ใน core.js: crumbs = [ชื่อเมนู, ...ระดับกลาง, หน้าปัจจุบัน] · ปุ่มลบสีแดง/ปุ่มหลายปุ่มวางในกรอบ Actions แยก (ส่ง Actions)
  Desktop ไม่มีปุ่ม Back ใน variant (ย้อนกลับด้วย Breadcrumbs) — ดู COMPOSED.md
  Pill = สลับชั้น Badge outline เป็น Pill outline (headPill() ใน screens.js 5 พ.ย. 2569: สถานะ "อยู่ระหว่างบำรุงรักษา" สี Warning ตรงกับตาราง — Badge outline ไม่มีสี Warning)
```

**ก่อน `Badge?: [string, BadgeOutlineColor];`**

```text
property Badge — [ข้อความ, สี Badge outline]
```

**ก่อน `Pill?: [string, PillColor];`**

```text
ชั้น Badge สลับเป็น Pill outline (แทน Badge)
```

**ก่อน `onBack?: () => void;`**

```text
property Back action (มือถือ)
```

**ก่อน `Actions?: ReactNode;`**

```text
property Actions — ปุ่มขวา (desktop) / ใต้หัวข้อ (mobile)
```

## src/components/vms/PillColor.tsx

**หัวไฟล์**

```text
Figma: "Pill color" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Pill color.json
  variant: Color = Brand | Gray | Info | Success | Warning | Error | Disabled · property: Text
  ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 9999 · ตัวอักษร 12 SemiBold
       พื้น/ตัวอักษร: Brand brand-900/white · Gray gray-200/gray-600 · Info info-600/white · Success success-600/white · Warning warning-600/white · Error error-500/white · Disabled gray-100/gray-400
  ใช้เป็นป้ายตัวเลขใน Nav item / Nav list item (property Badge)
```

**ก่อน `export type PillColorName = Exclude<PillOutlineColor, "Purple">;`**

```text
Pill color ไม่มี variant Purple (มีเฉพาะ Pill outline)
```

## src/components/vms/PillOutline.tsx

**หัวไฟล์**

```text
Figma: "Pill outline" — ไฟล์ (Component) VMS Plus หน้า Badge (node 2:13) · สเปก figma-spec/Pill outline.json
  variant: Color = Brand | Gray | Info | Success | Warning | Error | Disabled | Purple (purple-50 / purple-200 / purple-700 ตาม Variable Color/component/utility/purple/*)
  property: Text
  ค่า: สูง 24 · ขอบใน 4/8 · รัศมี 9999 · ขอบ 1 · ตัวอักษร 12 SemiBold
```

## src/components/vms/PrimaryButton.tsx

**หัวไฟล์**

```text
Figma: "Primary button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Primary button.json
  variant: State = Default | Hover | Focused | Disabled · Size = md | lg
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: พื้น brand-900 · Hover brand-800 · ตัวอักษร white · Disabled พื้น gray-100 ตัวอักษร gray-400
```

## src/components/vms/PrimaryDangerButton.tsx

**หัวไฟล์**

```text
Figma: "Primary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Primary danger button.json
  variant: State = Default | Hover | Focused | Disabled · Size = md | lg
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: พื้น error-600 · Hover error-500 · ตัวอักษร white · Disabled พื้น gray-100 ตัวอักษร gray-400
```

## src/components/vms/ProgressBar.tsx

**หัวไฟล์**

```text
Figma: "Progress bar" — ไฟล์ (Component) VMS Plus หน้า Progress bar (node 2843:13902) · สเปก figma-spec/Progress bar.json
  variant: Label = Right (ที่ต้นแบบใช้) | Top left · Progress = 0%…100% (ต้นแบบรับตัวเลขใดก็ได้ 0–100) · Size = md · property: Percentage
  ค่า: Label=Right: แถบ + ตัวเลข ช่องไฟ 8 · แถบสูง 8 รัศมี 9999 · ราง gray-300 · แถบ brand-900 · ตัวเลข 14 Regular gray-600 ชิดขวา กว้าง 40
  ในรายการไฟล์ (_File upload item base State=Completed) แถบ 100% เป็นสีเขียว success-500 → Color="Success"
```

## src/components/vms/ProgressSteps.tsx

**หัวไฟล์**

```text
Figma: "Progress steps" + "Horizontal step item" — ไฟล์ (Component) VMS Plus หน้า Progress steps · สเปก figma-spec/Progress steps.json · figma-spec/Horizontal step item.json
  variant (Progress steps): Type = Horizontal (ใช้) | Vertical · property: Step 2 · Step 3 · Step 4 (ซ่อนช่องเกินตาม mtStepper() ใน screens.js)
  Horizontal: กรอบ ขอบ 1 gray-300 (Color/border/primary) รัศมี 8 · ช่องเรียงแนวนอน ยืดเท่ากัน
  Horizontal step item: variant Status = Incomplete | Current | Completed · property: Text · Number · Supporting (ปิด) · Connector
    สูง 72 · ขอบในซ้าย 24 บน/ล่าง 16 · ช่องไฟ 8 · Content ช่องไฟ 16 · วงกลม 40 รัศมี 9999 ขอบ 1
    Incomplete: วง white ขอบ gray-300 ตัวเลข gray-400 (Color/text/disabled) · ข้อความ gray-600 (Color/text/secondary)
    Current: วง white ขอบ brand-900 ตัวเลข brand-900 (Color/text/brand) · ข้อความ brand-900
    Completed: วง brand-900 ไอคอน check 24 white · ข้อความ black (Color/text/primary) · ตัวอักษร 16 SemiBold
    Connector: เส้นหักมุม (>) 20×72 สี gray-300 ชิดขวาของช่อง (ประกอบด้วยเส้น 2 เส้นแทน vector ของไลบรารี — COMPOSED.md)
```

**ก่อน `export function ProgressSteps({ steps, current, className }: { steps: string[]; current: n`**

```text
steps = ชื่อขั้น · current = ขั้นปัจจุบัน (1 ขึ้นไป) — ก่อนหน้า Completed · ปัจจุบัน Current · ถัดไป Incomplete · ตัวเลข "01" "02"
```

## src/components/vms/RadioButton.tsx

**หัวไฟล์**

```text
Figma: "Radio button" — ไฟล์ (Component) VMS Plus หน้า Radio button (node 2:17) · สเปก figma-spec/Radio button.json
  variant: State = Default | Hover | Focused | Disabled · Selected = True | False
  ค่า: วงกลม 20 · ไม่เลือก ขอบ 2 gray-300 · เลือก พื้น brand-900 จุดกลาง 8 white · Disabled พื้น gray-200 ขอบ 2 gray-300 (จุด gray-300)
       Hover/Focused วงโฟกัส 4 ทึบ 12% (effect ของ Surface): ไม่เลือก gray-500 · เลือก brand-900
```

**ก่อน `label?: string;`**

```text
ป้ายสำหรับโปรแกรมอ่านจอ (เมื่อไม่มีข้อความข้างๆ)
```

**ก่อน `bare?: boolean;`**

```text
true = แสดงเฉยๆ (อยู่ในการ์ด/แถวที่กดได้ทั้งแถว)
```

## src/components/vms/RadioTextCard.tsx

**หัวไฟล์**

```text
Figma: "Radio text card" — ไฟล์ (Component) VMS Plus หน้า Radio button (node 2:17) · สเปก figma-spec/Radio text card.json
  variant: State = Default | Hover | Focused | Disabled · Selected = False | True · property: Text · Supporting · Supporting text
  ค่า: กว้างตั้งต้น 240 (FILL ในแถว) · ขอบใน 16 · รัศมี 8 · พื้น white · ขอบ 1 gray-300 (Selected ขอบ 2 brand-900)
       Hover/Focused ขอบ brand-800 (Focused + วงโฟกัส 4 brand-900 ทึบ 12%) · Disabled พื้น gray-50 ขอบ gray-300 ตัวอักษร gray-400
       Content: Radio button + Text and supporting text ช่องไฟ 12 · Text 16 SemiBold black · Supporting text 14 Regular gray-600 ห่าง 4
  ใช้แบบ radioPick() ใน core.js: desktop แถวเดียว ช่องไฟ 16 การ์ดกว้าง/สูงเท่ากัน · มือถือ เรียงลง ช่องไฟ 12 (ห่อเองด้วย RadioTextCards)
```

**ก่อน `compact?: boolean;`**

```text
ข้อความ 14 (ค่า override ของ instance ในการ์ด ReceiptChecklistCard / InspectionChecklistCard ไฟล์ Maintain-D)
```

**ก่อน `export function RadioTextCards({ options, value, onChange, Breakpoint: bp, row, Disabled, `**

```text
แถวการ์ดตาม radioPick(): desktop แถวเดียว ช่องไฟ 16 กว้าง/สูงเท่ากัน · มือถือ เรียงลง ช่องไฟ 12 · row=true บังคับแถวเดียวบนมือถือ (คะแนน 1–5 ช่องไฟ 8 · การ์ด มี/ไม่มี)
```

## src/components/vms/Rating.tsx

**หัวไฟล์**

```text
Figma: "Rating" — ไฟล์ (Component) VMS Plus หน้า Rating (node 107:2628) · สเปก figma-spec/Rating.json + figma-spec/_Rating star base.json
  variant: Point = 0 | 0.5 | 1 | … | 5 · ลูก = "_Rating star base" ×5 (Fill = Full | Half | Empty · State = Default | Hover)
  ค่า: แถวแนวนอน กว้าง 240 สูง 48 ไม่มีช่องไฟ · ดาวละ 48×48 ไอคอน star-48-300-round-fill
       Full = Color/component/utility/warning/500 (= token warning-600) · Empty = Color/icon/tertiary (= token gray-300) · Hover สีเดียวกับ Default
  ใช้แบบฟอร์มประเมินผู้รับจ้าง (contractor-eval-plugin question()): Input label แล้ว Rating ใต้ข้อความ · ดาวเริ่มว่าง (Point=0)
  onChange = กดดาวที่ n ⇒ Point=n · ไม่ส่ง onChange = แสดงผลอย่างเดียว · Point ครึ่งดวงแสดงได้ (Half) แต่การกดให้ค่าเต็มดวง
```

## src/components/vms/SecondaryButton.tsx

**หัวไฟล์**

```text
Figma: "Secondary button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Secondary button.json
  variant: State = Default | Hover | Focused | Disabled · Size = md | lg
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: พื้น white ขอบ gray-300 ตัวอักษร gray-600 · Hover พื้น gray-200 · Disabled พื้น gray-100 ขอบ gray-200 ตัวอักษร gray-400
```

## src/components/vms/SecondaryDangerButton.tsx

**หัวไฟล์**

```text
Figma: "Secondary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Secondary danger button.json
  variant: State = Default | Hover | Focused | Disabled · Size = md | lg
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: พื้น white ขอบ gray-300 ตัวอักษร error-600 · Hover พื้น gray-200 · Disabled พื้น gray-100 ขอบ gray-200 ตัวอักษร gray-400
```

## src/components/vms/SectionHeader.tsx

**หัวไฟล์**

```text
Figma: "Section header" — ไฟล์ (Component) VMS Plus หน้า Section headers (node 2011:6955) · สเปก figma-spec/Section header.json
  หัวข้อของหน้า Create/Edit (กติกา R3)
  variant: Breakpoint = Desktop | Mobile · property: Title · Badge · Supporting text · Actions · More actions (ปิด) · Divider (ปิด R2/R13)
  ค่า: แถบ Line 4×24 รัศมี 9999 brand-900 · หัวข้อ 20 SemiBold black ห่าง 12 · Badge outline Gray · Supporting text 14 gray-600 ห่าง 8
       Desktop: Actions ขวา ช่องไฟ 12 · Mobile: Actions ใต้หัวข้อ ห่าง 20 ช่องไฟ 16
```

**ก่อน `Badge?: string | number | null;`**

```text
property Badge — ข้อความในป้าย (เช่น "ในแผน 3 คัน")
```

## src/components/vms/SectionLabel.tsx

**หัวไฟล์**

```text
Figma: "Section label" — ไฟล์ (Component) VMS Plus หน้า Section headers (node 2011:6955) · สเปก figma-spec/Section label.json
  หัวข้อของหน้า Detail (กติกา R5/R11) · ไม่มี Badge → จำนวนต่อท้ายชื่อ "(n)" ตาม sectionLabel() ใน core.js
  variant: Breakpoint = Desktop | Mobile
  property: Title · Supporting · Supporting text · Info icon (ปิด) · Actions · Primary action (Tertiary brand button) · Secondary action (Tertiary button) · More actions (ปิด)
  ค่า: หัวข้อ 16 SemiBold black · Supporting text 12 gray-600 ห่าง 4 · Actions ขวา ช่องไฟ 12
```

**ก่อน `Actions?: ReactNode;`**

```text
ปุ่ม Primary action / Secondary action (TertiaryBrandButton · TertiaryButton)
```

## src/components/vms/SidebarNavigation.tsx

**หัวไฟล์**

```text
Figma: "Sidebar navigation" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Sidebar navigation.json
  เมนูจริงตามหน้า "Sidebar Navigation" (277:230639) ของไฟล์ (UI) VMS Plus – Release#2 (component "Sidebar" + "Nav menu") — ข้อความ ลำดับ ไอคอน ตรงตามนั้น
  variant: State = Collapsed | Expanded
  Collapsed: กว้าง 80 · ขอบใน 12/16 · ช่องไฟ 20 · พื้น white · เส้นขวา/ล่าง/ซ้าย 1 gray-200 · PEA logo 32 · Menu = Nav button ช่องไฟ 8 · Footer menu ชิดล่าง ช่องไฟ 8
  Expanded: กว้าง 280 · ขอบใน 12/16 · ช่องไฟ 20 · เส้นขวา 1 gray-200 · Logo wrap สูง 40 ขอบในข้าง 4 (Brand logo + Tertiary button ไอคอน keyboard_tab)
            Menu = Nav item ช่องไฟ 8 · กลุ่มที่มีเมนูย่อย = Nav item (ลูกศร keyboard_arrow_down / เปิดแล้ว keyboard_arrow_up) + sub items (Nav list item ช่องไฟ 4) ห่างหัวกลุ่ม 4
            Footer menu = Nav item ช่องไฟ 8 (แถวผู้ใช้: Avatar + Show Description + ไอคอน logout)
  เมนูย่อย "บำรุงรักษาตามวาระ" ใต้ "งานซ่อมและบำรุงรักษา" เพิ่มตามเจ้าของงาน 4 พ.ย. 2569 (ทางเข้าหน้ารายการแผน = รากเว็บ) — ดู figma-spec/COMPOSED.md
  เมนูย่อย "พาดูทีละเรื่อง" (/guide/ · ของต้นแบบ ไม่มีจอใน Figma) ต่อจาก "บำรุงรักษาตามวาระ" เพิ่มตามเจ้าของงาน 5 พ.ย. 2569 _"สร้างเป็นอีกเมนู เป็นเมนูย่อยของ บำรุงรักษาตามวาระก็ได้"_
    ไลบรารีมีเมนู 2 ชั้น (Nav item → Nav list item) ไม่มีชั้นที่ 3 ⇒ เป็น Nav list item ตัวถัดไปในกลุ่มเดียวกัน ไม่ย่อหน้าเพิ่ม (COMPOSED.md ท.)
  เหลือเฉพาะเมนูของงานบำรุงรักษาที่มีหน้าในต้นแบบ (19 พ.ย. 2569 "ปรับ side menu ให้เหลือเฉพาะสิ่งที่เกี่ยวข้องกับ feature บำรุง" · ดู SIDEBAR_MENU)
    ตัดเมนูที่ไม่พาไปไหนออก: หน้าหลัก · ระบบจองยานพาหนะ · จัดการคำขอใช้ยานพาหนะ · ข้อมูลพนักงานและยานพาหนะ · การอัดประจุไฟฟ้า · จัดการเหตุการณ์ · รายงาน
    และเมนูย่อยที่ไม่มีหน้า: ภาพรวมการซ่อมบำรุง · ตารางบำรุงรักษา · นัดหมายบำรุงรักษา · งานซ่อม · ยานพาหนะทดแทน
  Avatar: พื้นม่วงอ่อน + ภาพ ไม่ผูก Variable ไม่มี token ตรง → purple-200 ใกล้สุด (COMPOSED.md ข.) · เส้นขอบตาม sws: Collapsed ขวา/ล่าง/ซ้าย 1 · Expanded ขวา 1 (Color/border/secondary = gray-200) · Brand logo ใช้ pea-logo.svg (COMPOSED.md ค.)
```

**ท้ายบรรทัด `export interface SideLink { Text: string; href?: string;`**

```text
property Badge ของ Nav list item (Pill color) — จำนวนที่รอ
```

**ท้ายบรรทัด `export interface SideGroup { IconSwap: string; Text: string; items?: SideLink[]; href?: st`**

```text
Badge ของ Nav item ชั้นบน (Pill color) — จำนวนที่รอ
```

**ก่อน `export const GUIDE_LABEL = "พาดูทีละเรื่อง";`**

```text
เมนูย่อยของต้นแบบ: เมนูพาดูทีละเรื่อง /guide/ (ต่อจาก บำรุงรักษาตามวาระ)
```

**ก่อน `export const PARTS_LABEL = "อะไหล่ของแผนที่อนุมัติแล้ว";`**

```text
เมนูย่อย: แดชบอร์ดอะไหล่ของแผนที่อนุมัติแล้ว /parts/ (S4 · 6 พ.ย. 2569 "เข้าจากเมนู" · ชื่อ = หัวหน้าของจอ partsDash · ไม่มีใน Sidebar Navigation ของ UI Release#2 — COMPOSED.md บ.)
```

**ก่อน `export const SAFETY_LABEL = "การตรวจ ปจ.2";   // ชื่อบนจอ "การตรวจ ปจ.2" (เจ้าของงาน 11 พ.`**

```text
เมนูย่อยอนุมัติ (9 พ.ย. 2569 เจ้าของงาน "ตอนอนุมัติให้เห็น เมนูของทุกคนไปเลย … อันนี้ในเวปนะ แต่จริงๆเงื่อนไขคือยิงเส้น upper lower ในการหาคนอนุมัติ")
   ทุกบทบาทของต้นแบบเห็นและอนุมัติได้ · ชื่อ = หัวหน้าของจอ S2 S7 · ไม่มีใน Sidebar Navigation ของ UI Release#2 (COMPOSED.md บ.) · Badge = จำนวนที่รออนุมัติ
```

**ก่อน `export const SAFETY_LABEL = "การตรวจ ปจ.2";   // ชื่อบนจอ "การตรวจ ปจ.2" (เจ้าของงาน 11 พ.`**

```text
เมนูย่อย Safety Inspection /safety/ (S26 · เจ้าของงาน 11 พ.ย. 2569 "อยากทำหน้าลิสต์รถ เป็นอีก scen นึง … scen ชื่อว่า safety inspection" · ไม่มีใน Sidebar Navigation ของ UI Release#2 — COMPOSED.md)
```

**ท้ายบรรทัด `export const SAFETY_LABEL = "การตรวจ ปจ.2";`**

```text
ชื่อบนจอ "การตรวจ ปจ.2" (เจ้าของงาน 11 พ.ย. 2569 · เดิม Safety Inspection)
```

**ก่อน `export const SAT_LABEL = "แบบประเมินความพึงพอใจ";`**

```text
เมนูชั้นบนของตัวเอง: แบบประเมินความพึงพอใจ /satisfaction/ — เจ้าของงาน 12 พ.ย. 2569 _"เรื่องการประเมินเป็นเรื่องแยกที่จะไปผูกตาม flow ต่างๆ เลยอยากแยกใว้"_ (BACKLOG ข้อ 75)
   ไม่อยู่ใต้ "งานซ่อมและบำรุงรักษา" แล้ว (เดิม S27 เมนูย่อย 11 พ.ย. 2569) · Sidebar Navigation (277:230639) ของ UI Release#2 ไม่มีเมนูประเมิน ⇒ Nav item ชั้นบนแบบ "หน้าหลัก" "รายงาน"
   วางก่อน "รายงาน" (ผูกได้หลาย flow: งานซ่อม · บำรุงรักษาตามวาระ · Overhaul) · ไอคอน star (ไอคอนประเมินของตารางเดิม) · Badge (Pill color) = จำนวนที่ยังไม่ได้ประเมิน · Collapsed = Nav button Indicator — COMPOSED.md ศ.
```

**ก่อน `let openMemo: string[] | null = null;`**

```text
กลุ่มที่เปิดอยู่ จำไว้ข้ามหน้า (กรอบหน้าสร้างใหม่ทุกหน้า) — ตั้งต้นเปิดกลุ่มที่มีเมนูที่กำลังใช้
```

**ก่อน `active?: string;`**

```text
ข้อความของเมนู (หรือเมนูย่อย) ที่เป็น Active
```

**ก่อน `onToggle?: () => void;`**

```text
Tertiary button ของ Logo wrap (Expanded) · กดโลโก้/ปุ่มใดใน Collapsed = ขอขยาย
```

## src/components/vms/SortIcon.tsx

**หัวไฟล์**

```text
Figma: "Sort icon" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Sort icon.json
  variant: Icon = Down | Up | Swap · 20×20 · gray-400 (swap_vert / arrow_upward_alt / arrow_downward_alt weight 300)
```

## src/components/vms/Status.tsx

**หัวไฟล์**

```text
Figma: "Status" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Status.json
  จุดสถานะในรายการแจ้งเตือน · variant: State = Success | Warning | Error | Brand | Info
  ค่า: วงกลม 12 · Success success-600 · Warning warning-600 · Error error-500 · Brand brand-900 · Info info-600 (hex ตรง token ทุกตัว)
```

## src/components/vms/TabItem.tsx

**หัวไฟล์**

```text
Figma: "Tab item" — ไฟล์ (Component) VMS Plus หน้า Tabs (node 2:9) · สเปก figma-spec/Tab item.json
  variant: State = Default | Hover | Focused · Active = True | False · property: Text · Badge (Pill outline Color=Brand)
  ค่า: สูง 48 · ขอบใน 12/24 · ช่องไฟ 8 · ข้อความ 14 SemiBold (Active black · ไม่ Active gray-600) · Hover พื้น gray-200 · Focused gray-50
       เส้น (sws [บน,ขวา,ล่าง,ซ้าย]): ไม่ Active [0,0,1,0] Color/border/primary = gray-300 · Active [0,0,2,0] Variable Color/component/utility/brand/900 = brand-900
       (สีในดัมป์เป็นค่าของโหมดในไฟล์ Component — ยึดชื่อ Variable)
```

**ก่อน `Badge?: string | number | null;`**

```text
property Badge — ตัวเลขในป้าย (ไม่ใส่ = ปิด)
```

## src/components/vms/Table.tsx

**หัวไฟล์**

```text
Figma: "Table" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table.json
  variant: Alternating fills = False | True · property: Scrollbar (ปิด) · Pagination
  โครง: Content = คอลัมน์ละ Table header cell + Table cell ไลบรารีมี 8 คอลัมน์ × 10 แถว (กติกา TABLE_MAX ของ core.js) · ช่องไฟ Content → Pagination 20 (Alternating fills=True)
  ใช้แบบ tbl() ใน core.js: columns [หัว, กว้าง (0 = ยืด), Style, Sort icon] · ช่อง = ข้อความ | {text, sub} | {pills} | {actions}
  กว้างคอลัมน์ส่งเป็นตัวเลขตอนรัน → style width (ค่าที่คำนวณตอนรัน ตามกติกาข้อ 3)
```

**ก่อน `width?: number;`**

```text
กว้าง px · 0/ไม่ใส่ = ยืด
```

**ท้ายบรรทัด `| { actions: CellAction[]; mobileActions?: CellAction[]; mobileButtons?: ReactNode };`**

```text
mobileActions = ไอคอนดู แก้ไข ลบ ที่กางบนการ์ดมือถือแทนปุ่ม … (เจ้าของงาน 4 พ.ย. 2569) · mobileButtons = Mobile table item Style=Action buttons (S25 ปุ่ม "ย้ายไปไตรมาสอื่น" 5 พ.ย. 2569)
```

**ก่อน `Pagination?: ReactNode;`**

```text
property Pagination — ส่ง Table pagination มาวางใต้ตาราง
```

## src/components/vms/TableCell.tsx

**หัวไฟล์**

```text
Figma: "Table cell" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table cell.json
  variant: Style = Text | Lead text | Badge | Action icons | Multiple badges | Lead checkbox (ที่ต้นแบบใช้) · Alternating fills = False | True
  property: Text · Supporting · Supporting text · View · Edit · Print · Delete (ปุ่มไอคอนของ Action icons)
  ค่า: สูง 56 · ขอบใน 8/16 · ช่องไฟ 12 (Badge 8 · Action icons/Multiple badges 4) · พื้น white / gray-50 (Alternating fills=True) · เส้นล่าง 1 (sws [0,0,1,0]) Color/border/secondary = gray-200
       Text 14 Regular black · Lead text 14 Medium · Supporting text 12 Regular gray-600 · Action icons = Tertiary button ไอคอนอย่างเดียว 40
```

**ก่อน `Pills?: [string, PillColor][];`**

```text
Badge / Multiple badges
```

**ก่อน `Actions?: CellAction[];`**

```text
Action icons — ค่าเริ่มของไลบรารี View quick_reference_all · Edit stylus · Print print · Delete delete
```

**ก่อน `checked?: boolean;`**

```text
Lead checkbox
```

**ก่อน `checkDisabled?: boolean;`**

```text
Checkbox State=Disabled ของช่อง Lead checkbox (แถวที่ติ๊กไม่ได้ · headCheck() ใน screens.js 5 พ.ย. 2569)
```

## src/components/vms/TableHeader.tsx

**หัวไฟล์**

```text
Figma: "Table header" — ไฟล์ (Component) VMS Plus หน้า Table headers (node 2096:36080) · สเปก figma-spec/Table header.json
  variant: Breakpoint = Desktop | Mobile
  property: Table title · Badge · Supporting text · Actions · Filters · More actions · Divider (ปิดตามกติกา R2/R13)
  ใช้แบบ tableHeader() ใน core.js: ช่องค้นหา (Text input ไม่มีป้าย ไอคอน search) + ปุ่ม "ตัวกรอง" (Secondary button ไอคอน filter_list + Pill outline Brand = จำนวนตัวกรอง) · ชิปตัวกรอง Brand
  Table title (5 พ.ย. 2569 ฟอร์มสร้างแผนแบบ A): Front Section = Line 4×24 brand-900 + Text 20 SemiBold black + Badge outline Gray ช่องไฟ 12 · ห่างแถวค้นหา 20
  Actions: ปุ่มต่อจาก "ตัวกรอง" (Secondary button ช่องที่ 2–4 · Primary button ท้ายสุด ตามดัมป์) — Actions = ปุ่มที่ส่งมา
  Desktop: ค้นหากว้าง 320 ซ้าย · ปุ่มขวา ช่องไฟ 12 · แถวชิปห่าง 20 ช่องไฟ 12
  Mobile: เรียงลง ช่องไฟ 16 · ช่องค้นหา Size=lg เต็มแถว · ปุ่ม Size=lg ครึ่งแถว (ช่องที่ 2 = ปุ่มแรกของ Actions แบบ Request list ของ 5.10 Vehicle In Use (EV) · tableHeader() o.primary)
```

**ก่อน `Title?: string;`**

```text
property Table title + Title (ไม่ใส่ = ปิด)
```

**ก่อน `Badge?: string | number | null;`**

```text
property Badge — ข้อความใน Badge outline Gray ข้างหัวตาราง
```

**ก่อน `query?: string;`**

```text
คำค้น (property Text ของ Text input)
```

**ก่อน `onFilter?: () => void;`**

```text
ปุ่มตัวกรอง
```

**ก่อน `FilterButton?: boolean;`**

```text
ปุ่มตัวกรอง (Action 1 swap) — false = ไม่มีปุ่มตัวกรอง เหลือช่องค้นหา + Actions (ฟอร์มแผน S1 S19 แท็บยานพาหนะในแผน · BACKLOG ข้อ 87) · ค่าเริ่ม true คงแบบเดิมของทุกหน้า
```

**ก่อน `FilterCount?: number | null;`**

```text
Pill outline ในปุ่มตัวกรอง = จำนวนตัวกรองที่ใช้อยู่ (ไม่ใส่ / 0 = ซ่อน)
```

**ก่อน `Filters?: string[];`**

```text
property Filters — ชิปตัวกรองที่ใช้อยู่
```

**ก่อน `Actions?: ReactNode;`**

```text
ปุ่มต่อจาก "ตัวกรอง" (Secondary / Primary button ของไลบรารี) — ส่งขนาดตาม Breakpoint เอง (Mobile lg)
```

## src/components/vms/TableHeaderCell.tsx

**หัวไฟล์**

```text
Figma: "Table header cell" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table header cell.json
  variant: Checkbox = False | True · property: Header text · Text · Sort icon
  ค่า: สูง 44 · ขอบใน 12/16 · ช่องไฟ 8 · พื้น gray-100 · ข้อความ 14 SemiBold black · Sort icon 20
```

**ก่อน `SortIcon?: "Down" | "Up" | "Swap";`**

```text
property Sort icon — ใส่ทิศ = แสดง
```

## src/components/vms/TablePagination.tsx

**หัวไฟล์**

```text
Figma: "Table pagination" — ไฟล์ (Component) VMS Plus หน้า Pagination (node 2:15) · สเปก figma-spec/Table pagination.json
  variant: Breakpoint = Desktop | Mobile
  Desktop: แถวเดียว ชิดซ้าย–ขวา ช่องไฟ 24 · ซ้าย "แสดง a ถึง b จาก n รายการ" 14 black + Items per page dropdown (Input dropdown Selected กว้าง 92) ห่าง 8
           ขวา กลุ่มปุ่ม Button groups pagination item กรอบ 1 gray-300 รัศมี 8
  Mobile: เรียงลง จัดกลาง ช่องไฟ 16 · กลุ่มปุ่มก่อน แล้วข้อความ
  ข้อความตาม fillPagination() ใน core.js
```

**ก่อน `export function pageNumbers(page: number, pages: number): (number | "...")[] {`**

```text
เลขหน้าไม่เกิน 5 ช่อง ตามระบบจริง getPageNumbers() ใน maintain-d-fe/src/components/ui/table/pagination-control.tsx
  หน้าแรก + รอบหน้าปัจจุบัน + หน้าสุดท้าย · ช่องว่างเป็น "..." (ไลบรารีมีช่อง Number "..." ใน Table pagination 1 2 ... 9 10)
  เช่น 1 2 3 ... 25 · 1 ... 9 10 11 ... 25 · 1 ... 23 24 25 (เจ้าของงาน 9 พ.ย. 2569 "pagination น่าจะแสดงผิดนะ" ตอน 243 คัน 25 หน้า)
```

## src/components/vms/Tabs.tsx

**หัวไฟล์**

```text
Figma: "Tabs" — ไฟล์ (Component) VMS Plus หน้า Tabs (node 2:9) · สเปก figma-spec/Tabs.json
  แถว Tab item (ไลบรารีมี 5 ช่อง ซ่อนช่องที่เกินตาม tabs() ใน screens.js) · พื้น white เส้นล่าง gray-300 · มือถือเลื่อนแนวนอน
```

## src/components/vms/TertiaryBrandButton.tsx

**หัวไฟล์**

```text
Figma: "Tertiary brand button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary brand button.json
  variant: State = Default | Hover | Focused | Disabled (ไม่มี Size · สูง 40)
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: ตัวอักษร brand-900 · Hover พื้น gray-100 · Disabled ตัวอักษร gray-400
```

## src/components/vms/TertiaryButton.tsx

**หัวไฟล์**

```text
Figma: "Tertiary button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary button.json
  variant: State = Default | Hover | Focused | Disabled · Size = md
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: ตัวอักษร gray-600 · Hover พื้น gray-100 ตัวอักษร gray-700 · Disabled ตัวอักษร gray-400
```

## src/components/vms/TertiaryDangerButton.tsx

**หัวไฟล์**

```text
Figma: "Tertiary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary danger button.json
  variant: State = Default | Hover | Focused | Disabled (ไม่มี Size · สูง 40)
  property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
  สี: ตัวอักษร error-600 · Hover พื้น gray-200 ตัวอักษร error-700 · Disabled ตัวอักษร gray-400
```

## src/components/vms/TextArea.tsx

**หัวไฟล์**

```text
Figma: "Text area" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Text area.json
  variant: State = Default | Filled | Hover | Focused | Disabled | Readonly | Error | Error Hover | Error Focused | Error Readonly · Size = md
  property: Label · Label text · Optional · Info icon · Text · Show Placeholder · Helper · Helper text · Trailing icon (ปิด)
  ค่า: กว้างตั้งต้น 352 · ป้าย (Input label) → ช่อง ห่าง 8 · ช่องสูง 120 · ขอบใน 8/8/8/12 · รัศมี 8 · ขอบ 1 gray-300 (สีตาม State เหมือน Text input — containerTone)
       ตัวอักษร 16 Regular (ค่า black · placeholder gray-400) · มุมขวาล่าง ไอคอน resize-right 16 (กราฟิกจาก figma-spec/svg) · Helper 12 gray-600 (Error error-600)
```

## src/components/vms/TextInput.tsx

**หัวไฟล์**

```text
Figma: "Text input" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Text input.json
  variant: State = Default | Filled | Hover | Focused | Disabled | Readonly | Error | Error Hover | Error Focused | Error Readonly · Size = md | lg
  property: Label · Label text · Optional · Info icon · Text · Show Placeholder · Leading icon (swap) · Trailing icon (swap) · Helper · Helper text
  ค่า: กว้างตั้งต้น 352 · ป้าย (Input label) → ช่อง ห่าง 8 · ช่อง md สูง 40 / lg 48 · ขอบใน 8/12 · ช่องไฟ 8 · รัศมี 8 · ขอบ 1 gray-300
       Hover/Focused ขอบ brand-800 · Focused วงโฟกัส 4 brand-900 ทึบ 12% (Error Focused error-600) ตาม effect ของ Container · Error ขอบ error-500 · Disabled/Readonly พื้น gray-100 · Error Readonly ขอบ error-200
       ตัวอักษร 16 Regular (ค่า black · placeholder gray-400) · ไอคอน 24/20 gray-500 · Helper 12 Regular gray-600 (Error error-600)
```

**ก่อน `Label?: boolean;`**

```text
property Label (แสดงป้าย)
```

**ก่อน `Text?: string;`**

```text
property Text = ค่าในช่อง
```

**ก่อน `Placeholder?: string;`**

```text
ข้อความ placeholder (Figma: Text ตอน Show Placeholder)
```

**ก่อน `HelperText?: string;`**

```text
property Helper text (ใส่ = เปิด Helper)
```

## src/components/vms/_button.tsx

**หัวไฟล์**

```text
ฐานร่วมของปุ่ม 7 แบบในหน้า Button (2:5) ของไลบรารี — ไม่ใช่ component ของไลบรารีเอง ไฟล์ปุ่มแต่ละแบบเรียกใช้
  ค่าจาก figma-spec/<ชื่อปุ่ม>.json: สูง md 40 / lg 48 · ขอบใน 8/12 (Tertiary 8/8) · ช่องไฟ 4 · รัศมี 8 · ไอคอน 20 · ตัวอักษร SemiBold md 14 / lg 16
  State=Focused: วงโฟกัส effect DROP_SHADOW spread 4 ทึบ 12% — Primary brand-900 · Secondary/Secondary danger gray-500 · Primary danger error-600 · Tertiary ไม่มี (ดัมป์ 4 พ.ย. 2569)
  prop ตามชื่อ property ของ Figma (ตัดช่องว่าง): Text · State · Size · LeadingIcon/LeadingIconSwap · TrailingIcon/TrailingIconSwap · ButtonText
```

**ก่อน `Text?: string;`**

```text
property Text
```

**ก่อน `State?: ButtonState;`**

```text
variant State — Hover/Focused ใช้แสดงในหน้า kit · ปกติปล่อยให้ CSS :hover ทำงาน · Disabled = ปุ่มกดไม่ได้
```

**ก่อน `Size?: ButtonSize;`**

```text
variant Size (Tertiary button มีแค่ md · Tertiary brand/danger ไม่มี Size)
```

**ก่อน `LeadingIconSwap?: string;`**

```text
property Leading icon swap = ชื่อไอคอน เช่น "add-24-300-round" (ใส่ = เปิด Leading icon)
```

**ก่อน `TrailingIconSwap?: string;`**

```text
property Trailing icon swap
```

**ก่อน `ButtonText?: boolean;`**

```text
property Button text — false = ปุ่มไอคอนอย่างเดียว (ต้องส่ง aria-label)
```

**ก่อน `Pill?: string | number | null;`**

```text
Pill outline Color=Brand ต่อท้ายข้อความ — ชั้นของปุ่ม "Filters" ใน Table header (ดัมป์ 2096:36080 · จำนวนตัวกรองที่ใช้อยู่) · ไม่ใส่ = ไม่มี
```

**ท้ายบรรทัด `base: string;`**

```text
พื้น/ขอบ/ตัวอักษร State=Default
```

**ท้ายบรรทัด `hover: string;`**

```text
State=Hover (บังคับแสดง)
```

**ท้ายบรรทัด `hoverCls: string;`**

```text
เหมือน hover แต่นำหน้า hover: (เขียนเต็มให้ Tailwind เห็น)
```

**ท้ายบรรทัด `disabled: string;`**

```text
State=Disabled
```

**ท้ายบรรทัด `focused?: string;`**

```text
State=Focused ถ้าต่างจาก Default
```

**ท้ายบรรทัด `tertiary?: boolean;`**

```text
ขอบใน 8/8
```

**ท้ายบรรทัด `ring?: keyof typeof RING;`**

```text
วงโฟกัส State=Focused (ไม่ใส่ = ไม่มี)
```

**ก่อน `const RING = {`**

```text
[State=Focused บังคับแสดง, โฟกัสจริงด้วยคีย์บอร์ด] — เขียนเต็มให้ Tailwind เห็น
```
