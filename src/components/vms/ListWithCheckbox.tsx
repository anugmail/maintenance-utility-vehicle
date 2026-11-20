"use client";
import { ListHeaderItem } from "./ListHeaderItem";
import { ListWithCheckboxItem } from "./ListWithCheckboxItem";

export interface ListOption { value: string; Text: string; SupportingText?: string; Disabled?: boolean }

export function ListWithCheckbox({ Title, Badge, options, value, onChange, className }: {
  Title: string; Badge?: string | number | null; options: ListOption[]; value: string[]; onChange?: (next: string[]) => void; className?: string;
}) {
  const live = options.filter((o) => !o.Disabled);
  const all = live.length > 0 && live.every((o) => value.includes(o.value));
  const some = live.some((o) => value.includes(o.value));
  return (
    <div className={className}>
      <ListHeaderItem Title={Title} Badge={Badge} checkType={all ? "Selected" : some ? "Indeterminate" : "Unselected"} onCheck={() => onChange?.(all ? [] : live.map((o) => o.value))} />
      {options.map((o) => (
        <ListWithCheckboxItem key={o.value} Text={o.Text} SupportingText={o.SupportingText} Selected={value.includes(o.value)} State={o.Disabled ? "Disabled" : undefined}
          onChange={(on) => onChange?.(on ? [...value, o.value] : value.filter((v) => v !== o.value))} />
      ))}
    </div>
  );
}
