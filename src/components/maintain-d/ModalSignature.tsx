"use client";
/* Figma: "Modal Signature" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/Modal Signature.json (CLAUDE.md ข้อ 12)
   popup เซ็นลงนาม · variant: State = Default (ยังไม่เซ็น — ปุ่มบันทึก Disabled) | Filled (เซ็นแล้ว)
   ค่า: Background overlay + Modal กว้าง 607 รัศมี 12 · Modal header Alignment=Left (Title · ปุ่มปิด · เส้นคั่น Content divider) 
        Form ขอบในข้าง 24 ช่องไฟ 16: กล่องข้อมูล พื้น gray-50 รัศมี 8 ขอบใน 8/16 = _Content item base Text with label (ผู้ลงนาม: ชื่อ)
        + ช่องเซ็น = Container ของ Text area สูง 249 (ขอบ 1 gray-300 รัศมี 8) วาดลายเซ็นได้ · ปุ่มล้าง close 24 มุมขวาบน
        Modal footer Alignment=Horizontal right (เส้นคั่นบน): Secondary "ปิด" + Primary "บันทึก"
   มือถือ: ไฟล์ไม่มีแบบมือถือ → Bottom sheet + เนื้อหาเดียวกัน + Bottom sheet footer (COMPOSED.md ก.) */
import { useEffect, useRef, useState } from "react";
import { BackgroundOverlay } from "@/components/vms/BackgroundOverlay";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { ContentItemBase } from "@/components/vms/ContentItemBase";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { useBreakpoint } from "@/lib/useBreakpoint";

export interface ModalSignatureProps {
  open: boolean;
  Title?: string;
  /** ป้ายและชื่อผู้ลงนามในกล่องข้อมูล เช่น ["ผู้ส่งมอบรถ", "นายสุรชัย แก้วมณี"] */
  signer: [string, string];
  /** ลายเซ็นเดิม (data URL) — State=Filled */
  value?: string | null;
  onSave?: (dataUrl: string) => void;
  onClose?: () => void;
}

function Pad({ value, onDraw }: { value?: string | null; onDraw: (url: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const r = c.getBoundingClientRect(); c.width = r.width; c.height = r.height;
    const g = c.getContext("2d"); if (!g) return;
    g.lineWidth = 2; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = getComputedStyle(c).color;
    if (value) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0, c.width, c.height); im.src = value; }
  }, [value]);
  const at = (e: React.PointerEvent<HTMLCanvasElement>) => { const r = e.currentTarget.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const; };
  return (
    <div className="relative h-[249px] rounded-md border border-gray-300 bg-white">
      <canvas ref={ref} aria-label="ช่องเซ็นลงนาม" className="size-full touch-none text-black"
        onPointerDown={(e) => { const g = e.currentTarget.getContext("2d"); if (!g) return; drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); const [x, y] = at(e); g.beginPath(); g.moveTo(x, y); }}
        onPointerMove={(e) => { if (!drawing.current) return; const g = e.currentTarget.getContext("2d"); if (!g) return; const [x, y] = at(e); g.lineTo(x, y); g.stroke(); }}
        onPointerUp={(e) => { drawing.current = false; onDraw(e.currentTarget.toDataURL()); }} />
      <span className="absolute top-2 right-2">
        <TertiaryButton LeadingIconSwap="close-24-300-round" ButtonText={false} aria-label="ล้างลายเซ็น"
          onClick={() => { const c = ref.current; c?.getContext("2d")?.clearRect(0, 0, c.width, c.height); onDraw(null); }} />
      </span>
    </div>
  );
}

export function ModalSignature({ open, Title = "เซ็นลงนาม", signer, value, onSave, onClose }: ModalSignatureProps) {
  const mob = useBreakpoint() === "Mobile";
  const [sig, setSig] = useState<string | null>(value ?? null);
  useEffect(() => { if (open) setSig(value ?? null); }, [open, value]);
  if (!open) return null;
  const body = (
    <div className="flex flex-col gap-4">
      <div className="rounded-md bg-gray-50 px-4 py-2"><ContentItemBase Label={signer[0]} Text={signer[1]} /></div>
      <Pad value={value} onDraw={setSig} />
    </div>
  );
  const Close = <SecondaryButton Text="ปิด" Size={mob ? "lg" : "md"} onClick={onClose} className={mob ? undefined : "w-25"} />;
  const Save = <PrimaryButton Text="บันทึก" Size={mob ? "lg" : "md"} State={sig ? "Default" : "Disabled"} onClick={() => sig && onSave?.(sig)} className={mob ? undefined : "w-25"} />;
  if (mob) return <BottomSheet open onClose={onClose} Title={Title} Footer={<BottomSheetFooter SecondaryAction={Close} PrimaryAction={Save} />}>{body}</BottomSheet>;
  return (
    <>
      <BackgroundOverlay onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div role="dialog" aria-modal="true" aria-labelledby="sig-title" onClick={(e) => e.stopPropagation()} className="flex w-[607px] max-w-full flex-col rounded-lg bg-white animate-fade-in">
          <ModalHeader id="sig-title" Alignment="Left" FeaturedIcon={false} Divider Title={Title} onClose={onClose} />
          <div className="px-6">{body}</div>
          <ModalFooter Alignment="Horizontal right" Divider SecondaryAction={Close} PrimaryAction={Save} />
        </div>
      </div>
    </>
  );
}
