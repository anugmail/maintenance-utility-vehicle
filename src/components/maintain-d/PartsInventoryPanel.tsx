"use client";
/* Figma: "PartsInventoryPanel" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/PartsInventoryPanel.json (CLAUDE.md ข้อ 12)
   คลังอะไหล่ (S21 อะไหล่ของรถ) · variant: State = Default | Not Found | API error
   ค่า: กล่อง พื้น white ขอบ 1 gray-200 (สีไฟล์ไม่มี token — COMPOSED.md ข.) รัศมี 16 ขอบใน 16 · ด้านใน ช่องไฟ 16
        Section header "คลังอะไหล่" + Supporting text "อะไหล่ทั้งหมดจาก Smart Inventory และ คลังสำรอง" · Text input ค้นหา (ไอคอน search) placeholder "ค้นหาชื่อหรือรหัสอะไหล่"
        รายการ = Spare Part Card Item อะไหล่=รายการในคลัง ช่องไฟ 16 (เลื่อนในกล่อง)
        Not Found: Empty state/Search not found "ไม่พบข้อมูล" / "เปลี่ยนคำค้นหาแล้วลองใหม่อีกครั้ง" (ขอบในบน/ล่าง 10)
        API error: Empty state/Search not found "ไม่สามารถแสดงข้อมูลได้" / "อาจเกิดจากปัญหาการเชื่อมต่อระบบ กรุณารีเฟรชหน้าจอหรือลองใหม่อีกครั้ง" */
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { SparePartCardItem, type SparePart } from "./SparePartCardItem";

export function PartsInventoryPanel({ parts, picked = [], onPick, query = "", onQuery, apiError, className }: {
  parts: SparePart[]; picked?: string[]; onPick?: (p: SparePart) => void; query?: string; onQuery?: (q: string) => void; apiError?: boolean; className?: string;
}) {
  const q = query.trim().toLowerCase();
  const list = q ? parts.filter((p) => p.name.toLowerCase().includes(q) || (p.code ?? "").toLowerCase().includes(q)) : parts;
  return (
    <div className={cx("flex min-w-0 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4", className)}>
      <SectionHeader Title="คลังอะไหล่" SupportingText="อะไหล่ทั้งหมดจาก Smart Inventory และ คลังสำรอง" Breakpoint="Desktop" />
      <TextInput Label={false} LeadingIconSwap="search-24-300-round" Text={query} Placeholder="ค้นหาชื่อหรือรหัสอะไหล่" onChange={onQuery} aria-label="ค้นหาชื่อหรือรหัสอะไหล่" />
      {apiError ? <EmptyStateSearchNotFound Text="ไม่สามารถแสดงข้อมูลได้" SupportingText="อาจเกิดจากปัญหาการเชื่อมต่อระบบ กรุณารีเฟรชหน้าจอหรือลองใหม่อีกครั้ง" className="py-2.5" />
        : !list.length ? <EmptyStateSearchNotFound Text="ไม่พบข้อมูล" SupportingText="เปลี่ยนคำค้นหาแล้วลองใหม่อีกครั้ง" className="py-2.5" />
          : <div className="flex max-h-[680px] flex-col gap-4 overflow-y-auto">{list.map((p) => <SparePartCardItem key={p.code ?? p.name} อะไหล่="รายการในคลัง" part={p} picked={picked.includes(p.code ?? p.name)} onPick={() => onPick?.(p)} />)}</div>}
    </div>
  );
}
