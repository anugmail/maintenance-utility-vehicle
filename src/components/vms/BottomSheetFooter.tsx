import type { ReactNode } from "react";

export function BottomSheetFooter({ SecondaryAction, PrimaryAction }: { SecondaryAction?: ReactNode; PrimaryAction?: ReactNode }) {
  return (
    <div className="pt-6">
      <div className="flex gap-4 px-4 pb-4 [&>*]:flex-1 [&>*]:basis-0">{SecondaryAction}{PrimaryAction}</div>
    </div>
  );
}
