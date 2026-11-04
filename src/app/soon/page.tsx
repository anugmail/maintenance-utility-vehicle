"use client";
/* ที่พักชั่วคราวของ scenario ที่ยังไม่ทำ (เมนูจาก S1 ที่ลิงก์ไป S19 S20 S21 ฯลฯ) — Empty state/Data empty ของไลบรารี */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SCENARIOS } from "@/lib/scenarios";

function Soon() {
  const router = useRouter();
  const id = useSearchParams().get("s") ?? "";
  const s = SCENARIOS.find((x) => x.id === id);
  return (
    <>
      <PageHeader Title="เร็วๆ นี้" crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "เร็วๆ นี้" }]} onBack={() => router.back()} />
      <EmptyStateDataEmpty Text="เร็วๆ นี้" SupportingText={s ? s.id + " · " + s.name + " ยังไม่ได้ทำในต้นแบบรอบนี้" : "หน้านี้ยังไม่ได้ทำในต้นแบบรอบนี้"}
        Actions={<SecondaryButton Text="ย้อนกลับ" onClick={() => router.back()} />} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Soon /></Suspense></AppFrame>;
}
