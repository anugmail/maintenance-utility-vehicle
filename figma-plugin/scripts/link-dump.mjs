#!/usr/bin/env node
/* ชี้ out/figma-dump ไปที่ดัมป์ไลบรารี Figma ในเครื่อง (เทสต้องใช้ · ไม่อยู่ในรีโปเพราะเป็นไลบรารี PEA)
   รัน:  npm run link-dump -- <โฟลเดอร์ figma-dump>
         ไม่ใส่ = ../peads/Maintenance-Request-Form/figma-export/out/figma-dump (โครงโฟลเดอร์ MaintainD ในเครื่อง)
   หรือไม่ลิงก์ ตั้ง FIGMA_DUMP=<โฟลเดอร์> ตอนรันเทสแทน */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.resolve(process.argv[2] || path.join(ROOT, '..', 'peads', 'Maintenance-Request-Form', 'figma-export', 'out', 'figma-dump'));
if (!fs.existsSync(path.join(src, 'component'))) {
  console.error('✗ ไม่พบ ' + path.join(src, 'component') + ' — ใส่ path ของโฟลเดอร์ figma-dump ที่มี component/ อยู่ข้างใน');
  process.exit(1);
}
const dst = path.join(ROOT, 'out', 'figma-dump');
fs.mkdirSync(path.dirname(dst), { recursive: true });
try { fs.lstatSync(dst); fs.rmSync(dst, { recursive: false, force: true }); } catch (e) { /* ยังไม่มี */ }
fs.symlinkSync(src, dst, 'dir');
console.log('out/figma-dump → ' + src + ' (' + fs.readdirSync(src).join(' · ') + ')');
