/**
 * 调试元素位置
 */
import { Composition, TextElement, RectElement } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPosition() {
  const composition = new Composition({
    width: 800,
    height: 600,
    fps: 30,
    duration: 1,
    backgroundColor: '#1a1a1a',
  });

  const layer = composition.createElementLayer();

  // 创建文本元素 - 明确设置位置和锚点
  const textElement = new TextElement({
    text: 'Hello, Video!',
    x: 400,  // 中心
    y: 300,  // 中心
    fontSize: 48,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    width: 800,
    height: 100,
    anchor: [0.5, 0.5], // 中心锚点
  });
  layer.addElement(textElement);

  // 创建矩形元素 - 明确设置位置和锚点
  const rectElement = new RectElement({
    x: 400,  // 中心
    y: 450,  // 中心偏下
    width: 300,
    height: 150,
    bgcolor: '#4a90e2',
    borderRadius: 15,
    anchor: [0.5, 0.5], // 中心锚点
  });
  layer.addElement(rectElement);

  // 创建一个在左上角的矩形用于测试
  const testRect = new RectElement({
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    bgcolor: '#ff0000',
    anchor: [0, 0], // 左上角锚点
  });
  layer.addElement(testRect);

  // 渲染一帧
  await composition.renderer.init();
  const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 0.5, composition.backgroundColor);
  
  // 保存
  const outputPath = path.join(__dirname, 'output', 'test-position.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 测试帧已保存: ${outputPath}`);
  console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);
  
  // 检查元素状态
  const textState = textElement.getStateAtTime(0.5);
  const rectState = rectElement.getStateAtTime(0.5);
  console.log('\n元素状态:');
  console.log('文本位置:', textState.x, textState.y, '锚点:', textState.anchor);
  console.log('矩形位置:', rectState.x, rectState.y, '锚点:', rectState.anchor);
}

testPosition().catch(console.error);

