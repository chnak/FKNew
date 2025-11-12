/**
 * 调试SpriteJS渲染
 */
import spritejs from 'spritejs';
import { createCanvas } from 'canvas';
import './src/utils/dom-polyfill.js';

const { Scene, Label, Rect } = spritejs;

async function testSpriteJS() {
  const width = 800;
  const height = 600;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // 绘制背景
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, width, height);
  
  const container = {
    clientWidth: width,
    clientHeight: height,
    appendChild: () => {},
    removeChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: width,
      height: height,
    }),
  };
  
  const scene = new Scene({
    container: container,
    width: width,
    height: height,
    canvas: canvas,
  });
  
  const layer = scene.layer();
  
  console.log('Scene created');
  console.log('Scene canvas:', scene.canvas ? 'exists' : 'missing');
  console.log('Layer:', layer ? 'exists' : 'missing');
  
  // 创建文本
  const label = new Label({
    text: 'Hello SpriteJS',
    pos: [400, 300],
    font: 'bold 48px Arial',
    color: '#ffffff',
    textAlign: 'center',
  });
  
  layer.appendChild(label);
  console.log('Label added to layer');
  console.log('Layer children count:', layer.children.length);
  
  // 创建矩形
  const rect = new Rect({
    pos: [300, 400],
    size: [200, 100],
    bgcolor: '#00ff00',
  });
  
  layer.appendChild(rect);
  console.log('Rect added to layer');
  console.log('Layer children count:', layer.children.length);
  
  // 尝试snapshot
  try {
    await scene.snapshot();
    console.log('Snapshot completed');
  } catch (error) {
    console.error('Snapshot error:', error.message);
  }
  
  // 检查canvas内容
  const buffer = canvas.toBuffer('image/png');
  console.log(`Canvas buffer size: ${(buffer.length / 1024).toFixed(2)} KB`);
  
  // 保存
  const fs = (await import('fs-extra')).default;
  await fs.writeFile('output/test-spritejs.png', buffer);
  console.log('Saved to output/test-spritejs.png');
  
  // 检查scene的canvas属性
  console.log('\nScene properties:');
  console.log('scene.canvas:', scene.canvas);
  console.log('scene.renderer:', scene.renderer ? 'exists' : 'missing');
  if (scene.renderer) {
    console.log('renderer.canvas:', scene.renderer.canvas ? 'exists' : 'missing');
  }
}

testSpriteJS().catch(console.error);

