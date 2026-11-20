"use client";
import { useState } from "react";
import { FormModal } from "@/components/patterns/FormModal";
import { CardFormRow } from "@/components/vms/CardFormRow";
import { DatePicker } from "@/components/vms/DatePicker";
import { TextInput } from "@/components/vms/TextInput";
import { TH_PICKER } from "@/lib/thaiDate";
import { tripCtrl, tripLoc, tripPhone, type Trip, type TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";

export type CarOverrides = Pick<Trip, "locs" | "phones" | "names">;
export interface WorkEdit { d1: string; d2: string; value: [string, string] }

export const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
export const fromThai = (s: string) => { const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };

export function applyCarEdit(t: CarOverrides, c: TripCar, name: string, phone: string, loc: string): CarOverrides {
  const names = { ...(t.names ?? {}) }, phones = { ...t.phones }, locs = { ...t.locs };
  if (name.trim() && name.trim() !== c.ctrl) names[c.id] = name.trim(); else delete names[c.id];
  if (phone.trim() && phone.trim() !== c.phone) phones[c.id] = phone.trim(); else delete phones[c.id];
  if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
  return { names, phones, locs };
}
export const workEdited = (w: WorkEdit, v: [string, string]) => (v[0] === w.d1 && v[1] === w.d2 ? null : v);

export interface TripCarEditProps { car: TripCar | null; trip: CarOverrides; work?: WorkEdit; onSave: (next: CarOverrides, work?: [string, string] | null) => void; onCancel: () => void }
export function TripCarEditModal(p: TripCarEditProps) {
  if (!p.car) return null;
  return <Inner key={p.car.id} {...p} car={p.car} />;
}

function Inner({ car, trip, work, onSave, onCancel }: TripCarEditProps & { car: TripCar }) {
  const mob = useBreakpoint() === "Mobile";
  const [name, setName] = useState(() => { const n = tripCtrl(trip, car); return n === "-" ? "" : n; });
  const [phone, setPhone] = useState(tripPhone(trip, car));
  const [loc, setLoc] = useState(tripLoc(trip, car));
  const [w, setW] = useState<[string, string] | null>(work ? work.value : null);
  const [cal, setCal] = useState(false);
  if (!work) {
    return (
      <FormModal open title={"แก้ไขผู้ดูแลยานพาหนะและสถานที่ · " + car.plate}
        fields={[{ label: "เบอร์ติดต่อ", value: phone }, { label: "ผู้ดูแลยานพาหนะ", value: name }, { label: "สถานที่บำรุงรักษา", value: loc }]}
        onField={(i, v) => (i === 0 ? setPhone(v) : i === 1 ? setName(v) : setLoc(v))}
        onCancel={onCancel} onOk={() => onSave(applyCarEdit(trip, car, name, phone, loc))} />
    );
  }
  const lo = fromThai(work.d1), hi = fromThai(work.d2), has = !!lo && !!hi && !!w && !!w[0];
  const nameIn = <TextInput LabelText="ผู้ดูแลยานพาหนะ" Text={name} onChange={setName} />;
  const phoneIn = <TextInput LabelText="เบอร์ติดต่อ" Text={phone} onChange={setPhone} />;
  const locIn = <TextInput LabelText="สถานที่บำรุงรักษา" Text={loc} onChange={setLoc} />;
  const dateIn = (
    <TextInput LabelText="วันดำเนินการ" LeadingIconSwap="calendar_month-24-300-round" Text={has ? w![0] + " - " + w![1] : ""} Placeholder="วว/ดด/ปปปป - วว/ดด/ปปปป" readOnly
      State={!lo || !hi ? "Disabled" : cal ? "Focused" : has ? "Filled" : "Default"} onClick={() => lo && hi && setCal(true)} aria-haspopup="dialog" aria-expanded={cal} />
  );
  const picker = cal && lo && hi && (
    <div className="flex">
      <DatePicker Type="Single" range {...TH_PICKER} Today={false} min={lo} max={hi} month={lo}
        value={{ start: fromThai(w?.[0] ?? "") ?? lo, end: fromThai(w?.[1] ?? "") ?? hi }} onCancel={() => setCal(false)}
        onApply={(r) => { if (r.start) setW([toThai(r.start), toThai(r.end ?? r.start)]); setCal(false); }} />
    </div>
  );
  const save = () => onSave(applyCarEdit(trip, car, name, phone, loc), w && w[0] ? workEdited(work, w) : null);
  return (
    <FormModal open title={"แก้ไขยานพาหนะในแผนเดินทาง · " + car.plate} onCancel={onCancel} onOk={save}>
      {mob
        ? <div className="flex flex-col gap-4">{phoneIn}{nameIn}{locIn}{dateIn}{picker}</div>
        : <>
          <CardFormRow Input1={phoneIn} Input2={nameIn} />
          <CardFormRow Input1={locIn} />
          <CardFormRow Input1={dateIn} />
          {picker}
        </>}
    </FormModal>
  );
}
