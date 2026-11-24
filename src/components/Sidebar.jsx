import Icon from './Icon.jsx';

// 메뉴 목록: 나중에 메뉴를 추가하려면 여기에 한 줄 추가하면 됩니다.
export const MENUS = [
  { id: 'dashboard', label: '대시보드', icon: 'home' },
  { id: 'transactions', label: '수입·지출', icon: 'list' },
  { id: 'budget', label: '예산 관리', icon: 'target' },
];

// 왼쪽 사이드바 (모바일에서는 화면 아래 메뉴바로 바뀝니다)
export default function Sidebar({ page, onChange, onReset }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Icon name="logo" size={26} />
        <span>FinFlow</span>
      </div>
      <nav className="menu">
        {MENUS.map((m) => (
          <button key={m.id} className={`menu-item ${page === m.id ? 'active' : ''}`} onClick={() => onChange(m.id)}>
            <Icon name={m.icon} />
            <span>{m.label}</span>
          </button>
        ))}
      </nav>
      <button className="menu-item reset" onClick={onReset}>
        <Icon name="refresh" />
        <span>데이터 관리</span>
      </button>
    </aside>
  );
}
