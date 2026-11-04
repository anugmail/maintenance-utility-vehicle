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
| `PillOutline` | Pill outline · Badge 2:13 | `Text` `Color` (Brand/Gray/Info/Success/Warning/Error/Disabled/Purple) |
| `BadgeOutline` | Badge outline · Badge 2:13 | `Text` `Color` (Brand/Gray/Disabled/Success/Error) |
| `BadgeOutlineWithRemoveIcon` | Badge outline with remove icon · Badge 2:13 | `Text` `Color` (Brand/Gray/Disabled) `onRemove` |
| `FeaturedIcon` | Featured icon · 2861:54686 | `Color` (รวม Purple) `Size` (md/sm) `IconSwap` |
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
| `MobileTable` (+ `MobileCards`) / `MobileTableItem` | Mobile table (+ item) · Table 2:14 | `MobileCards` = แปลง columns/rows ของ `Table` เป็นการ์ด (ตาม mobileCards() ใน core.js · ช่อง `{text, sub}` → Text + Supporting text) · item: `Style` `Header` `Text` `SupportingText` `Pill` `Actions` |
| `EmptyStateDataEmpty` | Empty state/Data empty · Table 2:14 | `Text` `SupportingText` `Actions` |
| `Breadcrumbs` | Breadcrumbs · 2:7 | `links[{Text, href}]` |
| `PageHeader` | Page header · 1983:21158 | `Breakpoint` `Title` `Badge` ([ข้อความ, สี Badge outline]) `SupportingText` `onBack` `crumbs` `Actions` |
| `SectionHeader` | Section header · 2011:6955 (หน้า Create/Edit) | `Breakpoint` `Title` `Badge` `SupportingText` `Actions` |
| `SectionLabel` | Section label · 2011:6955 (หน้า Detail) | `Title` `SupportingText` `Actions` |
| `Tabs` / `TabItem` | Tabs · Tab item · Tabs 2:9 | item: `Text` `Badge` `Active` `State` `onClick` |
| `Modal` / `ModalHeader` / `ModalFooter` | Modal · Modal header · Modal footer · Modals 2:16 | modal: `Type` `Size` (md 500/lg 800/xl 1140) `open` `onClose` `Header` `Footer` children · header: `Alignment` `Title` `SupportingText` `FeaturedIcon` `Divider` `onClose` `onBack` · footer: `Alignment` `SecondaryAction` `PrimaryAction` `TertiaryAction` `Divider` `PaddingTop` |
| `BackgroundOverlay` | Background overlay · 2428:4927 | `onClick` |
| `BottomSheetHeader` / `BottomSheetFooter` | Bottom sheet header/footer · Bottom sheets 1180:2 | header: `Text` `ActionText` `onAction` `onBack` · footer: `SecondaryAction` `PrimaryAction` |
| `BottomSheet` | **ประกอบ** (ดู `figma-spec/COMPOSED.md`) | `open` `onClose` `Title` `children` `Footer` `flush` |
| `Alert` | Alert · Alerts 2:11 | `Color` `Text` `SupportingText` `LeadingIcon` `onClose` |
| `Notification` | Notification · Notifications 1873:44383 | `Type` `Breakpoint` `Text` `SupportingText` `onClose` `floating` · ใช้ผ่าน `notify()` ใน `lib/mock/store` |
| `NavButton` | Nav button · Sidebar navigation 2:2 | `IconSwap` (ชื่อไอคอน หรือ element เช่น Avatar) `State` `Indicator` `Text` `href` `onClick` |
| `NavItem` | Nav item · Sidebar navigation 2:2 | `Text` `State` (Default/Hover/Active/Focused/Disabled) `LeadingIcon` `LeadingIconSwap` `TrailingIcon` `TrailingIconSwap` `Badge` `BadgeText` `ShowDescription` `SupportingText` `href` `onClick` `expanded` |
| `NavListItem` | Nav list item · Sidebar navigation 2:2 (เมนูย่อย) | `Text` `State` `Badge` `BadgeText` `href` `onClick` |
| `PillColor` | Pill color · Badge 2:13 | `Text` `Color` (Brand/Gray/Info/Success/Warning/Error/Disabled) |
| `HeaderNavigation` | Header navigation · 2:4 | `Breakpoint` (Desktop/Tablet/Mobile) `bell` `onMenu` |
| `SidebarNavigation` | Sidebar navigation · 2:2 (เมนูจริงจากหน้า Sidebar Navigation 277:230639 ของ UI Release#2) | `State` (Collapsed/Expanded) `menu` (กลุ่ม + เมนูย่อย) `footer` `active` (ข้อความเมนูที่ Active · ตั้งต้น "บำรุงรักษาตามวาระ") `onToggle` `toggleLabel` |
| `TextArea` | Text area · Inputs 2:6 | `State` (10 ค่า) `LabelText` `Optional` `Text` `Placeholder` `HelperText` `onChange(v)` |
| `NumberInput` | Number input · Inputs 2:6 | `State` `Size` `Label` `LabelText` `Number` `min` `max` `step` `onChange(n)` `HelperText` |
| `RadioButton` (+ `RadioDot`) | Radio button · Radio button 2:17 | `Selected` `State` `onChange` `label` `bare` |
| `HorizontalRadioGroups` | Horizontal radio groups · 2:17 | `Label` `Optional` `options[]` `value` `onChange(v)` `HelperText` `Error` `Disabled` |
| `RadioTextCard` (+ `RadioTextCards`) | Radio text card · 2:17 | `Text` `SupportingText` `Selected` `State` `onClick` `compact` · `RadioTextCards` = แถวตาม radioPick(): `options[{Text, SupportingText}]` `value` `onChange` `row` |
| `CheckboxTextCard` | Checkbox text card · Checkbox 2:18 | `Text` `SupportingText` `Selected` `State` `onChange(next)` |
| `ProgressBar` | Progress bar · 2843:13902 | `Progress` (0–100) `Percentage` `Color` (Brand/Success) |
| `FileUpload` | File upload · 2123:5261 (upload() ใน core.js) | `LabelText` `Optional` `files[{name, size, progress, bar, err}]` `hint` `max` `readonly` `bar` `HelperText` `Error` `onFiles` `onDelete(i)` `onDownload(i)` |
| `FileUploadBase` / `FileUploadItemBase` / `FileIcon` | _File upload base · _File upload item base · _File icon · 2123:5261 | base: `State` `SupportingText` `onFiles` · item: `State` (In progress/Completed/Error) `FileName` `FileSize` `Progress` `ProgressBar` `DownloadAction` `DeleteAction` · icon: `Type` (Document/Image) + `fileIconType(name)` |
| `ContentItemBase` / `ContentItemRow` | _Content item base · Content item row · Cards 2413:11354 | base: `Type` `Label` `Text` `SupportingText` `LeadingIconSwap` `InstanceSwap` · row: `items` ([label, text] หรือ props ของ base) `perRow` `ColumnWidth` `gap` |
| `CardFormRow` | Card form row · Cards 2413:11354 | `Width` (Full/50%/25%) `Input1` `Input2` |
| `ContentDivider` | Content divider · 2635:20181 | `Type` (Default/Text) `Text` |
| `EmptyStateSearchNotFound` | Empty state/Search not found · Table 2:14 | `Text` `SupportingText` `Actions` (ค่าเริ่มไลบรารี "ไม่พบข้อมูล") |
| `Images` | Images · 2648:43267 | `Size` (md/sm) `src` (ไม่ส่ง = Type Empty) `alt` `className` (กว้าง/สูง) |
| `IconButton` | Icon button · Button 2:5 | `IconSwap` `State` + ปุ่ม HTML |
| `ListWithCheckbox` / `ListWithCheckboxItem` / `ListHeaderItem` | List with checkbox (+ item, header) · List 3285:58382 | list: `Title` `Badge` `options[{value, Text, SupportingText, Disabled}]` `value[]` `onChange(next[])` · item: `Text` `SupportingText` `Selected` `State` `onChange` |
| `DatePicker` | Date picker · 855:376 | `Type` (Dual/Single) `value{start,end}` `month` `today` `onApply(v)` `onCancel` `weekdays` `monthLabel` `ClearText` `CancelText` `ApplyText` |
| `Status` | Status · Header navigation 2:4 | `State` (Success/Warning/Error/Brand/Info) |
| `NotificationItemBase` / `NotificationCard` | _Notification item base · Notification card · 2:4 | item: `Text` `SupportingText` `StatusState` `Button` `onClick` · card: `Badge` children `Header` `Footer` `FooterText` `onFooter` |
| `BadgeOutlineWithLeadingIcon` | Badge outline with leading icon · Badge 2:13 | `Text` `Color` `LeadingIconSwap` |
| `Ms` | (ไม่ใช่ component ไลบรารี) ไอคอน Material Symbols Rounded | `name` `size` (12/16/20/24/48) |

กรอบหน้า + แถบต้นแบบอยู่ `src/components/shell/` (`AppFrame` — Sidebar ย่อ/ขยาย + เมนูมือถือ · `PrototypeBar` · `ToastHost` · `MovedTo` หน้าพาจากที่อยู่เดิม)

ชุดประกอบที่ใช้ซ้ำ (จาก core.js) อยู่ `src/components/patterns/`:
- `ConfirmDialog` — `spec={{ title, sub, cancel, ok, danger }}` `onOk` `onCancel` (desktop Modal · มือถือ Bottom sheet)
- `RowMenu` + `anchorOf(el)` — เมนู "…" ท้ายแถว `anchor` `items` `onClose` (desktop Dropdown menu ลอย · มือถือ Bottom sheet)
- `FormModal` — formModal(): `open` `title` `sub` `fields[{label, value, placeholder, area, optional, error}]` `onField(i, v)` หรือ children · `ok` (บันทึก) `cancel` (ยกเลิก) `okDisabled` `onOk` `onCancel` (desktop Modal Type=Form · มือถือ Bottom sheet)
- `PopupModal` — popupModal() เนื้อหาอิสระ (ตาราง/อัปโหลด): `open` `title` `sub` `width` (640/800) children `ok` `okDisabled` `showOk` `onOk` `onCancel`
- `NotificationPanel` — แผงกระดิ่ง (S8): `open` `onClose` `badge` `items[{state, text, time, onClick}]` `onClearAll` (desktop Notification card ใต้หัว · มือถือ Bottom sheet)
- `DisplayBox` (+ `chunk`) — กล่องแสดงข้อมูล kv(): `Title` `pairs[[label, text]]` `perRow` (desktop 4 · มือถือ 2) `Actions`
- `PhotoGallery` — แถวภาพ library fallback: `Title` `photos[{src, alt}]` (desktop 4 · มือถือ 2)

component จากไฟล์ Figma งานซ่อม **Maintain-D** (CLAUDE.md ข้อ 12) อยู่ `src/components/maintain-d/` — ชื่อไฟล์ = ชื่อใน Figma ตัดช่องว่าง · สเปก `figma-spec/<ชื่อ>.json`:

| ไฟล์ | Figma (หน้า · node) | prop หลัก |
|---|---|---|
| `VehicleAndReporterInfo` | รายละเอียดงานซ่อม 175:79986 (vehicleInfo()) | `Title` `pairs[[label, text]]` · มือถือ = DisplayBox |
| `IncidentPhotoGallery` | รายละเอียดงานซ่อม 175:79986 (photoGallery()) | `Title` `photos[]` · มากกว่า 4 ภาพมีปุ่มถัดไป · มือถือ = PhotoGallery |
| `RepairFeedback` | Design 0:1 (S14) | `Title` `SupportingText` `value` (1–5) `onChange(n)` `Disabled` |
| `HandoverSignature` | Design 0:1 (S10) | `Title` `slots[{LabelText, Placeholder, options, value, signed, HelperText}]` `onPick(i, name)` `onSign(i)` |
| `ModalSignature` | Design 0:1 (S10) | `open` `Title` `signer` ([ป้าย, ชื่อ]) `value` `onSave(dataUrl)` `onClose` — ช่องวาดลายเซ็นจริง |
| `ReceiptChecklist` | Design 0:1 (S10 รับรถ) | `Title` `Badge` `items[{name, has, damaged, wrongModel, note, battery}]` `onChange(i, patch)` `onAdd` `readonly` |
| `InspectionChecklist` | Design 0:1 (S10 รับรถ/ปิดงาน) | `Title` `GroupTitle` `Badge` `items[{name, ok, note}]` `onChange(i, patch)` `onAdd` `readonly` |
| `SparePartCardItem` (+ `baht`) | Local Component 8:133440 | `อะไหล่` (รายการในคลัง/รายการที่เลือก/V2 รายการที่เลือก/เพิ่มอะไหล่) `part{name, code, unit, price, warehouse, stock, suggestion}` `picked` `onPick` `qty` `onQty` `onDelete` `buyMore` `buyerOptions` `manual` `onManual` |
| `SelecteSparePart` | Local Component 8:133440 | `State` (Add/Checked/Text) `Text` `onClick` |
| `PartsInventoryPanel` | Design 0:1 (S21) | `parts[]` `picked[]` (รหัส) `onPick(part)` `query` `onQuery` `apiError` (State Not Found อัตโนมัติเมื่อค้นไม่เจอ) |
| `RequestedPartsPanel` | Design 0:1 (S21) | `Title` `SupportingText` `Badge` children (การ์ด) `onAddManual` `costs[[ป้าย, บาท]]` |
| `PartRequestStepPanel` | Design 0:1 (S21) | `Inventory` `Requested` (มือถือเรียงลง) |
| `SummaryRequestedParts` | Design 0:1 (S4) | `open` `Title` `info` `groups[{title, subs[{title, rows[[ชื่อ, บาท]]}]}]` `totals` `cancel` `ok` `onOk` `onCancel` |

```tsx
import { FormModal } from "@/components/patterns/FormModal";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { FileUpload } from "@/components/vms/FileUpload";

<VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={[["ไตรมาส", "ไตรมาส 1"], ["ช่วงวันเดินทาง", "03/11/2569 – 07/11/2569"]]} />
<FileUpload LabelText="ภาพก่อนเริ่มงาน" hint="JPG, PNG · 1 ภาพ" files={[{ name: "ภาพก่อนเริ่มงาน-1.jpg", size: "1.2 MB", bar: true }]} />
<FormModal open={open} title="แก้ไขเบอร์ติดต่อและสถานที่" fields={[{ label: "เบอร์ติดต่อ", value: tel }]} onField={(i, v) => setTel(v)} onOk={save} onCancel={close} />
```

ข้อมูลจำลอง `src/lib/mock/` — `data.ts` (ค่าชุด screens.js) · `plan.ts` (ตัวช่วยแผน) · `store.ts` (`useMock` `setMock` `resetMock` `useRole` `notify`)
