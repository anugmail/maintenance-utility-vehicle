/* ตัวช่วยจัดหน้า /kit/ (ไม่ใช่ component ของไลบรารี — หน้า kit เป็นของต้นแบบ CLAUDE.md ข้อ 12) */
import type { ReactNode } from "react";
import { SectionLabel } from "@/components/vms/SectionLabel";

export function Block({ name, node, children }: { name: string; node: string; children: ReactNode }) {
  return (
    <section id={name.replace(/[^a-zA-Z]/g, "-")} className="flex flex-col gap-4 border-t border-gray-200 pt-6">
      <SectionLabel Title={name} SupportingText={node} />
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}
export function V({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "flex w-full min-w-0 flex-col gap-2" : "flex max-w-full min-w-0 flex-col gap-2"}>
      <span className="text-xs text-gray-600">{label}</span>
      {children}
    </div>
  );
}
