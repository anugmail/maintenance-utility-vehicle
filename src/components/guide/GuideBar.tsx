"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Alert } from "@/components/vms/Alert";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { cx } from "@/lib/cx";
import { hrefOf, matchAt } from "@/lib/guide/match";
import { findCase } from "@/lib/guide/scenarios";
import { setGuide, useGuide } from "@/lib/guide/session";
import { scenarioHref, startHref } from "@/lib/guide/start";
import { useBreakpoint } from "@/lib/useBreakpoint";

let lastUrl: string | null = null;

export function GuideBar() {
  return <Suspense fallback={null}><Bar /></Suspense>;
}

function Bar() {
  const g = useGuide();
  const path = usePathname();
  const search = useSearchParams().toString();
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const [full, setFull] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const found = g ? findCase(g.case) : undefined;
  const steps = found?.c.steps ?? [];
  const i = g ? Math.min(g.step, Math.max(0, steps.length - 1)) : 0;

  useEffect(() => { if (g && !found) setGuide(null); }, [g, found]);
  useEffect(() => {
    const url = path + "?" + search;
    if (url === lastUrl) return;
    lastUrl = url;
    if (!g || !found) return;
    const next = steps[i + 1];
    if (next && !matchAt(steps[i].at, path, search) && matchAt(next.at, path, search)) setGuide({ case: g.case, step: i + 1 });
  }, [path, search, g, found, steps, i]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const root = document.documentElement.style;
    const set = () => { root.scrollPaddingTop = el.offsetHeight + "px"; root.setProperty("--guide-bottom", Math.max(0, Math.round(el.getBoundingClientRect().bottom)) + "px"); };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("scroll", set, { passive: true });
    return () => { ro.disconnect(); window.removeEventListener("scroll", set); root.scrollPaddingTop = ""; root.removeProperty("--guide-bottom"); };
  }, [found, mob]);

  if (!g || !found) return null;
  const { g: sc, c } = found;
  const step = steps[i], n = steps.length;
  const here = matchAt(step.at, path, search);
  const inCase = here || steps.some((s) => matchAt(s.at, path, search));
  const state = here ? "here" : inCase ? "elsewhere" : "outside";
  const text = (mob && step.mobile) || step.text;
  const go = (k: number) => setGuide({ case: c.id, step: k });
  const toStep = () => router.push(hrefOf(step));
  const restart = () => { setFull(false); router.push(startHref(c.id, g.from)); };
  const exit = () => { setGuide(null); router.push(scenarioHref(sc.key, g.from)); };
  const counter = "ขั้นที่ " + (i + 1) + " จาก " + n;

  const alert = state === "outside"
    ? <Alert Color="Warning" Text="หน้านี้อยู่นอกเรื่องที่กำลังดู" SupportingText={!mob || full ? "เรื่องที่กำลังดูคือ " + c.name + " " + counter : undefined} LeadingIcon={!mob} className={cx("min-w-0 flex-1", mob && !full && "[&_p]:truncate")} />
    : mob && !full
      ? <Alert Color="Brand" Text={i + 1 + "/" + n + " " + text} LeadingIcon={false} className="min-w-0 flex-1 [&_p]:truncate" />
      : <Alert Color="Brand" Text={"กำลังดู: " + c.name} SupportingText={counter + ": " + text} LeadingIcon={!mob} className="min-w-0 flex-1" />;

  const desktop = (
    <div className="flex shrink-0 items-center gap-3">
      {state === "outside"
        ? <PrimaryButton Text="กลับไปหน้าของขั้นนี้" onClick={toStep} />
        : <>
          {state === "elsewhere" && <SecondaryButton Text="ไปหน้าของขั้นนี้" onClick={toStep} />}
          <SecondaryButton Text="ก่อนหน้า" LeadingIconSwap="keyboard_arrow_left-20-400-round" State={i ? "Default" : "Disabled"} onClick={() => i && go(i - 1)} />
          <PrimaryButton Text="ถัดไป" TrailingIconSwap="keyboard_arrow_right-20-400-round" State={i < n - 1 ? "Default" : "Disabled"} onClick={() => i < n - 1 && go(i + 1)} />
        </>}
      <TertiaryButton Text="เริ่มเคสใหม่" LeadingIconSwap="restart_alt-24-300-round" onClick={restart} />
      <TertiaryButton Text="ออก" LeadingIconSwap="close-24-300-round" onClick={exit} />
    </div>
  );
  const icon = (IconSwap: string, label: string, onClick: () => void, on = true) =>
    <TertiaryButton LeadingIconSwap={IconSwap} ButtonText={false} aria-label={label} title={label} State={on ? "Default" : "Disabled"} onClick={() => on && onClick()} />;
  const mobile = (
    <div className="flex shrink-0 items-center gap-1">
      {state === "outside"
        ? <PrimaryButton LeadingIconSwap="undo-24-300-round" ButtonText={false} aria-label="กลับไปหน้าของขั้นนี้" title="กลับไปหน้าของขั้นนี้" onClick={toStep} />
        : <>
          {icon("keyboard_arrow_left-20-400-round", "ก่อนหน้า", () => go(i - 1), i > 0)}
          <PrimaryButton LeadingIconSwap="keyboard_arrow_right-20-400-round" ButtonText={false} aria-label="ถัดไป" title="ถัดไป" State={i < n - 1 ? "Default" : "Disabled"} onClick={() => i < n - 1 && go(i + 1)} />
        </>}
      <TertiaryButton LeadingIconSwap={full ? "expand_less-24-300-round" : "expand_more-24-300-round"} ButtonText={false} aria-label={full ? "ย่อคำอธิบาย" : "ดูคำอธิบายเต็ม"} aria-expanded={full} onClick={() => setFull(!full)} />
    </div>
  );

  return (
    <div ref={box} data-guide-bar data-step={i + 1} data-total={n} data-state={state} data-case={c.id}
      className={cx("sticky top-0 z-20 flex flex-col border-b border-gray-200 bg-white", mob ? "gap-2 px-4 py-2" : "px-8 py-3")}>
      <div className={cx("flex items-center", mob ? "gap-2" : "gap-4")}>
        {alert}
        {mob ? mobile : desktop}
      </div>
      {mob && full && (
        <div className="flex flex-wrap justify-end gap-2">
          {state === "elsewhere" && <SecondaryButton Text="ไปหน้าของขั้นนี้" onClick={toStep} />}
          <TertiaryButton Text="เริ่มเคสใหม่" LeadingIconSwap="restart_alt-24-300-round" onClick={restart} />
          <TertiaryButton Text="ออก" LeadingIconSwap="close-24-300-round" onClick={exit} />
        </div>
      )}
    </div>
  );
}
