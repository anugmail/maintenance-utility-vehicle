"use client";
/* แถวภาพ (library fallback ของ IncidentPhotoGallery) ตาม photoGallery() ใน screens.js — ประกอบจากชิ้นไลบรารี (บันทึกใน figma-spec/COMPOSED.md)
   Section label (ชื่อ "(n)") → ห่าง 16 → Images Size=sm Type=Image ช่องไฟ 16 ไม่มีปุ่ม/จุดเลื่อน · desktop สูงสุด 4 ภาพ · มือถือ 2 ภาพ
   ต้นแบบไม่มีไฟล์ภาพจริง → ไม่ส่ง src = ช่องภาพ Type=Empty ของไลบรารี */
import { Images } from "@/components/vms/Images";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export interface Photo { src?: string; alt?: string }

export function PhotoGallery({ Title, photos, Breakpoint: bp, className }: { Title: string; photos: Photo[]; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  const shown = photos.slice(0, mob ? 2 : 4);
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      <SectionLabel Title={Title} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {shown.map((p, i) => <Images key={i} Size="sm" src={p.src} alt={p.alt ?? Title + " " + (i + 1)} className="h-39 w-full" />)}
      </div>
    </section>
  );
}
