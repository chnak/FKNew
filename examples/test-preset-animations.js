/**
 * 测试预设动画功能
 */
import { VideoMaker } from '../src/index.js';
import { TextElement } from '../src/elements/TextElement.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPresetAnimations() {
  console.log('创建预设动画测试...\n');

  const videoMaker = new VideoMaker({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 10,
    backgroundColor: '#1a1a1a',
  });

  const layer = videoMaker.createElementLayer();

  // 测试 1: 字符串形式的预设动画
  const text1 = new TextElement({
    text: '字符串预设动画',
    x: '50%',
    y: '20%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
    duration: 3,
    startTime: 0,
    animations: ['fadeIn', 'fadeOut'], // 字符串形式
  });
  layer.addElement(text1);

  // 测试 2: 对象形式的预设动画（覆盖默认参数）
  const text2 = new TextElement({
    text: '对象预设动画',
    x: '50%',
    y: '40%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#4ecdc4',
    textAlign: 'center',
    duration: 3,
    startTime: 1,
    animations: [
      { type: 'fadeIn', duration: 0.5, delay: 0 }, // 覆盖默认 duration
      { type: 'fadeOut', duration: 0.5, delay: -0.5 }, // 覆盖默认 delay
    ],
  });
  layer.addElement(text2);

  // 测试 3: 滑入滑出
  const text3 = new TextElement({
    text: '滑入滑出',
    x: '50%',
    y: '60%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#f39c12',
    textAlign: 'center',
    duration: 3,
    startTime: 2,
    animations: ['slideInLeft', 'slideOutRight'],
  });
  layer.addElement(text3);

  // 测试 4: 缩放动画
  const text4 = new TextElement({
    text: '缩放动画',
    x: '50%',
    y: '80%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#e74c3c',
    textAlign: 'center',
    duration: 3,
    startTime: 3,
    animations: ['zoomIn', 'zoomOut'],
  });
  layer.addElement(text4);

  // 测试 5: 组合预设动画
  const text5 = new TextElement({
    text: '组合动画',
    x: '50%',
    y: '50%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#9b59b6',
    textAlign: 'center',
    duration: 5,
    startTime: 4,
    animations: [
      'fadeInUp',
      { type: 'fadeOutDown', duration: 1, delay: -1 },
    ],
  });
  layer.addElement(text5);

  const outputPath = path.join(__dirname, '../output/test-preset-animations.mp4');
  console.log('开始导出视频...');
  console.log(`总时长: ${videoMaker.duration} 秒`);
  
  await videoMaker.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  videoMaker.destroy();
}

testPresetAnimations().catch(console.error);

