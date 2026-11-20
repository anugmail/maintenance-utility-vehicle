"use client";
import { useState } from "react";
import { PhotoGallery, type Photo } from "@/components/patterns/PhotoGallery";
import { IconButton } from "@/components/vms/IconButton";
import { Images } from "@/components/vms/Images";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function IncidentPhotoGallery({ Title = "รูปภาพเหตุการณ์", photos, Breakpoint: bp, className }: { Title?: string; photos: Photo[]; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  const [page, setPage] = useState(0);
  if (mob) return <PhotoGallery Title={Title} photos={photos} Breakpoint="Mobile" className={className} />;
  const pages = Math.max(1, Math.ceil(photos.length / 4));
  const shown = photos.slice(page * 4, page * 4 + 4);
  return (
    <section className={cx("flex flex-col gap-2", className)}>
      <SectionLabel Title={Title} className="min-h-10" />
      <div className="flex items-center gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-4">
          {shown.map((p, i) => <Images key={page * 4 + i} Size="sm" src={p.src} alt={p.alt ?? Title + " " + (page * 4 + i + 1)} className="h-39 w-full" />)}
        </div>
        {photos.length > 4 && <IconButton IconSwap="keyboard_arrow_right-20-400-round" aria-label="ภาพถัดไป" onClick={() => setPage((p) => (p + 1) % pages)} />}
      </div>
    </section>
  );
}
