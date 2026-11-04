/* Figma: "Content divider" — ไฟล์ (Component) VMS Plus หน้า Content divider (node 2635:20181) · สเปก figma-spec/Content divider.json
   variant: Type = Default | Text · property: Text ("หรือ")
   ค่า: เส้น 1 gray-300 · Text: เส้น + ข้อความ 14 Regular gray-600 + เส้น ช่องไฟ 4 */
import { cx } from "@/lib/cx";

export function ContentDivider({ Type = "Default", Text = "หรือ", className }: { Type?: "Default" | "Text"; Text?: string; className?: string }) {
  if (Type === "Default") return <div role="separator" className={cx("h-px w-full bg-gray-300", className)} />;
  return (
    <div role="separator" className={cx("flex items-center gap-1", className)}>
      <span className="h-px flex-1 bg-gray-300" /><span className="text-sm text-gray-600">{Text}</span><span className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
