# plan.md: โน้ตของงานที่ไม่อยู่ในโค้ด

โค้ดในรีโปนี้ไม่มี comment โน้ตที่เคยเขียนเป็น comment ย้ายมาอยู่ในโฟลเดอร์ `docs/code-notes/` ทั้งหมด ได้แก่ หน้าไหนทำตาม scenario ไหน ชิ้นไหนมาจาก component ไหนของ Figma เหตุผลของเงื่อนไข และประวัติการแก้

วิธีหาโน้ตของไฟล์โค้ด: เปิดไฟล์โน้ตของโฟลเดอร์นั้นตามตารางข้างล่าง หัวข้อในไฟล์คือชื่อไฟล์โค้ด ตัวหนาใต้หัวข้อบอกว่าโน้ตเคยอยู่ตรงไหนของไฟล์ เช่น หัวไฟล์ หรือก่อนบรรทัดไหน

มีโน้ตใหม่ ให้เขียนต่อในไฟล์โน้ตของโฟลเดอร์นั้น ใต้หัวข้อของไฟล์โค้ดที่เกี่ยว ไม่เขียนกลับเข้าโค้ด แผนงานที่ยังไม่ได้ทำเขียนต่อท้ายไฟล์นี้ได้

ในโค้ดเหลือ comment ได้อย่างเดียว คือคำสั่งที่เครื่องมืออ่าน เช่น `eslint-disable-next-line` และ `@ts-expect-error`

`src/styles/tokens.css` และ `src/styles/theme.css` สร้างด้วย `npm run sync-tokens` ซึ่งตัด comment ออกให้ตอนสร้าง คำอธิบาย token อยู่ในไฟล์ต้นทาง `design-system/tokens.css` ของรีโป Maintenance-Request-Form

## ไฟล์โน้ต

| โค้ดอยู่ที่ | ไฟล์โน้ต | ไฟล์โค้ดที่มีโน้ต | จำนวนโน้ต |
| --- | --- | --- | --- |
| src/app (ไฟล์ที่อยู่ชั้นบนสุด) | [docs/code-notes/app.md](docs/code-notes/app.md) | 2 | 11 |
| src/app/acceptance | [docs/code-notes/app-acceptance.md](docs/code-notes/app-acceptance.md) | 4 | 7 |
| src/app/approvals | [docs/code-notes/app-approvals.md](docs/code-notes/app-approvals.md) | 5 | 20 |
| src/app/car-parts | [docs/code-notes/app-car-parts.md](docs/code-notes/app-car-parts.md) | 3 | 27 |
| src/app/closeout | [docs/code-notes/app-closeout.md](docs/code-notes/app-closeout.md) | 2 | 2 |
| src/app/detail | [docs/code-notes/app-detail.md](docs/code-notes/app-detail.md) | 4 | 23 |
| src/app/edit | [docs/code-notes/app-edit.md](docs/code-notes/app-edit.md) | 1 | 4 |
| src/app/guide | [docs/code-notes/app-guide.md](docs/code-notes/app-guide.md) | 1 | 4 |
| src/app/head-review | [docs/code-notes/app-head-review.md](docs/code-notes/app-head-review.md) | 2 | 2 |
| src/app/kit | [docs/code-notes/app-kit.md](docs/code-notes/app-kit.md) | 3 | 6 |
| src/app/new | [docs/code-notes/app-new.md](docs/code-notes/app-new.md) | 3 | 50 |
| src/app/parts | [docs/code-notes/app-parts.md](docs/code-notes/app-parts.md) | 3 | 24 |
| src/app/plans | [docs/code-notes/app-plans.md](docs/code-notes/app-plans.md) | 2 | 2 |
| src/app/quarter | [docs/code-notes/app-quarter.md](docs/code-notes/app-quarter.md) | 9 | 70 |
| src/app/safety | [docs/code-notes/app-safety.md](docs/code-notes/app-safety.md) | 5 | 21 |
| src/app/satisfaction | [docs/code-notes/app-satisfaction.md](docs/code-notes/app-satisfaction.md) | 4 | 9 |
| src/app/scenarios | [docs/code-notes/app-scenarios.md](docs/code-notes/app-scenarios.md) | 4 | 8 |
| src/app/soon | [docs/code-notes/app-soon.md](docs/code-notes/app-soon.md) | 1 | 1 |
| src/app/trips | [docs/code-notes/app-trips.md](docs/code-notes/app-trips.md) | 15 | 94 |
| src/app/trips-view | [docs/code-notes/app-trips-view.md](docs/code-notes/app-trips-view.md) | 3 | 4 |
| src/app/vehicles | [docs/code-notes/app-vehicles.md](docs/code-notes/app-vehicles.md) | 7 | 65 |
| src/components/dashboard | [docs/code-notes/components-dashboard.md](docs/code-notes/components-dashboard.md) | 8 | 23 |
| src/components/guide | [docs/code-notes/components-guide.md](docs/code-notes/components-guide.md) | 1 | 6 |
| src/components/maintain-d | [docs/code-notes/components-maintain-d.md](docs/code-notes/components-maintain-d.md) | 14 | 27 |
| src/components/patterns | [docs/code-notes/components-patterns.md](docs/code-notes/components-patterns.md) | 10 | 25 |
| src/components/shell | [docs/code-notes/components-shell.md](docs/code-notes/components-shell.md) | 4 | 12 |
| src/components/vms | [docs/code-notes/components-vms.md](docs/code-notes/components-vms.md) | 87 | 198 |
| src/lib (ไฟล์ที่อยู่ชั้นบนสุด) | [docs/code-notes/lib.md](docs/code-notes/lib.md) | 10 | 29 |
| src/lib/guide | [docs/code-notes/lib-guide.md](docs/code-notes/lib-guide.md) | 21 | 81 |
| src/lib/mock | [docs/code-notes/lib-mock.md](docs/code-notes/lib-mock.md) | 23 | 588 |
| scripts/ และไฟล์ตั้งค่า | [docs/code-notes/scripts.md](docs/code-notes/scripts.md) | 4 | 15 |
| src/styles/ | [docs/code-notes/styles.md](docs/code-notes/styles.md) | 1 | 8 |
| รวม |  | 266 | 1466 |

## แผนงาน

### ทำต้นแบบบำรุงรักษาให้เป็นล่าสุด (เริ่ม 20 พ.ย. 2569)

เจ้าของงานสั่ง _"อยากให้ไปทำ ต้นแบบของงานบำรุงรักษา ให้เป็นล่าสุดที่คุยกัน"_ · ทำตาม skill `pre-dev` (4 ปลายทางต้องตรงกัน: userflow ไฟล์ 14 · จอ Figma `screens.js` ในรีโปงานซ่อม · เว็บ · เอกสาร Feature หน้าสรุป FLO)

**ตกลงไว้แล้ว**

- ทำ 3 ช่วง ช่วงละ commit: 1) Figma และเอกสารตามทันเว็บ 2) ข้อที่ยังไม่เริ่ม ทำ Figma ก่อนแล้วเว็บ 3) เอกสาร Feature 40–44 AC หน้าสรุป FLO
- จบแต่ละช่วง commit และ push ทั้งสองรีโป
- FLO: แก้ในการ์ดเดิม แล้ว comment บอกว่าแก้หัวข้อไหน ข้อไหน เพราะอะไร พร้อมลิงก์ commit · **ตอนนี้พักไว้ รอเจ้าของงานสรุปก่อน** (_"ยังไม่ต้องเขียน flo ได้ป่ะ รอให้สรุปก่อน"_)
- ข้อ 12 วันตัวอย่าง: เลื่อนทั้งเส้นเวลา ต.ค.–พ.ย. 2569 → ม.ค.–ก.พ. 2570 คงเลขวัน · วันนี้ของต้นแบบ 10/11/2569 → 10/02/2570 · วันปิดงาน 82-6789 ใน S24 เลื่อนตาม · ทั้งเว็บและ Figma ชุดเดียวกัน
- S27 แบบประเมินความพึงพอใจ: กรองให้ผู้ดูแลยานพาหนะเห็นเฉพาะคันที่ตัวเองดูแล (ตัวอย่างเคส satisfaction เปลี่ยนเป็นคันของนายสมชาย แก้วมณี)
- จอใหม่ใน Figma ต่อท้ายลิสต์เสมอ ไม่แทรกกลาง รหัสจอเดิมไม่เลื่อน

**ช่วง 1 Figma ตามทันเว็บ**

| ข้อ (ไฟล์ 34) | เรื่อง | สถานะ |
|---|---|---|
| R117 | แบบ Overhaul ถาวร (ปุ่มที่หัวหน้า S2 S7 · popup เลือกยานพาหนะ · เมนู … แถว) | ✅ Figma `846224a` |
| 13 14 15 | ผู้ดูแลรายคันนายสมชาย แก้วมณี · กรย. เขต กฟฉ.1 · ข้อความแจ้งเตือนมีชื่อผู้ดำเนินการ | ✅ Figma `b098db0` |
| 16 | S7 แผนจ้าง (F.11 F.12) · S8 กรย. ดูแผนจ้าง และแจ้งเตือนผู้รับจ้าง (G.6 G.7) | ✅ Figma `b098db0` |
| 18 19 | S23 หน่วยงานตรวจรับงานผู้รับจ้าง ช่องค่าจ้าง ค่าเดินทาง (V.14.1–V.14.7) · S18 ส่วนยานพาหนะที่จ้างดำเนินการ (Q.7) | ✅ Figma `b098db0` |
| 4 | ติ๊กหลายคัน "ย้ายไตรมาส (k)" / "จัดเข้าไตรมาส (k)" · popup จัดเข้าไตรมาส (S1 A.88–A.95 · R119) | ✅ Figma `3baf91f` |
| 8 | ฟอร์มแก้ไขแผนที่ดำเนินการ (S19 R.12–R.15 · R119) | ✅ Figma `3baf91f` · ใช้แผนตัวอย่าง 10 คันของปลั๊กอิน (เว็บ 16 คัน) |
| เอกสาร | userflow ไฟล์ 14: S1 (ข้อ 1 3 4 5 6 9 27) · S2 S7 ยังเป็น Radio card ต้องเป็นปุ่มที่หัวหน้า · S19 ข้อ 8 · S24 ข้อ 25 · ไฟล์ 27 · AC 25 28 29 · `Diagram/README.md` | ⬜ ยังไม่ทำ |

**ช่วง 2 ข้อที่ยังไม่เริ่ม (Figma ก่อน แล้วเว็บ)**

- ⬜ ข้อ 12 เลื่อนวันตัวอย่างตามที่ตกลง + ปฏิทินช่วงวันเดินทางเลือกได้เฉพาะเดือนของไตรมาส
- ⬜ ข้อ 18 กบค. ปิดงานแทนผู้รับจ้างที่ S10 มีช่องค่าจ้าง ค่าเดินทาง บังคับ เข้า S18
- ⬜ ข้อ 20 แผนปิดงานเมื่อทุกคันทุกไตรมาสเสร็จหรือบำรุงรักษาไม่ได้ และรับทราบแล้ว
- ⬜ ข้อ 23 ตัวอย่าง MTD-691003-014 เป็นงานที่ กบค. ซ่อมเอง
- ⬜ ข้อ 24 ผู้รับจ้างไม่เห็นเมนูแบบประเมินความพึงพอใจ
- ⬜ S27 กรองตามผู้ดูแลยานพาหนะ
- ⬜ `PERMISSIONS.md` ข้อ 6 9 13 15 16 24
- ยังไม่มีจอ: ผู้ตรวจรับประเมินผู้รับจ้าง (ข้อ 21) · มือถือไอคอนย้ายและเอาออกในการ์ดไตรมาส (ข้อ 2 รอไลบรารี)

**ช่วง 3 เอกสารและ FLO (พักไว้ รอเจ้าของงานสรุป)**

- ⬜ เอกสาร Feature 40–44 ให้ตรงงานวันนี้ทั้งหมด แล้วแก้ `FEATURES` ใน `artifact/build.py` ถ้าจำนวนเปลี่ยน
- ⬜ หน้าสรุป https://claude.ai/artifact/ApmsruZ1AgACrtvQG1FoFn (แก้บรรทัดที่มาใน `shell.html` ให้เป็นรีโปนี้และ commit ล่าสุด)
- ⬜ MTD-212 ตารางตัวเลขและบรรทัดที่มา (ยังอ้าง 896ec41 ของรีโปงานซ่อม 18 พ.ย. 2569)
- ⬜ การ์ด journey ที่กระทบ: S2 S7 ปุ่มที่หัวหน้า · popup เลือกยานพาหนะ · ผู้ดูแลรายคัน เขต กฟฉ.1 · แจ้งเตือนผู้รับจ้าง · ตรวจรับงานผู้รับจ้าง · ย้าย/จัดเข้าไตรมาสหลายคัน · แก้ไขแผนที่ดำเนินการ
- ⬜ MTD-247 และ MTD-267 (เครื่องมือกล) ยังเป็นแบบที่มีปุ่ม "เพิ่มเครื่องมือกล" ที่หัวส่วน ต้องแก้ตามข้อสรุปล่าสุดด้านล่าง

**เครื่องมือกล (BACKLOG ข้อ 94 · spec ไฟล์ 47)**

- เงื่อนไขล่าสุด: รหัสข้างยานพาหนะ 04 07 08 09 10 มีส่วนนี้เสมอ · มีข้อมูลแสดงค่า ไม่มีแสดง "-" · มีเครื่องแล้ว กบค. เห็นปุ่ม "แก้ไข" อย่างเดียว · ยังไม่มีเครื่อง การ์ดทุกช่อง "-" กบค. เห็นปุ่ม "เพิ่ม" อย่างเดียว เพิ่มแล้วเป็น "แก้ไข" · ไม่มีปุ่มที่หัวส่วน · บทบาทอื่นดูอย่างเดียว · นอกกลุ่มไม่มีส่วนนี้
- ทำแล้ว: เว็บ `b19bddc` · Figma `15642f8` (R118 · W.19 W.20 W.24) · AC ไฟล์ 46 J4 · spec ไฟล์ 47
- ลิงก์พาดูให้เจ้าของงานเอาไปคอนเฟิร์ม 7 เคส: https://anugmail.github.io/maintenance-utility-vehicle/scenarios/guide/?s=machine (mc-blank-kbk · mc-blank-view · mc-has-kbk · mc-has-view · mc-validate · mc-duplicate · mc-outside)
- ค้างให้เจ้าของงานเคาะ: หัวส่วนยังแสดงจำนวน "(n)" ไหม · ชื่อประเภท 04–10 · รหัสทรัพย์สิน 12+4 หลักกับ `vehicle_asset_no` 9 ตัว · พิกัดยก กก. หรือ ตัน · ชั่วโมงเครื่องยนต์ต่อเครื่องหรือต่อคัน · ลบเครื่องมือกลได้ไหม · ผู้แก้มีแค่ กบค. ใช่ไหม · ประเภท 6 ค่าครบไหม

**แผนการ์ด production (maintain-d-fe · maintain-d-be)**

- ไฟล์ 48 `Diagram/01-บำรุงรักษาตามวาระ/48-บำรุงรักษา-แผนการ์ด-production.md` (เจ้าของงาน 20 พ.ย. 2569 _"อยากให้วางแผน เขียนการ์ด แบบที่ต้องทำ อย่างละเอียด ไปหยิบอะไรได้ที่ใหน"_)
- ✅ ร่างการ์ดรอบ 0 เต็มแม่แบบ 10 ใบ (R0-1 ถึง R0-10) อยู่ในไฟล์ 48 หัวข้อ 4 · ยังไม่ลง FLO
- ⬜ ร่างการ์ดรอบ 1–4 เต็มแม่แบบ (ตอนนี้เป็นตารางย่อ) · ⬜ แปลงคำถามค้างไฟล์ 45 เป็นการ์ด Decision · ⬜ ลง FLO เมื่อเจ้าของงานบอก
- งานค้างในเครื่องเจ้าของงาน (`~/Documents/repo-maintainD/`): BE commit `8b506ce` ยังไม่ push · BE `CLAUDE.md` `AI-EDITING.md` untracked · FE มีไฟล์แก้ค้าง

**ข้อควรรู้**

- เทสปลั๊กอินตอนนี้ 686 จอ · คำเตือน R19 "Sub Flow 2" ทั้งหมดมีอยู่ก่อนแล้ว (core.js ของ liinux-cw) ไม่ใช่ของงานนี้
- ในรีโปงานซ่อมต้องปิดแล้วเปิดปลั๊กอินใหม่ แล้วสร้างจอที่เพิ่ม/เปลี่ยน: F.11–F.12 · G.2–G.7 · V.14.1–V.14.7 · Q.7 · A.88–A.95 · R.12–R.15 · W.19 W.20 W.24 · จอ S6 S7 ที่มี 80-9981
- liinux-cw push โฟลเดอร์ `figma-plugin/` (ปลั๊กอิน "I AM A lnw") เข้า main ของรีโปนี้ด้วย ⇒ `git fetch` ก่อน push ทุกครั้ง · จอ Feature ของปลั๊กอินเขายังเป็นแบบเดิม ต้องแจ้งเขา
- ยังไม่ได้แจ้ง liinux-cw: เอกสารย้ายมารีโปนี้แล้ว · merge `a70bfac` เคยทำให้ปลั๊กอินพัง (แก้แล้ว `846224a`)
