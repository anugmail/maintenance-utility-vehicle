"use client";
/* popup แก้ไขเบอร์ติดต่อและสถานที่ของรถในแผนเดินทาง — tripCarEdit() ใน screens.js (S6 E.5 · S9 H.4 · ใช้ซ้ำใน S10 ของ batch C)
   = patterns/FormModal (Modal Type=Form · มือถือ Bottom sheet) ช่อง Text input "เบอร์ติดต่อ" + "สถานที่บำรุงรักษา" ค่าตั้งต้น = ค่าปัจจุบันของแถว · ปุ่ม ยกเลิก / บันทึก
   บันทึก: ค่าเท่าค่าตั้งต้น (เบอร์เจ้าของรถ · "สำนักงาน <หน่วยงาน>") = ไม่นับว่าแก้ */
import { useState } from "react";
import { FormModal } from "@/components/patterns/FormModal";
import { tripLoc, tripPhone, type Trip, type TripCar } from "@/lib/mock/trips";

export type CarOverrides = Pick<Trip, "locs" | "phones">;

export function applyCarEdit(t: CarOverrides, c: TripCar, phone: string, loc: string): CarOverrides {
  const phones = { ...t.phones }, locs = { ...t.locs };
  if (phone.trim() && phone.trim() !== c.phone) phones[c.id] = phone.trim(); else delete phones[c.id];
  if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
  return { phones, locs };
}

export function TripCarEditModal({ car, trip, onSave, onCancel }: { car: TripCar | null; trip: CarOverrides; onSave: (next: CarOverrides) => void; onCancel: () => void }) {
  if (!car) return null;
  return <Inner key={car.id} car={car} trip={trip} onSave={onSave} onCancel={onCancel} />;
}

function Inner({ car, trip, onSave, onCancel }: { car: TripCar; trip: CarOverrides; onSave: (next: CarOverrides) => void; onCancel: () => void }) {
  const [phone, setPhone] = useState(tripPhone(trip, car));
  const [loc, setLoc] = useState(tripLoc(trip, car));
  return (
    <FormModal open title={"แก้ไขเบอร์ติดต่อและสถานที่ · " + car.plate}
      fields={[{ label: "เบอร์ติดต่อ", value: phone }, { label: "สถานที่บำรุงรักษา", value: loc }]}
      onField={(i, v) => (i === 0 ? setPhone(v) : setLoc(v))}
      onCancel={onCancel} onOk={() => onSave(applyCarEdit(trip, car, phone, loc))} />
  );
}
