import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// 每个测试后自动清理
afterEach(() => {
  cleanup();
}); 