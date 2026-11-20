import type { MouseEvent, ReactNode } from "react";
import { asset } from "@/lib/basePath";

export const PLATE_RE = /^\d{2}-\d{4} [฀-๿]+$/;
export const plateHref = (plate: string) => asset("/soon/?car=" + encodeURIComponent(plate.split(" ")[0]));

export function PlateLink({ plate }: { plate: string }) {
  return (
    <a href={plateHref(plate)} target="_blank" rel="noopener" data-plate-link className="text-info-700 underline underline-offset-2"
      onClick={(e: MouseEvent) => e.stopPropagation()}>{plate}</a>
  );
}

export function linkPlate(node: ReactNode): ReactNode {
  return typeof node === "string" && PLATE_RE.test(node) ? <PlateLink plate={node} /> : node;
}
