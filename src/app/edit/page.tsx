"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PLAN_ROLES, canManage, findPlan, startEdit, useRoleGuard } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import { PlanForm } from "../new/PlanForm";

const EDITABLE = ["review", "returned", "approved", "active"];

function Edit() {
  const router = useRouter();
  const sp = useSearchParams();
  const ok = useRoleGuard(PLAN_ROLES);
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const role = useRole();
  const editable = !!plan && EDITABLE.includes(plan.status) && canManage(role, plan);
  const fresh = !!plan && mock.edit?.editOf !== plan.mr;
  useEffect(() => {
    if (!ok) return;
    if (!editable) router.replace("/");
    else if (fresh) startEdit(plan);
  }, [ok, editable, fresh, plan, router]);
  if (!ok || !editable || fresh) return null;
  return <PlanForm mode="edit" plan={plan} from={sp.get("from") ?? undefined} />;
}

export default function Page() {
  return <AppFrame><Suspense><Edit /></Suspense></AppFrame>;
}
