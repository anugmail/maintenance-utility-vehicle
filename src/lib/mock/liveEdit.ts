import { CAND, type Plan } from "./data";
import { jobsOf } from "./jobs";
import { quarterFinished } from "./moves";
import { allocScope, inQuarter, type Draft } from "./plan";
import { draftFromPlan, planId } from "./planFlow";
import { setMock, type MockState } from "./store";
import { candId, tripsOf } from "./trips";

export const isLive = (p?: Plan) => p?.status === "active";

export interface LiveLocks { finished: Set<number>; closed: Set<number>; locked: (i: number, q?: number) => boolean }
export function liveLocks(m: MockState, p: Plan): LiveLocks {
  const id = planId(p);
  const finished = new Set([1, 2, 3, 4].filter((q) => quarterFinished(m, id, q)));
  const js = jobsOf(m), mine = new Set(Object.values(js.trips).filter((t) => t.planId === id).map((t) => t.id));
  const closedIds = new Set(Object.values(js.jobs).filter((j) => mine.has(j.tripId) && (j.status === "done" || j.status === "cannot")).map((j) => j.carId));
  const closed = new Set(CAND.map((c, i) => [i, closedIds.has(candId(c.plate))] as const).filter(([, x]) => x).map(([i]) => i));
  const saved = draftFromPlan(p, m).alloc;
  return { finished, closed, locked: (i, q = saved[i]) => closed.has(i) || (q != null && finished.has(q)) };
}

export function saveLive(p: Plan, d: Draft) {
  const id = planId(p);
  setMock((s) => {
    const qOf = (cid: string) => { const i = CAND.findIndex((c) => candId(c.plate) === cid); return i < 0 ? undefined : d.alloc[i]; };
    const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
    const plans = s.plans.map((x) => (x.mr !== p.mr ? x : {
      ...x, name: d.name.trim(), ...allocScope(d.alloc), cars: Object.keys(d.alloc).length, perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "),
      regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual, oils: d.oils, oilSpec: d.oilSpec, draw: d.draw,
    }));
    const qcars = Object.fromEntries(Object.entries(s.qcars ?? {}).map(([k, e]) => [k, k.startsWith(id + "-") ? { ...e, added: [], removed: [] } : e]));
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
