/**
 * DOM Polyfill for Node.js environment
 */
import { createCanvas } from 'canvas';

// 创建全局document和window对象
if (typeof global !== 'undefined' && !global.document) {
  global.document = {
    createElement: (tagName) => {
      if (tagName === 'canvas') {
        return createCanvas(1920, 1080);
      }
      return {
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        style: {},
      };
    },
    createElementNS: (ns, tagName) => {
      return global.document.createElement(tagName);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
  };

  global.window = {
    document: global.document,
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb) => setTimeout(cb, 16),
    cancelAnimationFrame: (id) => clearTimeout(id),
    devicePixelRatio: 1,
    innerWidth: 1920,
    innerHeight: 1080,
  };
}

