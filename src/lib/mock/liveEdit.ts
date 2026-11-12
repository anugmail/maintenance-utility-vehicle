/* แก้ไขแผนที่ดำเนินการแล้ว (S19 · 11 พ.ย. 2569 เจ้าของงาน "แผนที่ดำเนินการแล้ว ยังสามารถแก้ไขได้" · BACKLOG ข้อ 64)
   เคาะ: แก้ได้เฉพาะไตรมาสที่ยังไม่เสร็จ ("เฉพาะไตรมาสที่ยังไม่เสร็จ" · เสร็จ = quarterFinished ของ moves.ts กติกาเดียวกับปุ่มเพิ่มยานพาหนะของหน้าไตรมาส)
     · ไม่ต้องส่งอนุมัติใหม่ ("ไม่ต้อง บันทึกแล้วมีผลเลย") แผนคงสถานะดำเนินการ
   ล็อก (แก้ไม่ได้ · ติ๊กไม่ได้ · ย้าย/เอาออกไม่ได้ · กำหนดอะไหล่ไม่ได้) = ยานพาหนะในไตรมาสที่เสร็จแล้ว + ยานพาหนะที่ปิดงานแล้ว (เสร็จสิ้น · บำรุงรักษาไม่ได้) ในไตรมาสที่ยังไม่เสร็จ
   บันทึก = เขียนยานพาหนะ อะไหล่ ลงแผนเลย · หน้าไตรมาสอ่านจาก alloc ของแผน (คันที่เพิ่ม/เอาออกใน S6 รวมอยู่ในฟอร์มแล้ว ⇒ ล้างรายการเพิ่ม/เอาออกของไตรมาส)
   · ยานพาหนะที่ย้ายไตรมาสหรือเอาออกจากแผน = ออกจากแผนเดินทางของไตรมาสเดิมที่ยังไม่ปิดงาน (ไม่มีงานที่ปิดแล้ว เพราะคันที่ปิดงานล็อกไว้) */
import { CAND, type Plan } from "./data";
import { jobsOf } from "./jobs";
import { quarterFinished } from "./moves";
import { allocScope, inQuarter, type Draft } from "./plan";
import { draftFromPlan, planId } from "./planFlow";
import { setMock, type MockState } from "./store";
import { candId, tripsOf } from "./trips";

/** แผนที่แก้ไขแบบมีผลทันที (ดำเนินการ) — อนุมัติแล้วแต่ยังไม่เริ่ม ใช้ S19 เดิม (กลับเป็นรออนุมัติ · ALERT_APPROVED ของ Figma) */
export const isLive = (p?: Plan) => p?.status === "active";

export interface LiveLocks { finished: Set<number>; closed: Set<number>; locked: (i: number, q?: number) => boolean }
export function liveLocks(m: MockState, p: Plan): LiveLocks {
  const id = planId(p);
  const finished = new Set([1, 2, 3, 4].filter((q) => quarterFinished(m, id, q)));
  const js = jobsOf(m), mine = new Set(Object.values(js.trips).filter((t) => t.planId === id).map((t) => t.id));
  const closedIds = new Set(Object.values(js.jobs).filter((j) => mine.has(j.tripId) && (j.status === "done" || j.status === "cannot")).map((j) => j.carId));
  const closed = new Set(CAND.map((c, i) => [i, closedIds.has(candId(c.plate))] as const).filter(([, x]) => x).map(([i]) => i));
  /* ไตรมาสของคันตามแผนที่บันทึกไว้ (ไม่ใช่ค่าที่ย้ายในฟอร์ม · แผนตัวอย่าง = ยานพาหนะของหน้าไตรมาส) */
  const saved = draftFromPlan(p, m).alloc;
  return { finished, closed, locked: (i, q = saved[i]) => closed.has(i) || (q != null && finished.has(q)) };
}

/** บันทึกแผนที่ดำเนินการ: สถานะคงเดิม · ไม่ส่งอนุมัติ */
export function saveLive(p: Plan, d: Draft) {
  const id = planId(p);
  setMock((s) => {
    const qOf = (cid: string) => { const i = CAND.findIndex((c) => candId(c.plate) === cid); return i < 0 ? undefined : d.alloc[i]; };
    const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
    const plans = s.plans.map((x) => (x.mr !== p.mr ? x : {
      ...x, name: d.name.trim(), ...allocScope(d.alloc), cars: Object.keys(d.alloc).length, perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "),
      regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual, oils: d.oils, oilSpec: d.oilSpec, draw: d.draw,
    }));
    /* คันที่เพิ่ม/เอาออกในหน้าไตรมาส อยู่ใน alloc แล้ว ⇒ ล้าง (คงเบอร์ ผู้ดูแล สถานที่ที่แก้ไว้) */
    const qcars = Object.fromEntries(Object.entries(s.qcars ?? {}).map(([k, e]) => [k, k.startsWith(id + "-") ? { ...e, added: [], removed: [] } : e]));
    /* แผนเดินทางของแผนนี้: คันที่ไม่อยู่ในไตรมาสของใบแล้ว = ออกจากใบ */
    const trips = tripsOf(s).map((t) => {
      if (t.planId !== id) return t;
      const keep = t.carIds.filter((c) => qOf(c) === t.quarter);
      if (keep.length === t.carIds.length) return t;
      const pick = <T,>(o?: Record<string, T>) => (o ? Object.fromEntries(Object.entries(o).filter(([c]) => keep.includes(c))) : o);
      return { ...t, carIds: keep, locs: pick(t.locs) ?? {}, phones: pick(t.phones) ?? {}, names: pick(t.names), works: pick(t.works) };
    });
    return { ...s, edit: null, plans, qcars, trips };
  });
}
