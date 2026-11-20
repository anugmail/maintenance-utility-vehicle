"use client";
import { cx } from "@/lib/cx";
import { FileUploadBase } from "./FileUploadBase";
import { FileUploadItemBase } from "./FileUploadItemBase";
import { InputLabel } from "./InputLabel";

export interface UploadFile { name: string; size?: string; progress?: number; bar?: boolean; err?: boolean }

export interface FileUploadProps {
  LabelText?: string;
  Optional?: boolean;
  files: UploadFile[];
  hint?: string;
  max?: number;
  readonly?: boolean;
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
