import { toPixels } from '../src/utils/unit-converter.js';

console.log('测试 toPixels:');
console.log('50% of 720:', toPixels('50%', { width: 720, height: 1280 }, 'x'));
console.log('50% of 1280:', toPixels('50%', { width: 720, height: 1280 }, 'y'));

