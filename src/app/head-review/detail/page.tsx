"use client";
/* S16 P2 · ประวัติงานบำรุงรักษาของแผน (/head-review/detail/?id=Z7000001 · หัวหน้า กบค.) — headHistory() ใน screens.js · spec S16.md (O.2–O.5)
   Page header "หมายเลขแผน MRZ7000001" + Badge HST (รอหัวหน้าตรวจสอบ → Brand · ผ่านแล้ว → Success · ตีกลับ → Error)
   Content ช่องไฟ 32: รายละเอียดแผน · ความคืบหน้ารายคัน (DisplayBox 4 คู่ + ผู้ส่ง) · ประวัติงานบำรุงรักษาทั้งหมด (12) + Table pagination 12
   รอตรวจ: ปุ่ม ตีกลับ (FormModal เหตุผลที่ตีกลับ · ว่าง = กดตีกลับไม่ได้) · อนุมัติประวัติ (ConfirmDialog) · อนุมัติแล้ว: Alert Success ไม่มีปุ่ม
   ตีกลับ → แผนกลับไปให้ผู้ดำเนินการแก้แล้วส่งใหม่ที่หน้าประวัติของแผน (S16 O.6 /closeout/history/ · S15 ตัดออก 10 พ.ย. 2569) → กลับรายการ (toast ยังไม่ออกแบบ) · อนุมัติ → ประวัติผ่านแล้ว + toast → S17
   ประวัติมาถึงเองเมื่อผู้ดูแลยานพาหนะรับทราบครบทุกคัน (S13) · ความคืบหน้ารายคัน "ผู้ดูแลยานพาหนะรับทราบแล้ว" (Figma 9607c3b) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { planHistory } from "@/lib/mock/history";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { FormModal } from "@/components/patterns/FormModal";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { unitOf } from "@/lib/mock/data";
import { HEAD_AT, HIST_COLS, HQ_OTHER, HST, SENT_AT, closeoutOf, headStatusOf, mrOf, planKv, planOf, putCloseout, setPlanStatus } from "@/lib/mock/closeout";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { CREATOR, badgeOf } from "@/lib/mock/trips";
import { BtnRow, Content, DataTable, MENU_HOME, Section, useBack } from "../../quarter/_shared/ui";

function HeadHistory() {
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const head = useRole() === "หัวหน้าหน่วยงาน";
  const id = sp.get("id") ?? "Z7000001";
  const plan = planOf(mock, id);
  const c = closeoutOf(mock, id);
  const [ask, setAsk] = useState<"" | "back" | "ok">("");
  const [reason, setReason] = useState("");
  const back = useBack("/head-review/");
  if (!plan) return null;
  const other = id === HQ_OTHER.id;
  const st = other ? "ok" : headStatusOf(plan, c);
  const hist = planHistory(mock, plan);   // งานรายคันจริงของแผน (BACKLOG ข้อ 6)
  const total = hist.total;
  const sender = other ? HQ_OTHER.sender + " (" + unitOf(HQ_OTHER.mr) + ") · " + HQ_OTHER.sentAt : CREATOR + " · " + (c.sentAt ?? SENT_AT);
  const approve = () => {
    setAsk("");
    setPlanStatus(id, "passed");
    putCloseout(id, { head: "ok", headAt: HEAD_AT, headReason: undefined });
    notify("อนุมัติประวัติงานบำรุงรักษาสำเร็จ");
  };
  const sendBack = () => {
    setAsk("");
    setPlanStatus(id, "active");
    putCloseout(id, { head: "back", headReason: reason.trim() });
    router.push("/head-review/");
  };
  return (
    <>
      <PageHeader Title={"หมายเลขแผน " + mrOf(id)} Badge={badgeOf(HST[st])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "ประวัติรอตรวจสอบ", href: "/head-review/" }, { Text: mrOf(id) }]} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
        <DisplayBox Title="ความคืบหน้ารายคัน" pairs={[["บำรุงรักษาแล้ว", hist.done + " / " + total + " คัน"], ["ทำไม่ได้", hist.cannot + " คัน"], ["ผู้ดูแลยานพาหนะรับทราบแล้ว", hist.accepted + " คัน"], ["ผู้ส่ง", sender]]} />
        <Section>
          <SectionLabel Title={"ประวัติงานบำรุงรักษาทั้งหมด (" + hist.rows.length + ")"} />
          <DataTable columns={HIST_COLS} rows={hist.rows} pagination={hist.rows.length} perPage={Math.max(1, hist.rows.length)} />
        </Section>
        {st === "ok" && <Alert Color="Success" Text={"อนุมัติประวัติแล้ว" + (other ? "" : " " + (c.headAt ?? HEAD_AT)) + " — บันทึกเป็นประวัติทางการ"} SupportingText="หน่วยงานออกรายงานผลและปิดงานได้" />}
        {st === "wait" && plan.status === "hist" && head && (
          <BtnRow>
            <SecondaryButton Text="ตีกลับ" Size="lg" onClick={() => { setReason(""); setAsk("back"); }} />
            <PrimaryButton Text="อนุมัติประวัติ" Size="lg" onClick={() => setAsk("ok")} />
          </BtnRow>
        )}
      </Content>
      <FormModal open={ask === "back"} title="ตีกลับประวัติงานบำรุงรักษา" fields={[{ label: "เหตุผลที่ตีกลับ", value: reason, area: true }]} onField={(_, v) => setReason(v)}
        ok="ตีกลับ" okDisabled={!reason.trim()} onCancel={() => setAsk("")} onOk={sendBack} />
      <ConfirmDialog spec={ask === "ok" ? { title: "ยืนยันอนุมัติประวัติงานบำรุงรักษา", sub: mrOf(id) + " · " + total + " คัน · บันทึกเป็นประวัติทางการ", ok: "อนุมัติ" } : null}
        onCancel={() => setAsk("")} onOk={approve} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><HeadHistory /></Suspense></AppFrame>;
}
