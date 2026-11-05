"use client";
/* Figma: "Date picker" — ไฟล์ (Component) VMS Plus หน้า Date picker (node 855:376) · สเปก figma-spec/Date picker.json + _Date picker calendar + _Date picker calendar item base
   variant: Type = Dual (ช่วงวัน · S6 ช่วงวันเดินทาง) | Single (Month/Year ต้นแบบไม่ใช้) · property: Time picker (ปิดตาม screens.js)
   ค่า: กล่อง รัศมี 16 พื้น white ขอบ 1 gray-300 ไม่มีเงา · Calendar กว้าง 312 ขอบใน 16 ช่องไฟ 12
        Header: Tertiary button ‹ · เดือน (Tertiary button 14 SemiBold black) · Tertiary button › (Dual: ปฏิทินซ้ายปิด › ปฏิทินขวาปิด ‹)
        _Date picker calendar 280×280 = 7 คอลัมน์ × แถวละ 40 (แถวแรกชื่อวัน 14 SemiBold)
        _Date picker calendar item base 40×40 รัศมี 9999 ตัวเลข 14 Regular: Day (Hover พื้น gray-200) · Today พื้น gray-100 ตัวอักษร brand-900
          · Day in range พื้น gray-100 + connector ซ้าย/ขวา gray-100 (แถบต่อเนื่อง) · Selected day พื้น brand-900 ตัวอักษร white (Hover brand-800) · Disabled ตัวอักษร gray-400 (วันนอกเดือน)
        _Date picker footer: ขอบใน 16 เส้นบน gray-300 · Tertiary brand button (ล้าง) ซ้าย · Secondary + Primary button md ขวา ช่องไฟ 12
   ข้อความตั้งต้นตามไลบรารี (Mo–Su · "Dec 2024" · Clear / Cancel / Apply) · ส่ง prop เพื่อเปลี่ยนได้ (COMPOSED.md ง.) · ClearText="" = ซ่อนปุ่มล้าง (Tertiary brand button ซ่อนตาม thaiDatePicker() ใน screens.js 5 พ.ย. 2569) */
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
  /** เดือนแรกที่แสดง (ค่าเริ่ม = เดือนของวันเริ่ม หรือวันนี้) */
  month?: Date;
  today?: Date;
  onApply?: (v: DateRange) => void;
  onCancel?: () => void;
  weekdays?: string[];
  monthLabel?: (year: number, month: number) => string;
  ClearText?: string;
  CancelText?: string;
  ApplyText?: string;
  className?: string;
}

export function DatePicker({ Type = "Dual", value, month, today = new Date(), onApply, onCancel, weekdays = LIB_WEEKDAYS, monthLabel = libMonth, ClearText = "Clear", CancelText = "Cancel", ApplyText = "Apply", className }: DatePickerProps) {
  const first = month ?? value?.start ?? today;
  const [view, setView] = useState({ y: first.getFullYear(), m: first.getMonth() });
  const [sel, setSel] = useState<DateRange>(value ?? {});
  const pick = (d: Date) => {
    if (Type === "Single") return setSel({ start: d, end: d });
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
            <Calendar key={i} year={d.getFullYear()} month={d.getMonth()} sel={sel} today={today} weekdays={weekdays} label={monthLabel(d.getFullYear(), d.getMonth())}
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

function Calendar({ year, month, sel, today, weekdays, label, prev, next, onPick }: {
  year: number; month: number; sel: DateRange; today: Date; weekdays: string[]; label: string; prev?: () => void; next?: () => void; onPick: (d: Date) => void;
}) {
  const start = new Date(year, month, 1);
  const lead = (start.getDay() + 6) % 7;   // จันทร์เป็นวันแรก (Mo–Su ตามไลบรารี)
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
          const out = d.getMonth() !== month;
          const isS = sameDay(d, s), isE = sameDay(d, e);
          const inRange = !!s && !!e && dayKey(d) > dayKey(s) && dayKey(d) < dayKey(e);
          const ranged = !!s && !!e && !sameDay(s, e);
          const type = isS || isE ? "Selected day" : inRange ? "Day in range" : sameDay(d, today) ? "Today" : "Day";
          return (
            <span key={d.toISOString()} className="relative flex size-10 items-center justify-center">
              {!out && ranged && (inRange || isE) && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-5 bg-gray-100" />}
              {!out && ranged && (inRange || isS) && <span aria-hidden="true" className="absolute inset-y-0 right-0 w-5 bg-gray-100" />}
              <button type="button" disabled={out} onClick={() => onPick(d)} aria-pressed={isS || isE}
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
