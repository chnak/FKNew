/**
 * 调试渲染问题
 */
import { Composition, TextElement, RectElement } from './src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testRenderDebug() {
  console.log('调试渲染...\n');

  try {
    const composition = new Composition({
      width: 800,
      height: 600,
      fps: 30,
      duration: 3,
      backgroundColor: '#ff0000', // 红色背景，容易看到
    });

    console.log('合成创建，背景色:', composition.backgroundColor);

    const layer = composition.createElementLayer();

    // 创建文本元素
    const textElement = new TextElement({
      text: 'TEST TEXT',
      x: 400,
      y: 300,
      fontSize: 48,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      width: 800,
      height: 100,
    });
    layer.addElement(textElement);

    // 创建矩形元素
    const rectElement = new RectElement({
      x: 300,
      y: 400,
      width: 200,
      height: 100,
      bgcolor: '#00ff00', // 绿色矩形
      borderRadius: 10,
    });
    layer.addElement(rectElement);

    // 初始化渲染器
    await composition.renderer.init();
    console.log('渲染器初始化完成');
    console.log('Canvas:', composition.renderer.canvas ? '存在' : '不存在');
    console.log('Scene:', composition.renderer.scene ? '存在' : '不存在');
    console.log('Layer:', composition.renderer.layer ? '存在' : '不存在');

    // 手动绘制背景
    const ctx = composition.renderer.canvas.getContext('2d');
    ctx.fillStyle = composition.backgroundColor;
    ctx.fillRect(0, 0, 800, 600);
    console.log('手动绘制背景完成');

    // 渲染一帧
    console.log('\n渲染时间 1.0 秒的帧...');
    const canvas = await composition.renderer.renderFrame(composition.timeline.getLayers(), 1.0);
    
    // 再次手动绘制背景（确保背景存在）
    const ctx2 = canvas.getContext('2d');
    ctx2.fillStyle = composition.backgroundColor;
    ctx2.fillRect(0, 0, 800, 600);
    
    // 保存为图片
    const outputPath = path.join(__dirname, 'output', 'test-debug.png');
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

testRenderDebug();

