# figma-plugin

ปลั๊กอิน Figma ของงานบำรุงรักษาตามวาระ แยกออกมาจากรีโปงานซ่อม (Maintenance-Request-Form) เมื่อ 19 พ.ย. 2569

โฟลเดอร์นี้ในรีโป maintenance-utility-vehicle เป็นสำเนาจาก liinux-cw/figma-plugin f7e6b6c (20 พ.ย. 2569) · เปิดเทอร์มินัลที่ `figma-plugin/` ก่อนรัน `npm run …` ทุกคำสั่ง

| ปลั๊กอิน | โฟลเดอร์ | ทำอะไร |
|---|---|---|
| I AM A lnw | `plugins/maintenance-feature/` | สร้างจอ 5 Feature (แผนบำรุงรักษา · แผนเดินทาง · งานรายคัน · ต้นทุนการบำรุงรักษา · ติดตามและแดชบอร์ด) ลง Figma ทั้ง Desktop/Mobile · อัปเดต/ลบเฉพาะจอที่เปลี่ยน · ส่งภาพจอไปวางบอร์ด FigJam |

## ใช้ใน Figma

Figma desktop → Plugins → Development → Import plugin from manifest… → เลือก `plugins/maintenance-feature/manifest.json`

ชื่อ **I AM A lnw** · `id` `i-am-a-lnw` (เปลี่ยน 20 พ.ย. 2569 ไม่ให้ซ้ำกับ "พระผู้สร้าง" ตัวเดิมในรีโปงานซ่อม `maintaind-maintainance-feature-plan`) ⇒ สองตัวอยู่ในรายการ Development พร้อมกันได้ แยกชื่อชัด และไม่ใช้ค่าที่จำไว้ร่วมกัน · ครั้งแรกต้องเพิ่มบอร์ด FigJam ปลายทางใหม่ และเปิดปลั๊กอินในไฟล์ (UI) VMS Plus - Release#2 (Backup) 1 ครั้งให้จำ Device Type / Header / State · Page สำรองใหม่ชื่อ `<ชื่อ Feature> (I AM A lnw)` · Page `(พระผู้สร้าง)` ที่มีอยู่แล้วในไฟล์ยังหาเจอและใช้ต่อ ไม่สร้างซ้ำ

ส่งจอไป FigJam ต้องเปิด `npm run serve` ไว้ (พอร์ต 8124 · ไฟล์ลง `out/`)

## แก้แล้ว build

```bash
npm run build        # ประกอบ plugins/maintenance-feature/code.js
npm run link-dump    # ครั้งแรกครั้งเดียว: ชี้ out/figma-dump ไปที่ดัมป์ไลบรารี Figma ในเครื่อง (หรือตั้ง FIGMA_DUMP)
npm test             # ลายเซ็นจอ · ฝั่ง FigJam · สร้างจอ Feature plan
npm run test:all     # สร้างจอทั้ง 5 Feature
```

ตอนนี้เทสสร้างจอจบด้วย exit 1 เพราะมีคำเตือนที่มีมาตั้งแต่ก่อนย้าย 182 ข้อ (R19 แถบ Header · ตัวจำลองยังไม่มี Header ตัวใหม่) — ดูว่าจำนวนไม่เพิ่มขึ้นหลังแก้ (`— ผลทดสอบ — … คำเตือน N`)

`code.js` เป็นไฟล์ที่ประกอบขึ้น อย่าแก้ตรง ๆ — แก้ที่ `feature.js` `features/*.js` `update.js` `ui.html` ฯลฯ แล้ว build ใหม่ (commit `code.js` ด้วย เพราะ Figma โหลดไฟล์นี้)

## ฐานจากงานพี่นุ (`base/`)

`code.js` = `base/core.js` + `base/screens.js` (จอและข้อมูลจำลองของพี่นุ) + `base/figjam-plugin-code.js` (วางบอร์ด FigJam) + ไฟล์ของปลั๊กอินนี้ · `base/` ลอกมาอ่านอย่างเดียว ห้ามแก้ในนั้น · ที่มาจดใน `base/SOURCE.json`

ตามงานล่าสุดของพี่นุ:

```bash
npm run sync-base -- --dry                       # ดูว่าไฟล์ไหนจะเปลี่ยน
npm run sync-base                                # ลอก origin/main ของ ../peads/Maintenance-Request-Form ทับ base/
npm run sync-base -- --from <path> --ref <commit>
npm run build && npm run test:all
```

ระวัง: ลำดับจอในบล็อกของ `screens.js` เปลี่ยน ⇒ รหัสจอเดิมชี้จอคนละจอโดยไม่มีคำเตือน (ดู `docs/notes/MERGE-NOTES.md` ข้อ 3) ไล่ดูรหัสใน `features/*.js` กับเอกสาร `docs/features/` ก่อนคอมมิต

## โครงรีโป

| ที่ | อะไร |
|---|---|
| `plugins/<ปลั๊กอิน>/` | ปลั๊กอิน 1 ตัว (manifest · code.js · ui.html · build.js · base/) |
| `test/` | เทสของ I AM A lnw · `test/shared/` ตัวจำลอง Plugin API และกติกา component ลอกจากรีโปงานซ่อม |
| `docs/features/` | เอกสาร Feature 40–45 สำหรับ dev (เทสตรวจว่ารหัสจอใน `features/*.js` ตรงหัวข้อ 3 ของเอกสาร) |
| `docs/notes/` | บันทึกรวมงาน · requirement · ใบรีวิว 18 พ.ย. 2569 |
| `scripts/` | `sync-base.mjs` · `link-dump.mjs` |
| `serve.js` | เสิร์ฟ `out/` ให้ปลั๊กอินส่งภาพจอ/สเปกบอร์ด และฝั่ง FigJam โหลดกลับ |
| `out/` | ผลเทส ภาพจอ ดัมป์ (ไม่เก็บใน git) |

## เพิ่มปลั๊กอินใหม่

สร้าง `plugins/<ชื่อ>/` มี `manifest.json` (id ใหม่ ไม่ซ้ำ) `build.js` ของตัวเอง · ถ้าต้องใช้ฐานจากรีโปอื่นให้ลอกเข้า `base/` และใช้ `npm run sync-base -- --plugin <ชื่อ>` (แก้ `FILES` ในสคริปต์ให้รองรับ) · เพิ่มสคริปต์ build/test ใน `package.json`
