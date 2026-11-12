/* โดนัท + ตัวเลขรวมตรงกลาง + ตารางคำอธิบาย — เลียนแบบ VMS+ หน้า "แดชบอร์ดยานพาหนะ" การ์ด "สถานะยานพาหนะ" / "กลุ่มเชื้อเพลิง" (page-vehicles.png)
   วาดด้วย inline SVG (วงกลม stroke-dasharray · ช่องไฟ 2px ระหว่างชิ้น) · ตารางคำอธิบาย = สี · ชื่อ · จำนวน · %
   กดชิ้นโดนัทหรือแถวในตาราง = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า · ชิ้นที่เลือกอยู่หนาขึ้น ชิ้นอื่นจางลง · ชี้ที่ชิ้น = ป้ายชื่อ (title)
   LegendTable ใช้ร่วมกับตารางสรุปใต้กราฟแท่ง (ColumnChart)
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 เฉพาะแดชบอร์ด S4 S24 */
import { cx } from "@/lib/cx";
import { HUE, nf, pct, type Hue } from "./palette";

export interface Slice { key: string; label: string; value: number; hue: Hue; active?: boolean }

const R = 70, C = 2 * Math.PI * R, GAP = 2;

export function Donut({ slices, unit, labelHead, onPick }: { slices: Slice[]; unit: string; labelHead: string; onPick?: (key: string) => void }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  const anyActive = slices.some((s) => s.active);
  const live = slices.filter((s) => s.value > 0);
  let off = 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto size-48">
        <svg viewBox="0 0 200 200" className="size-full -rotate-90" role="img" aria-label={labelHead + " " + slices.map((s) => s.label + " " + s.value).join(" · ")}>
          <circle cx="100" cy="100" r={R} fill="none" strokeWidth="28" className="stroke-gray-100" />
          {live.map((s) => {
            const len = (s.value / Math.max(total, 1)) * C, gap = live.length > 1 ? GAP : 0;
            const el = (
              <circle key={s.key} cx="100" cy="100" r={R} fill="none" strokeWidth={s.active ? 34 : 28}
                strokeDasharray={Math.max(0.5, len - gap) + " " + (C - Math.max(0.5, len - gap))} strokeDashoffset={-off}
                className={cx(HUE[s.hue].stroke, onPick && "cursor-pointer", anyActive && !s.active && "opacity-40")}
                onClick={() => onPick?.(s.key)} data-slice={s.label}>
                <title>{s.label + " " + nf(s.value) + " " + unit + " (" + pct(s.value, total) + ")"}</title>
              </circle>
            );
            off += len;
            return el;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{nf(total)}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <LegendTable head={[labelHead, "จำนวน (" + unit + ")", "%"]} onPick={onPick}
        rows={slices.map((s) => ({ key: s.key, hue: s.hue, label: s.label, cells: [nf(s.value), pct(s.value, total)], active: s.active }))} />
    </div>
  );
}

export interface LegendRow { key: string; hue: Hue; label: string; cells: string[]; active?: boolean }

/** ตารางคำอธิบาย/ตารางสรุป: คอลัมน์แรก จุดสี + ชื่อ · คอลัมน์ตัวเลขชิดขวา · แถวรวมท้าย (foot) · กดแถว = onPick */
export function LegendTable({ head, rows, foot, onPick }: { head: string[]; rows: LegendRow[]; foot?: string[]; onPick?: (key: string) => void }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-500">
          {head.map((h, i) => <th key={i} scope="col" className={cx("py-2 font-normal", i ? "pl-2 text-right" : "text-left")}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.key} className={cx(r.active && "bg-brand-50")}>
            <td className="py-1.5">
              <button type="button" aria-pressed={!!r.active} disabled={!onPick} onClick={() => onPick?.(r.key)} data-legend={r.label}
                className={cx("flex items-center gap-2 text-left text-gray-800", onPick && "cursor-pointer hover:text-info-700")}>
                <span aria-hidden="true" className={cx("size-2.5 shrink-0 rounded-full", HUE[r.hue].bg)} />{r.label}
              </button>
            </td>
            {r.cells.map((c, i) => <td key={i} className={cx("py-1.5 pl-2 text-right", i === 0 ? "font-semibold text-gray-900" : "text-xs text-gray-500")}>{c}</td>)}
          </tr>
        ))}
      </tbody>
      {foot && (
        <tfoot>
          <tr className="border-t border-gray-200 font-semibold text-gray-900">
            {foot.map((f, i) => <td key={i} className={cx("py-2", i ? "pl-2 text-right" : "")}>{f}</td>)}
          </tr>
        </tfoot>
      )}
    </table>
  );
}
