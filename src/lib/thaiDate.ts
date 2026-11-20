const TH_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
export const TH_PICKER = {
  weekdays: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."],
  monthLabel: (y: number, m: number) => TH_MONTHS[m] + " " + (y + 543),
  CancelText: "ปิด",
  ApplyText: "ตกลง",
  ClearText: "",
};
