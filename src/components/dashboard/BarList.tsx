/* แถบแนวนอนต่อแถว — เลียนแบบ VMS+ หน้า "แดชบอร์ดยานพาหนะ" การ์ด "ยานพาหนะตามสังกัด" และ "ประเภทยานพาหนะ" (page-vehicles.png)
   แถว = จุดสี + ชื่อ + › · จำนวน + หน่วย · % ของทั้งหมด · แถบสี (ยาวเทียบรายการมากสุด) · บรรทัดรอง · "แสดงทั้งหมด n รายการ" เมื่อเกิน limit
   กดแถว = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า (aria-pressed) · StackBarList = แถบซ้อนต่อแถว (ความคืบหน้าของแผน) + คำอธิบายสีด้านบน
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 เฉพาะแดชบอร์ด S4 S24 · ความยาวแถบเป็นค่าที่คำนวณตอนรัน (style width) */
import { useState } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "@/components/vms/Ms";
import { HUE, nf, pct, type Hue } from "./palette";

export interface BarItem { key: string; label: string; value: number; unit?: string; sub?: string; hue: Hue; active?: boolean;
  /** ค่าเทียบความยาวแถบ / % (ไม่ใส่ = เทียบทุกแถว) — ใช้เมื่อแถวต่างหน่วยกัน */
  max?: number; total?: number }

const Empty = ({ text }: { text: string }) => <p className="py-6 text-center text-sm text-gray-500">{text}</p>;

export function BarList({ items, unit = "", limit = 10, onPick, empty = "ไม่มีข้อมูลตามตัวกรอง" }: { items: BarItem[]; unit?: string; limit?: number; onPick?: (key: string) => void; empty?: string }) {
  const [all, setAll] = useState(false);
  if (!items.length) return <Empty text={empty} />;
  const max = Math.max(...items.map((i) => i.value), 1), total = items.reduce((a, i) => a + i.value, 0);
  const shown = all ? items : items.slice(0, limit);
  return (
    <div className="flex flex-col gap-1">
      {shown.map((it) => {
        const m = it.max ?? max, t = it.total ?? total;
        return (
          <button key={it.key} type="button" aria-pressed={!!it.active} disabled={!onPick} onClick={() => onPick?.(it.key)} data-bar={it.label}
            title={it.label + " " + nf(it.value) + " " + (it.unit ?? unit) + " (" + pct(it.value, t) + ")"}
            className={cx("flex w-full flex-col gap-1.5 rounded-md px-2 py-2 text-left", onPick && "cursor-pointer hover:bg-gray-50", it.active && "bg-brand-50 ring-1 ring-brand-200")}>
            <span className="flex w-full items-center gap-2">
              <span aria-hidden="true" className={cx("size-2.5 shrink-0 rounded-full", HUE[it.hue].bg)} />
              <span className="min-w-0 truncate text-sm text-gray-800">{it.label}</span>
              {onPick && <Ms name="chevron_right-24-300-round" size={16} className="text-gray-400" />}
              <span className="ml-auto shrink-0 text-sm font-semibold text-gray-900">{nf(it.value)} <span className="text-xs font-normal text-gray-500">{it.unit ?? unit}</span></span>
              <span className="w-12 shrink-0 text-right text-xs text-gray-500">{pct(it.value, t)}</span>
            </span>
            <span className="h-2 w-full overflow-hidden rounded-pill bg-gray-100">
              <span className={cx("block h-full rounded-pill", HUE[it.hue].bg)} style={{ width: Math.max(1.5, (it.value / m) * 100) + "%" }} />
            </span>
            {it.sub && <span className="text-xs text-gray-500">{it.sub}</span>}
          </button>
        );
      })}
      {items.length > limit && (
        <button type="button" onClick={() => setAll(!all)} className="mt-1 cursor-pointer self-start px-2 text-sm font-semibold text-info-700">
          {all ? "แสดงน้อยลง" : "แสดงทั้งหมด " + items.length + " รายการ"}
        </button>
      )}
    </div>
  );
}

/* ---------- แถบซ้อนต่อแถว ---------- */
export interface StackSeries { key: string; label: string; hue: Hue }
export interface StackItem { key: string; label: string; sub?: string; values: number[]; active?: boolean }

export function Legend({ series }: { series: StackSeries[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {series.map((s) => <li key={s.key} className="flex items-center gap-1.5 text-xs text-gray-600"><span aria-hidden="true" className={cx("size-2.5 rounded-full", HUE[s.hue].bg)} />{s.label}</li>)}
    </ul>
  );
}

export function StackBarList({ series, items, unit, onPick, empty = "ไม่มีข้อมูลตามตัวกรอง" }: { series: StackSeries[]; items: StackItem[]; unit: string; onPick?: (key: string) => void; empty?: string }) {
  if (!items.length) return <Empty text={empty} />;
  return (
    <div className="flex flex-col gap-3">
      <Legend series={series} />
      <div className="flex flex-col gap-1">
        {items.map((it) => {
          const total = it.values.reduce((a, v) => a + v, 0);
          return (
            <button key={it.key} type="button" aria-pressed={!!it.active} onClick={() => onPick?.(it.key)} data-bar={it.label}
              title={it.label + " · " + series.map((s, i) => s.label + " " + nf(it.values[i]) + " " + unit).join(" · ")}
              className={cx("flex w-full cursor-pointer flex-col gap-1.5 rounded-md px-2 py-2 text-left hover:bg-gray-50", it.active && "bg-brand-50 ring-1 ring-brand-200")}>
              <span className="flex w-full items-center gap-2">
                <span className="min-w-0 truncate text-sm font-semibold text-gray-800">{it.label}</span>
                <Ms name="chevron_right-24-300-round" size={16} className="text-gray-400" />
                <span className="ml-auto shrink-0 text-xs text-gray-600">{series.map((s, i) => s.label + " " + nf(it.values[i])).join(" · ")} {unit}</span>
              </span>
              <span className="flex h-3 w-full gap-0.5 overflow-hidden rounded-pill bg-gray-100">
                {it.values.map((v, i) => v > 0 && <span key={i} className={cx("block h-full", HUE[series[i].hue].bg)} style={{ width: (v / Math.max(total, 1)) * 100 + "%" }} />)}
              </span>
              {it.sub && <span className="text-xs text-gray-500">{it.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
