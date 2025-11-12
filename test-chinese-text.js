/**
 * 测试中文文本渲染
 */
import { Composition, TextElement } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testChineseText() {
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 2,
    backgroundColor: '#1a1a1a',
  });

  const layer = composition.createElementLayer();

  // 测试中文文本
  const text1 = new TextElement({
    text: '你好，世界！',
    x: '50%',
    y: '40%',
    fontSize: 72,
    fontFamily: 'PatuaOne', // 使用注册的字体名称
    fontWeight: 'normal',
    color: '#ffffff',
    textAlign: 'center',
  });
  layer.addElement(text1);

  // 测试中英文混合
  const text2 = new TextElement({
    text: 'Hello 世界！Video 视频制作',
    x: '50%',
    y: '60%',
    fontSize: 64,
    fontFamily: 'PatuaOne', // 使用注册的字体名称
    fontWeight: 'normal',
    color: '#00ff00',
    textAlign: 'center',
  });
  layer.addElement(text2);

  // 测试使用默认字体（不指定fontFamily）
  const text3 = new TextElement({
    text: '默认字体测试 - 中文显示',
    x: '50%',
    y: '80%',
    fontSize: 48,
    color: '#ffff00',
    textAlign: 'center',
  });
  layer.addElement(text3);

  // 渲染一帧并保存为图片
  await composition.renderer.init();
  const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 1.0, composition.backgroundColor);
  
  const outputPath = path.join(__dirname, 'output', 'test-chinese-text.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 中文文本测试帧已保存: ${outputPath}`);
  console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);

  // 导出视频
  const videoPath = path.join(__dirname, 'output', 'test-chinese-text.mp4');
  console.log('\n开始导出视频...');
  await composition.export(videoPath);
  console.log(`✅ 视频导出完成: ${videoPath}`);

  composition.destroy();
}

testChineseText().catch(console.error);

