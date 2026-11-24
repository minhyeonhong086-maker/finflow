import { useEffect, useState } from 'react';
import ProgressBar from '../components/ProgressBar.jsx';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../data/categories.js';
import { byMonth, sumByType, expenseByCategory, percent, won } from '../utils/finance.js';
import { shiftMonth, monthLabel } from '../utils/date.js';

// 예산 관리 화면: 월 전체 예산 + 카테고리별 예산
export default function Budget({ data, month, saveBudget }) {
  const budget = data.budgets[month];
  const [editing, setEditing] = useState(!budget);
  const [draft, setDraft] = useState(toDraft(budget));
  const [error, setError] = useState('');

  // 다른 달로 이동하면 입력칸을 그 달 예산으로 다시 채웁니다.
  useEffect(() => {
    setDraft(toDraft(data.budgets[month]));
    setEditing(!data.budgets[month]);
    setError('');
  }, [month]);

  const monthTx = byMonth(data.transactions, month);
  const spent = sumByType(monthTx, 'expense');
  const spentByCat = Object.fromEntries(expenseByCategory(monthTx).map((c) => [c.category, c.amount]));

  // 저장: 숫자 검증 후 저장
  const submit = (e) => {
    e.preventDefault();
    const total = Number(draft.total);
    if (!Number.isFinite(total) || total <= 0) return setError('월 전체 예산을 0보다 큰 금액으로 입력해 주세요.');
    const categories = {};
    for (const c of EXPENSE_CATEGORIES) {
      const v = Number(draft.categories[c] || 0);
      if (!Number.isFinite(v) || v < 0) return setError(`${c} 예산이 올바르지 않습니다.`);
      if (v > 0) categories[c] = Math.round(v);
    }
    const catSum = Object.values(categories).reduce((s, v) => s + v, 0);
    if (catSum > total) return setError(`카테고리 예산 합계(${won(catSum)})가 월 예산보다 큽니다.`);
    saveBudget(month, { total: Math.round(total), categories });
    setEditing(false);
    setError('');
  };

  // 지난달 예산 복사
  const prev = data.budgets[shiftMonth(month, -1)];
  const copyPrev = () => setDraft(toDraft(prev));

  if (editing || !budget) {
    return (
      <div className="page">
        <form className="card budget-form" onSubmit={submit}>
          <h3 className="card-title">{monthLabel(month)} 예산 설정</h3>
          <label className="field">
            <span>월 전체 예산 (원)</span>
            <input type="number" min="0" placeholder="예: 1200000" value={draft.total}
              onChange={(e) => setDraft({ ...draft, total: e.target.value })} />
          </label>
          <p className="muted">카테고리별 예산 (비워두면 설정하지 않음)</p>
          <div className="budget-grid">
            {EXPENSE_CATEGORIES.map((c) => (
              <label className="field" key={c}>
                <span><i className="dot" style={{ background: CATEGORY_COLORS[c] }} /> {c}</span>
                <input type="number" min="0" placeholder="0" value={draft.categories[c] || ''}
                  onChange={(e) => setDraft({ ...draft, categories: { ...draft.categories, [c]: e.target.value } })} />
              </label>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            {prev && <button type="button" className="btn ghost" onClick={copyPrev}>지난달 예산 불러오기</button>}
            {budget && <button type="button" className="btn ghost" onClick={() => { setEditing(false); setError(''); }}>취소</button>}
            <button type="submit" className="btn primary">저장</button>
          </div>
        </form>
      </div>
    );
  }

  const rate = percent(spent, budget.total);
  const remain = budget.total - spent;

  return (
    <div className="page">
      <section className="card budget-total">
        <div className="card-head">
          <h3 className="card-title">월 전체 예산</h3>
          <button className="btn ghost" onClick={() => setEditing(true)}>예산 수정</button>
        </div>
        <div className="budget-numbers">
          <div><span>예산</span><strong>{won(budget.total)}</strong></div>
          <div><span>사용</span><strong>{won(spent)}</strong></div>
          <div><span>남은 예산</span><strong className={remain < 0 ? 'bad' : 'good'}>{won(remain)}</strong></div>
        </div>
        <ProgressBar value={rate} />
        <p className={rate > 100 ? 'alert' : 'muted'}>
          {rate > 100 ? `⚠ 예산을 ${won(-remain)} 초과했습니다!` : `예산의 ${rate}%를 사용했습니다.`}
        </p>
      </section>

      <section className="card">
        <h3 className="card-title">카테고리별 예산</h3>
        {Object.keys(budget.categories).length === 0 ? (
          <p className="empty">설정된 카테고리 예산이 없습니다.</p>
        ) : (
          <ul className="budget-list">
            {Object.entries(budget.categories).map(([c, limit]) => {
              const used = spentByCat[c] || 0;
              const r = percent(used, limit);
              return (
                <li key={c}>
                  <div className="row-between">
                    <span><i className="dot" style={{ background: CATEGORY_COLORS[c] }} /> {c}</span>
                    <span className={r > 100 ? 'bad' : 'muted'}>{r}%</span>
                  </div>
                  <ProgressBar value={r} />
                  <div className="row-between small">
                    <span className="muted">{won(used)} 사용</span>
                    <span className={used > limit ? 'bad' : 'muted'}>
                      {used > limit ? `${won(used - limit)} 초과` : `${won(limit - used)} 남음`}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

// 저장된 예산 → 입력칸용 값
function toDraft(budget) {
  return { total: budget?.total ?? '', categories: { ...(budget?.categories || {}) } };
}
