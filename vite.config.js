import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 설정 파일: React를 사용한다고 알려줍니다.
export default defineConfig({
  plugins: [react()],
});
