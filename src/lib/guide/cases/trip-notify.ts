"use client";
import { setMock } from "@/lib/mock/store";
import { CARETAKER, DEFAULT_NOTIS, KRY_AREA, TRIP_1, TRIP_OTHER, approvalNotis, areaCars, caredCars, operatorOf } from "@/lib/mock/trips";
import type { GuideScenario } from "../types";
import { approved } from "./trips-common";

const LIST = "/trips-view/", DETAIL = "/trips-view/detail/?trip=T1";
const T1 = approved(TRIP_1);
const OP = operatorOf(T1), AREA_N = areaCars(T1).length, CARED_N = caredCars(T1).length;
const seed = () => setMock((s) => ({ ...s, trips: [T1, { ...TRIP_OTHER }], jobs: undefined, notis: [...approvalNotis(T1), ...DEFAULT_NOTIS()] }));

export const TRIP_NOTIFY: GuideScenario = {
  key: "trip-notify", code: "S8", title: "ได้รับแจ้งเตือนแผนเดินทางที่อนุมัติแล้ว", who: "กรย. และผู้ดูแลยานพาหนะ",
  about: "เมื่อผู้อนุมัติอนุมัติแผนเดินทาง กรย. ของเขตที่ยานพาหนะสังกัดและผู้ดูแลยานพาหนะได้รับแจ้งเตือนในระบบ เปิดดูแผนเดินทางได้อย่างเดียว กรย. เห็นเฉพาะยานพาหนะในเขตของตน ผู้ดูแลยานพาหนะเห็นเฉพาะยานพาหนะที่ตนดูแล",
  cases: [
    {
      id: "noti-kry", name: "กรย. ได้รับแจ้งเตือน", about: "กดกระดิ่ง เปิดแจ้งเตือนแผนเดินทางที่อนุมัติแล้ว แล้วดูยานพาหนะในเขต " + KRY_AREA, role: "กรย.", sheet: [11],
      seed,
      steps: [
        { at: LIST, text: "หน้าแผนเดินทางบำรุงรักษาแสดงแผนเดินทางที่อนุมัติแล้ว กระดิ่งมุมขวาบนมีจุดแดง แปลว่ามีแจ้งเตือนใหม่" },
        { at: LIST, text: "กดกระดิ่ง แผงแจ้งเตือนบอกว่ามี 1 แจ้งเตือนใหม่ ว่าแผนเดินทาง " + TRIP_1.name + " อนุมัติแล้ว " + OP + " จะเข้าบำรุงรักษายานพาหนะในเขต " + KRY_AREA + " " + AREA_N + " คัน พร้อมช่วงวัน กดที่แจ้งเตือนนี้" },
        { at: DETAIL, text: "หน้าแผนเดินทางแบบดูอย่างเดียว เห็นรายละเอียด พนักงาน และหัวข้อยานพาหนะในเขต " + KRY_AREA + " ในแผนเดินทาง แสดง " + AREA_N + " คันพร้อมสถานที่ ไม่เห็นคันที่อยู่เขตอื่น ไม่มีปุ่มแก้ไข จุดแดงที่กระดิ่งหายไปเพราะอ่านแล้ว" },
      ],
    },
    {
      id: "noti-owner", name: "ผู้ดูแลยานพาหนะได้รับแจ้งเตือน", about: "ผู้ดูแลยานพาหนะเห็นแจ้งเตือนและแผนเดินทางเฉพาะยานพาหนะที่ตนดูแล", role: "ผู้ดูแลยานพาหนะ", sheet: [11],
      seed,
      steps: [
        { at: LIST, text: "เข้าระบบเป็นผู้ดูแลยานพาหนะ " + CARETAKER + " รายการแสดงเฉพาะแผนเดินทางที่มียานพาหนะที่ดูแล และนับเฉพาะยานพาหนะที่ดูแล " + CARED_N + " คัน กระดิ่งมีจุดแดง" },
        { at: LIST, text: "กดกระดิ่ง แจ้งเตือนใหม่บอกว่า " + OP + " จะเข้าบำรุงรักษายานพาหนะที่คุณดูแล " + CARED_N + " คัน พร้อมทะเบียน ช่วงวัน และสถานที่ กดที่แจ้งเตือนนี้" },
        { at: DETAIL, text: "หน้าแผนเดินทางแบบดูอย่างเดียว หัวข้อเป็นยานพาหนะที่คุณดูแลในแผนเดินทาง แสดงเฉพาะ " + CARED_N + " คันที่ดูแล รวมคันต่างหน่วยงานที่ใบนี้ระบุให้คุณเป็นผู้ดูแล ไม่เห็นยานพาหนะคันอื่น" },
      ],
    },
  ],
};
