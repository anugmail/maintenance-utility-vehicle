"use client";
import type { PillColor } from "@/components/vms/PillOutline";
import { putCloseout } from "./closeout";
import { JOB_TEXT, PEOPLE, SEED_TRIPS, WORK, applyJobs, carOf, closedSample, getJob, jobKey, jobsOf, newJob, workItems, type Job, type JobTrip, type TripCar } from "./jobs";
import { setMock, type MockState } from "./store";
import { DEFAULT_NOTIS, TRIP_OTHER, ackNoti, qEditOf, quarterCars } from "./trips";

type Pill = readonly [label: string, tone: PillColor];

export const ACCEPT_STATUS = { wait: ["รอรับทราบ", "Warning"], ok: ["รับทราบแล้ว", "Success"] } as const satisfies Record<string, Pill>;
export const ACK_LIST = "ผลการบำรุงรักษารอรับทราบ";
export const ACK_AT = "06/11/2569 10:05 น.";

export const ACCEPTANCE_CARS = [
  { carId: "82-6789", date: "04/11/2569", by: "นายวิชัย ทองดี (กบผ.)", cannot: false },
  { carId: "82-1145", date: "05/11/2569", by: "นางสาวกนกวรรณ ใจมั่น (กบผ.)", cannot: false },
  { carId: "80-9981", date: "05/11/2569", by: PEOPLE.kbk, cannot: true },
];

export interface AccRow { trip: JobTrip; car: TripCar; job: Job; date: string; by: string; mr: string; cannot: boolean; accepted: boolean }
function rowOf(trip: JobTrip, car: TripCar, job: Job): AccRow | null {
  if (job.status !== "done" && job.status !== "cannot") return null;
  const cannot = job.status === "cannot" && !!job.cannot;
  return { trip, car, job, mr: trip.planMr, cannot, accepted: !!job.acceptedAt,
    date: (cannot ? job.cannot!.at : job.closedAt ?? "").slice(0, 10), by: cannot ? job.cannot!.by : job.recordedBy ?? "-" };
}
export function accRows(m: MockState): AccRow[] {
  const s = jobsOf(m);
  return Object.values(s.trips).flatMap((t) => t.carIds.map((id) => { const c = carOf(id); return c ? rowOf(t, c, getJob(s, t.id, id)) : null; }))
    .filter((r): r is AccRow => !!r);
}
export const accRecord = (m: MockState, tripId: string | null, carId: string | null) => accRows(m).find((r) => r.trip.id === tripId && r.car.id === carId);
export const accCarHref = (r: { trip: Pick<JobTrip, "id">; car: Pick<TripCar, "id"> }) => "/acceptance/car/?trip=" + r.trip.id + "&car=" + r.car.id;
export const workRows = (j: Job) => workItems(j);
export const splitBy = (by: string): [string, string | undefined] => { const m = /^(.*) \((.*)\)$/.exec(by); return m ? [m[1], m[2]] : [by, undefined]; };

export function planAcked(m: MockState, planId: string) {
  const js = jobsOf(m), trips = Object.values(js.trips).filter((t) => t.planId === planId);
  const cars = [1, 2, 3, 4].flatMap((q) => quarterCars(m, planId, q).map((c) => ({ q, id: c.id })));
  const finished = (q: number, id: string) => trips.some((t) => {
    if (t.q !== q || !t.carIds.includes(id)) return false;
    const j = getJob(js, t.id, id);
    return (j.status === "done" || j.status === "cannot") && !!j.acceptedAt;
  });
  return cars.length > 0 && cars.every(({ q, id }) => finished(q, id));
}

export function acceptLastCarSample() {
  acceptSample(false);
  const keep = ACCEPTANCE_CARS.map((c) => c.carId), id = "Z7000001", tq = SEED_TRIPS.T1.q;
  applyJobs((s) => ({ ...s, jobs: Object.fromEntries(Object.entries(s.jobs).map(([k, j]) => [k, k === jobKey("T1", keep[2]) ? j : { ...j, acceptedAt: ACK_AT }])) }));
  setMock((s) => ({ ...s, qcars: { ...s.qcars, ...Object.fromEntries([1, 2, 3, 4].map((q) => {
    const cur = quarterCars(s, id, q).map((c) => c.id);
    return [id + "-" + q, { ...qEditOf(s, id, q), added: q === tq ? keep : [], removed: cur.filter((x) => q !== tq || !keep.includes(x)) }];
  })) } }));
}

export function acceptCar(r: AccRow) {
  applyJobs((s) => ({ ...s, jobs: { ...s.jobs, [jobKey(r.trip.id, r.car.id)]: { ...getJob(s, r.trip.id, r.car.id), acceptedAt: ACK_AT } } }));
  const id = r.trip.planId;
  let sent = false;
  setMock((s) => {
    const p = s.plans.find((x) => x.mr === "MR" + id);
    if (!p || p.status !== "active" || !planAcked(s, id)) return s;
    sent = true;
    return { ...s, plans: s.plans.map((x) => (x === p ? { ...x, status: "closed" as const } : x)) };
  });
  if (sent) putCloseout(id, { closedAt: ACK_AT.slice(0, 10) });
}

export function acceptSample(acked: boolean) {
  const T1: JobTrip = { ...SEED_TRIPS.T1, carIds: ACCEPTANCE_CARS.map((c) => c.carId) };
  applyJobs(() => ({
    trips: { T1 },
    jobs: Object.fromEntries(ACCEPTANCE_CARS.map((r) => {
      const j: Job = r.cannot
        ? { ...newJob("T1", r.carId), status: "cannot", cannot: { reason: JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: r.by, at: r.date + " 09:20 น.", whileDoing: false } }
        : { ...closedSample(T1, r.carId), closedAt: r.date + " 11:15 น.", recordedBy: r.by };
      return [jobKey("T1", r.carId), acked ? { ...j, acceptedAt: ACK_AT } : j];
    })),
  }), [{ ...TRIP_OTHER }]);
  const first = carOf(ACCEPTANCE_CARS[0].carId)!;
  setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === "MRZ7000001" ? { ...p, status: "active" as const } : p)), notis: acked ? DEFAULT_NOTIS() : [ackNoti(T1, first), ...DEFAULT_NOTIS()] }));
  putCloseout("Z7000001", { closedAt: undefined });
}
export const ACCEPT_SAMPLES = {
  S13: { role: "ผู้ดูแลยานพาหนะ" as const, apply: () => acceptSample(false) },
  S13_last: { role: "ผู้ดูแลยานพาหนะ" as const, apply: acceptLastCarSample },
};
