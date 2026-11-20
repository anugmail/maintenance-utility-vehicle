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

ยังไม่มีรายการ
