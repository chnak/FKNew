/**
 * 调试元素配置
 */
import { RectElement, TextElement } from './src/index.js';

// 创建矩形元素
const rect = new RectElement({
  x: 400,
  y: 300,
  width: 300,
  height: 150,
  bgcolor: '#4a90e2',
  borderRadius: 15,
});

console.log('矩形元素配置:');
console.log('rect.config.x:', rect.config.x);
console.log('rect.config.y:', rect.config.y);
console.log('rect.config:', JSON.stringify(rect.config, null, 2));
console.log('rect.getConfig():', JSON.stringify(rect.getConfig(), null, 2));

const state = rect.getStateAtTime(0);
console.log('\n时间0的状态:');
console.log('state:', JSON.stringify(state, null, 2));

