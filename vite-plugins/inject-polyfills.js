/**
 * Vite plugin to inject polyfills at the start of SSR bundle
 * This ensures MessageChannel is available before React 19 tries to use it
 */
export function injectPolyfills() {
  return {
    name: 'inject-polyfills',
    enforce: 'pre',
    transform(code, id) {
      // Only inject for JavaScript/TypeScript files, not CSS
      if (!id.match(/\.(js|ts|jsx|tsx|mjs|cjs)$/)) {
        return null;
      }

      // Only inject for SSR builds
      if (this.environment?.name === 'ssr' || id.includes('_worker.js')) {
        // Inject polyfill at the start of the bundle
        const polyfill = `
// MessageChannel polyfill for Cloudflare Workers + React 19
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const listeners1 = [];
      const listeners2 = [];
      this.port1 = {
        postMessage: (data) => queueMicrotask(() => listeners2.forEach(l => l({ data }))),
        addEventListener: (_, l) => listeners1.push(l),
        removeEventListener: (_, l) => { const i = listeners1.indexOf(l); if (i !== -1) listeners1.splice(i, 1); },
        start: () => {},
        close: () => {},
      };
      this.port2 = {
        postMessage: (data) => queueMicrotask(() => listeners1.forEach(l => l({ data }))),
        addEventListener: (_, l) => listeners2.push(l),
        removeEventListener: (_, l) => { const i = listeners2.indexOf(l); if (i !== -1) listeners2.splice(i, 1); },
        start: () => {},
        close: () => {},
      };
    }
  };
}
`;
        return {
          code: polyfill + code,
          map: null,
        };
      }
    },
  };
}

