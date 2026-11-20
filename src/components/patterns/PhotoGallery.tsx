"use client";
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
