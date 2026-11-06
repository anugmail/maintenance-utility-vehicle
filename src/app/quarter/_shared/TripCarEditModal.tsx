"use client";
/* popup แก้ไขผู้ดูแลยานพาหนะและสถานที่ของรถในแผนเดินทาง — tripCarEdit() ใน screens.js (S6 E.5 · S9 H.4 · ใช้ซ้ำใน S10 ของ batch C)
   = patterns/FormModal (Modal Type=Form · มือถือ Bottom sheet) ช่อง Text input "ผู้ดูแลยานพาหนะ" + "เบอร์ติดต่อ" + "สถานที่บำรุงรักษา" ค่าตั้งต้น = ค่าปัจจุบันของแถว · ปุ่ม ยกเลิก / บันทึก
   6 พ.ย. 2569 เจ้าของงาน "ตรงป๊อบอัพ เลยต้องมีให้แก้ชื่อโดย prefill ข้อมูลมาให้" ⇒ ช่องผู้ดูแลยานพาหนะ (ค่าเริ่มต้นชื่อผู้ควบคุมรถ) · หัว "แก้ไขผู้ดูแลยานพาหนะและสถานที่ · {ทะเบียน}"
   บันทึก: ค่าเท่าค่าตั้งต้น (ผู้ควบคุมรถ · เบอร์ผู้ควบคุมรถ · "สำนักงาน <หน่วยงาน>") = ไม่นับว่าแก้ */
import { useState } from "react";
import { FormModal } from "@/components/patterns/FormModal";
import { tripCtrl, tripLoc, tripPhone, type Trip, type TripCar } from "@/lib/mock/trips";

export type CarOverrides = Pick<Trip, "locs" | "phones" | "names">;

export function applyCarEdit(t: CarOverrides, c: TripCar, name: string, phone: string, loc: string): CarOverrides {
  const names = { ...(t.names ?? {}) }, phones = { ...t.phones }, locs = { ...t.locs };
  if (name.trim() && name.trim() !== c.ctrl) names[c.id] = name.trim(); else delete names[c.id];
  if (phone.trim() && phone.trim() !== c.phone) phones[c.id] = phone.trim(); else delete phones[c.id];
  if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
  return { names, phones, locs };
}

export function TripCarEditModal({ car, trip, onSave, onCancel }: { car: TripCar | null; trip: CarOverrides; onSave: (next: CarOverrides) => void; onCancel: () => void }) {
  if (!car) return null;
  return <Inner key={car.id} car={car} trip={trip} onSave={onSave} onCancel={onCancel} />;
}

function Inner({ car, trip, onSave, onCancel }: { car: TripCar; trip: CarOverrides; onSave: (next: CarOverrides) => void; onCancel: () => void }) {
  const [name, setName] = useState(() => { const n = tripCtrl(trip, car); return n === "-" ? "" : n; });
  const [phone, setPhone] = useState(tripPhone(trip, car));
  const [loc, setLoc] = useState(tripLoc(trip, car));
  return (
    <FormModal open title={"แก้ไขผู้ดูแลยานพาหนะและสถานที่ · " + car.plate}
      fields={[{ label: "ผู้ดูแลยานพาหนะ", value: name }, { label: "เบอร์ติดต่อ", value: phone }, { label: "สถานที่บำรุงรักษา", value: loc }]}
      onField={(i, v) => (i === 0 ? setName(v) : i === 1 ? setPhone(v) : setLoc(v))}
      onCancel={onCancel} onOk={() => onSave(applyCarEdit(trip, car, name, phone, loc))} />
  );
}
