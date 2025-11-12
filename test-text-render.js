/**
 * 测试文本渲染
 */
import { Composition, TextElement } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTextRender() {
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 2,
    backgroundColor: '#1a1a1a',
  });

  const layer = composition.createElementLayer();

  // 测试1: 使用像素单位
  const text1 = new TextElement({
    text: 'Pixel Test - 48px',
    x: 960,
    y: 300,
    fontSize: 48,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    width: 1920,
    height: 100,
  });
  layer.addElement(text1);

  // 测试2: 使用百分比
  const text2 = new TextElement({
    text: 'Percent Test - 2%',
    x: '50%',
    y: '50%',
    fontSize: '2%',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
    width: '100%',
    height: '10%',
  });
  layer.addElement(text2);

  // 测试3: 使用rpx
  const text3 = new TextElement({
    text: 'Rpx Test - 40rpx',
    x: '50%',
    y: '70%',
    fontSize: '40rpx',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffff00',
    textAlign: 'center',
    width: '100%',
    height: '10%',
  });
  layer.addElement(text3);

  // 渲染一帧并保存为图片
  await composition.renderer.init();
  const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 1.0, composition.backgroundColor);
  
  const outputPath = path.join(__dirname, 'output', 'test-text-render.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 测试帧已保存: ${outputPath}`);
  console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);

  // 检查元素状态
  const state1 = text1.getStateAtTime(1.0, { width: 1920, height: 1080 });
  const state2 = text2.getStateAtTime(1.0, { width: 1920, height: 1080 });
  const state3 = text3.getStateAtTime(1.0, { width: 1920, height: 1080 });
  
  console.log('\n元素状态:');
  console.log('Text1 - x:', state1.x, 'y:', state1.y, 'fontSize:', state1.fontSize);
  console.log('Text2 - x:', state2.x, 'y:', state2.y, 'fontSize:', state2.fontSize);
  console.log('Text3 - x:', state3.x, 'y:', state3.y, 'fontSize:', state3.fontSize);

  composition.destroy();
}

testTextRender().catch(console.error);

