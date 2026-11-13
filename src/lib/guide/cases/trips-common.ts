"use client";
/* ของใช้ร่วมของเรื่องชุดแผนเดินทางและงานรายคัน (S6 S9 S7 S8 S10 S25) ในโหมดพาดูทีละเรื่อง
   แผนตัวอย่าง MRZ7000001 "บำรุงรักษารถกระเช้า ภาค 1 และภาค 2 ปีงบประมาณ 2570" (สถานะดำเนินการ · ไตรมาส 1 มีรถ 10 คัน TRIP_CARS)
   ข้อมูลตั้งต้นใช้ตัวช่วยเดิม (SEEDS ของ seedB.ts · TRIP_1 TRIP_V TRIP_OTHER · applySample ของ jobs.ts) ⇒ ได้ค่าเดิมทุกครั้ง ไม่มีวันที่ปัจจุบัน */
import { applySample, JOB_TEXT, JOB_TIMES, newJob, PEOPLE, WORK, type Job } from "@/lib/mock/jobs";
import { setMock } from "@/lib/mock/store";
import { APPROVED_AT, DEFAULT_TRIPS, TRIP_1, TRIP_OTHER, type Trip } from "@/lib/mock/trips";

export const PLAN_ID = "Z7000001";
export const PLAN_MR = "MRZ7000001";
export const PLAN_NAME = "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 และภาค 2 ปีงบประมาณ 2570";

/* ---------- หน้า ---------- */
export const LIST = "/";
export const PLAN_DETAIL = "/detail/?id=" + PLAN_ID;
export const quarterAt = (q: number) => "/quarter/trips/?id=" + PLAN_ID + "&q=" + q;
export const QTR = quarterAt(1);
export const NEW_TRIP = "/quarter/trips/new/?id=" + PLAN_ID + "&q=1";
export const tripDetailAt = (trip: string) => "/trips/detail/?trip=" + trip;
export const jobAt = (trip: string, car: string, sub = "") => "/trips/job/" + sub + "?trip=" + trip + "&car=" + car;

/* ---------- ข้อมูลตั้งต้น ---------- */
export const approved = (t: Trip): Trip => ({ ...t, status: "approved", approvedAt: APPROVED_AT });
/** ไตรมาส 1 ยังไม่มีแผนเดินทาง (SEEDS.S6) */
export const seedNoTrips = () => setMock((s) => ({ ...s, trips: DEFAULT_TRIPS(), jobs: undefined }));
/** ตั้งแผนเดินทางทั้งชุด (ล้างงานรายคันเดิม) */
export const seedTrips = (list: Trip[]) => () => setMock((s) => ({ ...s, trips: list.map((t) => ({ ...t })), jobs: undefined }));
/** แผนเดินทาง T1 อนุมัติแล้ว + งานรายคันตามชุดตัวอย่างของ S10 */
export const seedJobs = (name: Parameters<typeof applySample>[0]) => () => { seedNoTrips(); applySample(name); };
/** รถ 80-9981 ลำปาง บำรุงรักษาไม่ได้ในไตรมาส q (2 ถึง 4) ของแผนตัวอย่าง — ย้ายรถเข้าไตรมาสนั้น + แผนเดินทางที่อนุมัติแล้วใบเดียว + งานบำรุงรักษาไม่ได้ */
export const MOVE_CAR = "80-9981";
export const MOVE_PLATE = "80-9981 ลำปาง";
const MOVE_DATES: Record<number, [string, string]> = { 2: ["12/05/2570", "14/05/2570"], 3: ["12/08/2570", "14/08/2570"], 4: ["07/10/2570", "09/10/2570"] };
export const seedCannotIn = (q: number) => () => {
  const id = "T" + (q + 6);
  /* 13 พ.ย. 2569 วันเดินทางอยู่ในเดือนของไตรมาสปฏิทิน (เจ้าของงาน 6 พ.ย. 2569 "ไตรเป็นตามปีปฎิทิน") · ไตรมาส 3 4 วันเดียวกับ MOVE_T3 MOVE_T4 ของ screens.js · เดิมใช้วันของ TRIP_1 (พ.ย. 2569) */
  const [d1, d2] = MOVE_DATES[q] ?? [TRIP_1.d1, TRIP_1.d2];
  const t: Trip = { ...approved(TRIP_1), id, quarter: q, name: "ตรวจยานพาหนะ ลำปาง ไตรมาส " + q, carIds: [MOVE_CAR], locs: {}, phones: {}, d1, d2, works: {} };
  const job: Job = { ...newJob(id, MOVE_CAR), status: "cannot", cannot: { reason: JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: PEOPLE.kbk, at: JOB_TIMES.self.start, whileDoing: false } };
  setMock((s) => ({
    ...s, trips: [{ ...TRIP_OTHER }, t], jobs: { jobs: { [id + ":" + MOVE_CAR]: job } },
    qcars: { [PLAN_ID + "-1"]: { added: [], removed: [MOVE_CAR], phones: {}, locs: {} }, [PLAN_ID + "-" + q]: { added: [MOVE_CAR], removed: [], phones: {}, locs: {} } },
  }));
};

/* ---------- ขั้นที่ใช้บ่อย ---------- */
/** รายการแผน → ดูรายละเอียดแผน MRZ7000001 */
export const openPlan = (what = "") => ({
  at: LIST,
  text: "ที่รายการแผน กดปุ่มสามจุดท้ายแถวของแผน " + PLAN_MR + " แล้วเลือกดูรายละเอียด" + what,
  mobile: "ที่การ์ดของแผน " + PLAN_MR + " กดไอคอนดูรายละเอียด" + what,
});
/** หน้ารายละเอียดแผนเดินทาง → เปิดหน้างานรายคันของรถ */
export const openCar = (trip: string, plate: string, extra = "") => ({
  at: tripDetailAt(trip),
  text: extra + "กดแถวของยานพาหนะ " + plate + " เพื่อเปิดหน้างานรายคัน",
  mobile: extra + "กดไอคอนดูรายละเอียดบนการ์ดของยานพาหนะ " + plate + " เพื่อเปิดหน้างานรายคัน",
});
