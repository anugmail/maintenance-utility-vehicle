import { machineOf } from "./data";
import { MA_REPAIRS, MA_CAR, addMonths, dayOf, machineHistoryOf, thaiDate, TODAY, type HistRow, type MaCar } from "./maintenance";
import { sideCodeOf } from "./vehicleTypes";

const pad = (n: number, w: number) => String(n).padStart(w, "0");
const idOf = (plate: string) => plate.split(" ")[0];
const digits = (plate: string) => idOf(plate).replace(/\D/g, "").padStart(6, "0").slice(-6);
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf = (n: number) => n.toLocaleString("en-US");

const CHASSIS: Record<string, [number, number, number, number, number, string, string]> = {
  "Isuzu FRR": [190, 2, 6, 6, 2_850_000, "MP1FRR34", "4HK1-"], "Isuzu FTR": [240, 2, 6, 6, 3_450_000, "MP1FTR34", "6HK1-"],
  "Hino FC": [175, 2, 6, 6, 3_200_000, "JHHFC9JL", "J05E-"], "Hino FG": [230, 2, 6, 6, 3_900_000, "JHHFG8JL", "J08E-"], "Hino FM": [260, 3, 10, 10, 4_600_000, "JHHFM2PL", "J08E-"],
};

export interface VehicleInfoData {
  general: { catMain: string; catSub: string; typeMain: string; typeSub: string; usage: string; gear: string; note: string };
  finance: { contract: string; lot: string; value: string };
  dept: { unit: string; sideCode: string; ctrl: string; phone: string; costCenter: string; ba: string; asset: string; received: string; assetType: string; assetSub: string; inGroup: string; shareable: string };
  reg: { dlt: string; brand: string; model: string; modelYear: string; color: string; vin: string; vinPos: string; engineNo: string; enginePos: string; fuel: string; hp: string; axles: string; wheels: string; tires: string; year: string; age: string };
  files: { name: string; size: string }[];
  fleet: { number: string; from: string; to: string; bank: string; limit: string };
  usage: { km: string; hours: string; fuel: string; clean: string; parking: string };
}

export function vehicleInfoOf(c: MaCar, age: string): VehicleInfoData {
  const car = c.car, d = digits(car.plate), n = Number(d);
  const { vehicle } = machineOf(car.model);
  const [brand, ...rest] = car.model.split(" ");
  const spec = CHASSIS[vehicle] ?? [180, 2, 6, 6, 3_000_000, "MP1XXX34", "ENG-"];
  const dist = car.owner.split(" ")[0];
  const prefix = dist.startsWith("กฟ") ? dist.slice(2) : dist;
  const reg = /^[นฉกต]\./.test(prefix) ? ({ น: "N", ฉ: "E", ก: "C", ต: "S" } as Record<string, string>)[prefix[0]] : "A";
  const regNo = Number(prefix.replace(/\D/g, "")) || 0;
  const year = c.year ?? 2560;
  const water = /ฉีดน้ำ/.test(car.model);
  return {
    general: { catMain: "รถบรรทุกขนาดใหญ่", catSub: water ? "รถพ่วงฉีดน้ำ" : "รถกระเช้า", typeMain: car.type, typeSub: car.type, usage: "รถส่วนกลาง", gear: "ธรรมดา", note: "-" },
    finance: { contract: "สญ2-จซ-" + pad(1 + (n % 200), 3) + "-" + (year - 1), lot: "งวดที่ " + (1 + (n % 3)), value: money(spec[4]) },
    dept: {
      unit: car.owner, sideCode: prefix + "-" + sideCodeOf(car) + "-" + d.slice(-4), ctrl: car.ctrl || "-", phone: car.ownerPhone || "-",
      costCenter: "Z" + reg + pad(regNo, 2) + "010100 : " + dist + "-บห.", ba: reg + pad(regNo, 2) + "0", asset: "500000" + d,
      received: pad(1 + (n % 28), 2) + "/" + pad(1 + (n % 12), 2) + "/" + year, assetType: "Z6020 : ยานพาหนะ", assetSub: "602004 : " + car.type + " - ซื้อ",
      inGroup: "ไม่ใช่", shareable: "ไม่ได้",
    },
    reg: {
      dlt: "รถยนต์บรรทุกส่วนบุคคล (รย.3)", brand, model: rest.join(" "), modelYear: String(year - 543), color: "ขาว",
      vin: spec[5] + "H" + pad(n % 10_000_000, 7), vinPos: "โครงคัสซีด้านหน้าขวา", engineNo: spec[6] + pad((n * 7) % 1_000_000, 6), enginePos: "ข้างเสื้อสูบด้านซ้าย",
      fuel: "ดีเซล", hp: String(spec[0]), axles: String(spec[1]), wheels: String(spec[2]), tires: String(spec[3]),
      year: c.year ? String(c.year) : "-", age,
    },
    files: [{ name: "เล่มทะเบียน_" + idOf(car.plate) + ".pdf", size: 160 + (n % 120) + " KB" }],
    fleet: { number: "4030 5263 " + d.slice(-4) + " " + pad((n * 7) % 10_000, 4), from: "01/10/2567", to: "30/09/2572", bank: "KTB", limit: "วงเงินบัตร 60,000.00" },
    usage: {
      km: c.km ? c.km + " กม." : "-", hours: c.hours ? c.hours + " ชม." : "-", fuel: 40 + (n % 60) + "%",
      clean: ["ดูดฝุ่น", "ล้างภายนอก", "ล้างภายนอกและดูดฝุ่น"][n % 3], parking: "ลานจอด สำนักงาน " + car.owner,
    },
  };
}

export interface EngineRecord { no: string; date: string; center: string; work: string; km: string; cost: string }
const ENGINE_WORK = ["เปลี่ยนน้ำมันเครื่อง · ไส้กรองน้ำมันเครื่อง", "เปลี่ยนน้ำมันเครื่อง · ไส้กรองน้ำมันเครื่อง · ไส้กรองน้ำมันเชื้อเพลิง"];
export function engineHistoryOf(c: MaCar): EngineRecord[] {
  const car = c.car, n = Number(digits(car.plate));
  const brand = car.model.split(" ")[0], prov = car.plate.split(" ").slice(1).join(" ");
  const count = c.year ? Math.max(1, Math.min(4, 2569 - c.year)) : 2;
  const km = Number((c.km ?? "0").replace(/,/g, ""));
  return Array.from({ length: count }, (_, i) => {
    const date = addMonths(TODAY, -(1 + (n % 4)) - 6 * i);
    const y = new Date(date).getUTCFullYear() + 543;
    return {
      no: "EG-" + y + "-" + pad((n + i * 37) % 10_000, 4), date: thaiDate(date), center: "ศูนย์บริการ " + brand + " " + prov, work: ENGINE_WORK[i % 2],
      km: km ? nf(Math.max(0, km - 2_000 - (n % 3_000) - i * 10_000)) : "-", cost: nf(i % 2 ? 6_850 : 4_200),
    };
  });
}

export interface ServiceRow extends HistRow { engine?: boolean }
export function serviceHistoryOf(c: MaCar): { rows: ServiceRow[]; lastMa?: string; lastRepair?: string } {
  const h = machineHistoryOf(c);
  const chassis: ServiceRow[] = (c.car.id === MA_CAR ? MA_REPAIRS : []).filter((r) => r[3] !== "บำรุงรักษา" && !h.rows.some((x) => x.no === r[0])).map((r) => ({
    kind: "repair", no: r[0], sub: r[4] || r[3], date: r[1], center: r[2], text: r[5], detail: r[6], war: r[7], cost: r[8],
  }));
  const engine: ServiceRow[] = engineHistoryOf(c).map((e) => ({ kind: "ma", engine: true, no: e.no, sub: "บำรุงรักษาเครื่องยนต์", date: e.date, center: e.center, text: "เช็คระยะตามเลขไมล์ " + e.km + " กม.", detail: e.work, war: "none", cost: e.cost }));
  const rows = [...h.rows, ...chassis, ...engine].sort((a, b) => dayOf(b.date) - dayOf(a.date));
  return { rows, lastMa: h.lastMa, lastRepair: h.lastRepair };
}
