import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Mock dla window.matchMedia (często używane w komponentach UI)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock dla IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  disconnect() {
    return;
  }
  observe() {
    return;
  }
  takeRecords() {
    return [];
  }
  unobserve() {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Mock dla ResizeObserver
global.ResizeObserver = class ResizeObserver {
  disconnect() {
    return;
  }
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
