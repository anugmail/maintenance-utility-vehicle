import { Ms } from "./Ms";

const NAME = { Swap: "swap_vert-20-300-round", Up: "arrow_upward_alt-20-300-round", Down: "arrow_downward_alt-20-300-round" } as const;

export function SortIcon({ Icon = "Swap" }: { Icon?: "Down" | "Up" | "Swap" }) {
  return <Ms name={NAME[Icon]} size={20} className="text-gray-400" />;
}
