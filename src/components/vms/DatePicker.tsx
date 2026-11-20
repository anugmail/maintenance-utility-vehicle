"use client";
import { useState } from "react";
import { cx } from "@/lib/cx";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { TertiaryBrandButton } from "./TertiaryBrandButton";
import { TertiaryButton } from "./TertiaryButton";

export interface DateRange { start?: Date | null; end?: Date | null }

const sameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate();
const LIB_WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const libMonth = (y: number, m: number) => new Date(y, m, 1).toLocaleString("en-US", { month: "short" }) + " " + y;

export interface DatePickerProps {
  Type?: "Dual" | "Single";
  value?: DateRange;
  month?: Date;
  today?: Date;
  onApply?: (v: DateRange) => void;
  onCancel?: () => void;
  weekdays?: string[];
  monthLabel?: (year: number, month: number) => string;
  ClearText?: string;
  min?: Date;
  max?: Date;
  range?: boolean;
  Today?: boolean;
  CancelText?: string;
  ApplyText?: string;
  className?: string;
}

export function DatePicker({ Type = "Dual", value, month, today = new Date(), onApply, onCancel, weekdays = LIB_WEEKDAYS, monthLabel = libMonth, ClearText = "Clear", CancelText = "Cancel", ApplyText = "Apply", min, max, range, Today = true, className }: DatePickerProps) {
  const first = month ?? value?.start ?? today;
  const [view, setView] = useState({ y: first.getFullYear(), m: first.getMonth() });
  const [sel, setSel] = useState<DateRange>(value ?? {});
  const pick = (d: Date) => {
    if (Type === "Single" && !range) return setSel({ start: d, end: d });
    if (!sel.start || sel.end) return setSel({ start: d, end: null });
    return setSel(dayKey(d) < dayKey(sel.start) ? { start: d, end: sel.start } : { start: sel.start, end: d });
  };
  const shift = (n: number) => setView((v) => { const d = new Date(v.y, v.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  const months = Type === "Dual" ? [0, 1] : [0];
  return (
    <div className={cx("inline-flex flex-col rounded-xl border border-gray-300 bg-white", className)}>
      <div className="flex">
        {months.map((i) => {
          const d = new Date(view.y, view.m + i, 1);
          return (
            <Calendar key={i} year={d.getFullYear()} month={d.getMonth()} sel={sel} today={Today ? today : undefined} min={min} max={max} weekdays={weekdays} label={monthLabel(d.getFullYear(), d.getMonth())}
              prev={Type === "Single" || i === 0 ? () => shift(-1) : undefined} next={Type === "Single" || i === months.length - 1 ? () => shift(1) : undefined} onPick={pick} />
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-gray-300 p-4">
        {ClearText ? <TertiaryBrandButton Text={ClearText} onClick={() => setSel({})} /> : <span />}
        <div className="flex items-center gap-3">
          <SecondaryButton Text={CancelText} onClick={onCancel} />
          <PrimaryButton Text={ApplyText} onClick={() => onApply?.(sel)} />
        </div>
      </div>
    </div>
  );
}

function Calendar({ year, month, sel, today, min, max, weekdays, label, prev, next, onPick }: {
  year: number; month: number; sel: DateRange; today?: Date; min?: Date; max?: Date; weekdays: string[]; label: string; prev?: () => void; next?: () => void; onPick: (d: Date) => void;
}) {
  const start = new Date(year, month, 1);
  const lead = (start.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - lead + i));
  const rows = days[35].getMonth() !== month ? days.slice(0, 35) : days;
  const s = sel.start, e = sel.end;
  return (
    <div className="flex w-78 flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <TertiaryButton LeadingIconSwap="keyboard_arrow_left-20-400-round" ButtonText={false} aria-label="เดือนก่อน" State={prev ? "Default" : "Disabled"} onClick={prev} />
        <span className="px-2 text-sm font-semibold text-black">{label}</span>
        <TertiaryButton LeadingIconSwap="keyboard_arrow_right-20-400-round" ButtonText={false} aria-label="เดือนถัดไป" State={next ? "Default" : "Disabled"} onClick={next} />
      </div>
      <div className="grid w-70 grid-cols-7">
        {weekdays.map((w) => <span key={w} className="flex size-10 items-center justify-center text-sm font-semibold text-black">{w}</span>)}
        {rows.map((d) => {
          const off = (!!min && dayKey(d) < dayKey(min)) || (!!max && dayKey(d) > dayKey(max));
          const out = d.getMonth() !== month || off;
          const isS = sameDay(d, s), isE = sameDay(d, e);
          const inRange = !!s && !!e && dayKey(d) > dayKey(s) && dayKey(d) < dayKey(e);
          const ranged = !!s && !!e && !sameDay(s, e);
          const type = isS || isE ? "Selected day" : inRange ? "Day in range" : sameDay(d, today) ? "Today" : "Day";
          return (
            <span key={d.toISOString()} className="relative flex size-10 items-center justify-center">
              {!out && ranged && (inRange || isE) && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-5 bg-gray-100" />}
              {!out && ranged && (inRange || isS) && <span aria-hidden="true" className="absolute inset-y-0 right-0 w-5 bg-gray-100" />}
              <button type="button" disabled={out} onClick={() => onPick(d)} aria-pressed={isS || isE} data-day={d.getMonth() === month ? d.getDate() : undefined}
                className={cx("relative inline-flex size-10 items-center justify-center rounded-pill text-sm",
                  out ? "cursor-default text-gray-400"
                    : type === "Selected day" ? "cursor-pointer bg-brand-900 text-white hover:bg-brand-800"
                      : type === "Day in range" ? "cursor-pointer bg-gray-100 text-black hover:bg-gray-200"
                        : type === "Today" ? "cursor-pointer bg-gray-100 text-brand-900 hover:bg-gray-200" : "cursor-pointer text-black hover:bg-gray-200")}>
                {d.getDate()}
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
