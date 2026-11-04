"use client";
/* ชิ้นประกอบหน้าของการยอมรับผล (S13 S14) — ประกอบจากชิ้นไลบรารีเท่านั้น (figma-spec/COMPOSED.md หัวข้อ ฉ.)
   DocList = Input label + _File upload item base (Download action อย่างเดียว) — File upload readonly ของไลบรารีซ่อนปุ่มดาวน์โหลด แต่ carResult() ต้องมี */
import { FileUploadItemBase } from "@/components/vms/FileUploadItemBase";
import { InputLabel } from "@/components/vms/InputLabel";

export function DocList({ LabelText, files }: { LabelText: string; files: { name: string; size: string }[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <InputLabel LabelText={LabelText} />
      <div className="flex flex-col gap-3">
        {files.map((f) => <FileUploadItemBase key={f.name} FileName={f.name} FileSize={f.size} State="Completed" ProgressBar={false} DeleteAction={false} />)}
      </div>
    </div>
  );
}
