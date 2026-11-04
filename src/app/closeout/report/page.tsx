"use client";
/* S17 · กบค. ออกรายงานผลและปิดงาน (/closeout/report/?id=Z7000001) — reportScreen() ใน screens.js · spec S17.md (P.1–P.3)
   Page header "หมายเลขแผน MR Z7000001" + Badge (ประวัติผ่านแล้ว Success · ปิดงานแล้ว Gray) + Secondary button "ดาวน์โหลดรายงาน" (มือถือ ใต้หัวข้อ เต็มแถว)
   Content ช่องไฟ 32: รายละเอียดแผน (12 คู่ รวมผลหัวหน้า กบค.) · สรุปรายงานผลการบำรุงรักษา (DisplayBox 8 คู่) · (ปิดแล้ว) Alert Success
   ปุ่ม ย้อนกลับ · ปิดงาน → ConfirmDialog → ปิดงานแล้ว + toast · ปิดแล้ว: คำนวณต้นทุน → S18 (ยังไม่ออกแบบ → /soon/)
   ทางเข้า: หลังหัวหน้า กบค. อนุมัติประวัติ (S16) · ปุ่มปิดงานกดได้เมื่อแผน "ประวัติผ่านแล้ว" · ดาวน์โหลดรายงาน: รูปแบบไฟล์ยังไม่เคาะ (Q25) ยังไม่ทำอะไร */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { CLOSED_AT, HEAD_AT, HEAD_REVIEWER, closeoutOf, mrOf, planKv, planOf, putCloseout, reportSummary, setPlanStatus } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { useSeed } from "@/lib/mock/seedB";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { badgeOf } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { BtnRow, Content, MENU_HOME, planDetailHref, useBack } from "../../quarter/_shared/ui";

function Report() {
  useSeed();
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const id = sp.get("id") ?? "Z7000001";
  const plan = planOf(mock, id);
  const c = closeoutOf(mock, id);
  const [confirm, setConfirm] = useState(false);
  const back = useBack(planDetailHref(id));
  if (!plan) return null;
  const closed = plan.status === "closed";
  const close = () => {
    setConfirm(false);
    setPlanStatus(id, "closed");
    putCloseout(id, { closedAt: CLOSED_AT });
    notify("ปิดงานสำเร็จ");
  };
  return (
    <>
      <PageHeader Title={"หมายเลขแผน " + mrOf(id)} Badge={badgeOf(PST[closed ? "closed" : "passed"])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผน " + mrOf(id), onClick: () => router.push(planDetailHref(id)) }, { Text: "รายงานผลการบำรุงรักษา" }]}
        Actions={<SecondaryButton Text="ดาวน์โหลดรายงาน" LeadingIconSwap="cloud_upload-24-300-round" Size={mob ? "lg" : "md"} />} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={[...planKv(plan), ["หัวหน้า กบค. ตรวจประวัติ", "ผ่าน · " + (c.headAt ?? HEAD_AT)], ["ผู้ตรวจ", HEAD_REVIEWER]]} />
        <DisplayBox Title="สรุปรายงานผลการบำรุงรักษา" pairs={reportSummary(plan)} />
        {closed && <Alert Color="Success" Text={"ปิดงานแล้ว " + (c.closedAt ?? CLOSED_AT)} SupportingText="ไปขั้นคำนวณต้นทุน (S18) ได้" />}
        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          {closed
            ? <PrimaryButton Text="คำนวณต้นทุน" Size="lg" onClick={() => router.push("/soon/?s=S18")} />
            : <PrimaryButton Text="ปิดงาน" Size="lg" State={plan.status === "passed" && kbk ? "Default" : "Disabled"} onClick={() => setConfirm(true)} />}
        </BtnRow>
      </Content>
      <ConfirmDialog spec={confirm ? { title: "ยืนยันปิดงาน", sub: "แผน " + mrOf(id) + " จะเปลี่ยนสถานะเป็น \"ปิดงานแล้ว\" และแก้ไขข้อมูลไม่ได้อีก", ok: "ปิดงาน" } : null}
        onCancel={() => setConfirm(false)} onOk={close} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Report /></Suspense></AppFrame>;
}
