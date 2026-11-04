import path from "node:path";
import type { NextConfig } from "next";

/* ส่งออกเป็นไฟล์ static ขึ้น GitHub Pages (ไม่มีเซิร์ฟเวอร์)
   basePath มาจาก env ตอน build: NEXT_PUBLIC_BASE_PATH=/maintainance-yearly (ตั้งใน .github/workflows/pages.yml)
   ลิงก์ทุกอันผ่าน next/link หรือ router · URL ไฟล์ดิบใช้ asset() ใน src/lib/basePath.ts */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
