# ต้นแบบบำรุงรักษาตามวาระ (Maintain-D)

ต้นแบบหน้าจอ **บำรุงรักษาตามวาระ** ของ PEA (VMS Plus) เขียนใหม่ด้วย Next.js + Tailwind CSS
ทุก component ยกค่าจากไลบรารี Figma **(Component) VMS Plus** · หน้าจอตาม scenario ที่เคาะแล้วในไฟล์ userflow ของงานบำรุงรักษา

- ดูต้นแบบ (หน้ารายการแผน · เมนู งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ): https://anugmail.github.io/maintenance-utility-vehicle/
- รายการ scenario ของต้นแบบ: https://anugmail.github.io/maintenance-utility-vehicle/scenarios/
- ชุด component ทุก variant: https://anugmail.github.io/maintenance-utility-vehicle/kit/
- ต้นแบบ HTML รุ่นเก่า: tag `html-prototype-2026-07`

## วิธีรัน

```bash
npm install
npm run dev                      # http://localhost:3020
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/maintenance-utility-vehicle npm run build   # ได้ out/ (static)
```

push ขึ้น `main` แล้ว GitHub Actions (`.github/workflows/pages.yml`) build และ deploy ขึ้น GitHub Pages เอง (basePath = `/<ชื่อรีโป>` ตั้งให้อัตโนมัติ)

## หน้า

| URL | หน้า |
|---|---|
| `/` | S1 รายการแผนบำรุงรักษา (ทางเข้าจริงจากเมนู Sidebar) |
| `/new/` | S1 สร้างแผนบำรุงรักษา |
| `/scenarios/` | รายการ scenario ของต้นแบบ (ลิงก์ในแถบต้นแบบบนสุด) |
| `/kit/` | ชุด component ทุก variant |
| `/soon/?s=…` | ที่พักของ scenario ที่ยังไม่ทำ |
| `/plans/` `/plans/new/` | ที่อยู่เดิม — พาไป `/` และ `/new/` |

## กติกา

อ่าน [CLAUDE.md](CLAUDE.md) ก่อนแก้ทุกครั้ง · component อยู่ `src/components/vms/` ([รายการและ prop](src/components/vms/README.md)) · สเปกจาก Figma อยู่ `figma-spec/` · ส่วนที่ต้องประกอบเองจดใน [figma-spec/COMPOSED.md](figma-spec/COMPOSED.md)
