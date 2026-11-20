"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import type { PlanStatus } from "@/lib/mock/data";
import { samplePlan, sampleDraft } from "@/lib/mock/planFlow";
import { SEEDS } from "@/lib/mock/seedB";
import { ROLES, setMock, setRole, type Role } from "@/lib/mock/store";

function Sample() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const st = sp.get("plan") as PlanStatus | null, role = sp.get("role") as Role | null, seed = SEEDS[sp.get("seed") ?? ""];
    if (seed) { seed.run(); setRole(seed.role); }
    if (role && (ROLES as readonly string[]).includes(role)) setRole(role);
    setMock((s) => {
      let n = { ...s };
      if (st) { const p = samplePlan(st); n = { ...n, plans: [p, ...n.plans.filter((x) => x.mr !== p.mr)], retiredMr: (n.retiredMr ?? []).filter((m) => m !== p.mr), edit: null }; }
      if (sp.get("draft")) n = { ...n, draft: sampleDraft() };
      return n;
    });
    const go = sp.get("go") ?? "/";
    router.replace(go.startsWith("/") ? go : "/");
  }, [sp, router]);
  return <p className="p-4 text-sm text-gray-600">กำลังเปิด scenario</p>;
}

export default function Page() {
  return <Suspense><Sample /></Suspense>;
}
