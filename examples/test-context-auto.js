/**
 * 测试自动上下文捕获功能
 */
import { VideoBuilder, withContext, smartContext } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testContextAuto() {
  console.log('🎬 测试自动上下文捕获功能\n');

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });
  const scene = mainTrack.createScene({
    duration: 3,
    startTime: 0,
  });
  scene.addBackground({ color: '#1a1a2e' });

  // 定义变量
  const rotationSpeed = 3;
  const pulseSpeed = 4;
  const phaseOffset = 0.5;
  const pulseAmplitude = 0.2;

  // 方法1：使用 withContext（推荐，最简洁）
  const onFrame1 = withContext((element, progress, time) => {
    element.rotation += rotationSpeed;
    const pulse = 1 + Math.sin(time * pulseSpeed + phaseOffset) * pulseAmplitude;
    if (element.config) {
      element.config.scaleX = pulse;
      element.config.scaleY = pulse;
    }
  }, { rotationSpeed, pulseSpeed, phaseOffset, pulseAmplitude });

  scene.addRect({
    x: '30%',
    y: '50%',
    width: 150,
    height: 150,
    fillColor: '#5acbed',
    startTime: 0,
    duration: 3,
    animations: ['zoomIn'],
    onFrame: onFrame1,
  });

  // 方法2：使用 smartContext（自动提取使用的变量）
  const onFrame2 = smartContext((element, progress, time) => {
    element.rotation += rotationSpeed;
    const pulse = 1 + Math.sin(time * pulseSpeed + phaseOffset) * pulseAmplitude;
    if (element.config) {
      element.config.scaleX = pulse;
      element.config.scaleY = pulse;
    }
  }, { rotationSpeed, pulseSpeed, phaseOffset, pulseAmplitude }); // 提供作用域

  scene.addRect({
    x: '70%',
    y: '50%',
    width: 150,
    height: 150,
    fillColor: '#208ab7',
    startTime: 0,
    duration: 3,
    animations: ['zoomIn'],
    onFrame: onFrame2,
  });

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'test-context-auto.mp4');

  console.log('开始渲染视频...\n');
  const startTime = Date.now();

  await builder.render(outputPath, {
    parallel: true,
    usePipe: true,
    maxWorkers: 4,
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log(`\n✅ 视频渲染完成！`);
  console.log(`输出文件: ${outputPath}`);
  console.log(`渲染耗时: ${duration} 秒`);
}

testContextAuto().catch(console.error);

