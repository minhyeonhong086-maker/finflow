import StatCard from '../components/StatCard.jsx';
import DonutChart from '../components/DonutChart.jsx';
import BarChart from '../components/BarChart.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Icon from '../components/Icon.jsx';
import { CATEGORY_COLORS } from '../data/categories.js';
import { byMonth, sumByType, expenseByCategory, percent, won } from '../utils/finance.js';
import { shiftMonth, shortMonthLabel } from '../utils/date.js';

// 메인 대시보드 화면
export default function Dashboard({ data, month, goPage }) {
  const monthTx = byMonth(data.transactions, month); // 이번 달 거래
  const income = sumByType(monthTx, 'income'); // 이번 달 수입
  const expense = sumByType(monthTx, 'expense'); // 이번 달 지출
  const lastExpense = sumByType(byMonth(data.transactions, shiftMonth(month, -1)), 'expense'); // 지난달 지출
  const diff = lastExpense ? percent(expense - lastExpense, lastExpense) : null; // 지난달 대비 %

  const budget = data.budgets[month];
  const usedRate = budget ? percent(expense, budget.total) : 0;

  // 최근 6개월 지출 (막대그래프용)
  const monthly = [5, 4, 3, 2, 1, 0].map((n) => {
    const key = shiftMonth(month, -n);
    return { label: shortMonthLabel(key), amount: sumByType(byMonth(data.transactions, key), 'expense') };
  });

  // 최근 거래 5개 (날짜 최신순)
  const recent = [...monthTx].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // 예산 대비 사용률이 높은 카테고리 4개
  const categorySpent = Object.fromEntries(expenseByCategory(monthTx).map((c) => [c.category, c.amount]));
  const budgetRows = budget
    ? Object.entries(budget.categories)
        .filter(([, limit]) => limit > 0)
        .map(([category, limit]) => ({ category, limit, spent: categorySpent[category] || 0 }))
        .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
        .slice(0, 4)
    : [];

  return (
    <div className="page">
      <section className="stats">
        <StatCard icon="wallet" color="#6C5CE7" label="이번 달 지출" value={won(expense)}>
          {diff !== null && (
            <span className={diff <= 0 ? 'good' : 'bad'}>
              <Icon name={diff <= 0 ? 'arrowDown' : 'arrowUp'} size={14} /> 지난달보다 {Math.abs(diff)}% {diff <= 0 ? '감소' : '증가'}
            </span>
          )}
        </StatCard>
        <StatCard icon="arrowDown" color="#3DBE8B" label="이번 달 수입" value={won(income)}>
          <span className="muted">{monthTx.filter((t) => t.type === 'income').length}건</span>
        </StatCard>
        <StatCard icon="target" color="#45A6F5" label="이번 달 예산" value={budget ? won(budget.total) : '미설정'}>
          {budget ? (
            <div className="stat-progress">
              <ProgressBar value={usedRate} />
              <span className={usedRate > 100 ? 'bad' : 'muted'}>{usedRate}% 사용</span>
            </div>
          ) : (
            <button className="link-btn" onClick={() => goPage('budget')}>예산 설정하기 →</button>
          )}
        </StatCard>
        <StatCard icon="logo" color="#F7B05B" label={budget ? '남은 생활비' : '이번 달 잔액'}
          value={won(budget ? budget.total - expense : income - expense)}>
          <span className="muted">{budget ? '예산 - 지출' : '수입 - 지출'}</span>
        </StatCard>
      </section>

      <section className="grid-2">
        <div className="card">
          <h3 className="card-title">지출 카테고리 비율</h3>
          <DonutChart items={expenseByCategory(monthTx)} />
        </div>
        <div className="card">
          <h3 className="card-title">월별 지출 추이</h3>
          <BarChart items={monthly} />
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">최근 거래 내역</h3>
            <button className="link-btn" onClick={() => goPage('transactions')}>전체보기 ›</button>
          </div>
          {recent.length === 0 ? (
            <p className="empty">이번 달 거래가 없습니다.</p>
          ) : (
            <ul className="tx-list">
              {recent.map((t) => (
                <li key={t.id}>
                  <span className="dot" style={{ background: t.type === 'income' ? '#3DBE8B' : CATEGORY_COLORS[t.category] }} />
                  <div className="tx-info">
                    <strong>{t.memo || t.category}</strong>
                    <small>{t.date.slice(5).replace('-', '/')} · {t.category}</small>
                  </div>
                  <span className={`tx-amount ${t.type}`}>{t.type === 'income' ? '+' : '-'}{won(t.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">카테고리 예산</h3>
            <button className="link-btn" onClick={() => goPage('budget')}>관리 ›</button>
          </div>
          {budgetRows.length === 0 ? (
            <p className="empty">카테고리 예산을 설정하면 여기에 표시됩니다.</p>
          ) : (
            <ul className="budget-mini">
              {budgetRows.map((r) => {
                const rate = percent(r.spent, r.limit);
                return (
                  <li key={r.category}>
                    <div className="row-between">
                      <span>{r.category}</span>
                      <span className={rate > 100 ? 'bad' : 'muted'}>{won(r.spent)} / {won(r.limit)}</span>
                    </div>
                    <ProgressBar value={rate} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
