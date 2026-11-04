"use client";
/* ที่พักชั่วคราวของ scenario ที่ยังไม่ทำ (เมนูจาก S1 ที่ลิงก์ไป S19 S20 S21 ฯลฯ) — Empty state/Data empty ของไลบรารี
   S21 (อะไหล่ของรถแต่ละคัน) ยังไม่ทำ ⇒ มีปุ่มของต้นแบบ "ใส่อะไหล่ตัวอย่าง" (CAR_PICK ของ screens.js) ให้รถในฟอร์มสร้างแผน เพื่อให้เห็นจออะไหล่ในไตรมาสของ S1 (ดู figma-spec/COMPOSED.md) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { CAR_PICK } from "@/lib/mock/data";
import { inQuarter } from "@/lib/mock/plan";
import { setMock, useMock } from "@/lib/mock/store";
import { SCENARIOS } from "@/lib/scenarios";

function Soon() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = sp.get("s") ?? "";
  const draft = useMock().draft;
  const car = sp.get("car"), q = sp.get("q");
  const targets = draft ? (car != null ? [Number(car)] : q ? inQuarter(draft, Number(q)) : []) : [];
  const sample = () => {
    setMock((st) => st.draft ? { ...st, draft: { ...st.draft, picks: { ...st.draft.picks, ...Object.fromEntries(targets.map((i) => [i, CAR_PICK])) } } } : st);
    router.back();
  };
  const s = SCENARIOS.find((x) => x.id === id);
  return (
    <>
      <PageHeader Title="เร็วๆ นี้" crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "เร็วๆ นี้" }]} onBack={() => router.back()} />
      <EmptyStateDataEmpty Text="เร็วๆ นี้" SupportingText={s ? s.id + " · " + s.name + " ยังไม่ได้ทำในต้นแบบรอบนี้" : "หน้านี้ยังไม่ได้ทำในต้นแบบรอบนี้"}
        Actions={<>
          <SecondaryButton Text="ย้อนกลับ" onClick={() => router.back()} />
          {id === "S21" && targets.length > 0 && <PrimaryButton Text="ใส่อะไหล่ตัวอย่าง (ข้อมูลจำลอง)" onClick={sample} />}
        </>} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Soon /></Suspense></AppFrame>;
}
