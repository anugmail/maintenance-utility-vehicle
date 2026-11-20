# โน้ตของโค้ด: src/app (ไฟล์ที่อยู่ชั้นบนสุด)

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/app/globals.css

**หัวไฟล์**

```text
Tailwind 4 + token ของ design system (ค่าจากไลบรารี (Component) VMS Plus)
  tokens.css และ theme.css สร้างด้วย npm run sync-tokens — แก้สีที่ design system ต้นทางที่เดียว · light เท่านั้น
```

**ก่อน `.ms { font-family: "Material Symbols Rounded"; font-weight: 300; font-style: normal; displ`**

```text
ไอคอน Material Symbols (ตามไลบรารี: ไอคอนทั้งหมดเป็น Material Symbols Rounded weight 300)
```

## src/app/page.tsx

**หัวไฟล์**

```text
S1 · หน้า รายการแผนบำรุงรักษา (รากเว็บ / — ทางเข้าจากเมนู Sidebar "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" แบบระบบจริง) — listScreen() ใน screens.js
  ตาม `Table header` + `Empty state/Data empty` ของไฟล์ Component + Incident list ของหน้า 5.5 Repair & Maintenance Job (Admin) ใน UI Release#2 (รีวิวทีมออกแบบ 5 พ.ย. 2569 · A.1 A.2)
  Page header (Title "บำรุงรักษาตามวาระ" ไม่มีปุ่ม) → Section ช่องไฟ 24: Table header (ค้นหา + ตัวกรอง + Primary "สร้างแผน" ขวาของตัวกรอง) + Table 8 คอลัมน์ (PLAN_COLS · ภาค / ประเภทรถ 2 บรรทัดสรุปจากรถในแผน) + Table pagination
  ยังไม่มีแผน (A.2) = Empty state/Data empty "ไม่มีแผนบำรุงรักษา" + Primary "สร้างแผน" ไม่มี Table header (Admin State=Empty ของ RP & MA Job)
  มือถือ: ตารางเป็น Mobile table (1 แผน = 1 การ์ด) · ปุ่มหัวหน้าอยู่ใต้หัวข้อ · เมนู "…" เป็น bottom sheet
  เมนู "…" ตามสถานะ (S19 S20 · planMenu): ดูรายละเอียด → /detail/ · แก้ไข → /edit/ (S19) · ลบ → ยืนยันการลบแผน (S20) แล้ว toast "ลบแผนบำรุงรักษาสำเร็จ"
  สิทธิ์: สร้าง/แก้ไข/ลบ เฉพาะหน่วยงานผู้สร้างแผน (6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน · 12 พ.ย. 2569 ข้อ 70 กบผ. · กปส. · กรย. · กบค. · กส.1 · กส.2 — UNITS)
  หน่วยงาน กบผ. กปส. กรย. กส.1 กส.2 (persona 9 พ.ย. 2569 · ownPlans ของ screens.js · A.1 A.39 A.40): เห็นเฉพาะแผนของหน่วยงานตัวเอง ไม่มีบรรทัดรองหน่วยงาน มีปุ่มสร้างแผน · ไม่มีแผนของตัวเอง = Empty state
  กบค. (listScreen view ของ screens.js · 6 พ.ย. 2569 รอบ 2 "กบค จะทำแผนจะมีรถของ กฝช. ด้วย"): รายการแผนทุกหน่วยงาน มีปุ่มสร้างแผน · คอลัมน์ "หน่วยงานเจ้าของเรื่อง" ต่อจากเลขที่ MR (PLAN_COLS_ALL · Figma 5dfd978 · 9 พ.ย. 2569 แทนบรรทัดรองใต้เลขที่ MR)
    · แผนของ กบค. (MRZ7100001) เมนู … ตามสถานะแบบปกติ · แผนของหน่วยงานอื่น เมนูเหลือดูรายละเอียด → รายละเอียดแผนไม่มีปุ่ม (canManage)
  ผู้อนุมัติเข้ารากแล้วไปหน้าเริ่มของบทบาท (routes.md §2: /approvals/plans/ · กบค. คลัง ตัดพร้อม S22 6 พ.ย. 2569)
  แผงตัวกรอง (listScreen o.filter · 6 พ.ย. 2569 รีวิว "filter หน้ารายการแผน เขต · หน่วยงานหน้างาน กรย. 12 เขต, กกฟ. 1and2" + "กบค. อยากเห็นทุกแผน"):
    ปุ่ม "ตัวกรอง" ของ Table header เปิด FilterShell (แผงตัวกรองแบบเดียวกับฟอร์มแผน S1 · มือถือ Bottom sheet) ช่อง `Input dropdown with badges` (Optional) หลายค่า
    เขต (12 เขตของภาค 1–4 · DISTRICTS ไม่รวมเขตของ สนง. กบค. กรย. กบผ. กปส. กส.1 กส.2 — Figma R93 132a652 · BACKLOG ข้อ 64ข 70) · หน่วยงานหน้างาน (UNITS · 12 พ.ย. 2569 ข้อ 70 กบผ. กปส. กรย. กส.1 กส.2 กบค. กส.1 กส.2) · กดตกลงจึงใช้ → ชิปใต้แถวค้นหา (กดเอาออกทีละตัว) + Pill จำนวนบนปุ่มตัวกรอง · ไม่ตรง = Empty state/Search not found + ล้างตัวกรอง
    ตามแผงตัวกรอง "PEA Car Cost Filter" ของ UI Release#2 (แบบเดียวกับ R77 ของฟอร์มแผน)
```

**ก่อน `const mrKey = (r: TableValue[]) => { const v = r[0]; return v && typeof v === "object" && `**

```text
คีย์แถว = เลขที่ MR (มุมมอง กบค. ช่องแรกเป็น { text, sub })
```

**ท้ายบรรทัด `const plans = useMemo(() => visiblePlans(role, mock.plans), [role, mock.plans]);`**

```text
กบผ. กปส. กรย. กส.1 กส.2 เห็นเฉพาะแผนของตัวเอง (ownPlans) · กบค. ทุกหน่วยงาน (allPlans · 9 พ.ย. 2569)
```

**ท้ายบรรทัด `const creator = PLAN_ROLES.includes(role);`**

```text
ผู้สร้างแผน: หน่วยงาน (กบผ. · กปส. · กรย. · กส.1 · กส.2) · กบค. (6 พ.ย. 2569 รอบ 2 · 9 พ.ย. 2569)
```

**ท้ายบรรทัด `const view = role === "กบค.";`**

```text
กบค. เห็นแผนทุกหน่วยงาน (หน่วยงานเป็นบรรทัดรองของเลขที่ MR)
```

**ก่อน `type F = { districts: string[]; units: string[] };`**

```text
แผงตัวกรอง: ค่าที่ใช้แล้ว (applied) · ค่าในแผง (fd · ยังไม่กดตกลง)
```

**ก่อน `const act = (p: Plan, i: number) => {`**

```text
ดูรายละเอียด → /detail/ · แก้ไข → เริ่มฟอร์มแก้ไขจากข้อมูลแผน แล้วไป /edit/ · ลบ → ยืนยัน (S20 S.2)
```

**ท้ายบรรทัด `const nMenu = (p: Plan) => (canManage(role, p) ? menuCount(p) : 1);`**

```text
แผนหน่วยงานอื่น (มุมมอง กบค.) ดูรายละเอียดอย่างเดียว
```

**ก่อน `mobileActions: MENU.slice(0, nMenu(p)).map((m, i) => ({ IconSwap: m.IconSwap, label: m.Tex`**

```text
มือถือ: กางไอคอนดู แก้ไข ลบ ตามสถานะแผนบนการ์ดเลย (Mobile table item Style=Action icons · View Edit Delete · เจ้าของงาน 4 พ.ย. 2569)
```
