/**
 * Composition 直接添加元素示例
 */
import { Composition } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compositionElementsExample() {
  console.log('Composition 直接添加元素示例...\n');

  // 创建合成
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });

  // 直接添加元素（链式调用）
  composition
    .addText({
      text: '标题文本',
      x: '50%',
      y: '30%',
      fontSize: 72,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addRect({
      x: '50%',
      y: '50%',
      width: 600,
      height: 300,
      bgcolor: '#3498db',
      borderRadius: 20,
      anchor: [0.5, 0.5],
    })
    .addText({
      text: '内容文本',
      x: '50%',
      y: '50%',
      fontSize: 48,
      fontFamily: 'PatuaOne',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addCircle({
      x: '50%',
      y: '75%',
      radius: 80,
      bgcolor: '#e74c3c',
      anchor: [0.5, 0.5],
    });

  // 也可以单独添加
  composition.addText({
    text: '底部文本',
    x: '50%',
    y: '90%',
    fontSize: 36,
    fontFamily: 'PatuaOne',
    color: '#f39c12',
    textAlign: 'center',
  });

  console.log(`元素数量: ${composition.getElements().length}`);
  console.log('开始导出视频...');

  // 导出视频
  const outputPath = path.join(__dirname, '../output/composition-elements-example.mp4');
  await composition.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  composition.destroy();
}

compositionElementsExample().catch(console.error);

