"use client";
const blobs = new Map<string, Blob>();
export function rememberFiles(files: File[]) { files.forEach((f) => blobs.set(f.name, f)); }
export function downloadFile(name: string) {
  const blob = blobs.get(name) ?? new Blob(["ไฟล์จำลองของต้นแบบ (ไม่ใช่เอกสารจริง): " + name + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
