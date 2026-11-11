"use client";
/* Figma: "File upload" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/File upload.json
   variant: Type = Default (ที่ต้นแบบใช้) · property: File upload (กล่องเลือกไฟล์) · File queue · Helper · Helper text
   โครง: File upload with label (Input label → _File upload base ห่าง 8 → Helper text) → File queue ห่าง 16 (_File upload item base ช่องไฟ 12)
   ใช้แบบ upload() ใน core.js: Supporting text = "<hint> · <n>/10 ไฟล์" · readonly = ไม่มีกล่องอัปโหลด ไม่มีปุ่มลบ · error = Helper text error-600 + กล่อง State=Error
   ไฟล์: ไอคอนตามนามสกุล (_File icon Image/Document) · progress = กำลังอัปโหลด (n%) · bar = อัปโหลดเสร็จแสดงแถบ 100% · err = อัปโหลดไม่สำเร็จ */
import { cx } from "@/lib/cx";
import { FileUploadBase } from "./FileUploadBase";
import { FileUploadItemBase } from "./FileUploadItemBase";
import { InputLabel } from "./InputLabel";

export interface UploadFile { name: string; size?: string; progress?: number; bar?: boolean; err?: boolean }

export interface FileUploadProps {
  LabelText?: string;
  Optional?: boolean;
  files: UploadFile[];
  /** ข้อความใน Supporting text ก่อนจำนวนไฟล์ (ค่าเริ่ม "PDF, JPG · สูงสุด 10 ไฟล์") */
  hint?: string;
  max?: number;
  /** หน้ารายละเอียด: ไม่มีกล่องอัปโหลด ไม่มีปุ่มลบ · ส่ง onDownload = แสดงปุ่มดาวน์โหลด (Download action) ด้วย (S26 11 พ.ย. 2569) */
  readonly?: boolean;
  /** แสดงแถบ 100% ทุกไฟล์ที่อัปโหลดเสร็จ */
  bar?: boolean;
  HelperText?: string;
  Error?: boolean;
  accept?: string;
  onFiles?: (files: File[]) => void;
  onDelete?: (i: number) => void;
  onDownload?: (i: number) => void;
  className?: string;
}

export function FileUpload({ LabelText, Optional, files, hint = "PDF, JPG · สูงสุด 10 ไฟล์", max = 10, readonly, bar, HelperText, Error, accept, onFiles, onDelete, onDownload, className }: FileUploadProps) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-4", className)}>
      {(LabelText || !readonly) && (
        <div className="flex flex-col gap-2">
          {LabelText && <InputLabel LabelText={LabelText} Optional={Optional} />}
          {!readonly && <FileUploadBase State={Error ? "Error" : "Default"} SupportingText={`${hint} · ${files.length}/${max} ไฟล์`} accept={accept} onFiles={onFiles} />}
          {HelperText && <p className={cx("text-xs", Error ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
        </div>
      )}
      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          {files.map((f, i) => (
            <FileUploadItemBase key={f.name + i} FileName={f.name} FileSize={f.err ? f.size ?? "อัปโหลดไม่สำเร็จ" : f.size}
              State={f.err ? "Error" : f.progress != null ? "In progress" : "Completed"} Progress={f.progress}
              ProgressBar={!f.err && (f.progress != null || !!f.bar || !!bar)}
              DownloadAction={!f.err && (!readonly || !!onDownload) && f.progress == null} DeleteAction={!readonly}
              onDelete={() => onDelete?.(i)} onDownload={() => onDownload?.(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
