/* basePath ตอน build (GitHub Pages: /maintainance-yearly) — next/link และ router เติมให้เอง ใช้ asset() เฉพาะ URL ดิบ */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export function asset(path: string): string {
  return BASE_PATH + (path.startsWith("/") ? path : "/" + path);
}
