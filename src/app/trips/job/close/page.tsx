"use client";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ClosePage } from "./ClosePage";

export default function Page() {
  return <AppFrame><Suspense><ClosePage /></Suspense></AppFrame>;
}
