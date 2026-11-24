// 날짜 관련 도우미 함수

// Date → '2026-11' 형태
export function toMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// 오늘 날짜 → '2026-11-24' 형태
export function todayString() {
  const d = new Date();
  return `${toMonthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
}

// '2026-11'에 몇 달을 더하거나 뺍니다. (예: -1이면 지난달)
export function shiftMonth(monthKey, diff) {
  const [y, m] = monthKey.split('-').map(Number);
  return toMonthKey(new Date(y, m - 1 + diff, 1));
}

// '2026-11' → '2026년 11월'
export function monthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number);
  return `${y}년 ${m}월`;
}

// '2026-11' → '11월'
export function shortMonthLabel(monthKey) {
  return `${Number(monthKey.split('-')[1])}월`;
}
