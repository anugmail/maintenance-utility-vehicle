"use client";
/* Figma: "_File upload item base" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File upload item base.json
   แถวไฟล์ในคิวของ File upload
   variant: State = In progress | Completed | Error · property: File name · File size · Progress bar · Actions · Download action · Delete action
   ค่า: ขอบใน 16 · รัศมี 8 · พื้น white ขอบ 1 gray-300 (Error error-500) · _File icon + ชื่อไฟล์ ช่องไฟ 12 · ชื่อ 14 SemiBold gray-600 · ขนาด 12 gray-600 (Error ข้อความ error-600)
        Actions = Tertiary button ไอคอน 40: Completed download + delete · In progress close · Error restart_alt + close
        Progress bar Label=Right ห่าง 4: In progress brand-900 n% · Completed success-500 100% */
import { cx } from "@/lib/cx";
import { FileIcon, fileIconType } from "./FileIcon";
import { ProgressBar } from "./ProgressBar";
import { TertiaryButton } from "./TertiaryButton";

export type FileItemState = "In progress" | "Completed" | "Error";

export interface FileUploadItemBaseProps {
  State?: FileItemState;
  FileName: string;
  /** property File size (Error = ข้อความผิดพลาด) */
  FileSize?: string;
  /** In progress: เปอร์เซ็นต์ (ค่าเริ่ม 40) */
  Progress?: number;
  /** property Progress bar — Completed แสดงแถบ 100% เมื่อ true */
  ProgressBar?: boolean;
  DownloadAction?: boolean;
  DeleteAction?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
  onRetry?: () => void;
}

export function FileUploadItemBase({ State = "Completed", FileName, FileSize, Progress = 40, ProgressBar: bar = true, DownloadAction = true, DeleteAction = true, onDownload, onDelete, onRetry }: FileUploadItemBaseProps) {
  const err = State === "Error";
  const btn = (icon: string, label: string, on?: () => void) => <TertiaryButton key={label} LeadingIconSwap={icon} ButtonText={false} aria-label={label} title={label} onClick={on} />;
  const actions = State === "In progress" ? [btn("close-24-300-round", "ยกเลิก", onDelete)]
    : err ? [btn("restart_alt-24-300-round", "ลองใหม่", onRetry), DeleteAction && btn("close-24-300-round", "เอาออก", onDelete)]
      : [DownloadAction && btn("download-24-300-round", "ดาวน์โหลด", onDownload), DeleteAction && btn("delete-24-300-round", "ลบ", onDelete)];
  return (
    <div className={cx("flex flex-col gap-1 rounded-md border bg-white p-4", err ? "border-error-500" : "border-gray-300")}>
      <div className="flex items-start gap-3">
        <FileIcon Type={fileIconType(FileName)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-sm font-semibold text-gray-600">{FileName}</p>
          {FileSize && <p className={cx("text-xs", err ? "text-error-600" : "text-gray-600")}>{FileSize}</p>}
        </div>
        <div className="-my-2 -mr-2 flex shrink-0 items-center">{actions}</div>
      </div>
      {!err && bar && <ProgressBar Progress={State === "In progress" ? Progress : 100} Color={State === "Completed" ? "Success" : "Brand"} className="pl-12" />}
    </div>
  );
}
