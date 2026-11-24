import Icon from './Icon.jsx';

// 대시보드 상단 요약 카드 하나
export default function StatCard({ icon, color, label, value, children }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ color, background: `${color}1A` }}>
        <Icon name={icon} size={22} />
      </div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {children && <div className="stat-sub">{children}</div>}
      </div>
    </div>
  );
}
