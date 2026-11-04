"use client";
/* S19 · หน้า แก้ไขแผน (/edit/?id=Z7000004) — planForm({ edit }) ใน screens.js · ฟอร์มเดียวกับ S1 (app/new/PlanForm.tsx)
   แก้ไขได้เมื่อ รออนุมัติ · ส่งกลับแก้ไข · อนุมัติแล้ว (ก่อนเริ่มงาน) — สถานะอื่นกลับหน้ารายการ · เฉพาะบทบาท กบค.
   ฟอร์มแก้ค้างเก็บใน mock.edit (เริ่มจากข้อมูลแผนเมื่อกด "แก้ไข" ในรายการ/รายละเอียด · ไป S21 แล้วกลับมาไม่หาย)
   บันทึกและส่งอนุมัติ → ยืนยันการแก้ไข → แผนกลับเป็นรออนุมัติ (เลขที่ MR เดิม) → รายการแผน + toast "บันทึกการแก้ไขแผนและส่งอนุมัติสำเร็จ" */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { findPlan, startEdit, useRoleGuard } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { PlanForm } from "../new/PlanForm";

const EDITABLE = ["review", "returned", "approved"];

function Edit() {
  const router = useRouter();
  const sp = useSearchParams();
  const ok = useRoleGuard(["กบค."]);
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const editable = !!plan && EDITABLE.includes(plan.status);
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
