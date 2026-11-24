import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import { CATEGORY_COLORS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories.js';
import { byMonth, sumByType, won } from '../utils/finance.js';

// 수입·지출 관리 화면: 목록, 필터, 검색, 등록·수정·삭제
export default function Transactions({ data, month, addTransaction, updateTransaction, deleteTransaction }) {
  const [typeFilter, setTypeFilter] = useState('all'); // 전체 / 수입 / 지출
  const [category, setCategory] = useState('all'); // 카테고리 필터
  const [keyword, setKeyword] = useState(''); // 검색어
  const [editing, setEditing] = useState(null); // null: 닫힘, {}: 새로 등록, 거래객체: 수정

  // 선택한 달 → 구분 → 카테고리 → 검색어 순서로 걸러냅니다.
  const list = byMonth(data.transactions, month)
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => category === 'all' || t.category === category)
    .filter((t) => !keyword || `${t.memo} ${t.category}`.toLowerCase().includes(keyword.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  const income = sumByType(list, 'income');
  const expense = sumByType(list, 'expense');

  const save = (tx) => {
    if (tx.id) updateTransaction(tx);
    else addTransaction(tx);
    setEditing(null);
  };

  const remove = (t) => {
    if (window.confirm(`'${t.memo || t.category}' ${won(t.amount)} 내역을 삭제할까요?`)) deleteTransaction(t.id);
  };

  return (
    <div className="page">
      <section className="summary-row">
        <div className="card summary"><span>수입</span><strong className="income">+{won(income)}</strong></div>
        <div className="card summary"><span>지출</span><strong className="expense">-{won(expense)}</strong></div>
        <div className="card summary"><span>합계</span><strong>{won(income - expense)}</strong></div>
      </section>

      <section className="card">
        <div className="toolbar">
          <div className="segmented small">
            {[['all', '전체'], ['income', '수입'], ['expense', '지출']].map(([v, l]) => (
              <button key={v} className={typeFilter === v ? 'on' : ''} onClick={() => setTypeFilter(v)}>{l}</button>
            ))}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="카테고리">
            <option value="all">모든 카테고리</option>
            {[...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="search">
            <Icon name="search" size={18} />
            <input placeholder="메모 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
          <button className="btn primary" onClick={() => setEditing({})}>
            <Icon name="plus" size={18} /> 거래 등록
          </button>
        </div>

        {list.length === 0 ? (
          <p className="empty">조건에 맞는 거래가 없습니다.</p>
        ) : (
          <ul className="tx-list full">
            {list.map((t) => (
              <li key={t.id}>
                <span className="dot" style={{ background: t.type === 'income' ? '#3DBE8B' : CATEGORY_COLORS[t.category] }} />
                <div className="tx-info">
                  <strong>{t.memo || t.category}</strong>
                  <small>{t.date.replaceAll('-', '.')} · {t.category}</small>
                </div>
                <span className={`tx-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}{won(t.amount)}</span>
                <div className="tx-actions">
                  <button className="icon-btn" onClick={() => setEditing(t)} aria-label="수정"><Icon name="edit" size={18} /></button>
                  <button className="icon-btn danger" onClick={() => remove(t)} aria-label="삭제"><Icon name="trash" size={18} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <TransactionForm initial={editing.id ? editing : null} onSubmit={save} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
