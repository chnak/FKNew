import { Composition, TextElement, KeyframeAnimation } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 文本动画示例
 */
async function textAnimation() {
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 8,
    backgroundColor: '#000000',
  });

  const layer = composition.createElementLayer();

  // 创建多个文本元素
  const texts = [
    { text: 'Welcome', y: 300 },
    { text: 'To', y: 400 },
    { text: 'Video', y: 500 },
    { text: 'Composition', y: 600 },
  ];

  texts.forEach((item, index) => {
    const textElement = new TextElement({
      text: item.text,
      x: 960,
      y: item.y,
      fontSize: 80,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      width: 1920,
      height: 100,
    });

    // 使用关键帧动画
    const keyframeAnim = new KeyframeAnimation({
      duration: 2,
      delay: index * 0.5,
      easing: 'ease-out',
    });

    keyframeAnim.addKeyframe(0, {
      opacity: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      rotation: -10,
    });

    keyframeAnim.addKeyframe(0.5, {
      opacity: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      rotation: 5,
    });

    keyframeAnim.addKeyframe(1, {
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    });

    textElement.addAnimation(keyframeAnim);
    layer.addElement(textElement);
  });

  const outputPath = path.join(__dirname, '../output/text-animation.mp4');
  console.log('开始导出文本动画视频...');
  await composition.export(outputPath);
  console.log(`视频导出完成: ${outputPath}`);

  composition.destroy();
}

textAnimation().catch(console.error);

