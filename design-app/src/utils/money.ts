export function formatMoney(v: number) {
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  return `${sign}${abs.toLocaleString("ru-RU")} ₽`;
}

export function ymKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, 1);
  return dt.toLocaleString("ru-RU", { month: "long", year: "numeric" });
}
