/**
 * 组件功能简单测试 - 用于调试
 */
import { VideoBuilder, Component } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testComponentSimple() {
  console.log('🎬 组件功能简单测试\n');

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  // 创建一个简单的组件
  const simpleComponent = new Component({
    name: 'Simple',
    width: 400,
    height: 300,
    x: '50%',      // 画布中心
    y: '50%',      // 画布中心
    anchor: [0.5, 0.5],
    startTime: 0,
    duration: 3,
    zIndex: 10,
  });

  // 在组件内添加元素
  simpleComponent
    .addBackground({ color: '#ff0000' }) // 红色背景，便于识别
    .addText({
      text: '组件测试',
      x: '50%',
      y: '50%',
      fontSize: 60,
      color: '#ffffff',
      textAlign: 'center',
      startTime: 0,
      duration: 3,
      animations: ['fadeIn'],
    });

  // 创建主轨道
  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 场景1：使用组件
  const scene1 = mainTrack.createScene({
    duration: 3,
    startTime: 0,
  });
  scene1.addBackground({ color: '#000000' }); // 黑色背景
  scene1.addComponent(simpleComponent);

  // 场景2：再次使用组件（测试复用）
  const scene2 = mainTrack.createScene({
    duration: 3,
    startTime: 3,
  });
  scene2.addBackground({ color: '#0000ff' }); // 蓝色背景
  scene2.addComponent(simpleComponent); // 复用同一个组件

  // 导出视频
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'test-component-simple.mp4');

  console.log('开始渲染视频...\n');
  const startTime = Date.now();

  await builder.render(outputPath, {
    parallel: false,
    usePipe: true,
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ 视频渲染完成！`);
  console.log(`输出文件: ${outputPath}`);
  console.log(`渲染耗时: ${duration} 秒`);
}

testComponentSimple().catch(console.error);

