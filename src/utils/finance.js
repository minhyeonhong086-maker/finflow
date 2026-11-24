// 금액 표시와 합계 계산 함수

// 1245000 → '1,245,000원'
export function won(amount) {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`;
}

// 특정 달의 거래만 골라냅니다.
export function byMonth(transactions, monthKey) {
  return transactions.filter((t) => t.date.startsWith(monthKey));
}

// 수입 합계, 지출 합계
export function sumByType(transactions, type) {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

// 카테고리별 지출 합계 → [{ category, amount }] (큰 금액 순)
export function expenseByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// 퍼센트 계산 (0으로 나누기 방지)
export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}
