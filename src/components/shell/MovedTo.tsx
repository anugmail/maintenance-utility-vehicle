"use client";
/* ที่อยู่เดิมที่ย้ายแล้ว (เจ้าของงาน 4 พ.ย. 2569 "แก้ url ให้เหมือนของจริง": รายการแผนอยู่ที่ราก · ฟอร์มสร้างแผนอยู่ /new/)
   ส่งออก static ทำ redirect ฝั่งเซิร์ฟเวอร์ไม่ได้ ⇒ หน้านี้พาไปที่อยู่ใหม่ฝั่งเบราว์เซอร์ (คงค่าใน query ไว้) · ไม่ใช่จอของระบบ */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function MovedTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(href + window.location.search); }, [router, href]);
  return <p className="p-4 text-sm text-gray-600">ย้ายไปที่ <Link href={href} className="font-semibold text-brand-900">หน้าใหม่</Link></p>;
}
