"use client";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { PillOutline } from "./PillOutline";

export type ButtonState = "Default" | "Hover" | "Focused" | "Disabled";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  Text?: string;
  State?: ButtonState;
  Size?: ButtonSize;
  LeadingIconSwap?: string;
  TrailingIconSwap?: string;
  ButtonText?: boolean;
  Pill?: string | number | null;
}

export interface Look {
  base: string;
  hover: string;
  hoverCls: string;
  disabled: string;
  focused?: string;
  tertiary?: boolean;
  ring?: keyof typeof RING;
}

const RING = {
  brand: ["shadow-ring", "focus-visible:shadow-ring focus-visible:outline-none"],
  gray: ["shadow-ring-gray", "focus-visible:shadow-ring-gray focus-visible:outline-none"],
  error: ["shadow-ring-error", "focus-visible:shadow-ring-error focus-visible:outline-none"],
} as const;

export function ButtonBase({ look, Text, State = "Default", Size = "md", LeadingIconSwap, TrailingIconSwap, ButtonText = true, Pill, className, disabled, type, ...rest }: ButtonProps & { look: Look }) {
  const off = disabled || State === "Disabled";
  const iconOnly = ButtonText === false || !Text;
  return (
    <button
      type={type ?? "button"}
      disabled={off}
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-md font-semibold whitespace-nowrap transition-colors",
        Size === "lg" ? "h-12 text-md" : "h-10 text-sm",
        iconOnly ? "w-10 p-2" : look.tertiary ? "px-2 py-2" : "px-3 py-2",
        off ? cx(look.disabled, "cursor-not-allowed") : cx(State === "Hover" ? look.hover : State === "Focused" && look.focused ? look.focused : look.base, "cursor-pointer", look.hoverCls,
          look.ring && (State === "Focused" ? RING[look.ring][0] : RING[look.ring][1])),
        className,
      )}
      {...rest}
    >
      {LeadingIconSwap && <Ms name={LeadingIconSwap} size={20} />}
      {!iconOnly && <span className="truncate">{Text}</span>}
      {Pill != null && Pill !== "" && <PillOutline Text={String(Pill)} Color="Brand" />}
      {TrailingIconSwap && <Ms name={TrailingIconSwap} size={20} />}
    </button>
  );
}
