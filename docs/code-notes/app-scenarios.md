# โน้ตของโค้ด: src/app/scenarios

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/app/scenarios/guide/page.tsx

**หัวไฟล์**

```text
หน้าของต้นแบบ (ไม่ใช่จอของระบบ): หน้าเรื่องของโหมดพาดูทีละเรื่อง /scenarios/guide/?s=<เรื่อง> — เปิดจากปุ่ม "ดูเคส" ในหน้า /scenarios/
  ลูกค้าเห็นหน้านี้ตอนยืนยันงาน ⇒ ข้อความภาษาคนพูด ไม่มีรหัส scenario (lib/guide/types.ts)
  ประกอบจากชิ้นไลบรารี (ไม่มีจอใน UI Release#2 — COMPOSED.md หัวข้อ ท.):
    `Page header` (ชื่อเรื่อง + สิ่งที่เรื่องนี้ทำได้) → กล่องแสดงข้อมูล (patterns/DisplayBox: ผู้ใช้งาน · ชีตยืนยัน ทุกหน้าที่เคสของเรื่องใช้ casePages ของ lib/guide/scenarios.ts)
    → `Section header` "เคสที่พาดู" + Badge จำนวนเคส → การ์ด `Mobile table` 1 เคส = 1 การ์ด (Lead text ชื่อเคส + บรรทัดรอง · จำนวนขั้น · ชีตยืนยันหน้าของเคส · Action buttons "เริ่มเคสนี้")
    desktop การ์ดเรียง 2 คอลัมน์ (Table ของไลบรารีไม่มีช่องปุ่มข้อความ)
```

**ท้ายบรรทัด `const back = from === "menu" ? GUIDE_MENU : "/scenarios/";`**

```text
เปิดจากเมนูพาดูทีละเรื่อง = ย้อนกลับไปเมนู
```

## src/app/scenarios/guide/start/page.tsx

**หัวไฟล์**

```text
หน้าของต้นแบบ (ไม่ใช่จอของระบบ): เริ่มเคสของโหมดพาดูทีละเรื่อง ?case=<รหัสเคส> — ล้างข้อมูลจำลอง ใส่ข้อมูลของเคส ตั้งบทบาท แล้วพาไปหน้าแรกของเคส
  แบบเดียวกับ /scenarios/sample/ · ไม่มีเคสนี้ → กลับหน้ารายการ scenario
```

## src/app/scenarios/page.tsx

**หัวไฟล์**

```text
หน้า /scenarios/ ของต้นแบบ (เปิดจากลิงก์ "ต้นแบบบำรุงรักษาตามวาระ" ในแถบต้นแบบ · รากเว็บเป็นรายการแผนแบบระบบจริง): รายการ scenario ตามลำดับงาน — Page header + Table
  10 พ.ย. 2569 (Figma 33a990c กรอบ "ตัดออกแล้ว"): scenario ที่ใช้ 17 รายการในตารางหลัก · ที่ตัดออก 8 รายการ (S3 S5 S11 S14 S15 S16 S17 S22) แยกหัวข้อ "Scenario ที่ตัดออกแล้ว"
  ดูอย่างเดียว (scenario · ชื่อ · เหตุผล) ไม่มีปุ่มเปิด ไม่มีลิงก์เข้าหน้าที่ไม่มีแล้ว (desktop) / Mobile table (มือถือ) ของไลบรารี
  12 พ.ย. 2569 เรื่องแยก (Scenario.topic · แบบประเมินความพึงพอใจ S27 BACKLOG ข้อ 75) อยู่หัวข้อ "เรื่องแยก: …" ต่อจากตารางหลัก ก่อน scenario ที่ตัดออก
  ไม่ใช่จอใน Figma (เป็นสารบัญของต้นแบบ) · ดู figma-spec/COMPOSED.md
```

**ก่อน `const CUT_COLS: TableColumn[] = [{ head: "scenario", width: 110, Style: "Lead text" }, { h`**

```text
scenario ที่ตัดออก: ดูอย่างเดียว
```

**ก่อน `const guideAction = (id: string) => { const g = guideByCode(id); return g ? [{ IconSwap: "`**

```text
โหมดพาดูทีละเรื่อง — ปุ่ม "ดูเคส" ข้างปุ่มเปิด → หน้าเรื่อง /scenarios/guide/
```

**ก่อน `const topics = [...new Set(TOPIC_SCENARIOS().map((s) => s.topic!))].map((t) => ({ t, rows:`**

```text
เรื่องแยก (12 พ.ย. 2569 แบบประเมินความพึงพอใจ · BACKLOG ข้อ 75) — หัวข้อต่อเรื่อง ตารางเดียวกับตารางหลัก
```

## src/app/scenarios/sample/page.tsx

**หัวไฟล์**

```text
หน้าของต้นแบบ (ไม่ใช่จอของระบบ): เปิด scenario จากหน้า /scenarios/ ที่จุดเริ่มของ scenario นั้น — ใส่แผนตัวอย่าง MRZ7000004 (NEW_PLAN + EDIT_FORM ของ screens.js)
  ในสถานะที่ scenario ใช้ · ตั้งบทบาท · แล้วพาไปหน้าแรกของ scenario
  ?plan=review|returned|approved (acked= ของ S22 เอาออก 6 พ.ย. 2569) · ?draft=1 (ฟอร์มสร้างแผนที่จัดรถ 6 คันแล้ว ยังไม่เลือกอะไหล่ — S21 T.1) · ?role=<บทบาท> · ?go=<หน้า>
  ?seed=<S> = ข้อมูลตั้งต้นของ scenario ชุด B (SEEDS ของ seedB.ts) + บทบาทของชุดนั้น แล้วพาไป go — S6 เริ่มที่รายการแผน (E.1) แทนหน้าไตรมาส (9 พ.ย. 2569)
  แผน Z7000004 เดิม (ถ้ามี) ถูกแทนที่ · ดู figma-spec/COMPOSED.md
```
