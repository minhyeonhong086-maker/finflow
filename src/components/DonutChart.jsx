import { CATEGORY_COLORS } from '../data/categories.js';
import { won, percent } from '../utils/finance.js';

// 카테고리별 지출 비율 도넛 차트
// items: [{ category, amount }]
export default function DonutChart({ items }) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  const r = 70; // 원의 반지름
  const circumference = 2 * Math.PI * r; // 원 둘레
  let offset = 0;

  if (total === 0) return <p className="empty">이번 달 지출 내역이 없습니다.</p>;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 200 200" className="donut">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#EEF0F6" strokeWidth="28" />
        {items.map((item) => {
          // 각 카테고리가 원 둘레에서 차지할 길이
          const length = (item.amount / total) * circumference;
          const el = (
            <circle key={item.category} cx="100" cy="100" r={r} fill="none"
              stroke={CATEGORY_COLORS[item.category] || '#C5CAD6'} strokeWidth="28"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset} transform="rotate(-90 100 100)">
              <title>{`${item.category} ${won(item.amount)}`}</title>
            </circle>
          );
          offset += length;
          return el;
        })}
        <text x="100" y="94" textAnchor="middle" className="donut-label">총 지출</text>
        <text x="100" y="116" textAnchor="middle" className="donut-value">{won(total)}</text>
      </svg>
      <ul className="legend">
        {items.map((item) => (
          <li key={item.category}>
            <span className="dot" style={{ background: CATEGORY_COLORS[item.category] || '#C5CAD6' }} />
            <span className="legend-name">{item.category}</span>
            <span className="legend-value">
              {percent(item.amount, total)}% <small>({won(item.amount)})</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
