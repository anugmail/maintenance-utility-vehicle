"use client";
/* หน้า /kit/ — ชุด component ทั้งหมดใน src/components/vms ทุก variant (ป้ายเป็นชื่อ variant ของ Figma) ให้เจ้าของงานเทียบกับไฟล์ (Component) VMS Plus
   ไม่ใช่จอของระบบ · ข้อความตัวอย่างเป็นค่าตั้งต้นของไลบรารีหรือค่าจาก screens.js */
import { useState, type ReactNode } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { Alert, type AlertColor } from "@/components/vms/Alert";
import { BadgeOutline, type BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import { BadgeOutlineWithRemoveIcon } from "@/components/vms/BadgeOutlineWithRemoveIcon";
import { BottomSheet } from "@/components/vms/BottomSheet";
import { BottomSheetFooter } from "@/components/vms/BottomSheetFooter";
import { BottomSheetHeader } from "@/components/vms/BottomSheetHeader";
import { Breadcrumbs } from "@/components/vms/Breadcrumbs";
import { ButtonGroupsPaginationItem } from "@/components/vms/ButtonGroupsPaginationItem";
import { Checkbox, type CheckboxType } from "@/components/vms/Checkbox";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem, type DropdownListItemState } from "@/components/vms/DropdownListItem";
import { DropdownMenu } from "@/components/vms/DropdownMenu";
import { DropdownMenuItem } from "@/components/vms/DropdownMenuItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { FeaturedIcon, type FeaturedIconColor } from "@/components/vms/FeaturedIcon";
import { HeaderNavigation } from "@/components/vms/HeaderNavigation";
import { InputDropdown, type InputDropdownState } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges, type InputDropdownWithBadgesState } from "@/components/vms/InputDropdownWithBadges";
import { InputLabel } from "@/components/vms/InputLabel";
import { MobileCards, MobileTable } from "@/components/vms/MobileTable";
import { MobileTableItem } from "@/components/vms/MobileTableItem";
import { Modal } from "@/components/vms/Modal";
import { ModalFooter } from "@/components/vms/ModalFooter";
import { ModalHeader } from "@/components/vms/ModalHeader";
import { NavButton } from "@/components/vms/NavButton";
import { NavItem } from "@/components/vms/NavItem";
import { NavListItem } from "@/components/vms/NavListItem";
import { PillColor as PillColorBadge, type PillColorName } from "@/components/vms/PillColor";
import { Notification, type NotificationType } from "@/components/vms/Notification";
import { PageHeader } from "@/components/vms/PageHeader";
import { PillOutline, type PillColor } from "@/components/vms/PillOutline";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { PrimaryDangerButton } from "@/components/vms/PrimaryDangerButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SecondaryDangerButton } from "@/components/vms/SecondaryDangerButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { SidebarNavigation } from "@/components/vms/SidebarNavigation";
import { SortIcon } from "@/components/vms/SortIcon";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableCell } from "@/components/vms/TableCell";
import { TableHeader } from "@/components/vms/TableHeader";
import { TableHeaderCell } from "@/components/vms/TableHeaderCell";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TertiaryDangerButton } from "@/components/vms/TertiaryDangerButton";
import { TextInput, type TextInputState } from "@/components/vms/TextInput";
import { MENU } from "@/lib/mock/data";
import { Block, V } from "./KitBlocks";
import { KitMore } from "./KitMore";

const STATES = ["Default", "Hover", "Focused", "Disabled"] as const;

const PCOLS: TableColumn[] = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text", SortIcon: "Down" },
  { head: "ชื่อแผน", SortIcon: "Swap" },
  { head: "สถานะ", width: 150, Style: "Badge", SortIcon: "Swap" },
  { head: "", width: 60, Style: "Action icons" },
];
const PROWS: TableValue[][] = [
  ["MR Z7000001", { text: "บำรุงรักษารถกระเช้า ภาค 1 และภาค 2 ปีงบประมาณ 2570", sub: "ปีงบประมาณ 2570" }, { pills: [["ดำเนินการ", "Info"]] }, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู" }] }],
  ["MR Z7000002", { text: "บำรุงรักษารถเครน ภาค 2 ปีงบประมาณ 2570", sub: "ปีงบประมาณ 2570" }, { pills: [["อนุมัติแล้ว", "Brand"]] }, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู" }] }],
  ["MR Z7000003", { text: "บำรุงรักษารถขุด ภาค 3 ปีงบประมาณ 2570", sub: "ปีงบประมาณ 2570" }, { pills: [["รออนุมัติ", "Warning"]] }, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู" }] }],
];

export default function Kit() {
  const [modal, setModal] = useState<"" | "confirm" | "danger" | "form">("");
  const [sheet, setSheet] = useState(false);
  const [dd, setDd] = useState(false);
  const [multi, setMulti] = useState(["ภาค 2 (ตะวันออกเฉียงเหนือ)"]);
  const [tab, setTab] = useState(0);
  return (
    <AppFrame>
      <PageHeader Title="ชุด component" SupportingText="ทุกชิ้นยกค่าจาก figma-spec/*.json ของไฟล์ (Component) VMS Plus · ป้ายเหนือแต่ละชิ้นคือชื่อ variant ใน Figma" crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "ชุด component" }]} />

      <Block name="Primary button" node="Button (2:5)">
        {(["md", "lg"] as const).flatMap((sz) => STATES.map((st) => <V key={st + sz} label={`State=${st}, Size=${sz}`}><PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" State={st} Size={sz} /></V>))}
      </Block>
      <Block name="Secondary button" node="Button (2:5)">
        {(["md", "lg"] as const).flatMap((sz) => STATES.map((st) => <V key={st + sz} label={`State=${st}, Size=${sz}`}><SecondaryButton Text="ตัวกรอง" LeadingIconSwap="filter_list-24-400-round" State={st} Size={sz} /></V>))}
      </Block>
      <Block name="Tertiary button" node="Button (2:5)">
        {STATES.map((st) => <V key={st} label={`State=${st}, Size=md`}><TertiaryButton Text="ล้างข้อมูล" LeadingIconSwap="restart_alt-24-300-round" State={st} /></V>)}
        <V label="Button text=false"><TertiaryButton LeadingIconSwap="stylus-24-300-round" ButtonText={false} aria-label="แก้ไข" /></V>
      </Block>
      <Block name="Tertiary brand button" node="Button (2:5)">
        {STATES.map((st) => <V key={st} label={`State=${st}`}><TertiaryBrandButton Text="เพิ่มรถ" LeadingIconSwap="add-24-300-round" State={st} /></V>)}
      </Block>
      <Block name="Primary danger button" node="Button (2:5)">
        {(["md", "lg"] as const).flatMap((sz) => STATES.map((st) => <V key={st + sz} label={`State=${st}, Size=${sz}`}><PrimaryDangerButton Text="เอาออก" State={st} Size={sz} /></V>))}
      </Block>
      <Block name="Secondary danger button" node="Button (2:5)">
        {(["md", "lg"] as const).flatMap((sz) => STATES.map((st) => <V key={st + sz} label={`State=${st}, Size=${sz}`}><SecondaryDangerButton Text="ลบแผน" LeadingIconSwap="delete-24-300-round" State={st} Size={sz} /></V>))}
      </Block>
      <Block name="Tertiary danger button" node="Button (2:5)">
        {STATES.map((st) => <V key={st} label={`State=${st}`}><TertiaryDangerButton Text="ลบ" LeadingIconSwap="delete-24-300-round" State={st} /></V>)}
      </Block>

      <Block name="Pill outline" node="Badge (2:13)">
        {(["Brand", "Gray", "Info", "Success", "Warning", "Error", "Disabled", "Purple"] as PillColor[]).map((c) => <V key={c} label={`Color=${c}`}><PillOutline Text="รออนุมัติ" Color={c} /></V>)}
      </Block>
      <Block name="Pill color" node="Badge (2:13)">
        {(["Brand", "Gray", "Info", "Success", "Warning", "Error", "Disabled"] as PillColorName[]).map((c) => <V key={c} label={`Color=${c}`}><PillColorBadge Text="1" Color={c} /></V>)}
      </Block>
      <Block name="Badge outline" node="Badge (2:13)">
        {(["Brand", "Gray", "Disabled", "Success", "Error"] as BadgeOutlineColor[]).map((c) => <V key={c} label={`Color=${c}`}><BadgeOutline Text="ในแผน 6 คัน" Color={c} /></V>)}
      </Block>
      <Block name="Badge outline with remove icon" node="Badge (2:13)">
        {(["Brand", "Gray", "Disabled"] as const).map((c) => <V key={c} label={`Color=${c}`}><BadgeOutlineWithRemoveIcon Text="กฟฉ.1" Color={c} onRemove={() => undefined} /></V>)}
      </Block>
      <Block name="Featured icon" node="Featured icon (2861:54686)">
        {(["md", "sm"] as const).flatMap((sz) => (["Brand", "Gray", "Info", "Success", "Warning", "Error", "Disabled", "Purple"] as FeaturedIconColor[]).map((c) => <V key={c + sz} label={`Color=${c}, Size=${sz}`}><FeaturedIcon Color={c} Size={sz} /></V>))}
      </Block>

      <Block name="Input label" node="Inputs (2:6)">
        <V label="Optional=false"><InputLabel LabelText="ชื่อแผน" /></V>
        <V label="Optional=true"><InputLabel LabelText="หมายเหตุ" Optional /></V>
        <V label="Info icon=true"><InputLabel LabelText="ชื่อแผน" InfoIcon /></V>
      </Block>
      <Block name="Text input" node="Inputs (2:6)">
        {(["Default", "Filled", "Hover", "Focused", "Disabled", "Readonly", "Error", "Error Hover", "Error Focused", "Error Readonly"] as TextInputState[]).map((st) => (
          <V key={st} label={`State=${st}, Size=md`}>
            <TextInput State={st} LabelText="ชื่อแผน" Text={st === "Default" ? "" : "บำรุงรักษารถกระเช้า ภาค 2 ปีงบประมาณ 2570"} Placeholder="ระบุชื่อแผน" HelperText={st.startsWith("Error") ? "กรุณาระบุชื่อแผน" : undefined} className="w-[352px]" />
          </V>
        ))}
        <V label="State=Default, Size=lg · Leading icon"><TextInput Size="lg" Label={false} LeadingIconSwap="search-24-300-round" Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" className="w-[352px]" /></V>
      </Block>
      <Block name="Input dropdown" node="Dropdowns (2:8)">
        {(["Default", "Selected", "Hover", "Focused", "Disabled", "Error", "Error Hover", "Error Focused"] as InputDropdownState[]).map((st) => (
          <V key={st} label={`State=${st}, Size=md`}>
            <InputDropdown State={st} LabelText="ปีงบประมาณ" Text={st === "Default" || st === "Disabled" ? "" : "2570"} Placeholder="เลือกปีงบประมาณ" HelperText={st.startsWith("Error") ? "กรุณาเลือกปีงบประมาณ" : undefined} className="w-[352px]" />
          </V>
        ))}
        <V label="เปิดรายการ (Focused + Dropdown list)">
          <InputDropdown LabelText="ปีงบประมาณ" Text="2570" open={dd} onOpenChange={setDd} className="w-[352px]">
            <DropdownList>{["2568", "2569", "2570", "2571", "2572"].map((y) => <DropdownListItem key={y} Text={y} State={y === "2570" ? "Selected" : "Default"} onClick={() => setDd(false)} />)}</DropdownList>
          </InputDropdown>
        </V>
      </Block>
      <Block name="Input dropdown with badges" node="Dropdowns (2:8)">
        {(["Default", "Selected", "Hover", "Focused", "Disabled", "Error", "Error Hover", "Error Focused"] as InputDropdownWithBadgesState[]).map((st) => (
          <V key={st} label={`State=${st}, Size=md`}>
            <InputDropdownWithBadges State={st} LabelText="เขต" values={st === "Default" || st === "Disabled" ? [] : ["กฟฉ.1", "กฟฉ.2", "กฟฉ.3"]} Placeholder="เลือกเขต" HelperText={st.startsWith("Error") ? "กรุณาเลือกเขต" : undefined} className="w-[352px]" />
          </V>
        ))}
        <V label="ใช้งานจริง (เอาชิปออกได้)">
          <InputDropdownWithBadges LabelText="ภาค" values={multi} Placeholder="เลือกภาค" onRemove={(v) => setMulti(multi.filter((x) => x !== v))} className="w-[352px]" />
        </V>
      </Block>
      <Block name="Checkbox" node="Checkbox (2:18)">
        {(["Default", "Hover", "Focused", "Disabled"] as const).flatMap((st) => (["Unselected", "Selected", "Indeterminate"] as CheckboxType[]).map((t) => <V key={st + t} label={`State=${st}, Type=${t}`}><Checkbox State={st} Type={t} label={t} /></V>))}
      </Block>

      <Block name="Dropdown list item" node="Dropdowns (2:8)">
        {(["Default", "Hover", "Selected", "Selected Hover", "Disabled"] as DropdownListItemState[]).map((st) => <V key={st} label={`State=${st}`}><div className="w-[292px]"><DropdownListItem Text="82-6789 ขอนแก่น" SupportingText={st === "Default" ? "ไตรมาส 1" : undefined} State={st} /></div></V>)}
      </Block>
      <Block name="Dropdown list" node="Dropdowns (2:8)">
        <V label="Dropdown list"><DropdownList className="w-[252px]">{["82-6789 ขอนแก่น", "82-1145 ขอนแก่น", "82-3302 อุดรธานี"].map((t, i) => <DropdownListItem key={t} Text={t} State={i === 0 ? "Selected" : "Default"} />)}</DropdownList></V>
      </Block>
      <Block name="_Dropdown menu item" node="Dropdowns (2:8)">
        {(["Default", "Hover", "Focused", "Disabled"] as const).map((st) => <V key={st} label={`Type=Shortcut, State=${st}, Divider=False`}><div className="w-60"><DropdownMenuItem Text="แก้ไข" IconSwap="stylus-24-300-round" State={st} /></div></V>)}
        <V label="Divider=True"><div className="w-60"><DropdownMenuItem Divider /></div></V>
      </Block>
      <Block name="Dropdown menu" node="Dropdowns (2:8)">
        <V label="3 รายการ (เส้นคั่นก่อนรายการที่ 3)"><DropdownMenu items={MENU} /></V>
        <V label="2 รายการ"><DropdownMenu items={MENU.slice(0, 2)} /></V>
        <V label="1 รายการ"><DropdownMenu items={MENU.slice(0, 1)} /></V>
      </Block>

      <Block name="Sort icon" node="Table (2:14)">
        {(["Down", "Up", "Swap"] as const).map((i) => <V key={i} label={`Icon=${i}`}><SortIcon Icon={i} /></V>)}
      </Block>
      <Block name="Table header cell" node="Table (2:14)">
        <V label="Checkbox=False"><table><thead><tr><TableHeaderCell Text="เลขที่ MR" SortIcon="Down" /></tr></thead></table></V>
        <V label="Checkbox=True"><table><thead><tr><TableHeaderCell Text="ทะเบียน" Checkbox SortIcon="Swap" /></tr></thead></table></V>
      </Block>
      <Block name="Table cell" node="Table (2:14)">
        {[false, true].map((alt) => (
          <V key={String(alt)} label={`Alternating fills=${alt ? "True" : "False"}`} wide>
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] table-fixed border-collapse"><tbody><tr>
              <TableCell Style="Text" AlternatingFills={alt} Text="ภาค 2 (ตะวันออกเฉียงเหนือ)" />
              <TableCell Style="Lead text" AlternatingFills={alt} Text="MR Z7000004" />
              <TableCell Style="Text" AlternatingFills={alt} Text="ไตรมาส 1: 3 · ไตรมาส 2: 2" SupportingText="ไตรมาส 3: 1 · ไตรมาส 4: 0" />
              <TableCell Style="Badge" AlternatingFills={alt} Pills={[["รออนุมัติ", "Warning"]]} />
              <TableCell Style="Multiple badges" AlternatingFills={alt} Pills={[["ดำเนินการ", "Info"], ["+2", "Gray"]]} />
              <TableCell Style="Action icons" AlternatingFills={alt} Actions={[{ IconSwap: "stylus-24-300-round", label: "แก้ไข" }, { IconSwap: "delete-24-300-round", label: "ลบ" }]} />
              <TableCell Style="Lead checkbox" AlternatingFills={alt} Text="82-6789 ขอนแก่น" checked={alt} />
            </tr></tbody></table></div>
          </V>
        ))}
        <span className="text-xs text-gray-600">Style = Text · Lead text · Text + Supporting text · Badge · Multiple badges · Action icons · Lead checkbox</span>
      </Block>
      <Block name="Table header" node="Table headers (2096:36080)">
        <V label="Breakpoint=Desktop" wide><TableHeader Breakpoint="Desktop" Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" /></V>
        <V label="Breakpoint=Desktop · Filters" wide><TableHeader Breakpoint="Desktop" Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" Filters={["ปีงบประมาณ 2570", "ภาค 2 (ตะวันออกเฉียงเหนือ)"]} onRemoveFilter={() => undefined} /></V>
        <V label="Breakpoint=Mobile"><div className="w-[370px]"><TableHeader Breakpoint="Mobile" Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" /></div></V>
      </Block>
      <Block name="Button groups pagination item" node="Pagination (2:15)">
        {(["Previous", "Number", "Next"] as const).flatMap((t) => (["Default", "Hover/Active", "Focused", "Disabled"] as const).map((st) => <V key={t + st} label={`Type=${t}, State=${st}`}><div className="inline-flex overflow-hidden rounded-md border border-gray-300"><ButtonGroupsPaginationItem Type={t} State={st} last /></div></V>))}
      </Block>
      <Block name="Table pagination" node="Pagination (2:15)">
        <V label="Breakpoint=Desktop" wide><TablePagination Breakpoint="Desktop" total={6} /></V>
        <V label="Breakpoint=Mobile"><div className="w-[370px]"><TablePagination Breakpoint="Mobile" total={6} /></div></V>
      </Block>
      <Block name="Table" node="Table (2:14)">
        <V label="Alternating fills=True · Pagination=True" wide><Table columns={PCOLS} rows={PROWS} Pagination={<TablePagination Breakpoint="Desktop" total={3} />} /></V>
        <V label="Alternating fills=False" wide><Table columns={PCOLS} rows={PROWS} AlternatingFills={false} /></V>
      </Block>
      <Block name="Mobile table item" node="Table (2:14)">
        <div className="w-[370px]">
          <MobileTable>
            <MobileTableItem Style="Lead text" Header="เลขที่ MR" Text="MR Z7000004" />
            <MobileTableItem Style="Text" Header="ชื่อแผน" Text="บำรุงรักษารถกระเช้า ภาค 2 ปีงบประมาณ 2570" SupportingText="ปีงบประมาณ 2570" />
            <MobileTableItem Style="Badge" Header="สถานะ" Pill={["รออนุมัติ", "Warning"]} />
            <MobileTableItem Style="Action icons" Actions={[{ IconSwap: "more_horiz-20-400-round", label: "เมนู" }]} />
          </MobileTable>
        </div>
        <span className="text-xs text-gray-600">Style = Lead text · Text · Badge · Action icons</span>
      </Block>
      <Block name="Mobile table" node="Table (2:14)">
        <V label="Alternating fills=False (1 แถวตาราง = 1 การ์ด)"><div className="w-[370px]"><MobileCards columns={PCOLS} rows={PROWS.slice(0, 2)} /></div></V>
        <V label="Alternating fills=True"><div className="w-[370px]"><MobileTable AlternatingFills><MobileTableItem Style="Lead text" Header="เลขที่ MR" Text="MR Z7000001" last /></MobileTable></div></V>
      </Block>
      <Block name="Empty state/Data empty" node="Table (2:14)">
        <V label="Actions ซ่อน (ตาม noCarsInQ)" wide><EmptyStateDataEmpty Text="ยังไม่มีรถในไตรมาสนี้" SupportingText="ค้นทะเบียนในช่องเลือกรถเพื่อเพิ่มรถเข้าไตรมาสนี้" /></V>
      </Block>

      <Block name="Breadcrumbs" node="Breadcrumbs (2:7)">
        <V label="Link 1 + Current link"><Breadcrumbs links={[{ Text: "บำรุงรักษาตามวาระ", href: "/kit/" }, { Text: "สร้างแผน" }]} /></V>
      </Block>
      <Block name="Page header" node="Page headers (1983:21158)">
        <V label="Breakpoint=Desktop · Actions" wide><PageHeader Breakpoint="Desktop" Title="บำรุงรักษาตามวาระ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} Actions={<PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" />} /></V>
        <V label="Breakpoint=Desktop · Badge" wide><PageHeader Breakpoint="Desktop" Title="เลขที่ MR Z7000004" Badge={["รออนุมัติ", "Brand"]} crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/kit/" }, { Text: "บำรุงรักษารถกระเช้า ภาค 2 ปีงบประมาณ 2570" }]} /></V>
        <V label="Breakpoint=Mobile · Back action · Actions"><div className="w-[370px]"><PageHeader Breakpoint="Mobile" Title="สร้างแผนบำรุงรักษา" onBack={() => undefined} Actions={<PrimaryButton Text="สร้างแผน" Size="lg" LeadingIconSwap="add-24-300-round" />} /></div></V>
      </Block>
      <Block name="Section header" node="Section headers (2011:6955)">
        <V label="Breakpoint=Desktop · Badge · Actions" wide><SectionHeader Breakpoint="Desktop" Title="อะไหล่ในไตรมาส 1" Badge={3} Actions={<SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" />} /></V>
        <V label="Breakpoint=Mobile"><div className="w-[370px]"><SectionHeader Breakpoint="Mobile" Title="รถในไตรมาส 1" Badge="3 คัน" Actions={<SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" />} /></div></V>
      </Block>
      <Block name="Section label" node="Section headers (2011:6955)">
        <V label="Breakpoint=Desktop" wide><SectionLabel Title="รายการรถ (6)" SupportingText="Supporting text" Actions={<><TertiaryButton Text="ดูทั้งหมด" /><TertiaryBrandButton Text="เพิ่มรถ" LeadingIconSwap="add-24-300-round" /></>} /></V>
      </Block>
      <Block name="Tab item" node="Tabs (2:9)">
        {(["Default", "Hover", "Focused"] as const).flatMap((st) => [true, false].map((a) => <V key={st + a} label={`State=${st}, Active=${a ? "True" : "False"}`}><TabItem Text="ไตรมาส 1 (ต.ค.–ธ.ค.)" Badge={3} Active={a} State={st} /></V>))}
      </Block>
      <Block name="Tabs" node="Tabs (2:9)">
        <V label="Tabs (4 Tab item)" wide>
          <Tabs>{["ไตรมาส 1 (ต.ค.–ธ.ค.)", "ไตรมาส 2 (ม.ค.–มี.ค.)", "ไตรมาส 3 (เม.ย.–มิ.ย.)", "ไตรมาส 4 (ก.ค.–ก.ย.)"].map((t, i) => <TabItem key={t} Text={t} Badge={[3, 2, 1, 0][i]} Active={tab === i} onClick={() => setTab(i)} />)}</Tabs>
        </V>
      </Block>

      <Block name="Alert" node="Alerts (2:11)">
        {(["Brand", "Success", "Warning", "Error", "Info", "Gray"] as AlertColor[]).map((c) => <V key={c} label={`Color=${c}`}><Alert Color={c} Text="แผนถูกส่งกลับแก้ไข" SupportingText="ช่วงวันที่ตรงกับแผนดับไฟ กรุณาเลื่อนเป็นสัปดาห์ถัดไป" className="w-[585px] max-w-full" /></V>)}
      </Block>
      <Block name="Notification" node="Notifications (1873:44383)">
        {(["Default", "Success", "Warning", "Error", "Info"] as NotificationType[]).map((t) => <V key={t} label={`Type=${t}, Breakpoint=Desktop`}><Notification floating={false} Breakpoint="Desktop" Type={t} Text={t === "Error" ? "general error" : "ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ"} onClose={() => undefined} /></V>)}
        <V label="Type=Success, Breakpoint=Mobile"><div className="w-[370px]"><Notification floating={false} Breakpoint="Mobile" Type="Success" Text="ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ" onClose={() => undefined} /></div></V>
      </Block>
      <Block name="Modal header" node="Modals (2:16)">
        <V label="Alignment=Center"><div className="w-[500px] max-w-full rounded-lg border border-gray-200"><ModalHeader Alignment="Center" Title="ยืนยันการออก" SupportingText="ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก" onClose={() => undefined} /></div></V>
        <V label="Alignment=Left"><div className="w-[500px] max-w-full rounded-lg border border-gray-200"><ModalHeader Alignment="Left" Title="แก้ไขเบอร์ติดต่อและสถานที่" onClose={() => undefined} /></div></V>
      </Block>
      <Block name="Modal footer" node="Modals (2:16)">
        <V label="Alignment=Horizontal fill"><div className="w-[500px] max-w-full rounded-lg border border-gray-200"><ModalFooter SecondaryAction={<SecondaryButton Text="ปิด" />} PrimaryAction={<PrimaryButton Text="ออก" />} /></div></V>
        <V label="Alignment=Horizontal right"><div className="w-[500px] max-w-full rounded-lg border border-gray-200"><ModalFooter Alignment="Horizontal right" TertiaryAction={<TertiaryBrandButton Text="ล้าง" />} SecondaryAction={<SecondaryButton Text="ยกเลิก" />} PrimaryAction={<PrimaryButton Text="บันทึก" />} /></div></V>
        <V label="Alignment=Vertical fill"><div className="w-[500px] max-w-full rounded-lg border border-gray-200"><ModalFooter Alignment="Vertical fill" SecondaryAction={<SecondaryButton Text="ยกเลิก" />} PrimaryAction={<PrimaryButton Text="ยืนยัน" />} /></div></V>
      </Block>
      <Block name="Modal" node="Modals (2:16)">
        <V label="Type=Centered image, Size=md"><SecondaryButton Text="เปิด" onClick={() => setModal("confirm")} /></V>
        <V label="Type=Destructive centered image with input, Size=md"><SecondaryButton Text="เปิด" onClick={() => setModal("danger")} /></V>
        <V label="Type=Form, Size=md"><SecondaryButton Text="เปิด" onClick={() => setModal("form")} /></V>
      </Block>
      <Block name="Background overlay + Bottom sheet header + Bottom sheet footer" node="Background overlay (2428:4927) · Bottom sheets (1180:2)">
        <V label="Bottom sheet header"><div className="w-[360px] rounded-t-sheet border border-gray-200"><BottomSheetHeader Text="ยืนยันการออก" ActionText="ล้าง" onAction={() => undefined} /></div></V>
        <V label="Bottom sheet header (ไม่มีหัวข้อ)"><div className="w-[360px] rounded-t-sheet border border-gray-200"><BottomSheetHeader /></div></V>
        <V label="Bottom sheet footer"><div className="w-[360px] border border-gray-200"><BottomSheetFooter SecondaryAction={<SecondaryButton Text="ปิด" Size="lg" />} PrimaryAction={<PrimaryButton Text="ออก" Size="lg" />} /></div></V>
        <V label="Bottom sheet (ประกอบ · ดู COMPOSED.md)"><SecondaryButton Text="เปิด" onClick={() => setSheet(true)} /></V>
      </Block>
      <Block name="Nav button" node="Sidebar navigation (2:2)">
        {(["Active", "Default", "Disabled", "Focused", "Hover"] as const).map((st) => <V key={st} label={`State=${st}`}><NavButton IconSwap="home-24-300-round" Text="หน้าแรก" State={st} /></V>)}
        <V label="Indicator=true"><NavButton IconSwap="notifications-24-300-round" Text="การแจ้งเตือน" Indicator /></V>
      </Block>
      <Block name="Nav item" node="Sidebar navigation (2:2)">
        {(["Default", "Hover", "Active", "Focused", "Disabled"] as const).map((st) => <V key={st} label={`State=${st}`}><div className="w-[248px]"><NavItem Text="งานซ่อมและบำรุงรักษา" LeadingIconSwap="build" TrailingIcon State={st} /></div></V>)}
        <V label="Badge · Show Description"><div className="w-[248px]"><NavItem Text="นายสมคิด จงจองหอ" LeadingIconSwap="id_card-24-300-round" Badge ShowDescription SupportingText="ผู้ใช้งานทั่วไป" /></div></V>
      </Block>
      <Block name="Nav list item" node="Sidebar navigation (2:2)">
        {(["Default", "Hover", "Active", "Focused", "Disabled"] as const).map((st) => <V key={st} label={`State=${st}`}><div className="w-[248px]"><NavListItem Text="บำรุงรักษาตามวาระ" State={st} /></div></V>)}
        <V label="Badge"><div className="w-[248px]"><NavListItem Text="งานซ่อม" Badge /></div></V>
      </Block>
      <Block name="Header navigation" node="Header navigation (2:4)">
        <V label="Breakpoint=Desktop" wide><HeaderNavigation Breakpoint="Desktop" /></V>
        <V label="Breakpoint=Tablet" wide><HeaderNavigation Breakpoint="Tablet" bell /></V>
        <V label="Breakpoint=Mobile"><div className="w-[402px] max-w-full"><HeaderNavigation Breakpoint="Mobile" /></div></V>
      </Block>
      <Block name="Sidebar navigation" node="Sidebar navigation (2:2)">
        <V label="State=Collapsed"><div className="flex h-[960px] rounded-md border border-gray-200"><SidebarNavigation /></div></V>
        <V label="State=Expanded (เมนูตามหน้า Sidebar Navigation ของ UI Release#2)"><div className="flex h-[960px] rounded-md border border-gray-200"><SidebarNavigation State="Expanded" /></div></V>
      </Block>

      <KitMore />

      <Modal open={modal === "confirm"} onClose={() => setModal("")} Type="Centered image"
        Header={<ModalHeader Title="ยืนยันการออก" SupportingText="ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก" onClose={() => setModal("")} />}
        Footer={<ModalFooter SecondaryAction={<SecondaryButton Text="ปิด" onClick={() => setModal("")} />} PrimaryAction={<PrimaryButton Text="ออก" onClick={() => setModal("")} />} />} />
      <Modal open={modal === "danger"} onClose={() => setModal("")} Type="Destructive centered image with input"
        Header={<ModalHeader Title="ยืนยันการเอาอะไหล่ออก" SupportingText="ไส้กรองไฮโดรลิก จะถูกเอาออกจากรถทุกคันในไตรมาส 2" onClose={() => setModal("")} />}
        Footer={<ModalFooter SecondaryAction={<SecondaryButton Text="ยกเลิก" onClick={() => setModal("")} />} PrimaryAction={<PrimaryDangerButton Text="เอาออก" onClick={() => setModal("")} />} />} />
      <Modal open={modal === "form"} onClose={() => setModal("")} Type="Form"
        Header={<ModalHeader Alignment="Left" FeaturedIcon={false} Title="แก้ไขเบอร์ติดต่อและสถานที่ · 82-6789 ขอนแก่น" onClose={() => setModal("")} />}
        Footer={<ModalFooter SecondaryAction={<SecondaryButton Text="ยกเลิก" onClick={() => setModal("")} />} PrimaryAction={<PrimaryButton Text="บันทึก" onClick={() => setModal("")} />} />}>
        <TextInput LabelText="เบอร์ติดต่อ" Text="081-472-3365" />
        <TextInput LabelText="สถานที่บำรุงรักษา" Text="สำนักงาน กฟฉ.1 ขอนแก่น" />
      </Modal>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} flush
        Footer={<BottomSheetFooter SecondaryAction={<SecondaryButton Text="ปิด" Size="lg" onClick={() => setSheet(false)} />} PrimaryAction={<PrimaryButton Text="ออก" Size="lg" onClick={() => setSheet(false)} />} />}>
        <ModalHeader Title="ยืนยันการออก" SupportingText="ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก" />
      </BottomSheet>
    </AppFrame>
  );
}
