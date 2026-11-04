/* รายการ scenario ตามลำดับงาน (SCEN_SEQ ใน screens.js) · ชื่อ ช่วงงาน บทบาท จากตารางหัวข้อ 0 ของ Diagram/01-บำรุงรักษาตามวาระ/14-บำรุงรักษา-userflow.md
   href = หน้าที่ทำแล้ว · ไม่มี href = ยังไม่ทำ (เร็วๆ นี้)
   ?sample=<ชุดตัวอย่าง> (S10 S12 S23 S11 S13 S14 S24) · ?seed=S… (S4–S17 ชุด B) = ใส่ข้อมูลตั้งต้นของ scenario + สลับบทบาท (ของต้นแบบ)
   S2 S19 S20 S21 S22 เปิดผ่าน /scenarios/sample/ (ใส่แผนตัวอย่าง MR Z7000004 ในสถานะที่ scenario เริ่ม + ตั้งบทบาท แล้วพาไปหน้าแรก) */
const sample = (q: Record<string, string>) => "/scenarios/sample/?" + new URLSearchParams(q).toString();
export interface Scenario { id: string; name: string; phase: string; role: string; href?: string }

export const SCENARIOS: Scenario[] = [
  { id: "S1", name: "กบค. สร้างแผนบำรุงรักษาประจำปี และจัดรถลงไตรมาส", phase: "เตรียมดำเนินการ", role: "กบค.", href: sample({ role: "กบค.", go: "/" }) },
  { id: "S2", name: "ผู้อนุมัติ ตรวจสอบและอนุมัติแผนบำรุงรักษา", phase: "เตรียมดำเนินการ", role: "ผู้อนุมัติ", href: sample({ plan: "review", role: "ผู้อนุมัติ", go: "/approvals/plans/" }) },
  { id: "S19", name: "กบค. แก้ไขแผนบำรุงรักษา แล้วส่งอนุมัติใหม่", phase: "เตรียมดำเนินการ", role: "กบค.", href: sample({ plan: "returned", role: "กบค.", go: "/" }) },
  { id: "S20", name: "กบค. ลบแผนบำรุงรักษาที่ยังไม่อนุมัติ", phase: "เตรียมดำเนินการ", role: "กบค.", href: sample({ plan: "review", role: "กบค.", go: "/" }) },
  { id: "S21", name: "กบค. กำหนดอะไหล่ของรถแต่ละคันในแผน", phase: "เตรียมดำเนินการ", role: "กบค.", href: sample({ draft: "1", role: "กบค.", go: "/new/" }) },
  { id: "S22", name: "กบค. คลัง รับทราบรายการอะไหล่รายไตรมาส", phase: "เบิก จัดหาอะไหล่", role: "กบค. คลัง", href: sample({ plan: "approved", role: "กบค. คลัง", go: "/warehouse/" }) },
  { id: "S4", name: "กบค. ติดตามความคืบหน้าและเบิกอะไหล่ของไตรมาส", phase: "เบิก จัดหาอะไหล่", role: "กบค.", href: "/quarter/parts/?id=Z7000001&q=1&seed=S4" },
  { id: "S6", name: "กบค. ทำแผนเดินทาง (ตรวจเอง)", phase: "จ้างดำเนินการ", role: "กบค.", href: "/quarter/trips/?id=Z7000001&q=1&seed=S6" },
  { id: "S9", name: "กบค. สร้างแผนเดินทางจ้างดำเนินการ (vendor)", phase: "จ้างดำเนินการ", role: "กบค.", href: "/quarter/trips/new/?id=Z7000001&q=1&mode=hire&seed=S9" },
  { id: "S7", name: "ผู้อนุมัติ ตรวจสอบและอนุมัติแผนเดินทาง", phase: "จ้างดำเนินการ", role: "ผู้อนุมัติตามสายงาน", href: "/approvals/trips/?seed=S7" },
  { id: "S8", name: "กรย. และหน่วยงานเจ้าของรถ ได้รับแจ้งเตือนแผนเดินทาง", phase: "จ้างดำเนินการ", role: "กรย. · หน่วยงานเจ้าของรถ", href: "/trips-view/?seed=S8" },
  { id: "S10", name: "กบค. บันทึกงานบำรุงรักษารายคัน", phase: "ดำเนินการบำรุงรักษา", role: "กบค.", href: "/trips/detail/?trip=T1&sample=T1_start" },
  { id: "S23", name: "ผู้รับจ้าง บันทึกงานรายคันและส่งตรวจงาน", phase: "ดำเนินการบำรุงรักษา", role: "ผู้รับจ้าง", href: "/trips/detail/?trip=TV&sample=S23" },
  { id: "S11", name: "กบค. ตรวจรับงานรายคันของผู้รับจ้างและรับคืนอะไหล่", phase: "ตรวจรับ", role: "กบค.", href: "/trips/detail/?trip=TV&sample=S11" },
  { id: "S12", name: "กบค. บันทึกผลตรวจน้ำมันไฮโดรลิก", phase: "ตรวจรับ", role: "กบค.", href: "/trips/detail/?trip=T1&sample=T1_afterClose" },
  { id: "S13", name: "หน่วยงาน/เจ้าของรถ ยอมรับผลการตรวจบำรุงรถรายคัน", phase: "ตรวจรับ", role: "หน่วยงาน / เจ้าของรถ", href: "/acceptance/?sample=S13" },
  { id: "S14", name: "หน่วยงาน/เจ้าของรถ ตรวจสอบหลักฐานและประเมินความพึงพอใจ (ครบทุกคัน)", phase: "ตรวจรับ", role: "หน่วยงาน / เจ้าของรถ", href: "/acceptance/?sample=S14" },
  { id: "S15", name: "กบค. บันทึกและส่งประวัติงานบำรุงรักษา", phase: "จัดทำรายงานการบำรุงรักษา", role: "กบค.", href: "/closeout/history/?id=Z7000001&seed=S15" },
  { id: "S16", name: "หัวหน้า กบค. ตรวจสอบประวัติงานบำรุงรักษา", phase: "จัดทำรายงานการบำรุงรักษา", role: "หัวหน้า กบค.", href: "/head-review/?seed=S16" },
  { id: "S17", name: "กบค. ออกรายงานผลและปิดงาน", phase: "จัดทำรายงานการบำรุงรักษา", role: "กบค.", href: "/closeout/report/?id=Z7000001&seed=S17" },
  { id: "S18", name: "กบค. คำนวณต้นทุนการบำรุงรักษา", phase: "คำนวณต้นทุน", role: "กบค." },
  { id: "S24", name: "กบค. ติดตามข้อมูลการบำรุงรักษารายคันและกำหนดครั้งถัดไป", phase: "หลังปิดงาน (ข้อมูลรถ)", role: "กบค. · หน่วยงานเจ้าของรถ", href: "/vehicles/maintenance/?sample=S24" },
];
