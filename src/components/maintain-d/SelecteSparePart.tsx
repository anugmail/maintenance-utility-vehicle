"use client";
/* Figma: "Selecte Spare Part" — ไฟล์ Maintain-D หน้า Local Component (node 8:133440) · สเปก figma-spec/Selecte Spare Part.json (ชื่อตามไฟล์ — สะกด "Selecte") (CLAUDE.md ข้อ 12)
   ปุ่มเลือกอะไหล่ท้ายการ์ด Spare Part Card Item · variant: State = Add | Checked | Text
   ค่า: Add = Secondary button md ไอคอน add 20 อย่างเดียว 44×44 · Checked = Primary button md ไอคอน check 20 · Text = ราคารวม 16 SemiBold gray-600 */
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";

export function SelecteSparePart({ State = "Add", Text, label = "เลือก", onClick }: { State?: "Add" | "Checked" | "Text"; Text?: string; label?: string; onClick?: () => void }) {
  if (State === "Text") return <span className="shrink-0 text-md font-semibold text-gray-600">{Text}</span>;
  const B = State === "Checked" ? PrimaryButton : SecondaryButton;
  return <B LeadingIconSwap={State === "Checked" ? "check-20-400-round" : "add-20-400-round"} ButtonText={false} aria-label={label} aria-pressed={State === "Checked"} title={label} onClick={onClick} className="size-11" />;
}
