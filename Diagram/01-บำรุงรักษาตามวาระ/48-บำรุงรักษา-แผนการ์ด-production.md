# แผนการ์ด production: บำรุงรักษาตามวาระ (maintain-d-fe · maintain-d-be)

> ร่าง 20 พ.ย. 2569 · ยังไม่ลง FLO (เจ้าของงาน _"ยังไม่ต้องเขียน flo ได้ป่ะ รอให้สรุปก่อน"_)
> ใช้คู่กับเอกสาร Feature 40–44 (journey และ AC) · AC ราย journey ไฟล์ 28 และ 46 · spec เครื่องมือกลไฟล์ 47 · คำถามค้างไฟล์ 45
> สำรวจโค้ดจริงเมื่อ 20 พ.ย. 2569: BE main `97daab2` · BE/FE branch `feat/maintenance-r0-r1`

## 0. สภาพตอนนี้

| | main | branch `feat/maintenance-r0-r1` |
|---|---|---|
| maintain-d-be (Go · Gin · GORM · Postgres) | `domain/maintenance/` เป็นแค่โครงเปล่า (ping) | 20 commit (11–12 พ.ย. 2569) R1 แผน CRUD + อนุมัติ · R2 หน้าไตรมาส + แผนเดินทาง + อนุมัติ · ตาราง `vms_*_pm_*` · e2e ผ่าน · **ตามหลัง main 164 commit · commit `8b506ce` ยังไม่ได้ push** |
| maintain-d-fe (Next 16 · React 19 · Tailwind + DaisyUI) | ไม่มีงานบำรุงรักษา | 11 commit: รายการแผน ฟอร์ม รายละเอียด อนุมัติแผน หน้าไตรมาส ฟอร์มแผนเดินทาง อนุมัติแผนเดินทาง · ซ่อนเมนูด้วย `NEXT_PUBLIC_FEATURE_PM` · **มีไฟล์ยังไม่ commit** (`CLAUDE.md` · `docs/backlog/maintenance/create-and-submit-plan/01-input.md` · `AI-EDITING.md`) |

ทั้งสอง branch ทำก่อนการตัดสินใจรอบ 13–20 พ.ย. 2569 (ไฟล์ 34 · R111–R119 · แบบ Overhaul ถาวร) ⇒ ต้องมีการ์ด "ตามต้นแบบล่าสุด" ในแต่ละรอบ

## 1. หลักการแบ่งการ์ด

| ชนิด | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| Epic | Feature (มีแล้ว MTD-214–218) + Epic พื้นฐาน (ใหม่) | Epic พื้นฐาน: สิทธิ์ แจ้งเตือน ข้อมูลอ้างอิง |
| Story | 1 journey (มีแล้ว MTD-222–247 · MTD-267) — ผู้ใช้ทำได้จนจบ มี AC | F2 J4 แจ้งเตือนแผนเดินทาง |
| Task | งานย่อยใต้ story แยกตามรีโปและชั้น ขนาด 1–3 วัน | BE: migration ตาราง job · FE: หน้า Step 1 |
| Decision | คำถามที่เจ้าของงานต้องตอบ บล็อก story | ผู้ดูแลยานพาหนะมาจากข้อมูลไหน |
| Spike | เรื่องเทคนิคที่ยังไม่รู้ จำกัดเวลา จบด้วยข้อสรุปในการ์ด | Smart Inventory มี API ค้นรายการไหม |
| Release | ปล่อยแต่ละรอบ | R1 ขึ้น UAT |

ชื่อ branch: `feat/MTD-<เลขการ์ด>-<สั้น>` · BE ใช้ Conventional Commits (lefthook บังคับ) · 1 Task = 1 MR

## 2. แม่แบบการ์ด

**Story** (การ์ด journey เดิม เติมหัวข้อ)
- เป้าหมาย 1 ประโยค
- ดูของจริง: จอ Figma (รหัสจอ) · ลิงก์พาดูต้นแบบ `https://anugmail.github.io/maintenance-utility-vehicle/scenarios/guide/?s=<เรื่อง>` · เอกสาร Feature หัวข้อ 2
- Acceptance Criteria (มีแล้ว)
- บล็อกโดย: Decision ที่เกี่ยว
- Task ลูก: BE / FE / ทดสอบ

**Task**

```
ชั้น: BE | FE
ทำ: <สิ่งที่ต้องเกิด 1–3 ข้อ>
หยิบจาก: <ไฟล์/ตาราง/API/ฟังก์ชันที่ใช้ซ้ำ พร้อม path>
แบบที่ลอก: <โค้ดที่ใกล้ที่สุด>
ห้าม: <กติกาที่มักพลาด>
เสร็จเมื่อ: <คำสั่งตรวจ + ผลที่เห็นได้>
```

**Decision**: คำถามเดียว · ตัวเลือก + ผลของแต่ละทาง · ใครตอบ · story ที่บล็อก

## 3. เงื่อนไขการทำงาน

**พร้อมเริ่ม** — Story: มีจอ Figma และลิงก์ต้นแบบ · AC ครบ · Decision ที่บล็อกปิดแล้ว · Task: รู้ตาราง/API แล้ว (หรือ Spike ปิดแล้ว)

**เสร็จ — BE (maintain-d-be `AGENTS.md`)**
- `make lint` · `make test` · `make e2e` ผ่าน · `golangci-lint run ./...` ผ่าน
- route ใหม่หรือ godoc เปลี่ยน → `make swagger` แล้ว commit `docs/`
- migration ใหม่: `make migration-create NAME=` · มี `-- +migrate Up/Down` · SQL pack `scripts/sql/NNN_YYYYMMDD_*.sql` + `_rollback.sql` (main ถึง 025 แล้ว) · แก้ `docs/schema/er.md` · `make check-migrations` ผ่าน
- ทุก POST/PUT/PATCH/DELETE ตรวจ actor และ role เอง + test 401 และ 403 · อยู่ใน `handler_write_permission_test.go` ของโดเมน (ห้ามใส่ exclusion)
- ฟังก์ชันใหม่คืน `(T, error)` ไม่ใช่ `funcs.Result` · log ด้วย `log/slog` · เวลาแปลง `Asia/Bangkok` ก่อนจัดรูปหรือบวก 543 · 5xx ไม่ส่ง `err.Error()`
- โดเมน maintenance ห้าม import repair/overhaul/parts (depguard) — ใช้ของกลางใน `domain/shared` หรือ bridge ที่ `adapter/`

**เสร็จ — FE (maintain-d-fe `AGENTS.md` · `AI-EDITING.md`)**
- `pnpm lint` · `pnpm type-check` · `pnpm test` ผ่าน · coverage ≥ 95% (branches ≥ 90%) ไม่ลดเกณฑ์ · เปลี่ยน route หรือโฟลเดอร์ → `pnpm build`
- เรียก API ใน `src/domains/maintenance/services/<feature>.ts` · logic ใน `utils/<feature>.ts` + `.test.ts` · ไม่มี `*.test.tsx` · ไม่มี `any` · ส่ง `AbortSignal`
- หน้าใน `src/app/maintenance-utility-vehicle/**` บาง import screen จาก domain · state ของตัวกรอง แบ่งหน้า แท็บ อยู่ใน URL
- หน้าตาตรงจอ Figma ทั้ง desktop และมือถือ · ข้อความตรงตัว ("ยานพาหนะ" · "ไฮดรอลิก") · สีจาก `tailwind.config.js` เท่านั้น
- ข้อความสรุปท้าย MR: Changed · Pattern deviations · Follow-ups

**เสร็จ — Story**: ผ่าน AC ทุกข้อบน UAT โดยคนที่ไม่ได้เขียน · พฤติกรรมต่างจากเอกสาร → แก้เอกสารและการ์ดก่อนปิด

**คอลัมน์**: Backlog → Ready → Doing → Review (MR) → UAT → Done · Doing ไม่เกิน 2 ใบต่อคน

## 4. รอบ 0: พื้นฐาน (Epic ใหม่ "[บำรุงรักษาตามวาระ] รอบ 0 พื้นฐาน")

> ร่างการ์ดเต็ม 20 พ.ย. 2569 · ยังไม่ลง FLO · ตรวจแล้วว่าไฟล์และฟังก์ชันที่อ้างมีอยู่จริง (BE main `97daab2` · branch `feat/maintenance-r0-r1` ที่ `~/Documents/repo-maintainD/`)
> ลำดับ: R0-1 R0-3 R0-4 เริ่มพร้อมกัน → R0-2 ต่อ R0-1 → R0-5 R0-6 รอคำตอบ R0-4 → R0-7 แล้ว R0-8 → R0-9 R0-10 ทำคู่ได้เลย · ขนาดเป็นค่าประมาณ dev ปรับได้

### R0-1 · BE: rebase งานบำรุงรักษาขึ้น main
**ชนิด** Task · **รีโป** BE · **ขนาด** 2–3 วัน · **ขึ้นกับ** —

**ทำ**
1. push `8b506ce` ที่ค้างอยู่ แล้ว rebase `feat/maintenance-r0-r1` บน `origin/main`
2. SQL pack ของงานนี้ 016–019 เปลี่ยนเป็น 026–029 ทั้งไฟล์หลักและ `_rollback.sql` (main ถึง 025)
3. migration ของงานนี้ทุกไฟล์มีเวลาหลัง migration ล่าสุดของ main · ห้ามแก้ไฟล์ migration ที่อยู่ใน main แล้ว
4. `registerMaintenance` ให้เข้ากับ `router.Setup(ctx, …)` ของ main
5. รวม `docs/schema/er.md` (ส่วน `pm_*`) และ `make swagger` ใหม่

**หยิบจาก** `scripts/sql/README.md` · `docs/schema/pea-overhaul-sql-pack.md` (ลำดับส่ง PEA) · `cmd/server/router/router.go`

**ห้าม** แก้ migration ของ main (`make check-migrations` ตีกลับ) · `--no-verify` · push main

**เสร็จเมื่อ** `make lint` `make test` `make e2e` `make check-migrations` ผ่าน · e2e เดิมของบำรุงรักษาผ่านครบ (`e2e/maintenance_test.go` `maintenance_trip_test.go` `maintenance_unit_test.go`) · เปิด MR ให้คนรีวิว

### R0-2 · BE: ให้โดเมน maintenance ผ่านกติกาของรีโป
**ชนิด** Task · **รีโป** BE · **ขนาด** 2–3 วัน · **ขึ้นกับ** R0-1

**ทำ**
1. port และ usecase ใหม่ใน `domain/maintenance/` ที่คืน `funcs.Result` เปลี่ยนเป็น `(T, error)`
2. เพิ่ม `domain/maintenance/adapter` และ `adapter/http` ใน `inner-layers` ของ `.golangci.yml`
3. handler POST/PUT/DELETE ทุกตัวตรวจ actor **และ role** (ตอนนี้ตรวจแค่หน่วยงานผ่าน `requireActor` ของตัวเอง)
4. `domain/maintenance/adapter/http/handler_write_permission_test.go` ไล่ทุก route ที่ไม่ใช่ GET มีขั้นต่ำจำนวน route
5. ข้อความ commit ของ branch เป็น Conventional Commits (lefthook บังคับ)

**แบบที่ลอก** `domain/overhaul/adapter/http/handler_write_permission_test.go` · `access_control.go` · `requireOverhaulPlanWriteAccess` (`handler.go:305`) · `ResolveActorContext` `TokenHasRole` (`domain/shared/actor/http/actor_resolver.go:146 177`)

**ห้าม** exclusion ใน `.golangci.yml` หรือ sweep test · maintenance import repair/overhaul (vendor ร่วมผ่าน bridge ที่ `adapter/` แบบ `adapter/pmvendor/bridge.go`)

**เสร็จเมื่อ** `golangci-lint run ./...` และ `make test` ผ่าน · route เขียนทุกตัวมี test 401 และ 403

### R0-3 · FE: rebase งานบำรุงรักษาขึ้น main และกันข้ามโดเมน
**ชนิด** Task · **รีโป** FE · **ขนาด** 1–2 วัน · **ขึ้นกับ** —

**ทำ**
1. ไฟล์ค้าง (`CLAUDE.md` · `docs/backlog/maintenance/create-and-submit-plan/01-input.md` · `AI-EDITING.md`) เจ้าของเคาะว่า commit หรือทิ้ง
2. rebase `feat/maintenance-r0-r1` บน main
3. กฎใน `eslint.config.mjs` ห้าม `src/domains/maintenance/**` import `@domains/repair` `@domains/overhaul` (แบบกฎ repair↔overhaul ที่มีอยู่)
4. ตรวจว่าเมนูยังซ่อนด้วย `NEXT_PUBLIC_FEATURE_PM` (`use-maintenance-enabled` · `MaintenanceGate`)

**ห้าม** ลด coverage · `*.test.tsx`

**เสร็จเมื่อ** `pnpm lint` `pnpm type-check` `pnpm test` `pnpm build` ผ่าน · เปิด MR

### R0-4 · Decision: บทบาทของบำรุงรักษามาจากข้อมูลไหน
**ชนิด** Decision · **ใครตอบ** เจ้าของงาน + ทีม VMS+ main · **บล็อก** R0-5 R2-1 R3-7 R3-10

ตอนนี้ role ใน JWT (`domain/platform/auth/dto/vms_profile.go`) มีแค่ vehicle-user · admin-* · approval-* ไม่มีบทบาทของงานนี้

| # | คำถาม | ตัวเลือกที่เห็น |
|---|---|---|
| 1 | กองผู้สร้างแผน (6 กองของ สนง.) ตัดสินจากอะไร | `dept_sap_short` ของผู้ใช้ (โค้ดทำแบบนี้ แต่ยืนยันค่าแล้วแค่ กบค.) · หรือ role ใหม่ |
| 2 | กบค. (เห็นทุกหน่วยงาน · แก้เครื่องมือกล) | หน่วยงาน กบค. · role admin-super · หรือ role ใหม่ |
| 3 | ผู้อนุมัติแผนและแผนเดินทาง | สายบังคับบัญชาจาก `hr.Client.GetEmpManager` (ทำแล้วใน `hr_gateway.go`) · อนุมัติชั้นเดียวไหม (ด.18) |
| 4 | กรย. ที่รับแจ้งเตือนตามเขต | `dept_sap`/`dept_upper` ของผังหน่วยงาน (`db-schema/map-06`) เทียบเขตของยานพาหนะ `vehicle_owner_dept_sap` |
| 5 | ผู้ดูแลยานพาหนะ | `vms_mas_vehicle_department.vehicle_user_emp_id` · `vms_mas_vehicle_authorized_user` · หรือชื่อที่ผู้ดำเนินการแก้ในแผนเดินทาง (ต้นแบบใช้แบบนี้) |
| 6 | ผู้รับจ้างเข้าระบบอย่างไร | บัญชีใน VMS+ · บัญชีแยก · หรือไม่เข้าระบบ หน่วยงานบันทึกแทน |

**หยิบจาก** ไฟล์ 14 หัวข้อ 1 · `Maintenance-Request/VMS-Plus-ตาราง-Permission.md` · `VMS-Plus-Permission-Role-3-ระยะ.md`

**เสร็จเมื่อ** ทุกข้อมีคำตอบใน comment · ตาราง Permission ไฟล์ 14 แก้ตามแล้ว

### R0-5 · BE+FE: สิทธิ์ของบำรุงรักษา
**ชนิด** Story (2 Task) · **ขนาด** BE 3 วัน · FE 2 วัน · **ขึ้นกับ** R0-2 R0-4

**ทำ (BE)**
1. resolver ว่าผู้ใช้เป็นบทบาทไหนของงานนี้ตามคำตอบ R0-4 (`domain/maintenance/adapter/http/access_control.go` แบบ overhaul)
2. ทุกรายการส่ง `can_edit` `can_delete` `can_review` (มีบางส่วนแล้ว)
3. persona ใหม่ใน `e2e/harness/personas.go` + e2e ตามตาราง Permission

**ทำ (FE)**
1. ขยาย `src/domains/maintenance/utils/plan-access.ts` ให้ครอบทุกหน้า ใช้ `useProfile()` (`src/domains/identity/profile.ts`) + `can_*` จาก BE · มี test ของ utils

**แบบที่ลอก** `src/domains/overhaul/utils/overhaul-permissions.ts` · `overhaul/components/kobk-only-guard.tsx`

**ห้าม** ซ่อนปุ่มฝั่ง FE อย่างเดียวโดย BE ไม่ตรวจ

**เสร็จเมื่อ** ทุกช่องในตาราง Permission ไฟล์ 14 มี e2e ครอบ · FE coverage ถึงเกณฑ์

### R0-6 · BE: ข้อมูลหน่วยงานและเขต
**ชนิด** Task · **รีโป** BE · **ขนาด** 1–2 วัน · **ขึ้นกับ** R0-1 · R0-4 ข้อ 1 4

**ทำ**
1. `dept_sap_short` จริงของ 5 กองที่ยังเป็น TODO ใน `domain/maintenance/domain/unit.go` (ยืนยันแล้วแค่ กบค.)
2. mapping เขต → `dept_sap` ให้ตัวกรองภาค/เขตของแผน (UC-MT-05.2 ตอนนี้ว่าง)
3. seed migration + SQL pack + rollback

**หยิบจาก** `vms_mas_department` / `local_mas_department` (`dept_sap` `dept_upper` `dept_short`) · `db-schema/map-06-การมองเห็นรถ-ตามผังหน่วยงาน.md` · seed เดิม 019 (`pm_unit_group_seed`)

**ห้าม** อ่านข้อมูลจริงจาก UAT/PROD (AGENTS.md) ขอค่าจากเจ้าของข้อมูล

**เสร็จเมื่อ** unit test ของ mapping · ตัวกรองบน dev คืนแผนถูกเขต

### R0-7 · BE: แจ้งเตือนของบำรุงรักษา
**ชนิด** Task · **รีโป** BE · **ขนาด** 2 วัน · **ขึ้นกับ** R0-1 · Decision ด.19 (e-mail / push ด้วยไหม)

**ทำ**
1. `NotifyType` ของ maintenance ใน `domain/shared/notify/links.go` (กดแล้วไปหน้าที่ถูก)
2. seed template ลง `vms_mas_notification_template`: อนุมัติแผนเดินทาง (กรย. · ผู้ดูแลยานพาหนะ · ผู้รับจ้าง) · ปิดงานรอรับทราบ · ผลตรวจน้ำมันไม่ผ่าน
3. ฟังก์ชันส่งใน usecase ผ่าน `notify.Service.Send` / `SendInBackground`

**หยิบจาก** `domain/shared/notify/service.go` · `adapter/vmsnotify` · ข้อความต้นแบบ `approvalNotis` `ackNoti` `oilFailNoti` (`maintenance-utility-vehicle/src/lib/mock/trips.ts`)

**แบบที่ลอก** `migrations/20261117120000_seed_overhaul_notification_templates.sql` · `domain/overhaul/usecase/service_selected_approver.go`

**เสร็จเมื่อ** unit test ว่าใครได้ข้อความไหน · ส่งได้จริงบน dev

### R0-8 · FE: กระดิ่งแจ้งเตือน (ใช้ร่วมทุกโมดูล)
**ชนิด** Task · **รีโป** FE · **ขนาด** 2–3 วัน · **ขึ้นกับ** R0-7 · Decision: อ่านรายการจาก VMS+ main (`getMainApiConfig`) หรือ maintain-d-be

**ทำ**
1. ปุ่มกระดิ่งใน `src/components/layout/header.tsx` (ตอนนี้ปุ่มนิ่ง มีจุดแดง ไม่มี handler) เปิดแผงรายการ · นับที่ยังไม่อ่าน · กดแล้วไปหน้าที่ลิงก์และทำเครื่องหมายอ่านแล้ว
2. service ที่ `src/services/` (ใช้ร่วม ไม่อยู่ใน domain)
3. หน้าตาตามจอแผงแจ้งเตือน Figma (G.2 G.4 G.7 L.4) · มือถือ bottom sheet (`@ui/bottom-sheet.tsx`)

**เสร็จเมื่อ** test ของ utils · ใช้ได้ทั้ง desktop และมือถือ · งานซ่อมและ Overhaul ไม่พัง

### R0-9 · Spike: รายการอะไหล่จาก Smart Inventory
**ชนิด** Spike · **ขนาด** จำกัด 2 วัน · **บล็อก** R1-2 R3-4

**คำถาม** `GetMasterMatWiSto` ค้นทีละรหัส ได้ยอดและราคา ไม่มีค้นรายการ · BE ใช้รายการจำลอง (`NewMemoryCatalogProvider`) · รายการอะไหล่สำหรับเลือกในแผนจะได้จากไหน · ใช้แหล่งเดียวกับงานซ่อมได้ไหม

**หยิบจาก** `Maintenance-Request/API_Spec_GetMasterMatWiSto.txt` · `docs/repair/smart-inventory-api-contract.md` · `domain/parts/port` (`CheckPartsStock` `ResolveCatalogPartSnapshot`)

**เสร็จเมื่อ** ข้อสรุปในการ์ด: API · ฟิลด์ · ข้อจำกัด · วิธีเชื่อม (ผ่าน bridge ที่ `adapter/` เพราะ maintenance ห้าม import parts)

### R0-10 · FE: ปรับตามแบบ Overhaul ถาวร
**ชนิด** Task · **รีโป** FE · **ขนาด** 2 วัน · **ขึ้นกับ** R0-3

**ทำ**
1. หน้าตรวจสอบแผนและแผนเดินทาง (`plan-detail/review-section` · `trip-review-page.tsx`): เอาส่วนผลการพิจารณาออก · ปุ่ม "ส่งกลับแก้ไข" + "อนุมัติ" ที่หัวหน้า · ส่งกลับเปิดหน้าต่างเหตุผลบังคับ · อนุมัติยังมีหน้าต่างยืนยัน
2. popup เลือกยานพาหนะ (`vehicle-picker`): หัวและปุ่ม "เพิ่มยานพาหนะ (k)" · แผงตัวกรองหุบตอนเปิด
3. แถวยานพาหนะ desktop เป็นเมนู "…" · มือถือคงไอคอนบนการ์ด

**หยิบจาก** `@ui/modal/reason-modal/reason-modal.tsx` · ต้นแบบ `src/app/approvals/_shared/Decision.tsx` `src/app/quarter/_shared/TripCarPicker.tsx` · Figma B.2 B.5–B.7 F.2 F.5–F.7 (R117)

**เสร็จเมื่อ** ตรงจอทั้ง desktop และมือถือ · ข้อความตรงตัว · test ของ utils ผ่าน

## 5. รอบ 1: แผนบำรุงรักษา (Feature 1 · ส่วนใหญ่ทำแล้วบน branch)

แต่ละใบ = ปรับของที่ทำไว้ให้ตรงการตัดสินใจหลัง 12 พ.ย. 2569 · ตรวจกับ AC ไฟล์ 28 และ 46 และลิงก์พาดู

| รหัส | การ์ด (Story เดิม) | ต่างจากที่ทำไว้ | BE | FE | ที่มา |
|---|---|---|---|---|---|
| R1-1 | แผน 2 ขั้น: เพิ่มเข้าแผนก่อน แล้วจัดเข้าไตรมาส (MTD-222) | แท็บทั้งหมด + ป้าย "ยังไม่จัดไตรมาส" · ส่งได้เมื่อจัดครบ | `vms_trn_pm_plan_vehicle` ให้ quarter เป็น null ได้ | `plan-form/quarter-tabs` | R111 · ไฟล์ 34 |
| R1-2 | ติ๊กหลายคัน กำหนดอะไหล่ ย้ายไตรมาส จัดเข้าไตรมาส (MTD-223 MTD-224) | ปุ่มรอง "กำหนดอะไหล่ (k)" "ย้ายไตรมาส (k)" "จัดเข้าไตรมาส (k)" · popup จัดเข้าไตรมาส | endpoint ย้าย/จัดหลายคัน | `vehicle-setup-modal` · `quarter-modal` | R112 R119 · ไฟล์ 34 ข้อ 3 4 27 · Figma A.88–A.95 |
| R1-3 | แผนรออนุมัติดูอย่างเดียว · ลบได้เฉพาะส่งกลับแก้ไข (MTD-225 MTD-228) | เมนู … ของแผนรออนุมัติเหลือดูรายละเอียด | ห้ามลบสถานะ REVIEW (409) | `plan-access.ts` | R116 · ไฟล์ 34 ข้อ 6 |
| R1-4 | แก้ไขแผนที่ดำเนินการแล้ว (MTD-227) | แก้ได้เฉพาะไตรมาสที่ยังไม่เสร็จ · คันปิดงานแล้วล็อก · ไม่ต้องอนุมัติใหม่ | rule ตาม `liveEdit.ts` ของต้นแบบ (ไตรมาสเสร็จ = ทุกคันปิดงานหรือบำรุงรักษาไม่ได้) · ต้องรอรอบ 3 (สถานะงานรายคัน) | ฟอร์มโหมด live | R113 · ไฟล์ 34 ข้อ 8 · Figma R.12–R.15 |
| R1-5 | หน้าอนุมัติแผน (MTD-229) | แท็บอนุมัติแล้วรวมดำเนินการและปิดงาน ป้ายสถานะจริง · ปุ่มที่หัวหน้า (R0-10) | filter สถานะ | `plan-approvals-page` | ไฟล์ 34 ข้อ 9 |
| R1-6 | อะไหล่ในแผน | แท็บรวมทุกไตรมาสว่าง "แผนนี้ไม่มีอะไหล่ที่ต้องเบิก" · ยอดอะไหล่แยกตามแผน | parts-summary | `parts-summary-section` | ไฟล์ 34 ข้อ 5 11 |
| R1-7 | Decision: เลขที่ MR | รูปแบบเลขที่แผน (`vms_mas_pm_plan_running`) | | | FE `docs/backlog/maintenance/questions-be.md` |
| R1-8 | ข้อ 12: ปีงบ ม.ค.–ธ.ค. · ปฏิทินจำกัดเดือนของไตรมาส | | ตรวจช่วงวันใน trip | `datePickerRange` | ไฟล์ 34 ข้อ 12 |

## 6. รอบ 2: แผนเดินทาง (Feature 2 · ทำแล้วบางส่วน)

| รหัส | การ์ด | ทำ | หยิบจาก | ที่มา |
|---|---|---|---|---|
| R2-1 | แจ้งเตือนเมื่ออนุมัติแผนเดินทาง (MTD-233 · S8) | BE: หลังอนุมัติส่ง กรย. (คันในเขต) · ผู้ดูแลยานพาหนะ (คันที่ดูแล) · ผู้รับจ้าง (แผนจ้าง) ข้อความตาม `approvalNotis` ของต้นแบบ · FE: หน้าแผนเดินทางดูอย่างเดียวของ กรย. และผู้ดูแล | R0-7 · R0-8 · ต้นแบบ `src/lib/mock/trips.ts` `approvalNotis` `areaCars` `caredCars` | ไฟล์ 34 ข้อ 13–16 · Figma G.1–G.7 |
| R2-2 | แผนจ้างดำเนินการ: อนุมัติและแจ้งผู้รับจ้าง (MTD-234) | รายละเอียดแผนจ้างมีเบอร์ผู้รับจ้าง · แจ้งเตือนผู้รับจ้าง "เริ่มงานได้ตั้งแต่ …" | `adapter/pmvendor/bridge.go` (VendorGateway ของ overhaul) | Figma F.11 F.12 G.7 |
| R2-3 | เพิ่ม เอาออก แก้ไขยานพาหนะในไตรมาส (MTD-235 · ยังไม่ทำ) | popup เพิ่มยานพาหนะเข้าไตรมาส (ทุกคันที่ยังไม่อยู่ในแผน หน้าละ 10) · ปุ่ม Disabled เมื่อทุกคันปิดงาน | `vehicle-picker` ของฟอร์มแผน | R104 R93 · Figma E.19 E.26 |
| R2-4 | ย้ายยานพาหนะที่บำรุงรักษาไม่ได้ไปไตรมาสอื่น (MTD-236 · S25) | เมนู … ดำเนินการบำรุงรักษา + ย้ายไตรมาส · ไตรมาส 4 ย้ายไม่ได้ · ต้องรอสถานะ "บำรุงรักษาไม่ได้" ของรอบ 3 | | R67 · ไฟล์ 34 ข้อ 26 |
| R2-5 | แก้ไขแผนเดินทางที่ถูกส่งกลับ (MTD-232) | ตรวจกับ AC · แจ้งผู้สร้างเมื่อถูกส่งกลับ (Decision ด.19) | | ไฟล์ 41 J3 |
| R2-6 | ส่งออกแผนเดินทาง PDF / Excel (MTD-238) | | PDF: `domain/repair/adapter/http/pdf_report.go` (chromedp) · Excel: `domain/overhaul/adapter/http/excel_overhaul_report.go` · FE: `triggerBlobDownload` ใน `repair/services/repair-list.ts` | ไฟล์ 42 J2 |

## 7. รอบ 3: งานรายคัน (Feature 3 · ยังไม่เริ่ม · ตารางใหม่ทั้งหมด)

| รหัส | การ์ด | ทำ | หยิบจาก / แบบที่ลอก |
|---|---|---|---|
| R3-1 | BE: ตารางงานรายคัน | `vms_trn_pm_job` (ผูก `vms_trn_pm_trip_vehicle`) สถานะ todo/doing/done/cannot · ผู้รับจ้าง worked/wait/returned · `vms_trn_pm_job_part` (ตามแผน ใช้จริง คืน) · `_status_history` (actor) · `_document` (ภาพ) · ผลตรวจน้ำมัน | `domain/repair/domain/status_transitions.go` (`AllowedTransitions`) · `vms_trn_repair_job_status_history` · `vms_mas_overhaul_document` |
| R3-2 | หน้ารายละเอียดแผนเดินทาง (S10 · ตัวนับ ตรวจแล้ว x/y) | รายการคันพร้อมสถานะ · เมนู … ตามสิทธิ์ | FE แบบ: `app/overhaul-utility-vehicle/.../vehicles/[vehicleId]/layout.tsx` |
| R3-3 | เริ่มงาน + Step 1 ตรวจสภาพก่อนบำรุงรักษา (MTD-237) | วันเวลาเริ่มงาน · แบบตรวจตามประเภทยานพาหนะ · ลงนามผู้ตรวจ/ผู้รับการตรวจ · ภาพก่อนเริ่มงาน | `vms_mas_repair_job_inspection_items` → แบบฟอร์ม pre/post · `@ui/signature-pad.tsx` · `fileService` + `StoragePort` · FE `step-indicator.tsx` |
| R3-4 | Step 2 สรุปงานก่อนปิดงาน | งานและอะไหล่ใช้จริง · คืน · ค่าใช้จ่ายของคัน (เบี้ยเลี้ยง ที่พัก เดินทาง ชั่วโมงทำงาน) · ลงนามส่งคืนรถ · ปิดงาน | ต้นแบบ `src/app/trips/job/close/` · `costSummary` ใน `lib/mock/jobs.ts` |
| R3-5 | บำรุงรักษาไม่ได้ (S10 · S25) | สาเหตุ + อะไหล่ส่งคืน · ใช้ระหว่าง Step ได้ | ต้นแบบ `CannotPopup` |
| R3-6 | ผลตรวจน้ำมันไฮดรอลิก (MTD-241 · S12) | บันทึกผล · ไม่ผ่าน → แจ้งผู้ดูแลยานพาหนะ | R0-7 · ต้นแบบ `oilFailNoti` |
| R3-7 | ผู้รับจ้างบันทึกงานและส่งตรวจงาน (MTD-240 · S23) | UI เดียวกับ R3-3/R3-4 ต่างที่ปุ่ม · ไม่มีค่าใช้จ่าย · แก้อะไหล่และภาพได้ · ส่งตรวจงาน | บล็อกโดย R0-4 (ผู้รับจ้าง login) |
| R3-8 | หน่วยงานตรวจรับงานผู้รับจ้าง | ค่าจ้าง ค่าเดินทาง บังคับ · ตรวจรับ / ส่งกลับแก้ไขพร้อมเหตุผล · เข้าต้นทุน | ต้นแบบ `VendorJob.tsx` · Figma V.14.1–V.14.7 |
| R3-9 | กบค. ปิดงานแทนผู้รับจ้าง (MTD-239) | ช่องค่าจ้าง ค่าเดินทาง | ไฟล์ 34 ข้อ 18 |
| R3-10 | ผู้ดูแลยานพาหนะรับทราบผลรายคัน (MTD-242 · S13) | รายการรอรับทราบเฉพาะคันที่ดูแล · รับทราบไม่มีหน้าต่างยืนยัน · แจ้งเตือนเมื่อปิดงาน | R0-7 · ต้นแบบ `src/app/acceptance/` |
| R3-11 | แผนปิดงานเอง | ทุกคันทุกไตรมาสเสร็จหรือบำรุงรักษาไม่ได้ และรับทราบครบ ⇒ CLOSED | ไฟล์ 34 ข้อ 20 |

## 8. รอบ 4: ต้นทุน และติดตาม (Feature 4 · 5)

| รหัส | การ์ด | ทำ | หยิบจาก |
|---|---|---|---|
| R4-1 | แท็บต้นทุนการบำรุงรักษา (MTD-243 · S18) | Metric 4 · สรุปรายไตรมาส · ต้นทุนรายคัน · งานจ้าง · บำรุงรักษาไม่ได้ · ส่งออก Excel | excelize `reportColumn[T]` · ต้นแบบ `lib/mock/cost.ts` · Figma Q.1–Q.7 |
| R4-2 | แดชบอร์ดอะไหล่และความคืบหน้า + ส่งออกรายงานอะไหล่ (MTD-244 MTD-245 · S4) | หน่วยงานเห็นของตัวเอง กบค. เห็นทุกหน่วยงาน · การ์ดตัวเลข กราฟ เรื่องที่ควรดู · ส่งออก | ต้นแบบ `src/app/parts/` · `components/dashboard/` (แบบ VMS+) |
| R4-3 | แดชบอร์ดรายคันและรายละเอียดยานพาหนะ (MTD-246 · S24) | กำหนดครั้งถัดไปตามเวลา · แท็บประวัติ 3 แท็บ · ป้าย Overhaul | `domain/shared/vehicle/port` (`FindVehicles` `FindVehicleProfile`) · ตารางเดิม `vms_mas_maintenance_schedule` `vms_trn_repair_record` (ดูว่าใช้ต่อหรือไม่) · งาน background แบบ `RunWarrantyAlertLoop` ถ้าจะเตือนใกล้ครบ |
| R4-4 | เครื่องมือกล (MTD-247 · MTD-267) | ตาม spec ไฟล์ 47 | **Decision ก่อน**: `vms_mas_vehicle_mechanic` เป็นของ vms-plus-main (อ่านอย่างเดียวใน maintain-d-be ตาม `er.md`) ⇒ ใครเขียน · ธง `has_equipment` บน `vms_ref_pea_official_vehicle_type` · คอลัมน์ที่ขาด |

## 9. Decision ที่ต้องตอบ (บล็อกงาน)

| รหัส | คำถาม | บล็อก |
|---|---|---|
| D-1 | ผู้ดูแลยานพาหนะมาจากข้อมูลไหน | R2-1 R3-10 |
| D-2 | กรย. เขตไหน หาจากผังหน่วยงานอย่างไร | R2-1 |
| D-3 | ผู้รับจ้างเข้าระบบอย่างไร | R3-7 R3-8 |
| D-4 | รูปแบบเลขที่แผน (MR) | R1-7 |
| D-5 | รายการอะไหล่มาจาก Smart Inventory API ไหน (หลัง R0-9) | R1-2 R3-4 |
| D-6 | แจ้งเตือนส่ง e-mail / push ด้วยไหม (ด.19) | R0-7 |
| D-7 | ตารางเครื่องมือกลใครเป็นเจ้าของ และคำถาม 8 ข้อในไฟล์ 47 | R4-4 |
| D-8 | ผู้ตรวจรับประเมินผู้รับจ้างไหม (ไฟล์ 34 ข้อ 21) | หลัง R3-8 |
| D-อื่น | คำถามค้างไฟล์ 45 (34 ข้อยังไม่เคาะ · 21 ข้อยังไม่มีจอ) แปลงเป็นการ์ด Decision ทีละข้อ ผูกกับ story | ตามข้อ |

## 10. ลำดับและการปล่อย

1. R0-1 R0-2 R0-3 (rebase · ผ่านกติกา) → merge R1 R2 เดิมเข้า main ใต้ flag `FEATURE_PM` / `NEXT_PUBLIC_FEATURE_PM`
2. R0-4 ถึง R0-10 คู่กับรอบ 1 ที่เหลือ
3. รอบ 1 → UAT → เปิด flag ให้ผู้ใช้กลุ่มแรก
4. รอบ 2 → รอบ 3 (ใหญ่สุด แบ่ง MR ตาม R3-1 … R3-11) → รอบ 4
5. ทุกรอบ: SQL pack ส่ง PEA ตามลำดับ (`scripts/sql/` + rollback) · ทดสอบ rollback บน dev ก่อน · merge เข้า main = deploy dev อัตโนมัติ

## 11. ทำงานร่วมกับคนอื่น

| เรื่อง | ใครตัดสิน | อยู่ที่ |
|---|---|---|
| ระบบต้องทำอะไร | เจ้าของงาน | การ์ด Decision → AC |
| หน้าตาและข้อความ | ทีมออกแบบ (ปลั๊กอินบำรุงรักษา รีโป Maintenance-Request-Form) | Figma |
| ต้นแบบให้ลอง | ทีมต้นแบบ | รีโป maintenance-utility-vehicle + ลิงก์พาดู |
| จอ Feature สำหรับ dev | liinux-cw (ปลั๊กอิน "I AM A lnw") | Figma Feature |
| โค้ดจริง | dev BE / FE | maintain-d-be · maintain-d-fe (MR ให้คนรีวิว ไม่ merge เอง · ไม่ push main ตรง) |
| ทดสอบรับงาน | QA + ผู้ใช้จริง | คอลัมน์ UAT |

- การเปลี่ยนแปลงทุกครั้งเริ่มที่การ์ด Decision → เจ้าของงานเคาะ → Figma + ต้นแบบ → เอกสาร + AC + การ์ด (comment ว่าแก้ข้อไหน) → แจ้งการ์ดที่อยู่ใน Doing ขึ้นไป
- คุยในแชตแล้วไม่ลงการ์ด = ยังไม่ตกลง
- AI agent: BE/FE ใช้ `AGENTS.md` ของรีโปนั้น · ต้นแบบใช้ skill `pre-dev` · ทุกการแก้การ์ดมี comment
