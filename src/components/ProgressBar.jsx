// 진행률 막대. 100%를 넘으면 빨간색으로 경고합니다.
export default function ProgressBar({ value }) {
  const over = value > 100;
  const warn = value >= 80 && !over;
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <div className={`progress-fill ${over ? 'over' : warn ? 'warn' : ''}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}
