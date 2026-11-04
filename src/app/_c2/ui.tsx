"use client";
/* ตัวช่วยประกอบหน้าของชุด C2 (S23 S11 S13 S14) — ประกอบจากชิ้นไลบรารีเท่านั้น (บันทึกใน figma-spec/COMPOSED.md หัวข้อ ฉ.)
   BtnRow      = btnRow() ของ core.js: desktop ปุ่มแรกชิดซ้าย ปุ่มท้ายชิดขวา · มือถือเต็มแถว ช่องไฟ 16 แบ่งเท่ากัน
   MobileRows  = Mobile table + Mobile table item ต่อการ์ด (ใช้เมื่อหัวแถวของการ์ดต่างจากหัวคอลัมน์ เช่นป้ายที่สอง "ผลตรวจน้ำมัน")
   DocList     = Input label + _File upload item base (Download action อย่างเดียว) — File upload readonly ของไลบรารีซ่อนปุ่มดาวน์โหลด แต่ carResult() ต้องมี
   useSample   = ?sample=<scenario> จากหน้า /scenarios/ → ใส่ข้อมูลตั้งต้นของ scenario + สลับบทบาท แล้วเอา sample ออกจาก URL (ของต้นแบบเท่านั้น) */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { FileUploadItemBase } from "@/components/vms/FileUploadItemBase";
import { InputLabel } from "@/components/vms/InputLabel";
import { MobileTable } from "@/components/vms/MobileTable";
import { MobileTableItem, type MobileTableItemProps } from "@/components/vms/MobileTableItem";
import type { CellAction } from "@/components/vms/TableCell";
import { cx } from "@/lib/cx";
import { setRole, type Role } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const jobHref = (car: string) => "/trips/hire/job/?trip=TV&car=" + car;
export const tripHref = "/trips/hire/?trip=TV";

export function BtnRow({ children }: { children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>{children}</div>;
}

export interface MobileRow { key: string; items: MobileTableItemProps[]; actions?: CellAction[] }
export function MobileRows({ rows }: { rows: MobileRow[] }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <MobileTable key={r.key}>
          {r.items.map((it, i) => <MobileTableItem key={i} {...it} last={i === r.items.length - 1 && !r.actions} />)}
          {r.actions && <MobileTableItem Style="Action icons" Actions={r.actions} />}
        </MobileTable>
      ))}
    </div>
  );
}

export function DocList({ LabelText, files }: { LabelText: string; files: { name: string; size: string }[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <InputLabel LabelText={LabelText} />
      <div className="flex flex-col gap-3">
        {files.map((f) => <FileUploadItemBase key={f.name} FileName={f.name} FileSize={f.size} State="Completed" ProgressBar={false} DeleteAction={false} />)}
      </div>
    </div>
  );
}

/** ?sample=S23 … → apply() + setRole(role) ครั้งเดียว แล้วลบ sample ออกจาก URL */
export function useSample(map: Record<string, { role: Role; apply: () => void }>) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const done = useRef(false);
  const sample = sp.get("sample");
  useEffect(() => {
    if (!sample || done.current) return;
    const m = map[sample];
    done.current = true;
    if (m) { m.apply(); setRole(m.role); }
    const q = new URLSearchParams(sp.toString());
    q.delete("sample");
    router.replace(path + (q.toString() ? "?" + q.toString() : ""));
  }, [sample, map, sp, router, path]);
  return !!sample && !done.current;
}
