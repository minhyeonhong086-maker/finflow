import { useState } from 'react';
import { won } from '../utils/finance.js';

// 월별 지출 막대그래프
// items: [{ label: '11월', amount: 1245000 }] — 마지막 항목이 선택한 달입니다.
export default function BarChart({ items }) {
  const [hover, setHover] = useState(items.length - 1);
  const max = Math.max(...items.map((i) => i.amount), 1);
  // 눈금 최댓값을 보기 좋게 반올림 (예: 1,623,000 → 2,000,000)
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => top * r);

  const W = 520, H = 240, left = 70, bottom = 30, chartH = H - bottom - 20;
  const slot = (W - left) / items.length;
  const barW = Math.min(44, slot * 0.55);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bar-chart">
      {ticks.map((t) => {
        const y = 20 + chartH - (t / top) * chartH;
        return (
          <g key={t}>
            <line x1={left} x2={W} y1={y} y2={y} stroke="#EEF0F6" />
            <text x={left - 10} y={y + 4} textAnchor="end" className="axis">{Math.round(t).toLocaleString()}</text>
          </g>
        );
      })}
      {items.map((item, i) => {
        const h = (item.amount / top) * chartH;
        const x = left + slot * i + (slot - barW) / 2;
        const y = 20 + chartH - h;
        const active = i === hover;
        return (
          <g key={item.label} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} style={{ cursor: 'pointer' }}>
            <rect x={left + slot * i} y={0} width={slot} height={H} fill="transparent" />
            <rect x={x} y={y} width={barW} height={Math.max(h, 0)} rx="6"
              fill={active ? '#6C5CE7' : '#D9D4FB'} />
            <text x={x + barW / 2} y={H - 8} textAnchor="middle" className={`axis ${active ? 'axis-active' : ''}`}>
              {item.label}
            </text>
            {active && (
              <g>
                <rect x={Math.min(x + barW / 2 - 62, W - 126)} y={Math.max(y - 46, 0)} width="124" height="38" rx="8" className="tip-box" />
                <text x={Math.min(x + barW / 2, W - 64)} y={Math.max(y - 22, 24)} textAnchor="middle" className="tip-text">
                  {won(item.amount)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
