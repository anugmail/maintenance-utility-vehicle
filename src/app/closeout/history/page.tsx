"use client";
/* S16 O.6 · ผู้ดำเนินการ — ประวัติงานบำรุงรักษาของแผน (/closeout/history/?id=Z7000001) — historyScreen() ใน screens.js (Figma 9607c3b · 10 พ.ย. 2569)
   S15 ตัดออก 10 พ.ย. 2569: ไม่มีขั้นกดส่งประวัติ — ผู้ดูแลยานพาหนะรับทราบครบทุกคัน (S13) ระบบส่งประวัติให้หัวหน้าหน่วยงานเอง
   หน้านี้เหลือไว้ให้ผู้ดำเนินการเมื่อหัวหน้าหน่วยงานตีกลับ (O.6): Alert Error "หัวหน้าหน่วยงานตีกลับประวัติงานบำรุงรักษา" + เหตุผล บนสุด
   → รายละเอียดแผน (VehicleAndReporterInfo) · ความคืบหน้ารายคัน (DisplayBox 4 คู่ · ผู้ดูแลยานพาหนะรับทราบแล้ว) · ประวัติงานบำรุงรักษาทั้งหมด (n) + Table pagination
   → ปุ่ม ย้อนกลับ · "ส่งประวัติให้หัวหน้าตรวจสอบอีกครั้ง" → แผนกลับไปรอหัวหน้าตรวจสอบ + toast (ไม่มี popup ยืนยัน — จอ O.6 ไม่มี · toast ใช้ข้อความเดิมของ S15 ยังไม่เคาะ BACKLOG ค.)
   ส่งแล้ว (รอหัวหน้าตรวจสอบ) = Alert Info "ส่งประวัติให้หัวหน้าหน่วยงาน ตรวจสอบแล้ว" + ย้อนกลับ
   ทางเข้า: ปุ่ม "ส่งประวัติ" ที่หัวหน้ารายละเอียดแผน เมื่อหัวหน้าตีกลับ (ทางเข้าเดิมของเว็บ 4 พ.ย. 2569 · จอ Figma ไม่ระบุทางเข้า O.6 — BACKLOG ค.)
   ผู้ดำเนินการแก้อะไรได้บ้างและแก้ที่หน้าไหน ยังไม่เคาะ (userflow S16) ⇒ หน้านี้ดูอย่างเดียวแล้วส่งใหม่ */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { HIST_COLS, HIST_BACK, SENT_AT, closeoutOf, mrOf, planKv, planOf, putCloseout, setPlanStatus } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { planHistory } from "@/lib/mock/history";
import { useSeed } from "@/lib/mock/seedB";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { canManage, usePlanGate } from "@/lib/mock/planFlow";
import { badgeOf } from "@/lib/mock/trips";
import { BtnRow, Content, DataTable, MENU_HOME, Section, planDetailHref, useBack } from "../../quarter/_shared/ui";

function History() {
  useSeed();
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const role = useRole();
  const id = sp.get("id") ?? "Z7000001";
  const plan = planOf(mock, id);
  const own = !!plan && canManage(role, plan);   // ผู้ดำเนินการ = หน่วยงานเจ้าของแผน
  const denied = usePlanGate(plan);
  const c = closeoutOf(mock, id);
  const back = useBack(planDetailHref(id));
  if (!plan) return null;
  if (denied) return null;
  const h = planHistory(mock, plan);
  const sent = plan.status === "hist" || plan.status === "passed" || plan.status === "closed";
  const returned = !sent && c.head === "back";
  const resend = () => {
    setPlanStatus(id, "hist");
    putCloseout(id, { sentAt: SENT_AT, head: undefined, headReason: undefined });
    notify("ส่งประวัติงานบำรุงรักษาให้หัวหน้าตรวจสอบแล้ว");
  };
  const progress: [string, string][] = [["บำรุงรักษาแล้ว", h.done + " / " + h.total + " คัน"], ["ทำไม่ได้", h.cannot + " คัน"], ["รอทำ", h.todo + " คัน"], ["ผู้ดูแลยานพาหนะรับทราบแล้ว", h.accepted + " คัน"]];
  return (
    <>
      <PageHeader Title={"หมายเลขแผน " + mrOf(id)} Badge={badgeOf(PST[plan.status])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผน " + mrOf(id), onClick: () => router.push(planDetailHref(id)) }, { Text: "ประวัติงานบำรุงรักษา" }]} />
      <Content>
        {returned && <Alert Color="Error" Text="หัวหน้าหน่วยงานตีกลับประวัติงานบำรุงรักษา" SupportingText={c.headReason || HIST_BACK} />}
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
        <Section><DisplayBox Title="ความคืบหน้ารายคัน" pairs={progress} /></Section>
        <Section>
          <SectionLabel Title={"ประวัติงานบำรุงรักษาทั้งหมด (" + h.rows.length + ")"} />
          <DataTable columns={HIST_COLS} rows={h.rows} pagination={h.rows.length} perPage={Math.max(1, h.rows.length)} />
        </Section>
        {sent && <Alert Color="Info" Text={"ส่งประวัติให้หัวหน้าหน่วยงาน ตรวจสอบแล้ว " + (c.sentAt ?? SENT_AT)} SupportingText="แก้ไขไม่ได้จนกว่าหัวหน้าจะตีกลับ" />}
        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          {returned && own && <PrimaryButton Text="ส่งประวัติให้หัวหน้าตรวจสอบอีกครั้ง" Size="lg" onClick={resend} />}
        </BtnRow>
      </Content>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><History /></Suspense></AppFrame>;
}
