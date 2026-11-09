"use client";
/* S19 S20 · หน้ารายละเอียดแผน ฝั่ง กบค. (/detail/?id=Z7000004) — planDetail() ใน screens.js
   หลังส่งอนุมัติ 3 สถานะ (รีวิวทีมออกแบบ 5 พ.ย. 2569 · planDetail o.readonly · userflow S1 "หน้า รายละเอียดแผน หลังส่งอนุมัติ"):
   Page header: "เลขที่ MR …" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › ชื่อแผน · Badge outline = สถานะแผน
     ปุ่มหัว (เฉพาะ กบค.): รออนุมัติ = ดูอย่างเดียว ไม่มีปุ่ม (ขัดกับ S19 S20 — Q53 · ลบ/แก้ไขแผนรออนุมัติยังทำได้จากเมนู "…" ของรายการ)
       · ส่งกลับแก้ไข = Secondary danger button "ลบแผน" + Secondary button "แก้ไข" (→ S19) · อนุมัติแล้ว = "แก้ไข" อย่างเดียว · ดำเนินการแล้วขึ้นไป = ไม่มีปุ่ม (ซ่อน ไม่ disable)
     มือถือ: ปุ่มอยู่ใต้หัวข้อ แบ่งเท่ากัน
   เนื้อหา ช่องไฟ 32: (ส่งกลับแก้ไข) Alert Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล → PlanBody (แถบสถานะคลังรับทราบ S22 U.8 ตัดออก 6 พ.ย. 2569)
   ลบแผน → ยืนยันการลบแผน (S20 S.5) → กลับหน้ารายการ + toast "ลบแผนบำรุงรักษาสำเร็จ" · แก้ไข → /edit/ (S19)
   ทางไปขั้นถัดไป เฉพาะ กบค. · แผนอนุมัติแล้ว/ดำเนินการ (planDetailQ ใน screens.js · S6 ทางเข้า 5 พ.ย. 2569):
     Section label "รถในแผน" Primary action (Tertiary brand button) "ไปหน้าไตรมาส n" ตามแท็บที่เปิด (Q54) → หน้า "ไตรมาส n" (/quarter/trips/)
     Secondary action (Tertiary button) "ความคืบหน้าอะไหล่" (S4) เฉพาะแท็บไตรมาสที่กำลังทำ — ทางเข้าเดิม 4 พ.ย. (จอ Figma รอบ 5 พ.ย. ไม่มีทางเข้า S4 · BACKLOG ค.)
     ปุ่มหัว: ดำเนินการ + หน่วยงานยอมรับผลทั้งแผนแล้ว (S14 · closeout.accepted · เงื่อนไข S15) → "ส่งประวัติ" (S15) · ประวัติผ่านแล้ว/ปิดงานแล้ว → "รายงานผลการบำรุงรักษา" (S17)
   กล่องรายละเอียดแผน: ก่อนดำเนินการ = npKv (planFlow.planKv · เขต ยานพาหนะรายไตรมาส วันที่ส่ง · planBody ของ screens.js)
     · ดำเนินการขึ้นไป = PLAN_KV (closeout.planKv · ไตรมาส วันที่สร้าง อนุมัติเมื่อ) ตาม E.2 planDetailQ ของ screens.js (9 พ.ย. 2569)
   อะไหล่ในแผน (detail/PlanParts.tsx ชุดเดียวกับหน้าผู้อนุมัติ S2) ต่อท้าย PlanBody ทุกสถานะ ทุกบทบาท (planBody ของ screens.js แสดง planPartsSec เสมอ · Figma e3040ff ee5e68c):
     ผู้สร้างแผน รออนุมัติ / อนุมัติแล้ว / ส่งกลับแก้ไข (A.20–A.22 · S19 R.2 · S20 S.4–S.6) · กบค. ดูแผนของหน่วยงานอื่น (A.32) · แผนที่ดำเนินการ (E.2 planDetailQ)
     เจ้าของงาน 9 พ.ย. 2569 ส่งภาพ A.20 A.21 A.22 A.32 "ทำให้เป็นแบบนี้" + "หน้าอื่นที่ต้องมีอะใหล่รวม หรืออะใหล่แต่ละไตรมาส ก็ต้องมี section อะใหล่ด้วยนะ" (ยกเลิก 1c33952 "มีแค่ผู้อนุมัติ")
     ยอดรายไตรมาส = quarterPartRows ⇒ ไตรมาส n ตรงกับอะไหล่ในไตรมาส n ของหน้าไตรมาส (E.2 ไตรมาส 1 = PARTS) · ไตรมาส 2–4 ของแผนตัวอย่างรวมจากยานพาหนะจำลองของไตรมาสนั้น (carParts) ไม่ใช่ค่าสัดส่วนของ pQParts */
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
import { closeoutOf, planKv as runKv } from "@/lib/mock/closeout";
import { PST, type PlanStatus } from "@/lib/mock/data";
import { DELETE_CONFIRM, badgeOf, canManage, deletePlan, findPlan, planId, startEdit, useHydrated } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "./PlanBody";
import { PlanParts } from "./PlanParts";

/* สถานะที่แผนเริ่มดำเนินการแล้ว (หลังอนุมัติ · E.2 ของ S6 ขึ้นไป) */
const RUN: PlanStatus[] = ["active", "hist", "passed", "closed"];

function Detail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const hydrated = useHydrated();
  const role = useRole();
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const [qSel, setQ] = useState<number | null>(null);   // แท็บที่เลือก · ยังไม่เลือก = ไตรมาสที่กำลังทำของแผน (9 พ.ย. 2569 MRZ7000002 ไตรมาส 2)
  const [del, setDel] = useState(false);
  const gone = hydrated && !plan;
  useEffect(() => { if (gone) router.replace("/"); }, [gone, router]);   // แผนไม่มีแล้ว (ลบ) → หน้ารายการ
  if (!hydrated || !plan) return null;

  const st = plan.status;
  /* แก้ไข ลบ: หน่วยงานผู้สร้างแผน · กบค. เฉพาะแผนของ กบค. (แผนหน่วยงานอื่นดูอย่างเดียว · planDetail readonly ของ screens.js 6 พ.ย. 2569 รอบ 2) */
  const manage = canManage(role, plan);
  const canDelete = manage && st === "returned";
  const canEdit = manage && (st === "returned" || st === "approved");
  const size = mob ? "lg" : "md";
  const id = planId(plan);
  const nowQ = Number(plan.nowQ.replace(/\D/g, "")) || 1;
  const q = qSel ?? nowQ;
  const canSend = manage && st === "active" && !!closeoutOf(mock, id).accepted;
  const canReport = manage && (st === "passed" || st === "closed");
  const actions = canEdit ? <>
    {canDelete && <SecondaryDangerButton Text="ลบแผน" LeadingIconSwap="delete-24-300-round" Size={size} onClick={() => setDel(true)} />}
    <SecondaryButton Text="แก้ไข" LeadingIconSwap="stylus-24-300-round" Size={size} onClick={() => { startEdit(plan); router.push("/edit/?id=" + id + "&from=detail"); }} />
  </> : canSend ? <PrimaryButton Text="ส่งประวัติ" Size={size} onClick={() => router.push("/closeout/history/?id=" + id)} />
    : canReport ? <PrimaryButton Text="รายงานผลการบำรุงรักษา" Size={size} onClick={() => router.push("/closeout/report/?id=" + id)} /> : undefined;
  /* ไปหน้าไตรมาส n (S6 ทางเข้า) · S4 เปลี่ยนเป็นแดชบอร์ดที่เข้าจากเมนู (/parts/ · 6 พ.ย. 2569) ไม่มีปุ่มที่นี่แล้ว */
  /* ไปหน้าไตรมาส n: แผนอนุมัติแล้ว/ดำเนินการ ของทุกหน่วยงาน (9 พ.ย. 2569 เจ้าของงาน "แผนอนุมัติแล้ว แต่ไม่เจอแผนการเดินทางที่อนุมัติแล้ว")
     planBody({ qBtn: st === 'approved' || st === 'active' }) ของ screens.js ไม่ขึ้นกับบทบาท — A.32 กบค. ดูแผนของหน่วยงานอื่น (planDetail readonly) ก็มีปุ่มนี้ (readonly ซ่อนแค่ปุ่มหัว)
     ⇒ หน่วยงานเจ้าของแผน + กบค. · หน้าไตรมาสของแผนที่ไม่ใช่ของตัวเอง = ดูอย่างเดียว */
  const qActions = (manage || role === "กบค.") && (st === "approved" || st === "active") ? <div className="flex items-center gap-3">
    <TertiaryBrandButton Text={"ไปหน้าไตรมาส " + q} LeadingIconSwap="keyboard_arrow_right-20-400-round" onClick={() => router.push("/quarter/trips/?id=" + id + "&q=" + q)} />
  </div> : undefined;

  return (
    <>
      <PageHeader Title={"เลขที่ " + plan.mr} Badge={[PST[st][0], badgeOf(PST[st][1])]} onBack={() => router.push("/")}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: plan.name }]} Actions={actions} />
      <div className="flex flex-col gap-8">
        {st === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {/* แผนที่ดำเนินการแล้ว (ดำเนินการ ขึ้นไป) = กล่อง PLAN_KV แบบ E.2 planDetailQ (ไตรมาสที่กำลังทำ · วันที่สร้าง · อนุมัติเมื่อ) · ก่อนนั้น = npKv แบบ planDetail (A.20–A.22) */}
        <PlanBody plan={plan} q={q} onQ={setQ} actions={qActions} kv={RUN.includes(st) ? runKv(plan) : undefined} />
        <PlanParts plan={plan} />
      </div>
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(false)} onOk={() => { setDel(false); deletePlan(plan.mr); router.push("/"); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Detail /></Suspense></AppFrame>;
}
