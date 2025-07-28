export function precioToNumber(precio: string): number {
  // "MX$ 3\u202f500" or "MXS 4 200" → 3500 / 4200
  const digits = (precio || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

export function startOfWeek(ts: number): number {
  const d = new Date(ts);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const diff = (day + 6) % 7; // make Monday=0
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - diff);
  return d.getTime();
}

export function weeksBack(n: number): number[] {
  const out: number[] = [];
  const now = new Date();
  now.setHours(0,0,0,0);
  const base = startOfWeek(now.getTime());
  for (let i = n-1; i >= 0; i--) out.push(base - i * 7 * 24 * 3600 * 1000);
  return out;
}
