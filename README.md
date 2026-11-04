# ต้นแบบบำรุงรักษาตามวาระ (Maintain-D)

ต้นแบบหน้าจอ **บำรุงรักษาตามวาระ** ของ PEA (VMS Plus) เขียนใหม่ด้วย Next.js + Tailwind CSS
ทุก component ยกค่าจากไลบรารี Figma **(Component) VMS Plus** · หน้าจอตาม scenario ที่เคาะแล้วในไฟล์ userflow ของงานบำรุงรักษา

- ดูต้นแบบ: https://anugmail.github.io/maintainance-yearly/
- ชุด component ทุก variant: https://anugmail.github.io/maintainance-yearly/kit/
- ต้นแบบ HTML รุ่นเก่า: tag `html-prototype-2026-07`

## วิธีรัน

```bash
npm install
npm run dev                      # http://localhost:3020
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/maintainance-yearly npm run build   # ได้ out/ (static)
```

push ขึ้น `main` แล้ว GitHub Actions (`.github/workflows/pages.yml`) build และ deploy ขึ้น GitHub Pages เอง

## กติกา

อ่าน [CLAUDE.md](CLAUDE.md) ก่อนแก้ทุกครั้ง · component อยู่ `src/components/vms/` ([รายการและ prop](src/components/vms/README.md)) · สเปกจาก Figma อยู่ `figma-spec/` · ส่วนที่ต้องประกอบเองจดใน [figma-spec/COMPOSED.md](figma-spec/COMPOSED.md)
