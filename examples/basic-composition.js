import { Composition, TextElement, RectElement, FadeAnimation, MoveAnimation } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 基础合成示例
 */
async function basicComposition() {
  // 创建合成
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });

  // 创建元素图层
  const layer = composition.createElementLayer();

  // 创建文本元素
  const textElement = new TextElement({
    text: 'Hello, Video Composition!',
    x: 960,
    y: 400,
    fontSize: 72,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    width: 1920,
    height: 100,
  });

  // 添加淡入动画
  const fadeIn = new FadeAnimation({
    duration: 1,
    delay: 0,
    fromOpacity: 0,
    toOpacity: 1,
    easing: 'ease-out',
  });
  textElement.addAnimation(fadeIn);

  // 添加移动动画
  const moveUp = new MoveAnimation({
    duration: 2,
    delay: 1,
    fromX: 960,
    fromY: 400,
    toX: 960,
    toY: 300,
    easing: 'ease-in-out',
  });
  textElement.addAnimation(moveUp);

  layer.addElement(textElement);

  // 创建矩形元素
  const rectElement = new RectElement({
    x: 960,
    y: 600,
    width: 400,
    height: 200,
    bgcolor: '#4a90e2',
    borderRadius: 20,
  });

  // 添加淡入和缩放动画
  const rectFadeIn = new FadeAnimation({
    duration: 1.5,
    delay: 0.5,
    fromOpacity: 0,
    toOpacity: 1,
  });
  rectElement.addAnimation(rectFadeIn);

  layer.addElement(rectElement);

  // 导出视频
  const outputPath = path.join(__dirname, '../output/basic-composition.mp4');
  console.log('开始导出视频...');
  await composition.export(outputPath);
  console.log(`视频导出完成: ${outputPath}`);

  // 清理
  composition.destroy();
}

// 运行示例
basicComposition().catch(console.error);

