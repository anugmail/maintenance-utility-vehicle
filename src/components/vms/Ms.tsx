/* ไอคอน Material Symbols Rounded — ไลบรารี (Component) VMS Plus ใช้ไอคอนชุดนี้ทั้งหมด ชื่อแบบ "search-24-300-round" / "check_circle-20-300-round-fill"
   ไม่ใช่ component ของไลบรารี (เป็นตัวแสดงไอคอนที่ทุก component ใช้ร่วม) · name รับได้ทั้งชื่อ Figma และชื่อ Material ตรงๆ
   size = กรอบไอคอนตามที่ instance วางใน component (เช่นในปุ่มเป็น 20 แม้ชื่อเป็น -24-) */
import { cx } from "@/lib/cx";

/* ชื่อในไฟล์ Figma ที่ฟอนต์ Material Symbols ไม่มี → ชื่อที่หน้าตาเดียวกัน */
const ALIAS: Record<string, string> = { warning_circle: "error", cancel_circle: "cancel" };

export function parseIcon(name: string): { glyph: string; weight: number; fill: boolean } {
  const m = name.match(/^(.+?)-(\d+)-(?:outline-)?(\d{3})-round(-fill)?(?:-resized)?$/);
  const raw = m ? m[1].replace(/^_/, "") : name;
  return { glyph: ALIAS[raw] ?? raw, weight: m ? Number(m[3]) : 300, fill: m ? !!m[4] : false };
}

const SIZE: Record<number, string> = { 12: "text-[12px]", 16: "text-[16px]", 20: "text-[20px]", 24: "text-[24px]" };
const VAR: Record<string, string> = {
  "300-0": "[font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_24]",
  "400-0": "[font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24]",
  "300-1": "[font-variation-settings:'FILL'_1,'wght'_300,'GRAD'_0,'opsz'_24]",
  "400-1": "[font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24]",
};

export function Ms({ name, size = 20, className }: { name: string; size?: 12 | 16 | 20 | 24; className?: string }) {
  const { glyph, weight, fill } = parseIcon(name);
  return (
    <span aria-hidden="true" className={cx("ms shrink-0 select-none", SIZE[size], VAR[`${weight === 400 ? 400 : 300}-${fill ? 1 : 0}`], className)}>
      {glyph}
    </span>
  );
}
