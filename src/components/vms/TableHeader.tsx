"use client";
import { Children, type ReactNode } from "react";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { BadgeOutline } from "./BadgeOutline";
import { BadgeOutlineWithRemoveIcon } from "./BadgeOutlineWithRemoveIcon";
import { SecondaryButton } from "./SecondaryButton";
import { TextInput } from "./TextInput";

export interface TableHeaderProps {
  Breakpoint?: Breakpoint;
  Title?: string;
  Badge?: string | number | null;
  query?: string;
  Placeholder?: string;
  onQuery?: (q: string) => void;
  onFilter?: () => void;
  FilterButton?: boolean;
  FilterText?: string;
  FilterCount?: number | null;
  Filters?: string[];
  onRemoveFilter?: (f: string) => void;
  Actions?: ReactNode;
  className?: string;
}

export function TableHeader({ Breakpoint: bp, Title, Badge, query, Placeholder, onQuery, onFilter, FilterButton = true, FilterText = "ตัวกรอง", FilterCount, Filters, onRemoveFilter, Actions, className }: TableHeaderProps) {
  const b = useBreakpoint(bp);
  const mob = b === "Mobile";
  const acts = Children.toArray(Actions).filter(Boolean);
  const chips = Filters && Filters.length > 0 && (
    <div className={cx("flex flex-wrap items-center", mob ? "gap-4" : "gap-3")}>
      {Filters.map((f) => <BadgeOutlineWithRemoveIcon key={f} Text={f} Color="Brand" onRemove={onRemoveFilter ? () => onRemoveFilter(f) : undefined} />)}
    </div>
  );
  return (
    <div className={cx("flex flex-col", mob ? "gap-4" : "gap-5", className)}>
      {Title && (
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 shrink-0 rounded-pill bg-brand-900" />
          <h3 className="text-lg font-semibold text-black">{Title}</h3>
          {Badge != null && Badge !== "" && <BadgeOutline Text={String(Badge)} Color="Gray" />}
        </div>
      )}
      <div className={cx("flex", mob ? "flex-col gap-4" : "items-center justify-between gap-3")}>
        <TextInput Label={false} Size={mob ? "lg" : "md"} LeadingIconSwap="search-24-300-round" Text={query} Placeholder={Placeholder} onChange={onQuery} aria-label={Placeholder} className={mob ? "w-full" : "w-80"} />
        <div className={cx("flex", mob ? "flex-wrap gap-4 [&>*]:flex-1 [&>*]:basis-[calc(50%-8px)]" : "gap-3")}>
          {FilterButton && <SecondaryButton Text={FilterText} Size={mob ? "lg" : "md"} LeadingIconSwap="filter_list-24-400-round" Pill={FilterCount || null} onClick={onFilter} />}
          {acts}
          {mob && (FilterButton ? !acts.length : acts.length === 1) && <span />}
        </div>
      </div>
      {chips}
    </div>
  );
}
