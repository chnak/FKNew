/**
 * CompositionElement 直接添加元素示例
 */
import { Composition, CompositionElement } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function compositionElementElementsExample() {
  console.log('CompositionElement 直接添加元素示例...\n');

  // 创建主合成
  const mainComposition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });

  const mainLayer = mainComposition.createElementLayer();

  // 创建嵌套合成元素
  const nestedComposition = new CompositionElement({
    x: 960,
    y: 540,
    width: 800,
    height: 600,
    anchor: [0.5, 0.5],
    compositionConfig: {
      width: 800,
      height: 600,
      fps: 30,
      duration: 5,
      backgroundColor: 'transparent',
    },
  });

  // 直接在嵌套合成中添加元素（链式调用）
  nestedComposition
    .addRect({
      x: 400,
      y: 300,
      width: 800,
      height: 600,
      bgcolor: '#2c3e50',
      borderRadius: 20,
      anchor: [0.5, 0.5],
    })
    .addText({
      text: '嵌套合成标题',
      x: 400,
      y: 200,
      fontSize: 48,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addText({
      text: '这是嵌套合成中的内容',
      x: 400,
      y: 300,
      fontSize: 36,
      fontFamily: 'PatuaOne',
      color: '#3498db',
      textAlign: 'center',
    })
    .addCircle({
      x: 400,
      y: 450,
      radius: 60,
      bgcolor: '#e74c3c',
      anchor: [0.5, 0.5],
    });

  // 也可以单独添加
  nestedComposition.addText({
    text: '底部文本',
    x: 400,
    y: 550,
    fontSize: 28,
    fontFamily: 'PatuaOne',
    color: '#f39c12',
    textAlign: 'center',
  });

  // 将嵌套合成添加到主合成
  mainLayer.addElement(nestedComposition);

  // 主合成中也添加一些元素
  mainLayer.addElement(new (await import('../src/elements/TextElement.js')).TextElement({
    text: '主合成文本',
    x: 960,
    y: 100,
    fontSize: 40,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
  }));

  console.log(`嵌套合成元素数量: ${nestedComposition.getElements().length}`);
  console.log('开始导出视频...');

  // 导出视频
  const outputPath = path.join(__dirname, '../output/composition-element-elements-example.mp4');
  await mainComposition.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  mainComposition.destroy();
}

compositionElementElementsExample().catch(console.error);

