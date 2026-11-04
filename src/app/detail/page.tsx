"use client";
/* S19 S20 S22 · หน้ารายละเอียดแผน ฝั่ง กบค. (/detail/?id=Z7000004) — planDetail() ใน screens.js
   Page header: "เลขที่ MR …" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › ชื่อแผน · Badge outline = สถานะแผน
     ปุ่มหัว (เฉพาะ กบค.): รออนุมัติ / ส่งกลับแก้ไข = Secondary danger button "ลบแผน" + Secondary button "แก้ไข" · อนุมัติแล้ว = "แก้ไข" อย่างเดียว · ดำเนินการแล้วขึ้นไป = ไม่มีปุ่ม (ซ่อน ไม่ disable)
     มือถือ: ปุ่มอยู่ใต้หัวข้อ แบ่งเท่ากัน
   เนื้อหา ช่องไฟ 32: (ส่งกลับแก้ไข) Alert Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล → PlanBody (อนุมัติแล้ว/ดำเนินการ: แถบสถานะคลังของไตรมาสที่เปิด S22 U.8)
   ลบแผน → ยืนยันการลบแผน (S20 S.5) → กลับหน้ารายการ + toast "ลบแผนบำรุงรักษาสำเร็จ" · แก้ไข → /edit/ (S19) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SecondaryDangerButton } from "@/components/vms/SecondaryDangerButton";
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
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const [del, setDel] = useState(false);
  const gone = hydrated && !plan;
  useEffect(() => { if (gone) router.replace("/"); }, [gone, router]);   // แผนไม่มีแล้ว (ลบ) → หน้ารายการ
  if (!hydrated || !plan) return null;

  const st = plan.status;
  const canDelete = kbk && (st === "review" || st === "returned");
  const canEdit = kbk && (st === "review" || st === "returned" || st === "approved");
  const size = mob ? "lg" : "md";
  const actions = canEdit ? <>
    {canDelete && <SecondaryDangerButton Text="ลบแผน" LeadingIconSwap="delete-24-300-round" Size={size} onClick={() => setDel(true)} />}
    <SecondaryButton Text="แก้ไข" LeadingIconSwap="stylus-24-300-round" Size={size} onClick={() => { startEdit(plan); router.push("/edit/?id=" + planId(plan) + "&from=detail"); }} />
  </> : undefined;

  return (
    <>
      <PageHeader Title={"เลขที่ " + plan.mr} Badge={[PST[st][0], badgeOf(PST[st][1])]} onBack={() => router.push("/")}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: plan.name }]} Actions={actions} />
      <div className="flex flex-col gap-8">
        {st === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        <PlanBody plan={plan} q={q} onQ={setQ} wh={st === "approved" || st === "active"} />
      </div>
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(false)} onOk={() => { setDel(false); deletePlan(plan.mr); router.push("/"); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Detail /></Suspense></AppFrame>;
}
