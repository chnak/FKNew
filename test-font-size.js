/**
 * 测试字体大小转换
 */
import { toFontSizePixels } from './src/utils/unit-converter.js';

const context = { width: 1920, height: 1080, baseFontSize: 16 };

console.log('字体大小转换测试:\n');
console.log('2% ->', toFontSizePixels('2%', context), 'px');
console.log('40rpx ->', toFontSizePixels('40rpx', context), 'px');
console.log('3vw ->', toFontSizePixels('3vw', context), 'px');
console.log('48px ->', toFontSizePixels('48px', context), 'px');
console.log('48 ->', toFontSizePixels(48, context), 'px');

