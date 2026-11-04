"use client";
/* S15 · กบค. บันทึกและส่งประวัติงานบำรุงรักษา (/closeout/history/?id=Z7000001) — progressScreen() / historyScreen() ใน screens.js · spec S15.md (N.1–N.4)
   Page header "หมายเลขแผน MR Z7000001" + Badge สถานะแผน (ดำเนินการ → รอหัวหน้าตรวจสอบ) → Content ช่องไฟ 32:
     รายละเอียดแผน (VehicleAndReporterInfo) · ความคืบหน้ารายคัน (DisplayBox 4 คู่ · ยังไม่ครบ + Alert Warning)
     ประวัติงานบำรุงรักษา (n) / ประวัติงานบำรุงรักษาทั้งหมด (12) + Table (HIST_COLS · ครบแล้วมี pagination 12)
     ปุ่ม ย้อนกลับ · ส่งประวัติให้หัวหน้าตรวจสอบ (ยังไม่ครบ = Disabled) → ConfirmDialog → แผนรอหัวหน้าตรวจสอบ + toast · ส่งแล้ว = Alert Info + ย้อนกลับ
   ครบทุกคัน = หน่วยงานยอมรับผลทั้งแผนแล้ว (closeout.accepted · S14 ของ batch C ตั้งค่า) · ทางเข้า = ปุ่ม "ส่งประวัติ" ในหน้ารายละเอียดแผน (batch A · เจ้าของงาน 4 พ.ย. 2569)
   หัวหน้าตีกลับ (S16) = กลับมาส่งใหม่ได้ (จอ "ถูกตีกลับ" ยังไม่ออกแบบ) */
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
import { SectionLabel } from "@/components/vms/SectionLabel";
import { HIST_COLS, HIST_ROWS, PROGRESS_DONE, SENT_AT, closeoutOf, mrOf, planKv, planOf, putCloseout, setPlanStatus } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { useSeed } from "@/lib/mock/seedB";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { badgeOf } from "@/lib/mock/trips";
import { BtnRow, Content, DataTable, MENU_HOME, Section, planDetailHref, useBack } from "../../quarter/_shared/ui";

function History() {
  useSeed();
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const id = sp.get("id") ?? "Z7000001";
  const plan = planOf(mock, id);
  const c = closeoutOf(mock, id);
  const [confirm, setConfirm] = useState(false);
  const back = useBack(planDetailHref(id));
  if (!plan) return null;
  const total = plan.cars;
  const sent = plan.status === "hist" || plan.status === "passed" || plan.status === "closed";
  const done = !!c.accepted || sent;
  const send = () => {
    setConfirm(false);
    setPlanStatus(id, "hist");
    putCloseout(id, { sentAt: SENT_AT, head: undefined, headReason: undefined });
    notify("ส่งประวัติงานบำรุงรักษาให้หัวหน้าตรวจสอบแล้ว");
  };
  const progress: [string, string][] = done
    ? [["บำรุงรักษาแล้ว", total + " / " + total + " คัน"], ["ทำไม่ได้", "0 คัน"], ["รอทำ", "0 คัน"], ["หน่วยงานยอมรับแล้ว", total + " คัน"]]
    : [["บำรุงรักษาแล้ว", PROGRESS_DONE + " / " + total + " คัน"], ["ทำไม่ได้", "0 คัน"], ["รอทำ", total - PROGRESS_DONE + " คัน"], ["หน่วยงานยอมรับแล้ว", PROGRESS_DONE - 1 + " คัน"]];
  return (
    <>
      <PageHeader Title={"หมายเลขแผน " + mrOf(id)} Badge={badgeOf(PST[plan.status])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผน " + mrOf(id), onClick: () => router.push(planDetailHref(id)) }, { Text: "ประวัติงานบำรุงรักษา" }]} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
        <Section>
          <DisplayBox Title="ความคืบหน้ารายคัน" pairs={progress} />
          {!done && <Alert Color="Warning" Text={"ยังบำรุงรักษาไม่ครบทุกคันตามแผน (เหลือ " + (total - PROGRESS_DONE) + " คัน)"}
            SupportingText="ครบแล้วจึงบันทึกและส่งประวัติให้หัวหน้า กบค. ตรวจสอบได้" />}
        </Section>
        <Section>
          <SectionLabel Title={done ? "ประวัติงานบำรุงรักษาทั้งหมด (" + total + ")" : "ประวัติงานบำรุงรักษา (" + HIST_ROWS.length + ")"} />
          <DataTable columns={HIST_COLS} rows={HIST_ROWS} pagination={done ? total : undefined} perPage={total} />
        </Section>
        {sent && <Alert Color="Info" Text={"ส่งประวัติให้หัวหน้า กบค. ตรวจสอบแล้ว " + (c.sentAt ?? SENT_AT)} SupportingText="แก้ไขไม่ได้จนกว่าหัวหน้าจะตีกลับ" />}
        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          {!sent && <PrimaryButton Text="ส่งประวัติให้หัวหน้าตรวจสอบ" Size="lg" State={done && kbk ? "Default" : "Disabled"} onClick={() => setConfirm(true)} />}
        </BtnRow>
      </Content>
      <ConfirmDialog spec={confirm ? { title: "ส่งประวัติให้หัวหน้า กบค. ตรวจสอบ", sub: "ประวัติงานบำรุงรักษา " + total + " คันของแผน " + mrOf(id) + " จะแก้ไขไม่ได้จนกว่าหัวหน้าจะตรวจเสร็จ", ok: "ส่งประวัติ" } : null}
        onCancel={() => setConfirm(false)} onOk={send} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><History /></Suspense></AppFrame>;
}
