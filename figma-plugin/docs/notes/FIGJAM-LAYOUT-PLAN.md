# แผน: บอร์ด FigJam จัดวางแบบหน้า Figma (20 พ.ย. 2569 · ทำแล้ว)

ผู้ใช้: "pattern การเรียง scope ของฝั่ง Figma ถูกต้องแล้ว แต่ของ Figjam ยังไม่ถูก อยากให้ของ Figjam แสดงแบบ Figma"

## วิธี
ส่งทุกชิ้นบนหน้า Feature ไปเป็นภาพพร้อมตำแหน่งจริง แล้ววางในบอร์ดตามตำแหน่งเดิม ทั้งหัว Feature หัวส่วน แถบ journey แถบขั้น ป้าย Device และจอ

### ฝั่ง Figma (`feature.js` · `exportFigJam` / `fjBoards`)
- ชิ้นที่เอา: ลูกระดับบนสุดของหน้าที่ `ownedNode` เป็นจริง และอยู่ในชุดล่าสุดเท่านั้น (y ≥ y ของโหนด tag `title` ตัวล่างสุด)
- จัดกลุ่มตาม pluginData `mf`
  - ไฟล์ happy = `title` + `happy` + `happy-*`
  - ไฟล์ journey j = `<j>` และไฟล์แรกได้ `full` ด้วย
  - โหนดที่ไม่มี tag ให้ไปอยู่กลุ่มเดียวกับโหนดที่มี tag ตัวที่อยู่เหนือมันใกล้ที่สุด
- ทำตามตัวเลือกอุปกรณ์และ journey ที่เลือก (ข้ามป้าย `MF · Mobile` และจอ ` · mobile` เมื่อไม่ได้เลือก Mobile)
- แปลงโหนดเป็นชิ้นที่วางได้แบบ recursive
  - ด้านยาว ≤ 4000 ⇒ export เป็น PNG 1 ภาพ (ถ้า ≤ 2048 ใช้ scale 2)
  - ใหญ่กว่านั้น เช่นแถบที่กว้างเต็มแถว ⇒ ทำเป็น rect จาก fill/stroke/radius ของโหนด แล้วไล่ลูกต่อด้วยกติกาเดียวกัน
  - เหตุผล: `figma.createImage` รับได้ไม่เกิน 4096 px
- ใช้ตำแหน่งจาก `absoluteBoundingBox`
  - x ลบด้วย minX ของทั้งชุด (ให้คอลัมน์ Device ตรงกันทุกไฟล์)
  - y ลบด้วย minY ของกลุ่มนั้น
- สเปกที่ได้: `sections: [{ kind: 'layout', name, color, w, h, items: [{ src, x, y, w, h } | { rect: { color, a, radius, stroke }, x, y, w, h }] }]`
- ใช้ชื่อไฟล์บอร์ดเดิม (`-happy.json` · `-N.json`) · ส่งภาพผ่านข้อความ `shot` ตามเดิม

### ฝั่ง FigJam (`figjam.js`)
- ถ้า `msg.type === 'build'` และใน spec มี section ที่ `kind === 'layout'` ให้ใช้ตัววางของเราเอง ไม่ใช่ `fjBuild`
- ขั้นตอนของตัววาง
  1. ลบ section ชื่อเดียวกับใน spec ออกก่อน
  2. วางต่อใต้ของที่มีอยู่บนบอร์ด (+400)
  3. สร้าง section ขนาดเท่าชุด + PAD 80
  4. ทุก item เป็น `createShapeWithText` แบบ SQUARE หรือ ROUNDED_RECTANGLE · ภาพใช้ fill แบบ IMAGE · rect ใช้ SOLID · ไม่มีเส้นขอบ (ยกเว้นที่ spec ระบุ)
  5. ส่ง `{ type: 'done', result: { sections, shapes, connectors: 0 } }` กลับให้ UI

### ต้องแก้ด้วย
- `ui.html` `buildSpec`: srcs ต้องรวม `s.items[].src` ด้วย
- `serve.js` บรรทัด 120 122: การนับภาพต้องรวม `items`
- เทส `test/figjam.test.js` และ `test/plugin.test.js` (MODE=export-figjam) ให้ตรงสเปกใหม่ · รันแบบ `ANNOT=0` เพราะดัมป์ใน iCloud เป็น dataless
- `npm run build` แล้ว commit + push

## ผลเทส (20 พ.ย. 2569)

- `PRE_MODE=build MODE=export-figjam` (Feature plan): ภาพ 459 · บอร์ด 9 ไฟล์ ✓
- `PRE_MODE=build MODE=export-figjam-all PRE_FEATURES=plan,trip`: ภาพ 731 · บอร์ด 17 ✓
- `SPEC=test-mf/board-maintainance-feature-happy.json node test/figjam.test.js`: วางตามพิกัด · ภาพเป็น fill IMAGE · วางซ้ำแทนที่ section เดิม ✓
- ถ้าจะกลับไปใช้แบบเดิม (คอลัมน์ละจอ + ลูกศร) ให้ตั้ง `FJ_LAYOUT = false` ใน feature.js
- ยังไม่ได้ลองในไฟล์ Figma และ FigJam จริง
