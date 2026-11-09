/* ส่งออกไฟล์ของแดชบอร์ด S4 (popup ส่งออก · R32) — ต้นแบบสร้างไฟล์ฝั่งเบราว์เซอร์ ไม่มีเซิร์ฟเวอร์
   Excel → ไฟล์ .csv (UTF-8 BOM เปิดใน Excel ได้ภาษาไทย) ของแท็บที่เปิดอยู่ · การ์ดบอก ".xlsx แยกชีตตามหัวข้อ" ตามจอ — ต้นแบบยังทำ .xlsx หลายชีตไม่ได้ (BACKLOG ข้อ 22 หมวด ค.)
   PDF → เปิดหน้าพิมพ์ในแท็บใหม่ (หัวเอกสาร DOC_HEAD + ตารางของแท็บ ตาม dashPdf) แล้วเรียกพิมพ์ ⇒ ผู้ใช้เลือก "บันทึกเป็น PDF" เอง
   หน้าตาไฟล์ไม่ใช่จอของระบบ (เฟรม "ไฟล์ PDF" / "ไฟล์ Excel" ของ Figma เป็นภาพประกอบ) — ไม่มี component ไม่มีสี */
import type { TableColumn, TableValue } from "@/components/vms/Table";

export interface ExportDoc { title: string; info: [string, string][]; section: string; cols: TableColumn[]; rows: TableValue[][]; file: string }

const cellText = (v: TableValue): string => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if ("pills" in v) return v.pills.map((p) => p[0]).join(", ");
  if ("text" in v) return v.sub ? v.text + " (" + v.sub + ")" : v.text;
  return "";
};
/* คอลัมน์ในไฟล์ = คอลัมน์บนจอ ตัดช่องไม่มีหัว (ปุ่ม ›) */
const table = (d: ExportDoc) => {
  const keep = d.cols.map((c, i) => (c.head ? i : -1)).filter((i) => i >= 0);
  return { head: keep.map((i) => d.cols[i].head), body: d.rows.map((r) => keep.map((i) => cellText(r[i]))) };
};

export function downloadCsv(d: ExportDoc) {
  const { head, body } = table(d);
  const q = (s: string) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
  const csv = "﻿" + [head, ...body].map((r) => r.map(q).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = d.file + ".csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function openPrint(d: ExportDoc) {
  const { head, body } = table(d);
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.write("<!doctype html><html lang=\"th\"><head><meta charset=\"utf-8\"><title>" + esc(d.file) + "</title>"
    + "<style>body{font-family:sans-serif;margin:48px}table{border-collapse:collapse;width:100%}th,td{border:1px solid;padding:6px 10px;text-align:left}dl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}dd{margin:0}</style></head><body>"
    + "<h1>" + esc(d.title) + "</h1><dl>" + d.info.map(([k, v]) => "<div><dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>").join("") + "</dl>"
    + "<h2>" + esc(d.section) + "</h2><table><thead><tr>" + head.map((h) => "<th>" + esc(h) + "</th>").join("") + "</tr></thead><tbody>"
    + body.map((r) => "<tr>" + r.map((c) => "<td>" + esc(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table></body></html>");
  w.document.close();
  w.focus();
  w.print();
  return true;
}

/* ---------- เอกสารหลายหน้า / หลายชีต (ส่งออกแผนเดินทาง R84 · tripPdf / tripXls ของ screens.js) ----------
   PDF: หน้าละหัวเอกสาร (heading + info) แล้วตามด้วยหัวข้อของหน้านั้น ขึ้นหน้าใหม่ทุกหน้า (A4 · หน้าพิมพ์ของเบราว์เซอร์)
   Excel: ต้นแบบทำ .xlsx หลายชีตไม่ได้ ⇒ .csv ไฟล์เดียว ชีตต่อกันลงมา คั่นด้วยชื่อชีต (BACKLOG หมวด ค.) */
export interface DocSection { title: string; cols?: TableColumn[]; rows?: TableValue[][]; pairs?: [string, string][] }
export interface DocPage { heading: string; info: [string, string][]; sections: DocSection[] }
const secTable = (s: DocSection) => table({ title: "", info: [], section: "", cols: s.cols ?? [], rows: s.rows ?? [], file: "" });
export function openPrintPages(file: string, pages: DocPage[]) {
  const w = window.open("", "_blank");
  if (!w) return false;
  const sec = (s: DocSection) => {
    if (s.pairs) return "<h2>" + esc(s.title) + "</h2><dl>" + s.pairs.map(([k, v]) => "<div><dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>").join("") + "</dl>";
    const { head, body } = secTable(s);
    return "<h2>" + esc(s.title) + "</h2><table><thead><tr>" + head.map((h) => "<th>" + esc(h) + "</th>").join("") + "</tr></thead><tbody>"
      + body.map((r) => "<tr>" + r.map((c) => "<td>" + esc(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
  };
  w.document.write("<!doctype html><html lang=\"th\"><head><meta charset=\"utf-8\"><title>" + esc(file) + "</title>"
    + "<style>body{font-family:sans-serif;margin:48px}section+section{break-before:page}table{border-collapse:collapse;width:100%}th,td{border:1px solid;padding:6px 10px;text-align:left}dl{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}dd{margin:0}</style></head><body>"
    + pages.map((p) => "<section><h1>" + esc(p.heading) + "</h1><dl>" + p.info.map(([k, v]) => "<div><dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>").join("") + "</dl>"
      + p.sections.map(sec).join("") + "</section>").join("") + "</body></html>");
  w.document.close();
  w.focus();
  w.print();
  return true;
}
export function downloadCsvSheets(file: string, sheets: DocSection[]) {
  const q = (s: string) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
  const lines = sheets.flatMap((s, i) => { const { head, body } = secTable(s); return [...(i ? [[] as string[]] : []), [s.title], head, ...body]; });
  const csv = "﻿" + lines.map((r) => r.map(q).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = file + ".csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
