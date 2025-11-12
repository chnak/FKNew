/**
 * 测试视频导出功能
 */
import { Composition, TextElement, RectElement, FadeAnimation } from './src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testExport() {
  console.log('开始测试视频导出...\n');

  try {
    // 创建合成（使用较小的尺寸和较短的时长以加快测试）
    const composition = new Composition({
      width: 1280,
      height: 720,
      fps: 24, // 降低帧率以加快渲染
      duration: 3, // 3秒视频
      backgroundColor: '#1a1a1a',
    });

    console.log('✓ 合成创建成功');
    console.log(`  尺寸: ${composition.width}x${composition.height}`);
    console.log(`  帧率: ${composition.fps} fps`);
    console.log(`  时长: ${composition.duration} 秒\n`);

    // 创建元素图层
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

    // 添加淡入动画
    const fadeIn = new FadeAnimation({
      duration: 1.5,
      delay: 0,
      fromOpacity: 0,
      toOpacity: 1,
      easing: 'ease-out',
    });
    textElement.addAnimation(fadeIn);

    layer.addElement(textElement);
    console.log('✓ 文本元素创建并添加动画\n');

    // 创建矩形元素
    const rectElement = new RectElement({
      x: 640,
      y: 450,
      width: 300,
      height: 150,
      bgcolor: '#4a90e2',
      borderRadius: 15,
    });

    const rectFadeIn = new FadeAnimation({
      duration: 1.5,
      delay: 0.5,
      fromOpacity: 0,
      toOpacity: 1,
    });
    rectElement.addAnimation(rectFadeIn);

    layer.addElement(rectElement);
    console.log('✓ 矩形元素创建并添加动画\n');

    // 导出视频
    const outputPath = path.join(__dirname, 'output', 'test-export.mp4');
    console.log('开始导出视频...');
    console.log(`输出路径: ${outputPath}\n`);
    
    const startTime = Date.now();
    await composition.export(outputPath);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`\n✅ 视频导出成功！`);
    console.log(`  文件: ${outputPath}`);
    console.log(`  耗时: ${duration} 秒`);

    // 清理
    composition.destroy();

  } catch (error) {
    console.error('\n❌ 导出失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testExport();

