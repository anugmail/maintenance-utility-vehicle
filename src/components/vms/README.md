# src/components/vms — ชุด component ตามไลบรารี (Component) VMS Plus

ไฟล์ละ 1 component ของไลบรารี (ชื่อไฟล์ = ชื่อใน Figma ตัดช่องว่าง) · ค่าทุกตัวยกจาก `figma-spec/<ชื่อ>.json` · ดูทุก variant ได้ที่หน้า `/kit/`

**กติกา prop:** ชื่อ variant/property ของ Figma ตัดช่องว่าง เช่น `State` `Size` `Color` `Breakpoint` `Text` `SupportingText` `LeadingIconSwap` `HelperText`
ค่าของ variant เขียนตรงตัวตาม Figma (`State="Error Focused"` `Alignment="Horizontal fill"` `Type="Destructive centered image with input"`)
prop ที่ไม่ใช่ของ Figma มีเฉพาะที่ React ต้องใช้ (`onClick` `onChange` `open` `onOpenChange` `onClose` `className` `children`)

**ไอคอน:** ส่งชื่อแบบ Figma `"search-24-300-round"` (หรือชื่อ Material Symbols ตรงๆ) ให้ prop ที่ลงท้าย `IconSwap` · ตัวแสดงคือ `Ms.tsx`

**Breakpoint:** component ที่มี variant `Breakpoint` ไม่ต้องส่งเอง — ใช้ `useBreakpoint()` (< 768 = Mobile) · ส่ง `Breakpoint="Mobile"` เมื่อต้องการบังคับ

```tsx
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { TextInput } from "@/components/vms/TextInput";
import { Table, type TableColumn } from "@/components/vms/Table";

<PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" onClick={go} />
<TextInput LabelText="ชื่อแผน" Text={name} Placeholder="ระบุชื่อแผน" onChange={setName} State={err ? "Error" : undefined} HelperText={err ? "กรุณาระบุชื่อแผน" : undefined} />
<Table columns={[{ head: "เลขที่ MR", width: 150, Style: "Lead text" }]} rows={[["MR Z7000001"]]} />
```

## รายการ

| ไฟล์ | Figma (หน้า · node) | prop หลัก |
|---|---|---|
| `PrimaryButton` `SecondaryButton` `PrimaryDangerButton` `SecondaryDangerButton` | Primary/Secondary (danger) button · Button 2:5 | `Text` `State` (Default/Hover/Focused/Disabled) `Size` (md/lg) `LeadingIconSwap` `TrailingIconSwap` `ButtonText` + ปุ่ม HTML |
| `TertiaryButton` | Tertiary button · Button 2:5 | เหมือนบน ไม่มี `Size` (md) · `ButtonText={false}` = ปุ่มไอคอน (ส่ง `aria-label`) |
| `TertiaryBrandButton` `TertiaryDangerButton` | Tertiary brand/danger button · Button 2:5 | `Text` `State` `LeadingIconSwap` |
| `PillOutline` | Pill outline · Badge 2:13 | `Text` `Color` (Brand/Gray/Info/Success/Warning/Error/Disabled) |
| `BadgeOutline` | Badge outline · Badge 2:13 | `Text` `Color` (Brand/Gray/Disabled/Success/Error) |
| `BadgeOutlineWithRemoveIcon` | Badge outline with remove icon · Badge 2:13 | `Text` `Color` (Brand/Gray/Disabled) `onRemove` |
| `FeaturedIcon` | Featured icon · 2861:54686 | `Color` `Size` (md/sm) `IconSwap` |
| `InputLabel` | Input label · Inputs 2:6 | `LabelText` `Optional` `InfoIcon` `Button` |
| `TextInput` | Text input · Inputs 2:6 | `State` (10 ค่า) `Size` `Label` `LabelText` `Optional` `Text` `Placeholder` `LeadingIconSwap` `TrailingIconSwap` `HelperText` `onChange(v)` |
| `InputDropdown` | Input dropdown · Dropdowns 2:8 | `State` `Size` `LabelText` `Text` `Placeholder` `SupportingText` `HelperText` `open` `onOpenChange` · children = `DropdownList` |
| `InputDropdownWithBadges` | Input dropdown with badges · Dropdowns 2:8 | `State` `LabelText` `values[]` `Placeholder` `HelperText` `onRemove(v)` `open` `onOpenChange` · children = `DropdownList` |
| `Checkbox` | Checkbox · Checkbox 2:18 | `Type` (Unselected/Selected/Indeterminate) `State` `onChange(next)` `label` |
| `DropdownList` / `DropdownListItem` | Dropdown list (+ item) · Dropdowns 2:8 | list: children `emptyText` · item: `Text` `State` (Default/Hover/Selected/Selected Hover/Disabled) `SupportingText` `SupportingText2` `onClick` |
| `DropdownMenu` / `DropdownMenuItem` | Dropdown menu · _Dropdown menu item · Dropdowns 2:8 | menu: `items[{Text, IconSwap, onClick, Disabled}]` `bare` (ใน bottom sheet) · เส้นคั่นก่อนรายการที่ 3 · item: `Text` `IconSwap` `State` `Divider` |
| `Table` | Table · Table 2:14 | `columns[{head, width, Style, SortIcon}]` `rows` (ช่อง: ข้อความ · `{text, sub}` · `{pills: [[t, สี]]}` · `{actions: [{IconSwap, label, onClick}]}`) `AlternatingFills` `Pagination` |
| `TableHeaderCell` / `TableCell` | Table header cell · Table cell · Table 2:14 | header: `Text` `SortIcon` `Checkbox` · cell: `Style` (Text/Lead text/Badge/Action icons/Multiple badges/Lead checkbox) `AlternatingFills` `Text` `SupportingText` `Pills` `Actions` |
| `SortIcon` | Sort icon · Table 2:14 | `Icon` (Down/Up/Swap) |
| `TableHeader` | Table header · Table headers 2096:36080 | `Breakpoint` `query` `Placeholder` `onQuery` `onFilter` `FilterText` `Filters[]` `onRemoveFilter` |
| `TablePagination` / `ButtonGroupsPaginationItem` | Table pagination · Pagination 2:15 | `Breakpoint` `total` `page` `perPage` `onPage` · item: `Type` `State` `Number` |
| `MobileTable` (+ `MobileCards`) / `MobileTableItem` | Mobile table (+ item) · Table 2:14 | `MobileCards` = แปลง columns/rows ของ `Table` เป็นการ์ด (ตาม mobileCards() ใน core.js) · item: `Style` `Header` `Text` `SupportingText` `Pill` `Actions` |
| `EmptyStateDataEmpty` | Empty state/Data empty · Table 2:14 | `Text` `SupportingText` `Actions` |
| `Breadcrumbs` | Breadcrumbs · 2:7 | `links[{Text, href}]` |
| `PageHeader` | Page header · 1983:21158 | `Breakpoint` `Title` `Badge` ([ข้อความ, สี Badge outline]) `SupportingText` `onBack` `crumbs` `Actions` |
| `SectionHeader` | Section header · 2011:6955 (หน้า Create/Edit) | `Breakpoint` `Title` `Badge` `SupportingText` `Actions` |
| `SectionLabel` | Section label · 2011:6955 (หน้า Detail) | `Title` `SupportingText` `Actions` |
| `Tabs` / `TabItem` | Tabs · Tab item · Tabs 2:9 | item: `Text` `Badge` `Active` `State` `onClick` |
| `Modal` / `ModalHeader` / `ModalFooter` | Modal · Modal header · Modal footer · Modals 2:16 | modal: `Type` `Size` (md 500/lg 800/xl 1140) `open` `onClose` `Header` `Footer` children · header: `Alignment` `Title` `SupportingText` `FeaturedIcon` `onClose` `onBack` · footer: `Alignment` `SecondaryAction` `PrimaryAction` `TertiaryAction` |
| `BackgroundOverlay` | Background overlay · 2428:4927 | `onClick` |
| `BottomSheetHeader` / `BottomSheetFooter` | Bottom sheet header/footer · Bottom sheets 1180:2 | header: `Text` `ActionText` `onAction` `onBack` · footer: `SecondaryAction` `PrimaryAction` |
| `BottomSheet` | **ประกอบ** (ดู `figma-spec/COMPOSED.md`) | `open` `onClose` `Title` `children` `Footer` `flush` |
| `Alert` | Alert · Alerts 2:11 | `Color` `Text` `SupportingText` `LeadingIcon` `onClose` |
| `Notification` | Notification · Notifications 1873:44383 | `Type` `Breakpoint` `Text` `SupportingText` `onClose` `floating` · ใช้ผ่าน `notify()` ใน `lib/mock/store` |
| `NavButton` | Nav button · Sidebar navigation 2:2 | `IconSwap` `State` `Indicator` `Text` `href` `onClick` |
| `HeaderNavigation` | Header navigation · 2:4 | `Breakpoint` (Desktop/Tablet/Mobile) `bell` `onMenu` |
| `SidebarNavigation` | Sidebar navigation · 2:2 | `State` (Collapsed) `menu` `footer` `activeIndex` |
| `Ms` | (ไม่ใช่ component ไลบรารี) ไอคอน Material Symbols Rounded | `name` `size` (12/16/20/24) |

กรอบหน้า + แถบต้นแบบอยู่ `src/components/shell/` (`AppFrame` · `PrototypeBar` · `ToastHost`)
