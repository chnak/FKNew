/**
 * 测试元素和Composition的时间控制
 */
import { Composition, TextElement, RectElement } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testElementTime() {
  console.log('测试元素和Composition的时间控制...\n');

  // 创建合成
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 10, // 总时长10秒
    backgroundColor: '#1a1a1a',
  });

  const layer = composition.createElementLayer();

  // 元素1：0-3秒显示
  const text1 = new TextElement({
    text: '0-3秒显示',
    x: '50%',
    y: '30%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
    startTime: 0,
    duration: 3, // 或者使用 endTime: 3
  });
  layer.addElement(text1);

  // 元素2：2-5秒显示（与元素1有重叠）
  const text2 = new TextElement({
    text: '2-5秒显示',
    x: '50%',
    y: '50%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#00ff00',
    textAlign: 'center',
    startTime: 2,
    endTime: 5,
  });
  layer.addElement(text2);

  // 元素3：5-8秒显示
  const rect1 = new RectElement({
    x: '50%',
    y: '70%',
    width: 400,
    height: 200,
    bgcolor: '#3498db',
    borderRadius: 10,
    anchor: [0.5, 0.5],
    startTime: 5,
    duration: 3,
  });
  layer.addElement(rect1);

  // 元素4：8-10秒显示
  const text3 = new TextElement({
    text: '8-10秒显示',
    x: '50%',
    y: '50%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#ff00ff',
    textAlign: 'center',
    startTime: 8,
    endTime: 10,
  });
  layer.addElement(text3);

  // 测试不同时间点的渲染
  console.log('测试不同时间点的元素可见性:');
  const testTimes = [0, 1, 2.5, 4, 6, 9, 10];
  for (const time of testTimes) {
    const visibleElements = [];
    if (text1.isActiveAtTime(time)) visibleElements.push('text1');
    if (text2.isActiveAtTime(time)) visibleElements.push('text2');
    if (rect1.isActiveAtTime(time)) visibleElements.push('rect1');
    if (text3.isActiveAtTime(time)) visibleElements.push('text3');
    console.log(`  时间 ${time}s: ${visibleElements.join(', ') || '无'}`);
  }

  // 渲染一帧测试（在2.5秒，应该看到text1和text2）
  console.log('\n渲染2.5秒的帧...');
  await composition.renderer.init();
  const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 2.5, composition.backgroundColor);
  
  const outputPath = path.join(__dirname, '../output/test-element-time.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  console.log(`✓ 测试帧已保存: ${outputPath}`);

  // 导出完整视频
  const videoPath = path.join(__dirname, '../output/test-element-time.mp4');
  console.log('\n导出完整视频...');
  await composition.export(videoPath);
  console.log(`✅ 视频导出完成: ${videoPath}`);

  composition.destroy();
}

testElementTime().catch(console.error);

