import { cx } from "@/lib/cx";

export function ContentDivider({ Type = "Default", Text = "หรือ", className }: { Type?: "Default" | "Text"; Text?: string; className?: string }) {
  if (Type === "Default") return <div role="separator" className={cx("h-px w-full bg-gray-300", className)} />;
  return (
    <div role="separator" className={cx("flex items-center gap-1", className)}>
      <span className="h-px flex-1 bg-gray-300" /><span className="text-sm text-gray-600">{Text}</span><span className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
