"use client";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";

export function SelecteSparePart({ State = "Add", Text, label = "เลือก", onClick }: { State?: "Add" | "Checked" | "Text"; Text?: string; label?: string; onClick?: () => void }) {
  if (State === "Text") return <span className="shrink-0 text-md font-semibold text-gray-600">{Text}</span>;
  const B = State === "Checked" ? PrimaryButton : SecondaryButton;
  return <B LeadingIconSwap={State === "Checked" ? "check-20-400-round" : "add-20-400-round"} ButtonText={false} aria-label={label} aria-pressed={State === "Checked"} title={label} onClick={onClick} className="size-11" />;
}
