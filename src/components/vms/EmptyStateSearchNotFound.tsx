import type { ReactNode } from "react";
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";

export function EmptyStateSearchNotFound({ Text = "ไม่พบข้อมูล", SupportingText = "เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง", Actions, className }: { Text?: string; SupportingText?: string; Actions?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-6 bg-white py-10", className)}>
      <div className="flex w-full max-w-[360px] flex-col items-center gap-3 text-center">
        <img src={asset("/figma-img/empty-search.png")} alt="" aria-hidden="true" width={200} height={200} />
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-xl font-semibold text-black">{Text}</p>
          {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
        </div>
      </div>
      {Actions && <div className="flex gap-4">{Actions}</div>}
    </div>
  );
}
