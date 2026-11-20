# โน้ตของโค้ด: src/styles/

โน้ตที่เคยเป็น comment ในโค้ด ย้ายออกมาเมื่อ 19 พ.ย. 2569 หัวข้อคือไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์

## src/styles/theme.css

**หัวไฟล์**

```text
สร้างจาก tokens.css ด้วย scripts/sync-tokens.mjs — ห้ามแก้มือ
  utility เช่น bg-brand-900 = var(--brand-900) · ล้าง palette/ขนาด/รัศมี/เงาตั้งต้นของ Tailwind ทิ้ง ใช้ได้เฉพาะค่าจาก token
```

**ก่อน `--color-ink: var(--color-text-primary);`**

```text
ชื่อเชิงความหมายตั้งใหม่ กัน var อ้างตัวเอง: ink = --color-text-* · line = --color-border-primary
```

**ก่อน `--color-overlay: var(--overlay);`**

```text
พื้นหลังทึบของ Background overlay (Variable Color/background/overlay · #000000 40%) — bg-overlay
```

**ก่อน `--text-*: initial;`**

```text
ตัวอักษร: สเกล 12/14/16 ของไลบรารี + หัวข้อ
```

**ก่อน `--radius-*: initial;`**

```text
รัศมี
```

**ก่อน `--shadow-*: initial;`**

```text
เงา (ตั้งชื่อใหม่ กันชน --shadow-xs ของ tokens)
```

**ท้ายบรรทัด `--shadow-lg-lib: var(--shadow-lg);`**

```text
ไลบรารี Dropdown menu · Dropdown list · Notification (y12 blur16 spread-4 #10182814)
```

**ก่อน `--shadow-ring: 0 0 0 4px var(--focus-ring);`**

```text
วงโฟกัสของไลบรารี (effect DROP_SHADOW spread 4 ไม่เบลอ ทึบ 12%): brand-900 · gray-500 (ปุ่มรอง Checkbox/Radio ไม่เลือก) · error-600 — token v0.74
```
