/* Figma: "Sort icon" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Sort icon.json
   variant: Icon = Down | Up | Swap · 20×20 · gray-400 (swap_vert / arrow_upward_alt / arrow_downward_alt weight 300) */
import { Ms } from "./Ms";

const NAME = { Swap: "swap_vert-20-300-round", Up: "arrow_upward_alt-20-300-round", Down: "arrow_downward_alt-20-300-round" } as const;

export function SortIcon({ Icon = "Swap" }: { Icon?: "Down" | "Up" | "Swap" }) {
  return <Ms name={NAME[Icon]} size={20} className="text-gray-400" />;
}
