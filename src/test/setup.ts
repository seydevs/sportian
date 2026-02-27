import '@testing-library/jest-dom';
// Polyfills mínimos para react-router en JSDOM
if (!('TextEncoder' in globalThis)) {
  Object.defineProperty(globalThis, 'TextEncoder', {
    configurable: true,
    writable: true,
    value: class {
      encode(input: string) {
        return new Uint8Array(input.length);
      }
    },
  });
}
if (!('TextDecoder' in globalThis)) {
  Object.defineProperty(globalThis, 'TextDecoder', {
    configurable: true,
    writable: true,
    value: class {
      decode(input?: Uint8Array) {
        void input;
        return '';
      }
    },
  });
}
