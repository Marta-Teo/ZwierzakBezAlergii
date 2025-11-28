/**
 * Polyfill for MessageChannel API in Cloudflare Workers
 * Required for React 19 SSR
 * 
 * @see https://github.com/cloudflare/workerd/issues/2097
 */

if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    port1: MessagePort;
    port2: MessagePort;

    constructor() {
      const listeners1: Array<(event: MessageEvent) => void> = [];
      const listeners2: Array<(event: MessageEvent) => void> = [];

      this.port1 = {
        postMessage: (data: any) => {
          queueMicrotask(() => {
            const event = { data } as MessageEvent;
            listeners2.forEach((listener) => listener(event));
          });
        },
        addEventListener: (_type: string, listener: any) => {
          listeners1.push(listener);
        },
        removeEventListener: (_type: string, listener: any) => {
          const index = listeners1.indexOf(listener);
          if (index !== -1) listeners1.splice(index, 1);
        },
        start: () => {},
        close: () => {},
      } as MessagePort;

      this.port2 = {
        postMessage: (data: any) => {
          queueMicrotask(() => {
            const event = { data } as MessageEvent;
            listeners1.forEach((listener) => listener(event));
          });
        },
        addEventListener: (_type: string, listener: any) => {
          listeners2.push(listener);
        },
        removeEventListener: (_type: string, listener: any) => {
          const index = listeners2.indexOf(listener);
          if (index !== -1) listeners2.splice(index, 1);
        },
        start: () => {},
        close: () => {},
      } as MessagePort;
    }
  } as any;
}

