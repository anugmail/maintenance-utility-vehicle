#!/usr/bin/env node
/* อัปเดตฐานของปลั๊กอิน (plugins/<ปลั๊กอิน>/base/) จากรีโปงานซ่อม Maintenance-Request-Form
   ฐาน = ไฟล์ของพี่นุที่ปลั๊กอินประกอบเข้า code.js (อ่านอย่างเดียว ไม่แก้ใน base/)
   รัน:  npm run sync-base -- --from ../peads/Maintenance-Request-Form [--ref origin/main] [--plugin maintenance-feature] [--dry]
   ทำ:  git show <ref>:<ไฟล์> → base/ · ภาพตาม images ของ build.json → base/img/ · จด base/SOURCE.json
   หลังรัน: npm run build && npm run test:all — รหัสจอเดิมอาจชี้จอคนละจอโดยไม่มีคำเตือน (docs/notes/MERGE-NOTES.md ข้อ 3) ไล่ดูก่อนคอมมิต */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const from = path.resolve(arg('from', path.join(ROOT, '..', 'peads', 'Maintenance-Request-Form')));
const ref = arg('ref', 'origin/main');
const plugin = arg('plugin', 'maintenance-feature');
const dry = process.argv.includes('--dry');
const BASE = path.join(ROOT, 'plugins', plugin, 'base');

/* ไฟล์ฐาน: ที่อยู่ในรีโปงานซ่อม → ชื่อใน base/ */
const FILES = {
  'figma-export/plugin-lib/core.js': 'core.js',
  'figma-export/maintainance-plugin/screens.js': 'screens.js',
  'figma-export/maintainance-plugin/build.json': 'build.json',
  'figma-export/figjam-plugin/code.js': 'figjam-plugin-code.js',
};

const git = (...a) => execFileSync('git', ['-C', from, ...a], { maxBuffer: 1 << 28 });
if (!fs.existsSync(BASE)) { console.error('✗ ไม่มี ' + BASE); process.exit(1); }
if (ref.startsWith('origin/')) { try { git('fetch', 'origin', '--quiet'); } catch (e) { console.log('ⓘ fetch ไม่ได้ ใช้ ' + ref + ' ที่มีในเครื่อง'); } }
const commit = git('rev-parse', '--short', ref).toString().trim();
const date = git('log', '-1', '--format=%cs', ref).toString().trim();
console.log('ฐานจาก ' + from + ' @ ' + ref + ' (' + commit + ' · ' + date + ')' + (dry ? ' · ดูอย่างเดียว' : ''));

const lines = (b) => b.toString('utf8').split('\n');
const changed = [];
const put = (rel, buf) => {
  const dst = path.join(BASE, rel);
  const old = fs.existsSync(dst) ? fs.readFileSync(dst) : null;
  if (old && old.equals(buf)) { console.log('  = ' + rel); return; }
  const a = old ? new Set(lines(old)) : new Set(), b = lines(buf);
  console.log('  ' + (old ? '~' : '+') + ' ' + rel + (old ? ' (บรรทัดใหม่/เปลี่ยน ~' + b.filter(l => !a.has(l)).length + ')' : ''));
  changed.push(rel);
  if (!dry) { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.writeFileSync(dst, buf); }
};
let cfg = {};
for (const [src, rel] of Object.entries(FILES)) {
  const buf = git('show', ref + ':' + src);
  if (rel === 'build.json') cfg = JSON.parse(buf.toString('utf8'));
  put(rel, buf);
}
for (const [k, v] of Object.entries(cfg.images || {})) if (k[0] !== '_' && typeof v === 'string') put(path.join('img', path.basename(v)), git('show', ref + ':' + v));

if (!dry) fs.writeFileSync(path.join(BASE, 'SOURCE.json'), JSON.stringify({ repo: 'Maintenance-Request-Form', ref, commit, date, files: FILES, syncedAt: new Date().toISOString().slice(0, 10) }, null, 2) + '\n');
console.log(changed.length ? (dry ? 'จะเปลี่ยน ' : 'เปลี่ยน ') + changed.length + ' ไฟล์ — ต่อด้วย npm run build && npm run test:all' : 'ฐานตรงกับ ' + commit + ' แล้ว');
