/**
 * 酷炫视频示例 - 使用上下文关联功能
 * 演示如何在平行渲染中使用上下文变量
 */
import { VideoBuilder, Component, withContext, autoContext } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createCoolVideoWithContext() {
  console.log('🎬 创建酷炫视频（使用上下文关联）...\n');

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 60,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // ========== 场景1: 使用上下文变量 ==========
  const scene1 = mainTrack.createScene({
    duration: 3,
    startTime: 0,
  });
  scene1.addBackground({ color: '#0a0a0a' });
  
  // 定义上下文变量
  const glowSpeed = 8;
  const glowAmplitude = 0.3;
  const glowBase = 0.7;
  
  // 方法1：使用 withContext（推荐）
  const onFrameWithContext = withContext((element, progress, time) => {
    // 现在可以直接使用上下文变量了！
    const glow = Math.sin(time * glowSpeed) * glowAmplitude + glowBase;
    if (element.config) {
      element.config.opacity = glow;
    }
  }, { glowSpeed, glowAmplitude, glowBase });
  
  // 方法2：使用 autoContext（更简洁，但需要函数包装）
  // const onFrameWithContext = autoContext((element, progress, time) => {
  //   const glow = Math.sin(time * glowSpeed) * glowAmplitude + glowBase;
  //   if (element.config) {
  //     element.config.opacity = glow;
  //   }
  // }, () => ({ glowSpeed, glowAmplitude, glowBase }));
  
  scene1.addText({
    text: 'FKbuilder',
    x: '50%',
    y: '40%',
    fontSize: 120,
    color: '#5acbed',
    textAlign: 'center',
    fontWeight: 'bold',
    startTime: 0,
    duration: 3,
    animations: ['zoomIn', 'fadeOut'],
    onFrame: onFrameWithContext, // 使用带上下文的函数
  });

  // ========== 场景2: 循环中使用上下文 ==========
  const scene2 = mainTrack.createScene({
    duration: 4,
    startTime: 3,
  });
  scene2.addBackground({ color: '#1a1a2e' });
  
  // 创建多个形状，每个都有自己的上下文
  const shapes = [
    { type: 'rect', color: '#5acbed', x: '25%', y: '30%', phase: 0 },
    { type: 'circle', color: '#208ab7', x: '50%', y: '30%', phase: 0.5 },
    { type: 'rect', color: '#cbe7e8', x: '75%', y: '30%', phase: 1.0 },
  ];
  
  shapes.forEach((shape, index) => {
    // 定义上下文变量
    const rotationSpeed = 3;
    const pulseSpeed = 4;
    const phaseOffset = shape.phase;
    const pulseAmplitude = 0.2;
    
    // 使用 withContext 自动关联上下文
    const onFrameShape = withContext((element, progress, time) => {
      element.rotation += rotationSpeed;
      const pulse = 1 + Math.sin(time * pulseSpeed + phaseOffset) * pulseAmplitude;
      if (element.config) {
        element.config.scaleX = pulse;
        element.config.scaleY = pulse;
      }
    }, { rotationSpeed, pulseSpeed, phaseOffset, pulseAmplitude });
    
    if (shape.type === 'rect') {
      scene2.addRect({
        x: shape.x,
        y: shape.y,
        width: 150,
        height: 150,
        fillColor: shape.color,
        strokeColor: '#ffffff',
        strokeWidth: 4,
        borderRadius: 20,
        startTime: index * 0.2,
        duration: 3.5 - index * 0.2,
        animations: ['zoomIn'],
        onFrame: onFrameShape, // 使用带上下文的函数
      });
    } else {
      scene2.addCircle({
        x: shape.x,
        y: shape.y,
        radius: 75,
        fillColor: shape.color,
        strokeColor: '#ffffff',
        strokeWidth: 4,
        startTime: index * 0.2,
        duration: 3.5 - index * 0.2,
        animations: ['zoomIn'],
        onFrame: onFrameShape, // 使用带上下文的函数
      });
    }
  });

  // ========== 场景3: 粒子效果使用上下文 ==========
  const scene3 = mainTrack.createScene({
    duration: 3,
    startTime: 7,
  });
  scene3.addBackground({ color: '#0d659d' });
  
  // 创建多个粒子，每个都有自己的随机上下文
  for (let i = 0; i < 20; i++) {
    // 定义上下文变量
    const rotationSpeed = 2;
    const scaleSpeed = 3;
    const phase = Math.random() * Math.PI * 2;
    const scaleAmplitude = 0.3;
    
    // 使用 withContext 自动关联上下文
    const onFrameParticle = withContext((element, progress, time) => {
      element.rotation += rotationSpeed;
      const scale = 1 + Math.sin(time * scaleSpeed + phase) * scaleAmplitude;
      if (element.config) {
        element.config.scaleX = scale;
        element.config.scaleY = scale;
      }
    }, { rotationSpeed, scaleSpeed, phase, scaleAmplitude });
    
    scene3.addCircle({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      radius: 5 + Math.random() * 15,
      fillColor: `rgba(90, 203, 237, ${0.3 + Math.random() * 0.4})`,
      startTime: Math.random() * 2,
      duration: 1 + Math.random() * 2,
      animations: ['fadeIn', 'fadeOut'],
      onFrame: onFrameParticle, // 使用带上下文的函数
    });
  }

  // 导出视频
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'cool-video-with-context.mp4');

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
  console.log(`\n💡 提示：使用 __context 属性可以在平行渲染中传递上下文变量！`);
}

createCoolVideoWithContext().catch(console.error);

