/* การ์ดตัวเลขสีไล่เฉด — เลียนแบบการ์ดแถวบนของ VMS+ หน้า "แดชบอร์ดยานพาหนะ" (vmsplus.pea.co.th/dashboard · page-vehicles.png)
   และ "แดชบอร์ดฟลีทการ์ด" (page-fleetcard.png): ไอคอน + ชื่อ · ตัวเลขใหญ่ + หน่วย · บรรทัดรอง · วงกลมโปร่งมุมขวาบน
   ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 ใช้ได้เฉพาะแดชบอร์ด S4 S24 (figma-spec/COMPOSED.md หัวข้อ "แดชบอร์ดแบบ VMS+")
   สีไล่เฉดจาก token 2 ขั้นของสีเดียวกัน (เช่น info-600 → info-700) · ตัวอักษรขาวบนพื้นเข้ม */
import { cx } from "@/lib/cx";
import { Ms } from "@/components/vms/Ms";

export type KpiTone = "blue" | "green" | "purple" | "orange" | "red" | "navy" | "magenta";
const GRAD: Record<KpiTone, string> = {
  blue: "from-info-600 to-info-700",
  green: "from-success-600 to-success-700",
  purple: "from-purple-600 to-purple-700",
  orange: "from-warning-600 to-warning-700",
  red: "from-error-500 to-error-700",
  navy: "from-secondary-700 to-secondary-600",
  magenta: "from-brand-800 to-brand-950",
};

export interface KpiCardProps { tone: KpiTone; icon: string; label: string; value: string; unit?: string; sub?: string }

export function KpiCard({ tone, icon, label, value, unit, sub }: KpiCardProps) {
  return (
    <div data-kpi={label} className={cx("relative flex min-w-0 flex-col gap-1 overflow-hidden rounded-xl bg-linear-to-br p-4 text-white shadow-field", GRAD[tone])}>
      <span aria-hidden="true" className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full bg-white/10" />
      <div className="flex items-center gap-2 text-sm font-semibold"><Ms name={icon} size={20} /><span className="min-w-0">{label}</span></div>
      <div className="flex items-baseline gap-1.5">
        <span data-value className="text-xl leading-tight font-bold xl:text-title xl:leading-tight">{value}</span>
        {unit && <span className="text-sm">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-white/90">{sub}</p>}
    </div>
  );
}

/** แถวการ์ด: มือถือ 2 ใบต่อแถว · แท็บเล็ต 3 · จอกว้าง 6 ใบแถวเดียว */
export function KpiRow({ items }: { items: KpiCardProps[] }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6 xl:gap-4">{items.map((k) => <KpiCard key={k.label} {...k} />)}</div>;
}
