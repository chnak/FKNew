/**
 * 测试单位转换器
 */
import { toPixels, toFontSizePixels, parseUnit } from './src/utils/unit-converter.js';

const context = { width: 1920, height: 1080 };

console.log('单位转换测试 (画布尺寸: 1920x1080)\n');

// 测试位置和尺寸单位
console.log('位置和尺寸单位:');
console.log('50% ->', toPixels('50%', context), 'px (应该是 960)');
console.log('10vw ->', toPixels('10vw', context), 'px (应该是 192)');
console.log('20vh ->', toPixels('20vh', context), 'px (应该是 216)');
console.log('30vmin ->', toPixels('30vmin', context), 'px (应该是 324)');
console.log('40vmax ->', toPixels('40vmax', context), 'px (应该是 768)');
console.log('100rpx ->', toPixels('100rpx', context), 'px (应该是 256)');
console.log('200px ->', toPixels('200px', context), 'px (应该是 200)');
console.log('200 ->', toPixels(200, context), 'px (应该是 200)');

console.log('\n字体大小单位:');
console.log('2% ->', toFontSizePixels('2%', context), 'px (基准16px，应该是 0.32)');
console.log('40rpx ->', toFontSizePixels('40rpx', context), 'px (应该是 102.4)');
console.log('24px ->', toFontSizePixels('24px', context), 'px (应该是 24)');

console.log('\n解析单位:');
console.log('parseUnit("50%") ->', parseUnit('50%'));
console.log('parseUnit("10vw") ->', parseUnit('10vw'));
console.log('parseUnit("200") ->', parseUnit('200'));
console.log('parseUnit(200) ->', parseUnit(200));

