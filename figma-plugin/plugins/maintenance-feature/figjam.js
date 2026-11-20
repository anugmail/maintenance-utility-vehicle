/* ======================== ฝั่งไฟล์ FigJam — วางจอที่ส่งมาลงบอร์ดนี้ (17 พ.ย. 2569) ========================
   ส่วนสร้างบอร์ด (build) ลอกจาก figjam-plugin/code.js ของพี่นุตอนประกอบ (build.js อ่านอย่างเดียว ไม่แก้ไฟล์เขา) · ไฟล์นี้ต่อท้าย:
   หน้าต่างแสดงบอร์ดที่เปิดอยู่เทียบกับบอร์ดปลายทาง · รายการชุดที่ส่งมา (out/board-maintainance-feature-*.json) · กดวางทีละชุดตามลำดับ */
const fjBuild = figma.ui.onmessage;   // ตัวรับ 'build' ของ figjam-plugin
/* สเปกแบบจัดวางตามหน้า Figma (20 พ.ย. 2569 · exportFigJamLayout ใน feature.js) — section kind 'layout' วางทุกชิ้นตามพิกัดเดิม */
async function fjLayoutBuild(spec, images) {
  const bytes = new Map(images.map(i => [i.src, i.bytes]));
  const names = new Set(spec.sections.map(s => s.name));
  let cleaned = 0;
  for (const n of figma.currentPage.children.slice()) if (n.type === 'SECTION' && names.has(n.name)) { n.remove(); cleaned++; }
  const rest = figma.currentPage.children;
  let y = rest.length ? Math.max(...rest.map(n => n.y + n.height)) + 400 : 0;
  const x0 = rest.length ? Math.min(...rest.map(n => n.x)) : 0;
  const PAD = 80, rgb = (c) => ({ r: c[0] / 255, g: c[1] / 255, b: c[2] / 255 });
  const made = { sections: 0, shapes: 0, connectors: 0, cleaned };
  for (const sec of spec.sections) {
    const s = figma.createSection();
    s.name = sec.name;
    s.fills = [{ type: 'SOLID', color: rgb(sec.color || [249, 249, 249]) }];
    s.x = x0; s.y = y;
    s.resizeWithoutConstraints(sec.w + PAD * 2, sec.h + PAD * 2);
    for (const it of sec.items) {
      const sh = figma.createShapeWithText();
      sh.shapeType = it.rect && it.rect.radius ? 'ROUNDED_RECTANGLE' : 'SQUARE';
      s.appendChild(sh);
      sh.resize(Math.max(1, it.w), Math.max(1, it.h));
      sh.x = PAD + it.x; sh.y = PAD + it.y;
      if (it.src) {
        const b = bytes.get(it.src);
        if (!b) throw new Error('ไม่มี bytes ของ ' + it.src);
        sh.name = 'shot / ' + it.src;
        sh.fills = [{ type: 'IMAGE', imageHash: figma.createImage(b).hash, scaleMode: 'FILL' }];
        sh.strokes = [];
      } else {
        sh.name = 'bg';
        sh.fills = it.rect.color ? [{ type: 'SOLID', color: rgb(it.rect.color), opacity: it.rect.a == null ? 1 : it.rect.a }] : [];
        sh.strokes = it.rect.stroke ? [{ type: 'SOLID', color: rgb(it.rect.stroke) }] : [];
      }
      made.shapes++;
    }
    made.sections++;
    y += s.height + 320;
  }
  return made;
}
figma.ui.onmessage = async (msg) => {
  if (msg && msg.type === 'build' && msg.spec && (msg.spec.sections || []).some(s => s.kind === 'layout')) {
    try {
      const result = await fjLayoutBuild(msg.spec, msg.images || []);
      figma.ui.postMessage({ type: 'done', result });
      figma.notify('บอร์ดเสร็จ: ' + result.sections + ' section · ชิ้น ' + result.shapes);
    } catch (e) {
      figma.ui.postMessage({ type: 'error', message: String(e && e.message ? e.message : e) });
      figma.notify('วางบอร์ดไม่สำเร็จ — ดูรายละเอียดในหน้าต่างปลั๊กอิน', { error: true });
    }
    return;
  }
  if (msg && msg.type === 'build') return fjBuild(msg);
  if (msg) await tgtHandle(msg);
};
{
  let key = '', name = '';
  try { key = figma.fileKey || ''; } catch (e) { /* อ่านไม่ได้ */ }
  try { name = figma.root.name || ''; } catch (e) { /* อ่านไม่ได้ */ }
  figma.ui.postMessage({ type: 'fj-mode', file: name, key });
  tgtPost();
}
