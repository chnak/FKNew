/**
 * 测试动画 delay 功能（包括负数 delay）
 */
import { VideoMaker } from '../src/index.js';
import { TextElement } from '../src/elements/TextElement.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAnimationDelay() {
  console.log('创建动画 delay 测试...\n');

  const videoMaker = new VideoMaker({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 10,
    backgroundColor: '#1a1a1a',
  });

  const layer = videoMaker.createElementLayer();

  // 测试 1: 正数 delay（延迟开始）
  const text1 = new TextElement({
    text: '延迟 1 秒淡入',
    x: '50%',
    y: '25%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
    duration: 5,
    startTime: 0,
    animations: [
      {
        type: 'fade',
        delay: 1, // 延迟 1 秒开始
        duration: 1,
        fromOpacity: 0,
        toOpacity: 1,
        easing: 'easeOutQuad',
      },
    ],
  });
  layer.addElement(text1);

  // 测试 2: 负数 delay（在元素结束前开始）
  const text2 = new TextElement({
    text: '结束前 1 秒淡出',
    x: '50%',
    y: '50%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#4ecdc4',
    textAlign: 'center',
    duration: 5,
    startTime: 0,
    animations: [
      {
        type: 'fade',
        delay: -1, // 在元素结束前 1 秒开始
        duration: 1,
        fromOpacity: 1,
        toOpacity: 0,
        easing: 'easeInQuad',
      },
    ],
  });
  layer.addElement(text2);

  // 测试 3: 组合动画（开始淡入，结束淡出）
  const text3 = new TextElement({
    text: '淡入 + 淡出',
    x: '50%',
    y: '75%',
    fontSize: 64,
    fontFamily: 'PatuaOne',
    color: '#f39c12',
    textAlign: 'center',
    duration: 5,
    startTime: 0,
    animations: [
      {
        type: 'fade',
        delay: 0, // 立即开始淡入
        duration: 1,
        fromOpacity: 0,
        toOpacity: 1,
        easing: 'easeOutQuad',
      },
      {
        type: 'fade',
        delay: -1, // 结束前 1 秒开始淡出
        duration: 1,
        fromOpacity: 1,
        toOpacity: 0,
        easing: 'easeInQuad',
      },
    ],
  });
  layer.addElement(text3);

  const outputPath = path.join(__dirname, '../output/test-animation-delay.mp4');
  console.log('开始导出视频...');
  console.log(`总时长: ${videoMaker.duration} 秒`);
  
  await videoMaker.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  videoMaker.destroy();
}

testAnimationDelay().catch(console.error);

