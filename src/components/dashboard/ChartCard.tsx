/* กรอบการ์ดกราฟ + ปุ่มสลับมุมมอง + หัวแดชบอร์ด + หมายเหตุแหล่งข้อมูล — เลียนแบบ VMS+ หน้า "แดชบอร์ดยานพาหนะ" (page-vehicles.png)
   การ์ดพื้นขาว มุมมน: หัว = ไอคอนสี + ชื่อ + บรรทัดรอง · ขวาบนปุ่มสลับ (หน่วยงาน / เขต) · ท้ายการ์ด "ข้อมูลจาก … | คลิกกราฟหรือรายการเพื่อกรองทั้งหน้า"
   หัวแดชบอร์ด (DashHead) = กรอบไอคอนสี + ชื่อ + บรรทัดอธิบาย · ขวาบนป้าย "ข้อมูล ณ …" จุดเขียว (page-fleetcard.png)
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 ใช้ได้เฉพาะแดชบอร์ด S4 S24 (figma-spec/COMPOSED.md หัวข้อ "แดชบอร์ดแบบ VMS+") */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "@/components/vms/Ms";
import { HUE, type Hue } from "./palette";

export const PICK_HINT = "คลิกกราฟหรือรายการเพื่อกรองทั้งหน้า";

export interface ChartCardProps {
  icon: string; hue?: Hue; title: string; sub?: string;
  /** ขวาบนของหัวการ์ด (เช่น ปุ่มสลับ) */
  action?: ReactNode;
  /** ข้อมูลจาก … */
  source: string;
  hint?: string | false;
  className?: string; children: ReactNode;
}

export function ChartCard({ icon, hue = "blue", title, sub, action, source, hint = PICK_HINT, className, children }: ChartCardProps) {
  return (
    <section aria-label={title} data-chart={title} className={cx("flex min-w-0 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-field md:p-6", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <Ms name={icon} size={20} className={cx("mt-0.5", HUE[hue].text)} />
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-900">{title}</h3>
            {sub && <p className="text-xs text-gray-600">{sub}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      <p className="text-xs text-gray-500">{source}{hint && <> <span className="text-gray-300">|</span> <span className="text-info-700">{hint}</span></>}</p>
    </section>
  );
}

/** ปุ่มสลับมุมมอง (หน่วยงาน / เขต) */
export function Toggle({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 rounded-lg bg-gray-100 p-1">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={o === value} onClick={() => onChange(o)}
          className={cx("cursor-pointer rounded-md px-3 py-1 text-xs font-semibold", o === value ? "bg-white text-info-700 shadow-field" : "text-gray-600 hover:text-gray-900")}>{o}</button>
      ))}
    </div>
  );
}

/** ป้าย "ข้อมูล ณ …" มีจุดสีเขียว */
export function DataAsOf({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-field">
      <span aria-hidden="true" className="size-2.5 rounded-full bg-success-600 ring-4 ring-success-100" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">{text}</span>
        {sub && <span className="text-xs text-gray-500">{sub}</span>}
      </div>
    </div>
  );
}

/** หัวแดชบอร์ด: กรอบไอคอนสี + ชื่อ + บรรทัดอธิบาย · ขวา ป้ายข้อมูล ณ */
export function DashHead({ icon, title, text, asOf }: { icon: string; title: string; text: string; asOf?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-800 to-brand-950 text-white shadow-field"><Ms name={icon} size={24} /></span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{text}</p>
        </div>
      </div>
      {asOf}
    </div>
  );
}

/** หมายเหตุแหล่งข้อมูลท้ายหน้า (ตัวเล็กสีเทา กลางหน้า) */
export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="mx-auto max-w-3xl text-center text-xs text-gray-500">{children}</p>;
}

/** ตารางกราฟ: มือถือเรียงลง · จอกว้าง 3 คอลัมน์ (การ์ดกว้างใส่ lg:col-span-2) */
export function ChartGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">{children}</div>;
}
