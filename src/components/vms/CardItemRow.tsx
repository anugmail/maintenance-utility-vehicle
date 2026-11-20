import { cx } from "@/lib/cx";
import { CardItemBase, type CardItemBaseProps } from "./CardItemBase";

export function CardItemRow({ Type = "1 Row", items, className }: { Type?: "1 Row" | "2 Rows"; items: CardItemBaseProps[]; className?: string }) {
  return (
    <div className={cx("flex", Type === "1 Row" ? "gap-2" : "flex-col gap-4", className)}>
      {items.map((it, i) => <CardItemBase key={i} {...it} className={cx(Type === "1 Row" && "flex-1", it.className)} />)}
    </div>
  );
}
