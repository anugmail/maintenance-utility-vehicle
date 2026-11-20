# โน้ตของโค้ด: src/components/shell

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/components/shell/AppFrame.tsx

**หัวไฟล์**

```text
กรอบหน้าแบบจอ Figma (shell() ใน core.js) + เมนูแบบระบบจริง (เจ้าของงาน 4 พ.ย. 2569 "เป็นเมนูจาก sidebar กด แล้ว expand ออกมา")
  Desktop (≥ 768): Sidebar navigation ซ้าย ตั้งต้น State=Collapsed (80)
    · ชี้เมาส์ที่ Sidebar = State=Expanded (280) ลอยทับเนื้อหา · เลื่อนเมาส์ออก = กลับ Collapsed
    · กดโลโก้หรือปุ่มใน Collapsed / กดปุ่ม keyboard_tab ใน Logo wrap = ค้าง Expanded ไว้ (ลอยทับเหมือนกัน ไม่ดันเนื้อหา
      ⇒ เนื้อหาวางตามจอ Figma ที่ Sidebar กว้าง 80 เสมอ) · ย่อด้วยปุ่ม keyboard_tab อีกครั้ง · คลิกนอก Sidebar · Esc
    · Sidebar ติดขอบบนตอนเลื่อนหน้า (สูงเท่าจอ เลื่อนในตัวเองเมื่อเมนูยาวกว่าจอ)
    Header navigation Breakpoint=Desktop (ไม่มีโลโก้และปุ่ม hamburger · ขอบใน 12/32 · ปุ่มขวาอย่างเดียว) + Page ขอบใน 32 ช่องไฟ 32
      — เจ้าของงาน 5 พ.ย. 2569 _"เอาตรงที่เป็น hambuger ออก … อันนี้บนเว็บนะ"_ (ต่างจาก R1 ของปลั๊กอินที่ให้ desktop ใช้ Tablet · COMPOSED.md)
  Mobile (402 · < 768): ไม่มี Sidebar · ปุ่ม menu ของ Header navigation Breakpoint=Mobile เปิด Sidebar navigation State=Expanded จากซ้าย ทับ Background overlay (ประกอบ — ดู figma-spec/COMPOSED.md)
    Page ขอบใน 16 ช่องไฟ 24
  เมนูที่ Active ใน Sidebar: "พาดูทีละเรื่อง" ที่ /guide/ และหน้าเรื่อง /scenarios/guide/ ที่เปิดจากเมนูนั้น (from=menu) · "อะไหล่ของแผนที่อนุมัติแล้ว" ที่ /parts/ (S4) · "แบบประเมินความพึงพอใจ" (เมนูชั้นบน) ที่ /satisfaction/ · หน้าอื่น "บำรุงรักษาตามวาระ"
  บนสุดมีแถบต้นแบบ (PrototypeBar) · toast ผ่าน ToastHost
```

**ก่อน `const path = (usePathname() || "/").replace(/\/$/, "");`**

```text
from=menu อ่านจาก location.search หลังโหลด (useSearchParams ต้องมี Suspense ครอบทุกหน้า)
```

**ก่อน `const mock = useMock();`**

```text
เมนูอนุมัติของทุกบทบาท + Badge จำนวนที่รออนุมัติ (ตัวเดียวกับรายการ S2 S7 · 9 พ.ย. 2569)
```

**ก่อน `const role = useRole();`**

```text
แบบประเมินความพึงพอใจ (เมนูชั้นบนของตัวเอง 12 พ.ย. 2569 · BACKLOG ข้อ 75) — Badge = ยังไม่ได้ประเมินที่บทบาทนี้เห็น (ตัวเดียวกับ Badge ของแท็บ)
```

**ท้ายบรรทัด `<GuideBar />{`**

```text
โหมดพาดูทีละเรื่อง (ของต้นแบบ · components/guide/GuideBar)
```

## src/components/shell/MovedTo.tsx

**หัวไฟล์**

```text
ที่อยู่เดิมที่ย้ายแล้ว (เจ้าของงาน 4 พ.ย. 2569 "แก้ url ให้เหมือนของจริง": รายการแผนอยู่ที่ราก · ฟอร์มสร้างแผนอยู่ /new/)
  ส่งออก static ทำ redirect ฝั่งเซิร์ฟเวอร์ไม่ได้ ⇒ หน้านี้พาไปที่อยู่ใหม่ฝั่งเบราว์เซอร์ (คงค่าใน query ไว้) · ไม่ใช่จอของระบบ
```

## src/components/shell/PrototypeBar.tsx

**หัวไฟล์**

```text
แถบต้นแบบบนสุด (ไม่ใช่หน้าจอของระบบ — มีเฉพาะต้นแบบ) · สลับบทบาท + ล้างข้อมูลจำลอง (CLAUDE.md ข้อ 5 และ 7)
  + ปุ่มช่วยฟอร์ม "กรอกข้อมูลตัวอย่าง" · "ล้างค่า" (เจ้าของงาน 10 พ.ย. 2569 · ของต้นแบบเท่านั้น ไม่ใส่ใน Figma) — ขึ้นเฉพาะหน้าที่มีฟอร์มลงทะเบียน (lib/protoForm.ts) · ล้างค่าเมื่อมีค่าที่กรอกไว้ = ยืนยันก่อน
  ประกอบจากชิ้นไลบรารี: Input dropdown + Dropdown list (บทบาท) · Tertiary button (ล้างข้อมูลจำลอง) · Checkbox (จำลองบันทึกไม่สำเร็จ — ให้เห็นจอ "บันทึกไม่สำเร็จ") · Tertiary brand button (ไปหน้ารายการ scenario · ไปเมนูพาดูทีละเรื่อง /guide/) — บันทึกใน figma-spec/COMPOSED.md
```

**ท้ายบรรทัด `const oh = useOhStyle();`**

```text
สวิตช์ทดลอง "แบบ Overhaul" (lib/ohStyle.ts) — ปิด = กลับแบบเดิมทุกจุด
```

**ก่อน `const pend = pendingSigns(mock);`**

```text
คำขอลงนาม (11 พ.ย. 2569 · ของต้นแบบ): ระบบจริงส่งแจ้งเตือนถึงผู้ลงนาม ผู้ลงนามเข้าระบบแล้วยืนยัน — ต้นแบบไม่มีบทบาทของผู้ลงนามรายคน
    ⇒ แถบต้นแบบมีปุ่ม "คำขอลงนาม (n)" เปิดรายการที่รอยืนยัน แล้วกดยืนยันในฐานะผู้ลงนามคนนั้น
```

**ท้ายบรรทัด `<div data-proto-bar className="relative z-[55] flex flex-wrap items-center gap-x-3 gap-y-1`**

```text
z-[55] เหนือ popup (z-50) ให้กดปุ่มกรอกข้อมูลตัวอย่างตอน popup เปิดได้ · ต่ำกว่า toast (z-[60])
```

**ก่อน `<Link href="/guide/" data-guide-menu className="inline-flex items-center gap-1 text-xs fon`**

```text
เมนูพาดูทีละเรื่อง (G1 · เจ้าของงาน 5 พ.ย. 2569 "อยากให้มีเมนูแยกออกมาเลย ว่า เป็นเรื่องที่แยก scen") — ของต้นแบบ อยู่ที่แถบนี้ และเป็นเมนูย่อยต่อจาก "บำรุงรักษาตามวาระ" ใน Sidebar ด้วย (เจ้าของงาน 5 พ.ย. 2569 "สร้างเป็นอีกเมนู เป็นเมนูย่อยของ บำรุงรักษาตามวาระก็ได้")
```

## src/components/shell/ToastHost.tsx

**หัวไฟล์**

```text
แสดง Notification (toast) ที่สั่งด้วย notify() ใน lib/mock/store — ปิดเองหลัง 4 วินาที หรือกดปิด
  ตำแหน่ง (เจ้าของงานยืนยัน 5 พ.ย. 2569 R60 "toast ต้องแสดงด้านมุมบนขวามือเสมอเลย"): มุมบนขวาเสมอทั้ง desktop และมือถือ ไม่อยู่กลาง ไม่อยู่ล่าง
  โหมดพาดู (ของต้นแบบ): ขยับลงใต้แถบพาดูด้วย --guide-bottom ที่ GuideBar ตั้ง · ไม่มีแถบ = ตำแหน่งเดิม
  notify() ใน core.js — Desktop: Notification วางชิดขอบบนขวา ขอบนอกบน 24 ขวา 24 · Mobile: จัดการ์ดบนขวา ขอบ 16
  ชั้นสูงกว่าแถบต้นแบบและ Header navigation (z-[60]) — ไม่ถูกแถบบนบัง · กำหนดที่นี่ที่เดียว (Notification floating=false)
```
