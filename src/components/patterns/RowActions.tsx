"use client";
import { useState } from "react";
import type { TableValue } from "@/components/vms/Table";
import { RowMenu, anchorOf, type MenuAnchor } from "./RowMenu";

export interface RowAct { Text: string; IconSwap: string; onClick: () => void }

export function useRowActions() {
  const [menu, setMenu] = useState<{ anchor: MenuAnchor; items: RowAct[] } | null>(null);
  const cell = (acts: RowAct[], plate: string): TableValue => {
    const icons = acts.map((a) => ({ IconSwap: a.IconSwap, label: a.Text + " " + plate, onClick: a.onClick }));
    return { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + plate, onClick: (e) => setMenu({ anchor: anchorOf(e.currentTarget), items: acts }) }], mobileActions: icons };
  };
  const Menu = <RowMenu anchor={menu?.anchor ?? null} items={menu?.items ?? []} onClose={() => setMenu(null)} />;
  return { cell, Menu };
}
