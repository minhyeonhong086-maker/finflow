// 데이터 저장소
// 지금은 브라우저의 localStorage에 저장합니다.
// 나중에 서버(백엔드)를 붙이면 이 파일의 함수 안쪽만 API 호출로 바꾸면 됩니다.
import { createSampleData } from './sampleData.js';

const KEY = 'finflow-data-v1';

// 저장된 데이터를 읽습니다. 처음이면 예시 데이터를 만들어 저장합니다.
export function loadData() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // 저장된 값이 깨졌으면 아래에서 새로 만듭니다.
  }
  const data = createSampleData();
  saveData(data);
  return data;
}

// 데이터를 저장합니다.
export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // 저장 공간이 꽉 찼거나 막힌 경우 조용히 넘어갑니다.
  }
}

// 모든 데이터를 지웁니다.
export function emptyData() {
  return { transactions: [], budgets: {} };
}

export function sampleData() {
  return createSampleData();
}
