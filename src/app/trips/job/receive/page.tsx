"use client";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ReceivePage } from "./ReceivePage";

export default function Page() {
  return <AppFrame><Suspense><ReceivePage /></Suspense></AppFrame>;
}
