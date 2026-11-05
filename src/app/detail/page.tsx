"use client";
/* S19 S20 S22 · หน้ารายละเอียดแผน ฝั่ง กบค. (/detail/?id=Z7000004) — planDetail() ใน screens.js
   หลังส่งอนุมัติ 3 สถานะ (รีวิวทีมออกแบบ 5 พ.ย. 2569 · planDetail o.readonly · userflow S1 "หน้า รายละเอียดแผน หลังส่งอนุมัติ"):
   Page header: "เลขที่ MR …" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › ชื่อแผน · Badge outline = สถานะแผน
     ปุ่มหัว (เฉพาะ กบค.): รออนุมัติ = ดูอย่างเดียว ไม่มีปุ่ม (ขัดกับ S19 S20 — Q53 · ลบ/แก้ไขแผนรออนุมัติยังทำได้จากเมนู "…" ของรายการ)
       · ส่งกลับแก้ไข = Secondary danger button "ลบแผน" + Secondary button "แก้ไข" (→ S19) · อนุมัติแล้ว = "แก้ไข" อย่างเดียว · ดำเนินการแล้วขึ้นไป = ไม่มีปุ่ม (ซ่อน ไม่ disable)
     มือถือ: ปุ่มอยู่ใต้หัวข้อ แบ่งเท่ากัน
   เนื้อหา ช่องไฟ 32: (ส่งกลับแก้ไข) Alert Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล → PlanBody (อนุมัติแล้ว/ดำเนินการ: แถบสถานะคลังของไตรมาสที่เปิด S22 U.8)
   ลบแผน → ยืนยันการลบแผน (S20 S.5) → กลับหน้ารายการ + toast "ลบแผนบำรุงรักษาสำเร็จ" · แก้ไข → /edit/ (S19)
   ทางไปขั้นถัดไป เฉพาะ กบค. · แผนอนุมัติแล้ว/ดำเนินการ (planDetailQ ใน screens.js · S6 ทางเข้า 5 พ.ย. 2569):
     Section label "รถในแผน" Primary action (Tertiary brand button) "ไปหน้าไตรมาส n" ตามแท็บที่เปิด (Q54) → หน้า "ไตรมาส n" (/quarter/trips/)
     Secondary action (Tertiary button) "ความคืบหน้าอะไหล่" (S4) เฉพาะแท็บไตรมาสที่กำลังทำ — ทางเข้าเดิม 4 พ.ย. (จอ Figma รอบ 5 พ.ย. ไม่มีทางเข้า S4 · BACKLOG ค.)
     ปุ่มหัว: ดำเนินการ + หน่วยงานยอมรับผลทั้งแผนแล้ว (S14 · closeout.accepted · เงื่อนไข S15) → "ส่งประวัติ" (S15) · ประวัติผ่านแล้ว/ปิดงานแล้ว → "รายงานผลการบำรุงรักษา" (S17) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SecondaryDangerButton } from "@/components/vms/SecondaryDangerButton";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { closeoutOf } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { DELETE_CONFIRM, badgeOf, deletePlan, findPlan, planId, startEdit, useHydrated } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "./PlanBody";

function Detail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const hydrated = useHydrated();
  const kbk = useRole() === "กบค.";
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const [del, setDel] = useState(false);
  const gone = hydrated && !plan;
  useEffect(() => { if (gone) router.replace("/"); }, [gone, router]);   // แผนไม่มีแล้ว (ลบ) → หน้ารายการ
  if (!hydrated || !plan) return null;

  const st = plan.status;
  const canDelete = kbk && st === "returned";
  const canEdit = kbk && (st === "returned" || st === "approved");
  const size = mob ? "lg" : "md";
  const id = planId(plan);
  const nowQ = Number(plan.nowQ.replace(/\D/g, "")) || 1;
  const canSend = kbk && st === "active" && !!closeoutOf(mock, id).accepted;
  const canReport = kbk && (st === "passed" || st === "closed");
  const actions = canEdit ? <>
    {canDelete && <SecondaryDangerButton Text="ลบแผน" LeadingIconSwap="delete-24-300-round" Size={size} onClick={() => setDel(true)} />}
    <SecondaryButton Text="แก้ไข" LeadingIconSwap="stylus-24-300-round" Size={size} onClick={() => { startEdit(plan); router.push("/edit/?id=" + id + "&from=detail"); }} />
  </> : canSend ? <PrimaryButton Text="ส่งประวัติ" Size={size} onClick={() => router.push("/closeout/history/?id=" + id)} />
    : canReport ? <PrimaryButton Text="รายงานผลการบำรุงรักษา" Size={size} onClick={() => router.push("/closeout/report/?id=" + id)} /> : undefined;
  /* ไปหน้าไตรมาส n (S6 ทางเข้า) · ความคืบหน้าอะไหล่ (S4) เฉพาะไตรมาสที่กำลังทำ */
  const qActions = kbk && (st === "approved" || st === "active") ? <div className="flex items-center gap-3">
    {q === nowQ && <TertiaryButton Text="ความคืบหน้าอะไหล่" onClick={() => router.push("/quarter/parts/?id=" + id + "&q=" + q)} />}
    <TertiaryBrandButton Text={"ไปหน้าไตรมาส " + q} LeadingIconSwap="keyboard_arrow_right-20-400-round" onClick={() => router.push("/quarter/trips/?id=" + id + "&q=" + q)} />
  </div> : undefined;

  return (
    <>
      <PageHeader Title={"เลขที่ " + plan.mr} Badge={[PST[st][0], badgeOf(PST[st][1])]} onBack={() => router.push("/")}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: plan.name }]} Actions={actions} />
      <div className="flex flex-col gap-8">
        {st === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        <PlanBody plan={plan} q={q} onQ={setQ} wh={st === "approved" || st === "active"} actions={qActions} />
      </div>
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(false)} onOk={() => { setDel(false); deletePlan(plan.mr); router.push("/"); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Detail /></Suspense></AppFrame>;
}
