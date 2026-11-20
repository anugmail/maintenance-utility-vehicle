"use client";
import { AppFrame } from "@/components/shell/AppFrame";
import { PlanForm } from "./PlanForm";

export default function Page() {
  return <AppFrame><PlanForm mode="create" /></AppFrame>;
}
