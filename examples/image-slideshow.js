import { Composition, ImageElement, FadeAnimation, TransformAnimation } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 图片幻灯片示例
 */
async function imageSlideshow() {
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 10,
    backgroundColor: '#000000',
  });

  const layer = composition.createElementLayer();

  // 示例图片路径（需要替换为实际图片路径）
  const imagePaths = [
    // 'path/to/image1.jpg',
    // 'path/to/image2.jpg',
    // 'path/to/image3.jpg',
  ];

  // 如果没有图片，创建一个占位符
  if (imagePaths.length === 0) {
    console.log('请提供图片路径');
    return;
  }

  imagePaths.forEach((imagePath, index) => {
    const imageElement = new ImageElement({
      src: imagePath,
      x: 960,
      y: 540,
      width: 1600,
      height: 900,
      fit: 'cover',
    });

    // 加载图片
    imageElement.load().then(() => {
      // 淡入动画
      const fadeIn = new FadeAnimation({
        duration: 1,
        delay: index * 3,
        fromOpacity: 0,
        toOpacity: 1,
      });

      // 缩放动画
      const zoomIn = new TransformAnimation({
        duration: 3,
        delay: index * 3,
        from: { scaleX: 1.2, scaleY: 1.2 },
        to: { scaleX: 1, scaleY: 1 },
        easing: 'ease-out',
      });

      imageElement.addAnimation(fadeIn);
      imageElement.addAnimation(zoomIn);

      // 淡出动画
      const fadeOut = new FadeAnimation({
        duration: 1,
        delay: index * 3 + 2,
        fromOpacity: 1,
        toOpacity: 0,
      });
      imageElement.addAnimation(fadeOut);
    });

    layer.addElement(imageElement);
  });

  const outputPath = path.join(__dirname, '../output/image-slideshow.mp4');
  console.log('开始导出图片幻灯片视频...');
  await composition.export(outputPath);
  console.log(`视频导出完成: ${outputPath}`);

  composition.destroy();
}

imageSlideshow().catch(console.error);

