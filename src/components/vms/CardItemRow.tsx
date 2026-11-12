/* Figma: "Card item row" — ไฟล์ (Component) VMS Plus หน้า Cards (node 2413:11354) · สเปก figma-spec/Card item row.json
   แถวของการ์ด (การ์ด "การใช้งานล่าสุด" ของหน้า 5.2 Vehicle Management · UI Release#2: Type=1 Row ช่องเดียว · สูง 24)
   variant: Type = 1 Row (ช่องเรียงแนวนอน ช่องไฟ 8 กว้างเท่ากัน) | 2 Rows (ช่องเรียงแนวตั้ง ช่องไฟ 16)
   property: Item 1 · Item 2 (เปิด/ปิดช่อง — ส่งเฉพาะช่องที่เปิด) · ลูก = Card item base */
import { cx } from "@/lib/cx";
import { CardItemBase, type CardItemBaseProps } from "./CardItemBase";

export function CardItemRow({ Type = "1 Row", items, className }: { Type?: "1 Row" | "2 Rows"; items: CardItemBaseProps[]; className?: string }) {
  return (
    <div className={cx("flex", Type === "1 Row" ? "gap-2" : "flex-col gap-4", className)}>
      {items.map((it, i) => <CardItemBase key={i} {...it} className={cx(Type === "1 Row" && "flex-1", it.className)} />)}
    </div>
  );
}
