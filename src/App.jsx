import { useEffect, useState } from 'react';
import Sidebar, { MENUS } from './components/Sidebar.jsx';
import Icon from './components/Icon.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budget from './pages/Budget.jsx';
import { loadData, saveData, emptyData, sampleData } from './data/storage.js';
import { toMonthKey, shiftMonth, monthLabel } from './utils/date.js';

// 주소의 # 뒤 값으로 현재 페이지를 정합니다. (예: /#budget)
function pageFromHash() {
  const id = window.location.hash.replace('#', '');
  return MENUS.some((m) => m.id === id) ? id : 'dashboard';
}

export default function App() {
  const [data, setData] = useState(loadData); // 거래·예산 데이터
  const [month, setMonth] = useState(toMonthKey(new Date())); // 보고 있는 달
  const [page, setPage] = useState(pageFromHash); // 현재 메뉴

  // 데이터가 바뀔 때마다 자동 저장
  useEffect(() => saveData(data), [data]);

  // 브라우저 뒤로가기 등으로 주소가 바뀌면 페이지도 바꿉니다.
  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goPage = (id) => {
    window.location.hash = id;
    setPage(id);
    window.scrollTo(0, 0);
  };

  // ----- 거래 추가 / 수정 / 삭제 -----
  const addTransaction = (tx) =>
    setData((d) => ({ ...d, transactions: [...d.transactions, { ...tx, id: crypto.randomUUID?.() || String(Date.now()) }] }));

  const updateTransaction = (tx) =>
    setData((d) => ({ ...d, transactions: d.transactions.map((t) => (t.id === tx.id ? tx : t)) }));

  const deleteTransaction = (id) =>
    setData((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) }));

  // ----- 예산 저장 -----
  const saveBudget = (monthKey, budget) =>
    setData((d) => ({ ...d, budgets: { ...d.budgets, [monthKey]: budget } }));

  // ----- 데이터 관리 (예시 데이터 / 전체 삭제) -----
  const [showData, setShowData] = useState(false);
  const resetData = (kind) => {
    if (kind === 'sample') setData(sampleData());
    if (kind === 'empty' && window.confirm('정말 모든 데이터를 지울까요? 되돌릴 수 없습니다.')) setData(emptyData());
    setShowData(false);
  };

  const pageProps = { data, month, addTransaction, updateTransaction, deleteTransaction, saveBudget, goPage };
  const title = MENUS.find((m) => m.id === page).label;

  return (
    <div className="layout">
      <Sidebar page={page} onChange={goPage} onReset={() => setShowData(true)} />
      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page === 'dashboard' ? '안녕하세요! 👋' : title}</h1>
            <p className="subtitle">
              {page === 'dashboard' ? '이번 달도 계획한 예산 안에서 알뜰하게 관리해요.' : `${monthLabel(month)} 기준`}
            </p>
          </div>
          <div className="month-switch">
            <button className="icon-btn" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="이전 달">
              <Icon name="left" />
            </button>
            <span>{monthLabel(month)}</span>
            <button className="icon-btn" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="다음 달">
              <Icon name="right" />
            </button>
          </div>
        </header>

        {page === 'dashboard' && <Dashboard {...pageProps} />}
        {page === 'transactions' && <Transactions {...pageProps} />}
        {page === 'budget' && <Budget {...pageProps} />}
      </main>

      {showData && (
        <div className="modal-backdrop" onClick={() => setShowData(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>데이터 관리</h2>
              <button className="icon-btn" onClick={() => setShowData(false)} aria-label="닫기"><Icon name="close" /></button>
            </div>
            <p className="muted">데이터는 이 브라우저에만 저장됩니다. 화면에 보이는 예시 데이터는 모두 가상의 값입니다.</p>
            <div className="modal-actions column">
              <button className="btn ghost" onClick={() => resetData('sample')}>예시 데이터로 되돌리기</button>
              <button className="btn danger" onClick={() => resetData('empty')}>모든 데이터 지우기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
