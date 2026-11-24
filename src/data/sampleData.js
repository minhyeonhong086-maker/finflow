// 처음 접속했을 때 보여줄 "가상" 금융 데이터 (실제 정보 아님)
import { toMonthKey } from '../utils/date.js';

// 최근 6개월치 예시 거래를 만듭니다.
export function createSampleData(today = new Date()) {
  const transactions = [];
  let id = 1;

  // 매달 반복되는 예시 항목: [일, 구분, 카테고리, 금액, 메모]
  const monthly = [
    [1, 'expense', '주거/통신', 450000, '월세'],
    [5, 'expense', '주거/통신', 55000, '휴대폰 요금'],
    [10, 'income', '급여', 2300000, '월급'],
    [12, 'expense', '구독/콘텐츠', 17000, '영상 구독'],
    [20, 'expense', '구독/콘텐츠', 10900, '음악 구독'],
  ];
  // 달마다 조금씩 달라지는 변동 지출
  const variable = [
    [3, '식비', 12000, '점심'],
    [4, '교통', 45000, '교통카드 충전'],
    [7, '식비', 38000, '장보기'],
    [9, '쇼핑', 59000, '옷'],
    [11, '생활비', 23000, '생활용품'],
    [14, '식비', 27000, '저녁 약속'],
    [16, '의료/건강', 15000, '약국'],
    [18, '식비', 9500, '카페'],
    [21, '기타', 30000, '선물'],
    [24, '교통', 13000, '택시'],
    [26, '쇼핑', 42000, '온라인 쇼핑'],
    [28, '식비', 31000, '배달'],
  ];
  const factors = [1.0, 0.9, 1.3, 1.1, 0.95, 1.0]; // 6개월 전 → 이번 달

  for (let m = 5; m >= 0; m--) {
    const base = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const y = base.getFullYear();
    const mo = base.getMonth();
    const isThisMonth = m === 0;
    const lastDay = isThisMonth ? today.getDate() : 28;
    const f = factors[5 - m];

    const add = (day, type, category, amount, memo) => {
      if (day > lastDay) return; // 이번 달은 오늘까지만
      const date = `${y}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      transactions.push({ id: String(id++), type, date, category, amount, memo });
    };

    monthly.forEach(([d, t, c, a, memo]) => add(d, t, c, a, memo));
    variable.forEach(([d, c, a, memo]) => add(d, 'expense', c, Math.round((a * f) / 100) * 100, memo));
  }

  const monthKey = toMonthKey(today);
  const budgets = {
    [monthKey]: {
      total: 1200000,
      categories: { 식비: 300000, 교통: 80000, 쇼핑: 120000, 생활비: 60000, '구독/콘텐츠': 40000, '주거/통신': 520000 },
    },
  };

  return { transactions, budgets };
}
