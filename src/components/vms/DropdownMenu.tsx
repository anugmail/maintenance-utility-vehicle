import { cx } from "@/lib/cx";
import { DropdownMenuItem } from "./DropdownMenuItem";

export interface MenuEntry { Text: string; IconSwap?: string; onClick?: () => void; Disabled?: boolean }

export function DropdownMenu({ items, bare, className }: { items: MenuEntry[]; bare?: boolean; className?: string }) {
  return (
    <div role="menu" className={cx("flex flex-col bg-white py-1", bare ? "" : "w-60 rounded-md border border-gray-200 shadow-lg-lib", className)}>
      {items.map((it, i) => (
        <div key={it.Text}>
          {i === 2 && <DropdownMenuItem Divider />}
          <DropdownMenuItem Text={it.Text} IconSwap={it.IconSwap} State={it.Disabled ? "Disabled" : "Default"} onClick={it.onClick} />
        </div>
      ))}
    </div>
  );
}
