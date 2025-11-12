/**
 * 简单文本渲染测试
 */
import { Composition, TextElement } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testSimpleText() {
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 2,
    backgroundColor: '#000000',
  });

  const layer = composition.createElementLayer();

  // 简单的文本元素
  const text = new TextElement({
    text: 'Hello, World!',
    x: 960,
    y: 540,
    fontSize: 72,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  });
  layer.addElement(text);

  // 渲染一帧
  await composition.renderer.init();
  const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 1.0, composition.backgroundColor);
  
  // 保存
  const outputPath = path.join(__dirname, 'output', 'test-simple-text.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 测试帧已保存: ${outputPath}`);
  console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);

  // 检查状态
  const state = text.getStateAtTime(1.0, { width: 1920, height: 1080 });
  console.log('\n文本状态:');
  console.log('  位置:', state.x, state.y);
  console.log('  字体大小:', state.fontSize);
  console.log('  文本:', state.text);
  console.log('  颜色:', state.color);

  composition.destroy();
}

testSimpleText().catch(console.error);

