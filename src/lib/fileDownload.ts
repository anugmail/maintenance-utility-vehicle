"use client";
/* ดาวน์โหลดเอกสารที่แนบแล้ว (S26 Safety Inspection · เจ้าของงาน 11 พ.ย. 2569 "ต้องสามารถดาวน์โหลดเอกสารหลังจากอัปโหลดเอกสารได้" · BACKLOG ข้อ 67ข)
   ต้นแบบไม่มีที่เก็บไฟล์จริง (ที่เก็บจำลองเก็บแค่ชื่อและขนาด):
     ไฟล์ที่เลือกในแท็บนี้ (รอบการใช้งานเดียวกัน) = ไฟล์จริงที่เลือก (blob ที่จำไว้ด้วย rememberFiles)
     ไฟล์อื่น (ข้อมูลตัวอย่าง · บันทึกไว้ก่อนรีโหลดหน้า) = ไฟล์ข้อความแทนชื่อเดียวกัน (ไฟล์จำลองของต้นแบบ)
   ดาวน์โหลดแบบเดียวกับส่งออกของ S4 (parts/_lib/exportFile.ts · Blob + ลิงก์ download) */
const blobs = new Map<string, Blob>();
/** จำไฟล์ที่ผู้ใช้เลือก (ชื่อไฟล์เป็นคีย์ · ชื่อซ้ำ = ไฟล์ล่าสุด) */
export function rememberFiles(files: File[]) { files.forEach((f) => blobs.set(f.name, f)); }
export function downloadFile(name: string) {
  const blob = blobs.get(name) ?? new Blob(["ไฟล์จำลองของต้นแบบ (ไม่ใช่เอกสารจริง): " + name + "\n"], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
