/**
 * 测试文本拆分动画
 * 详细测试 split 功能是否正常工作
 */
import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配色方案
const colors = {
  peach: '#fcdec3',
  pewter: '#e6e9e6',
  blueGrotto: '#208ab7',
  babyBlue: '#5acbed',
  babyBlueLight: '#cbe7e8',
  babyBlueLighter: '#dbf3f4',
  blueGrottoDark: '#0d659d',
  ebony: '#2e3b3c',
};

async function testTextSplitAnimation() {
  console.log('🧪 开始测试文本拆分动画...\n');

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '测试轨道' });

  // ========== 测试场景1：无动画的拆分文本（应该使用默认淡入）==========
  console.log('📝 测试场景1：无动画的拆分文本（默认淡入）...');
  const scene1 = mainTrack.createScene({
    duration: 5,
    startTime: 0,
  });

  scene1.addBackground({ color: colors.ebony });

  scene1.addText({
    text: '测试1：无动画',
    x: '50%',
    y: '20%',
    fontSize: 60,
    color: colors.pewter,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 10,
  });

  scene1.addText({
    text: 'FKbuilder',
    x: '50%',
    y: '40%',
    fontSize: 120,
    color: colors.babyBlue,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 9,
    split: 'letter',
    splitDelay: 0.1,
    splitDuration: 0.3,
    // 不指定 animations，应该使用默认淡入
  });

  // ========== 测试场景2：有 fadeIn 动画的拆分文本 ==========
  console.log('📝 测试场景2：有 fadeIn 动画的拆分文本...');
  const scene2 = mainTrack.createScene({
    duration: 5,
    startTime: 5 - 0.5, // 重叠0.5秒用于转场
  });

  mainTrack.addTransition({
    name: 'fade',
    duration: 0.5,
    startTime: 5 - 0.5,
  });

  scene2.addBackground({ color: colors.blueGrottoDark });

  scene2.addText({
    text: '测试2：fadeIn 动画',
    x: '50%',
    y: '20%',
    fontSize: 60,
    color: colors.pewter,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 10,
  });

  scene2.addText({
    text: 'FKbuilder',
    x: '50%',
    y: '40%',
    fontSize: 120,
    color: colors.babyBlue,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 9,
    split: 'letter',
    splitDelay: 0.1,
    splitDuration: 0.3,
    animations: [
      { type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.5 },
    ],
  });

  // ========== 测试场景3：有 transform 动画的拆分文本 ==========
  console.log('📝 测试场景3：有 transform 动画的拆分文本...');
  const scene3 = mainTrack.createScene({
    duration: 5,
    startTime: 10 - 0.5,
  });

  mainTrack.addTransition({
    name: 'fade',
    duration: 0.5,
    startTime: 10 - 0.5,
  });

  scene3.addBackground({ color: colors.ebony });

  scene3.addText({
    text: '测试3：transform 动画',
    x: '50%',
    y: '20%',
    fontSize: 60,
    color: colors.pewter,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 10,
  });

  scene3.addText({
    text: 'FKbuilder',
    x: '50%',
    y: '40%',
    fontSize: 120,
    color: colors.babyBlue,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 9,
    split: 'letter',
    splitDelay: 0.15,
    splitDuration: 0.5,
    animations: [
      { type: 'transform', fromScaleX: 0.3, fromScaleY: 0.3, toScaleX: 1, toScaleY: 1, duration: 0.8, easing: 'easeOut' },
    ],
  });

  // ========== 测试场景4：有 onFrame 的拆分文本 ==========
  console.log('📝 测试场景4：有 onFrame 的拆分文本...');
  const scene4 = mainTrack.createScene({
    duration: 5,
    startTime: 15 - 0.5,
  });

  mainTrack.addTransition({
    name: 'fade',
    duration: 0.5,
    startTime: 15 - 0.5,
  });

  scene4.addBackground({ color: colors.blueGrottoDark });

  scene4.addText({
    text: '测试4：onFrame 动画',
    x: '50%',
    y: '20%',
    fontSize: 60,
    color: colors.pewter,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 10,
  });

  scene4.addText({
    text: 'FKbuilder',
    x: '50%',
    y: '40%',
    fontSize: 120,
    color: colors.babyBlue,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 9,
    split: 'letter',
    splitDelay: 0.12,
    splitDuration: 0.5,
    animations: [
      { type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.5 },
    ],
    onFrame: (element, event, paperItem) => {
      if (!paperItem) return;
      const pivot = paperItem.position || paperItem.center;
      if (pivot && event.time > 2) {
        // 在所有字母出现后添加呼吸效果
        const breath = 1 + Math.sin((event.time - 2) * 1.5) * 0.04;
        const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
        paperItem.scale(breath / currentScale, pivot);
      }
    },
  });

  // ========== 测试场景5：word 拆分 ==========
  console.log('📝 测试场景5：word 拆分...');
  const scene5 = mainTrack.createScene({
    duration: 5,
    startTime: 20 - 0.5,
  });

  mainTrack.addTransition({
    name: 'fade',
    duration: 0.5,
    startTime: 20 - 0.5,
  });

  scene5.addBackground({ color: colors.ebony });

  scene5.addText({
    text: '测试5：word 拆分',
    x: '50%',
    y: '20%',
    fontSize: 60,
    color: colors.pewter,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 10,
  });

  scene5.addText({
    text: 'Hello World',
    x: '50%',
    y: '40%',
    fontSize: 100,
    color: colors.babyBlue,
    fontFamily: '微软雅黑',
    fontWeight: 'bold',
    textAlign: 'center',
    anchor: [0.5, 0.5],
    duration: 5,
    startTime: 0,
    zIndex: 9,
    split: 'word',
    splitDelay: 0.2,
    splitDuration: 0.4,
    animations: [
      { type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.5 },
    ],
  });

  // ========== 导出视频 ==========
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'test-text-split-animation.mp4');

  try {
    console.log('\n🎬 开始渲染测试视频...');
    console.log(`总时长: 25 秒`);
    console.log(`总帧数: ${Math.ceil(25 * 30)} 帧\n`);
    
    const resultPath = await builder.render(outputPath);
    
    console.log('\n✅ 测试视频渲染完成！');
    console.log(`📁 输出文件: ${resultPath}`);
    console.log(`⏱️  视频时长: 25 秒`);
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
    throw error;
  }
}

// 执行
testTextSplitAnimation().catch(console.error);

