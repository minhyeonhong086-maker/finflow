import { useState } from 'react';
import Icon from './Icon.jsx';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories.js';
import { todayString } from '../utils/date.js';

// 거래 등록·수정 창 (팝업)
// initial이 있으면 "수정", 없으면 "새로 등록"
export default function TransactionForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(
    initial || { type: 'expense', date: todayString(), category: '식비', amount: '', memo: '' }
  );
  const [error, setError] = useState('');

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // 입력칸 값이 바뀔 때 form 상태를 갱신합니다.
  const change = (key, value) => {
    const next = { ...form, [key]: value };
    // 수입/지출을 바꾸면 카테고리도 그 종류의 첫 번째 값으로 바꿉니다.
    if (key === 'type') next.category = (value === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0];
    setForm(next);
  };

  // 저장 버튼: 입력값 검증 후 부모에게 전달합니다.
  const submit = (e) => {
    e.preventDefault();
    const amount = Number(String(form.amount).replaceAll(',', ''));
    if (!form.date) return setError('날짜를 선택해 주세요.');
    if (!Number.isFinite(amount) || amount <= 0) return setError('금액은 0보다 큰 숫자로 입력해 주세요.');
    if (amount > 1000000000) return setError('금액은 10억 원 이하로 입력해 주세요.');
    if (form.memo.length > 50) return setError('메모는 50자 이하로 입력해 주세요.');
    onSubmit({ ...form, amount: Math.round(amount), memo: form.memo.trim() });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{initial ? '거래 수정' : '거래 등록'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            <Icon name="close" />
          </button>
        </div>

        <div className="segmented">
          <button type="button" className={form.type === 'expense' ? 'on expense' : ''} onClick={() => change('type', 'expense')}>지출</button>
          <button type="button" className={form.type === 'income' ? 'on income' : ''} onClick={() => change('type', 'income')}>수입</button>
        </div>

        <label className="field">
          <span>날짜</span>
          <input type="date" value={form.date} onChange={(e) => change('date', e.target.value)} />
        </label>
        <label className="field">
          <span>카테고리</span>
          <select value={form.category} onChange={(e) => change('category', e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>금액 (원)</span>
          <input type="number" inputMode="numeric" min="1" placeholder="예: 12000" value={form.amount}
            onChange={(e) => change('amount', e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>메모 (선택)</span>
          <input type="text" maxLength={50} placeholder="예: 점심" value={form.memo} onChange={(e) => change('memo', e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>취소</button>
          <button type="submit" className="btn primary">저장</button>
        </div>
      </form>
    </div>
  );
}
