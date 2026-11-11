"use client";
/* S19 · หน้า แก้ไขแผน (/edit/?id=Z7000004) — planForm({ edit }) ใน screens.js · ฟอร์มเดียวกับ S1 (app/new/PlanForm.tsx)
   แก้ไขได้เมื่อ รออนุมัติ · ส่งกลับแก้ไข · อนุมัติแล้ว (ก่อนเริ่มงาน) — สถานะอื่นกลับหน้ารายการ · เฉพาะหน่วยงานผู้สร้างแผน (หน่วยงาน · กบค. แผนของตัวเอง — PLAN_ROLES · canManage)
   ฟอร์มแก้ค้างเก็บใน mock.edit (เริ่มจากข้อมูลแผนเมื่อกด "แก้ไข" ในรายการ/รายละเอียด · ไป S21 แล้วกลับมาไม่หาย)
   บันทึกและส่งอนุมัติ → ยืนยันการแก้ไข → แผนกลับเป็นรออนุมัติ (เลขที่ MR เดิม) → รายการแผน + toast "บันทึกการแก้ไขแผนและส่งอนุมัติสำเร็จ" */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PLAN_ROLES, canManage, findPlan, startEdit, useRoleGuard } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import { PlanForm } from "../new/PlanForm";

const EDITABLE = ["review", "returned", "approved", "active"];   // 11 พ.ย. 2569 ดำเนินการ = แก้ได้เฉพาะไตรมาสที่ยังไม่เสร็จ บันทึกแล้วมีผลทันที (liveEdit.ts · BACKLOG ข้อ 64)

function Edit() {
  const router = useRouter();
  const sp = useSearchParams();
  const ok = useRoleGuard(PLAN_ROLES);   // หน่วยงานผู้สร้างแผน · กบค. (แผนของ กบค. · 6 พ.ย. 2569 รอบ 2)
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const role = useRole();
  const editable = !!plan && EDITABLE.includes(plan.status) && canManage(role, plan);
  const fresh = !!plan && mock.edit?.editOf !== plan.mr;
  useEffect(() => {
    if (!ok) return;
    if (!editable) router.replace("/");
    else if (fresh) startEdit(plan);   // เปิดลิงก์ตรง: เริ่มจากข้อมูลแผน
  }, [ok, editable, fresh, plan, router]);
  if (!ok || !editable || fresh) return null;
  return <PlanForm mode="edit" plan={plan} from={sp.get("from") ?? undefined} />;
}

export default function Page() {
  return <AppFrame><Suspense><Edit /></Suspense></AppFrame>;
}
