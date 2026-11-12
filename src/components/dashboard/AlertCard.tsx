/* กล่อง "เรื่องที่ควรดู" — เลียนแบบ VMS+ หน้า "ภาพรวมแดชบอร์ด" (shot-1-dashboard.png): หัว ไอคอนกระดิ่ง + "เรื่องที่ควรดู" + ป้าย "n เรื่อง"
   การ์ด 2 คอลัมน์ (มือถือ 1) สีเหลือง = ต้องรีบดู (warning) · สีฟ้า = ข้อมูลไม่ครบ (info) · หัวข้อตัวหนา + บรรทัดอธิบาย + ›
   กดการ์ด = กรองทั้งหน้าตามเรื่องนั้น (หน้าเป็นผู้ใส่ตัวกรอง) · กดซ้ำขณะกรองอยู่ = เอาตัวกรองนั้นออก (aria-pressed)
   ไม่มีเรื่อง = บรรทัดเดียว (emptyText) · ไม่ใช่ component ของไลบรารี PEA — ข้อยกเว้นเจ้าของงาน 12 พ.ย. 2569 เฉพาะแดชบอร์ด S4 S24 */
import { cx } from "@/lib/cx";
import { Ms } from "@/components/vms/Ms";
import { PillOutline } from "@/components/vms/PillOutline";

export interface DashAlert { key: string; tone: "warning" | "info"; title: string; text: string; active?: boolean; onClick: () => void }

const TONE = {
  warning: { box: "border-warning-200 bg-warning-50 hover:border-warning-600", icon: "warning-24-300-round", ic: "text-warning-600", title: "text-warning-800" },
  info: { box: "border-info-200 bg-info-25 hover:border-info-600", icon: "info-24-300-round", ic: "text-info-600", title: "text-info-700" },
};

export function AlertCard({ tone, title, text, active, onClick }: Omit<DashAlert, "key">) {
  const t = TONE[tone];
  return (
    <button type="button" aria-pressed={!!active} onClick={onClick} data-alert={title}
      className={cx("flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-left", t.box, active && "ring-2 ring-brand-800")}>
      <Ms name={t.icon} size={20} className={cx("mt-0.5", t.ic)} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cx("text-sm font-semibold", t.title)}>{title}</span>
        <span className="text-xs text-gray-600">{text}</span>
      </span>
      <Ms name={active ? "close-24-300-round" : "chevron_right-24-300-round"} size={20} className="mt-0.5 text-gray-500" />
    </button>
  );
}

export function AlertBox({ alerts, emptyText }: { alerts: DashAlert[]; emptyText: string }) {
  return (
    <section aria-label="เรื่องที่ควรดู" className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-field md:p-5">
      <div className="flex items-center gap-2">
        <Ms name="notifications-24-300-round" size={20} className="text-warning-600" />
        <h2 className="text-md font-semibold text-gray-900">เรื่องที่ควรดู</h2>
        <PillOutline Text={alerts.length + " เรื่อง"} Color="Gray" />
      </div>
      {alerts.length
        ? <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{alerts.map(({ key, ...a }) => <AlertCard key={key} {...a} />)}</div>
        : <p className="flex items-center gap-2 text-sm text-gray-600"><Ms name="check_circle-24-300-round" size={20} className="text-success-600" />{emptyText}</p>}
    </section>
  );
}
