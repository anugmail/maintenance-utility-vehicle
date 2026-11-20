"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function MovedTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(href + window.location.search); }, [router, href]);
  return <p className="p-4 text-sm text-gray-600">ย้ายไปที่ <Link href={href} className="font-semibold text-brand-900">หน้าใหม่</Link></p>;
}
