/**
 * 测试单帧渲染
 */
import { Composition, TextElement, RectElement, FadeAnimation } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testRenderFrame() {
  console.log('测试单帧渲染...\n');

  try {
    const composition = new Composition({
      width: 1280,
      height: 720,
      fps: 30,
      duration: 3,
      backgroundColor: '#1a1a1a',
    });

    const layer = composition.createElementLayer();

    // 创建文本元素
    const textElement = new TextElement({
      text: 'Hello, Video!',
      x: 640,
      y: 300,
      fontSize: 64,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      width: 1280,
      height: 100,
    });

    const fadeIn = new FadeAnimation({
      duration: 1.5,
      delay: 0,
      fromOpacity: 0,
      toOpacity: 1,
    });
    textElement.addAnimation(fadeIn);
    layer.addElement(textElement);

    // 创建矩形元素
    const rectElement = new RectElement({
      x: 640,
      y: 450,
      width: 300,
      height: 150,
      bgcolor: '#4a90e2',
      borderRadius: 15,
    });
    layer.addElement(rectElement);

    // 渲染一帧
    console.log('渲染时间 1.0 秒的帧...');
    await composition.renderer.init();
    const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 1.0);
    
    // 保存为图片
    const outputPath = path.join(__dirname, 'output', 'test-frame.png');
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(outputPath, buffer);
    
    console.log(`✓ 帧已保存: ${outputPath}`);
    console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);

    composition.destroy();
  } catch (error) {
    console.error('❌ 渲染失败:', error);
    console.error(error.stack);
  }
}

testRenderFrame();

