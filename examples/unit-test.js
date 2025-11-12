/**
 * 单位支持测试示例
 */
import { Composition, TextElement, RectElement, FadeAnimation } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUnits() {
  console.log('测试单位支持...\n');

  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 3,
    backgroundColor: '#1a1a1a',
  });

  const layer = composition.createElementLayer();

  // 测试各种单位
  console.log('创建使用不同单位的元素...');

  // 使用百分比定位和尺寸
  const text1 = new TextElement({
    text: '50% x, 50% y (中心)',
    x: '50%',
    y: '40%',
    width: '100%',
    fontSize: 64, // 使用像素单位，确保可见
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  });
  layer.addElement(text1);

  // 使用vw/vh单位
  const text2 = new TextElement({
    text: '10vw from left, 20vh from top',
    x: '10vw',
    y: '20vh',
    fontSize: '3vw', // 3vw = 3% of viewport width (约57.6px)
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'left',
  });
  layer.addElement(text2);

  // 使用rpx单位（响应式像素）
  const text3 = new TextElement({
    text: 'rpx字体大小测试 - 40rpx',
    x: '50%',
    y: '60%',
    fontSize: '40rpx', // 750rpx = 100% width (约102.4px)
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffff00',
    textAlign: 'center',
  });
  layer.addElement(text3);

  // 使用vmin/vmax单位
  const rect1 = new RectElement({
    x: '50%',
    y: '80%',
    width: '30vmin',
    height: '5vmin',
    bgcolor: '#ff0000',
    borderRadius: 5,
    anchor: [0.5, 0.5],
  });
  layer.addElement(rect1);

  // 混合使用px和百分比
  const rect2 = new RectElement({
    x: '10vw',
    y: '10vh',
    width: 200, // px
    height: '10vh',
    bgcolor: '#0000ff',
    borderRadius: 10,
  });
  layer.addElement(rect2);

  // 添加淡入动画
  const fadeIn = new FadeAnimation({
    duration: 1,
    fromOpacity: 0,
    toOpacity: 1,
  });
  text1.addAnimation(fadeIn);

  // 导出视频
  const outputPath = path.join(__dirname, '../output/unit-test.mp4');
  console.log('\n开始导出视频...');
  await composition.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  composition.destroy();
}

testUnits().catch(console.error);

