"use client";
import { Fragment, type ReactNode } from "react";
import { BackgroundOverlay } from "@/components/vms/BackgroundOverlay";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { ContentDivider } from "@/components/vms/ContentDivider";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { baht } from "./SparePartCardItem";

export interface SummaryGroup { title: string; subs: { title: string; rows: [string, number][] }[] }

export function SummaryRequestedParts({ open, Title = "สรุปรายการอะไหล่", info, groups, totals, cancel = "ปิด", ok = "ยืนยัน", onOk, onCancel }: {
  open: boolean; Title?: string; info?: ReactNode; groups: SummaryGroup[]; totals: [string, number][]; cancel?: string; ok?: string; onOk?: () => void; onCancel?: () => void;
}) {
  const mob = useBreakpoint() === "Mobile";
  if (!open) return null;
  const sum = totals.reduce((a, [, n]) => a + n, 0);
  const row = (k: string, v: string, strong?: boolean) => <div className="flex gap-4 text-sm text-gray-600"><span className={strong ? "flex-1 font-semibold" : "flex-1"}>{k}</span><span className={strong ? "flex-1 font-semibold" : "flex-1"}>{v}</span></div>;
  const body = (
    <div className="flex flex-col gap-6">
      {info}
      {groups.map((g) => (
        <section key={g.title} className="flex flex-col gap-2">
          <SectionLabel Title={g.title} className="min-h-10" />
          <div className="flex flex-col gap-4 rounded-md bg-gray-50 p-6">
            {g.subs.map((s, i) => (
              <Fragment key={s.title}>
                {i > 0 && <ContentDivider />}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-600">{s.title}</p>
                  {s.rows.map(([n, v]) => <Fragment key={n}>{row(n, baht(v))}</Fragment>)}
                </div>
              </Fragment>
            ))}
          </div>
        </section>
      ))}
      <section className="flex flex-col gap-2">
        <SectionHeader Title="รวมค่าอะไหล่" Breakpoint="Desktop" />
        {totals.map(([k, v]) => <div key={k} className="flex gap-4 text-sm text-gray-600"><span className="flex-1">{k}</span><span className="flex-1 font-semibold">{baht(v)}</span></div>)}
        {row("รวม", baht(sum), true)}
      </section>
    </div>
  );
  const Cancel = <SecondaryButton Text={cancel} Size={mob ? "lg" : "md"} onClick={onCancel} className={mob ? undefined : "min-w-25"} />;
  const Ok = <PrimaryButton Text={ok} Size={mob ? "lg" : "md"} onClick={onOk} className={mob ? undefined : "min-w-25"} />;
  if (mob) return <BottomSheet open onClose={onCancel} Title={Title} Footer={<BottomSheetFooter SecondaryAction={Cancel} PrimaryAction={Ok} />}>{body}</BottomSheet>;
  return (
    <>
      <BackgroundOverlay onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10" onClick={onCancel}>
        <div role="dialog" aria-modal="true" aria-labelledby="sum-title" onClick={(e) => e.stopPropagation()} className="my-auto flex w-[500px] max-w-full flex-col rounded-lg bg-white animate-fade-in">
          <ModalHeader id="sum-title" Alignment="Left" FeaturedIcon={false} Divider Title={Title} onClose={onCancel} />
          <div className="px-6">{body}</div>
          <ModalFooter Alignment="Horizontal right" Divider PaddingTop={false} SecondaryAction={Cancel} PrimaryAction={Ok} />
        </div>
      </div>
    </>
  );
}
