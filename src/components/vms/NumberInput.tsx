"use client";
/* Figma: "Number input" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Number input.json
   variant: State = Filled | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md (40) | lg (48)
   property: Label · Label text · Optional · Info icon · Number · Helper · Helper text
   ค่า: ป้าย → ช่อง ห่าง 8 · ช่อง รัศมี 8 ขอบ 1 (สีตาม State เหมือน Text input — containerTone) ช่องไฟ 8 ไม่มีขอบใน
        ปุ่มลด/เพิ่ม = Tertiary button ไอคอน remove / add 20 (Disabled ไอคอน gray-400) · ตัวเลข 16 Regular black จัดกลาง · Helper 12 gray-600 (Error error-600)
   ใช้ใน Spare Part Card Item (กว้าง 120 ไม่มีป้าย) */
import { useId } from "react";
import { cx } from "@/lib/cx";
import { InputLabel } from "./InputLabel";
import { TertiaryButton } from "./TertiaryButton";
import { containerTone } from "./TextInput";

export type NumberInputState = "Filled" | "Hover" | "Focused" | "Disabled" | "Error" | "Error Hover" | "Error Focused";

export interface NumberInputProps {
  State?: NumberInputState;
  Size?: "md" | "lg";
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  Number: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (n: number) => void;
  HelperText?: string;
  className?: string;
}

export function NumberInput({ State = "Filled", Size = "md", Label = true, LabelText, Optional, Number: n, min = 0, max, step = 1, onChange, HelperText, className }: NumberInputProps) {
  const id = useId();
  const off = State === "Disabled";
  const set = (v: number) => onChange?.(Math.max(min, max != null ? Math.min(max, v) : v));
  return (
    <div className={cx("flex min-w-0 flex-col gap-2", className)}>
      {Label && LabelText && <InputLabel LabelText={LabelText} Optional={Optional} htmlFor={id} />}
      <div className={cx("flex items-center gap-2 rounded-md border", Size === "lg" ? "h-12" : "h-10", containerTone(State === "Filled" ? "Default" : State))}>
        <TertiaryButton LeadingIconSwap="remove-20-400-round" ButtonText={false} aria-label="ลด" State={off || n <= min ? "Disabled" : "Default"} onClick={() => set(n - step)} />
        <input id={id} inputMode="numeric" value={String(n)} disabled={off}
          onChange={(e) => { const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); set(isNaN(v) ? min : v); }}
          className="min-w-0 flex-1 bg-transparent text-center text-md outline-none disabled:text-gray-400" />
        <TertiaryButton LeadingIconSwap="add-20-400-round" ButtonText={false} aria-label="เพิ่ม" State={off || (max != null && n >= max) ? "Disabled" : "Default"} onClick={() => set(n + step)} />
      </div>
      {HelperText && <p className={cx("text-xs", State.startsWith("Error") ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
    </div>
  );
}
