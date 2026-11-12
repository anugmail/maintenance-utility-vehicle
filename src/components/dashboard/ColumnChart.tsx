/* กราฟแท่งแนวตั้ง (แท่งเดี่ยว / แท่งซ้อน) — เลียนแบบ VMS+ หน้า "แดชบอร์ดยานพาหนะ" การ์ด "อายุการใช้งานของยานพาหนะ" (page-vehicles.png)
   และ "แนวโน้มรายเดือน" ของ "แดชบอร์ดฟลีทการ์ด" (page-fleetcard.png): แกนตั้งเส้นจางพร้อมตัวเลข · แท่งปลายมน · ป้ายใต้แท่ง · ตัวเลขรวมบนแท่ง
   แกนเดียว (ไม่มีแกนคู่) · หลายชุดข้อมูล = แท่งซ้อน ช่องไฟ 2px + คำอธิบายสีด้านบน · ชี้ที่แท่ง = ป้ายรายละเอียด (title)
   กดแท่ง = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า · แท่งที่เลือกอยู่มีกรอบ แท่งอื่นจางลง · ความสูงแท่งเป็นค่าที่คำนวณตอนรัน (style height)
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 เฉพาะแดชบอร์ด S4 S24 */
import { cx } from "@/lib/cx";
import { Legend, type StackSeries } from "./BarList";
import { HUE, nf } from "./palette";

export interface ColGroup { key: string; label: string; sub?: string; values: number[]; active?: boolean }

/** ขั้นแกนตั้ง 1 · 2 · 5 × 10^n ให้ได้ราว 4 ช่อง */
function ticksOf(max: number) {
  if (max <= 0) return [0, 1];
  const raw = max / 4, p = 10 ** Math.floor(Math.log10(raw)), step = [1, 2, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? raw;
  const top = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
}

export function ColumnChart({ series, groups, unit, onPick, height = "h-48", compact, scroll }: {
  series: StackSeries[]; groups: ColGroup[]; unit: string; onPick?: (key: string) => void; height?: string; compact?: boolean;
  /** แท่งหลายเดือนบนจอแคบ: เลื่อนแนวนอนได้ (กว้างอย่างน้อย 560) ป้ายใต้แท่งไม่ถูกตัด */
  scroll?: boolean;
}) {
  const totals = groups.map((g) => g.values.reduce((a, v) => a + v, 0));
  const ticks = ticksOf(Math.max(...totals, 0)), top = ticks[ticks.length - 1];
  const anyActive = groups.some((g) => g.active);
  return (
    <div className="flex min-w-0 flex-col gap-3">
      {series.length > 1 && <Legend series={series} />}
      <div className={cx(scroll && "-mx-1 overflow-x-auto px-1 pb-1")}>
      <div className={cx("mt-5 flex gap-2", scroll && "min-w-[560px]")}>
        <div className={cx("relative w-8 shrink-0", height)}>
          {ticks.map((t) => <span key={t} className="absolute right-0 translate-y-1/2 text-xs text-gray-500" style={{ bottom: (t / top) * 100 + "%" }}>{nf(t)}</span>)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className={cx("relative", height)}>
            {ticks.map((t) => <span key={t} aria-hidden="true" className={cx("absolute inset-x-0 border-t", t ? "border-gray-100" : "border-gray-300")} style={{ bottom: (t / top) * 100 + "%" }} />)}
            <div className={cx("absolute inset-0 flex items-end", compact ? "gap-1" : "gap-2 md:gap-3")}>
              {groups.map((g, gi) => (
                <button key={g.key} type="button" aria-pressed={!!g.active} disabled={!onPick} onClick={() => onPick?.(g.key)} data-col={g.label}
                  aria-label={g.label + " " + series.map((s, i) => s.label + " " + g.values[i]).join(" · ") + " " + unit}
                  title={g.label + "\n" + series.map((s, i) => s.label + " " + nf(g.values[i]) + " " + unit).join("\n")}
                  className={cx("group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end", onPick && "cursor-pointer", anyActive && !g.active && "opacity-40")}>
                  <span className="relative flex w-full max-w-12 shrink-0 flex-col" style={{ height: (totals[gi] / top) * 100 + "%" }}>
                    {totals[gi] > 0 && <span className="absolute inset-x-0 -top-5 text-center text-xs font-semibold text-gray-700">{nf(totals[gi])}</span>}
                    <span className={cx("flex h-full w-full flex-col-reverse gap-0.5 overflow-hidden rounded-t-sm group-hover:opacity-80", g.active && "ring-2 ring-brand-800 ring-offset-2")}>
                      {g.values.map((v, i) => v > 0 && <span key={i} className={cx("block w-full shrink-0", HUE[series[i].hue].bg)} style={{ height: "calc(" + (v / Math.max(totals[gi], 1)) * 100 + "% - 2px)" }} />)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className={cx("flex", compact ? "gap-1" : "gap-2 md:gap-3")}>
            {groups.map((g) => (
              <span key={g.key} className="min-w-0 flex-1 text-center text-xs leading-tight text-gray-600">
                <span className="block truncate">{g.label}</span>{g.sub && <span className="block truncate text-gray-400">{g.sub}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
