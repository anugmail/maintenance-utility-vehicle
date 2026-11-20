"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { findCase } from "@/lib/guide/scenarios";
import { startCase } from "@/lib/guide/start";

function Start() {
  const router = useRouter();
  const sp = useSearchParams();
  useEffect(() => {
    const f = findCase(sp.get("case"));
    router.replace(f ? startCase(f.c, sp.get("from")) : "/scenarios/");
  }, [sp, router]);
  return <p className="p-4 text-sm text-gray-600">กำลังเปิดเคส</p>;
}

export default function Page() {
  return <Suspense><Start /></Suspense>;
}
