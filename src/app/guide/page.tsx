"use client";
/* หน้าของต้นแบบ (ไม่ใช่จอของระบบ): เมนูพาดูทีละเรื่อง /guide/ — เปิดจากปุ่ม "พาดูทีละเรื่อง" ในแถบต้นแบบ
   เจ้าของงาน 5 พ.ย. 2569 _"อยากให้มีเมนูแยกออกมาเลย ว่า เป็นเรื่องที่แยก scen"_ · ลูกค้าเห็นหน้านี้ตอนยืนยันงาน ⇒ ภาษาคนพูด ไม่มีรหัส scenario (lib/guide/types.ts)
   รายการอ่านจาก GUIDES (lib/guide/scenarios.ts) เอง ⇒ เรื่องที่เพิ่มทีหลังขึ้นที่นี่เลย · ช่วงงานและลำดับตาม SCENARIOS (lib/scenarios.ts) จับคู่ด้วยรหัส scenario
     scenario ที่ทำหน้าจอแล้วแต่ยังไม่มีเคส = การ์ด "ยังไม่มีเคส" ปุ่มกดไม่ได้ · ไม่แสดง scenario ที่ตัดออก และที่ยังไม่มีหน้าจอ (ไม่มี href)
   ไม่มีจอนี้ในไฟล์ Component และ UI Release#2 ⇒ ประกอบจากชิ้นไลบรารี (COMPOSED.md หัวข้อ ท.):
     `Page header` → ช่วงงานละ 1 Section: `Section header` (ชื่อช่วงงาน + Badge จำนวนเรื่อง) → การ์ด `Mobile table` 1 เรื่อง = 1 การ์ด
     (Lead text ชื่อเรื่อง + Supporting text สิ่งที่เรื่องนี้ทำได้ · ผู้ใช้งาน · เคส · ชีตยืนยัน · Mobile table item Style=Action buttons "ดูเคส")
     desktop การ์ดเรียง 2 คอลัมน์ แบบหน้าเรื่อง /scenarios/guide/ */
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { cx } from "@/lib/cx";
import { GUIDES, sheetPagesOf, sheetText } from "@/lib/guide/scenarios";
import { scenarioHref } from "@/lib/guide/start";
import type { GuideScenario } from "@/lib/guide/types";
import { SCENARIOS } from "@/lib/scenarios";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [{ head: "เรื่อง", Style: "Lead text" }, { head: "ผู้ใช้งาน" }, { head: "เคส" }, { head: "ชีตยืนยัน" }, { head: "", Style: "Action icons" }];
/* ภาษาคนพูด: ช่วงงานตัดวงเล็บ ("หลังปิดงาน (ข้อมูลรถ)" = "หลังปิดงาน") · บทบาทหลายบทบาทเชื่อมด้วย "และ" แทน "·" · ตัดวงเล็บภาษาอังกฤษ เช่น (vendor) */
const phaseOf = (p: string) => p.replace(/\s*\(.*\)$/, "");
const plain = (t: string) => t.replace(/\s*\([A-Za-z ]+\)/g, "").replace(/\s*·\s*/g, " และ ");

interface Item { code: string; title: string; who: string; guide?: GuideScenario }
function groups(): { phase: string; items: Item[] }[] {
  const out: { phase: string; items: Item[] }[] = [];
  const push = (phase: string, it: Item) => { let g = out.find((x) => x.phase === phase); if (!g) out.push((g = { phase, items: [] })); g.items.push(it); };
  for (const s of SCENARIOS) {
    if (s.cut || !s.href) continue;
    const g = GUIDES.find((x) => x.code === s.id);
    /* ยังไม่มีเคส: ชื่อจากรายการ scenario ตัดบทบาทที่ขึ้นต้นออก (บทบาทอยู่ช่องผู้ใช้งานแล้ว) */
    const title = g ? g.title : s.name.startsWith(s.role + " ") ? s.name.slice(s.role.length + 1) : s.name;
    push(phaseOf(s.phase), { code: s.id, title: plain(title), who: g ? g.who : plain(s.role), guide: g });
  }
  /* เรื่องที่ไม่มีในรายการ scenario (ไม่ควรมี) ต่อท้าย */
  GUIDES.filter((g) => !SCENARIOS.some((s) => s.id === g.code)).forEach((g) => push("เรื่องอื่น", { code: g.code, title: g.title, who: g.who, guide: g }));
  return out;
}

export default function GuideMenu() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const card = (it: Item): TableValue[] => {
    const g = it.guide;
    return [
      g ? { text: it.title, sub: g.about } : it.title, it.who,
      g ? g.cases.length + " เคส" : "ยังไม่มีเคส",
      g ? sheetText(sheetPagesOf(g)) : "-",
      { actions: [], mobileButtons: <SecondaryButton Text="ดูเคส" LeadingIconSwap="school-24-300-round" Size="lg" State={g ? "Default" : "Disabled"}
        aria-label={"ดูเคส " + it.title} onClick={() => g && router.push(scenarioHref(g.key, "menu"))} /> },
    ];
  };
  return (
    <AppFrame>
      <PageHeader Title="พาดูทีละเรื่อง" SupportingText="เลือกเรื่องที่ต้องการดู แต่ละเรื่องมีเคสให้เดินดูทีละขั้นด้วยข้อมูลชุดเดิมทุกครั้ง เรียงตามช่วงงาน"
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "พาดูทีละเรื่อง" }]} />
      {groups().map(({ phase, items }) => (
        <section key={phase} data-phase={phase} className="flex flex-col gap-4">
          <SectionHeader Title={phase} Badge={items.length + " เรื่อง"} />
          <div className={cx("grid gap-4", !mob && "grid-cols-2")}>
            {items.map((it) => <div key={it.code} data-guide-item={it.guide ? it.guide.key : ""}><MobileCards columns={COLS} rows={[card(it)]} /></div>)}
          </div>
        </section>
      ))}
    </AppFrame>
  );
}
