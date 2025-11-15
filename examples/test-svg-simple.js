/**
 * SVG 元素简单测试
 */
import { VideoBuilder } from '../src/index.js';
import { registerFontFile } from '../src/utils/font-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 注册字体
const fontPath = 'D:/code/foliko-trade/public/fonts/MicrosoftYaHei-Bold-01.ttf';
try {
  registerFontFile(fontPath, 'MicrosoftYaHei');
} catch (error) {
  console.warn('字体注册失败，将使用默认字体:', error.message);
}

async function testSVG() {
  console.log('🎨 测试 SVG 元素...\n');

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });

  // 创建场景
  const scene = mainTrack.createScene({
    duration: 5,
    startTime: 0,
  })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: 'SVG 测试',
      color: '#ffffff',
      fontSize: 72,
      x: '50%',
      y: '15%',
      textAlign: 'center',
      duration: 5,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    });

  // 星形 SVG
  const starSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <polygon points="100,10 120,70 180,70 135,110 155,170 100,135 45,170 65,110 20,70 80,70" 
               fill="#4ecdc4" 
               stroke="#ffffff" 
               stroke-width="3"/>
    </svg>
  `;

  console.log('添加星形 SVG...');
  scene.addSVG({
    svgString: starSVG,
    x: '30%',
    y: '50%',
    width: 300,
    height: 300,
    anchor: [0.5, 0.5],
    fit: 'contain',
    duration: 5,
    startTime: 0.5,
    onFrame: (element, event, paperItem) => {
      if (!paperItem) return;
      const relativeTime = event.time - element.startTime;
      const rotationSpeed = 90; // 度/秒
      const rotation = (relativeTime * rotationSpeed) % 360;
      paperItem.rotation = rotation;
    },
    animations: ['fadeIn', 'zoomIn'],
  });

  // 心形 SVG
  const heartSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <path d="M100,180 C100,180 20,120 20,80 C20,50 40,30 70,30 C85,30 100,40 100,55 C100,40 115,30 130,30 C160,30 180,50 180,80 C180,120 100,180 100,180 Z" 
            fill="#ff6b6b" 
            stroke="#ffffff" 
            stroke-width="2"/>
    </svg>
  `;

  console.log('添加心形 SVG...');
  scene.addSVG({
    svgString: heartSVG,
    x: '70%',
    y: '50%',
    width: 300,
    height: 300,
    anchor: [0.5, 0.5],
    fit: 'contain',
    duration: 5,
    startTime: 1,
    onFrame: (element, event, paperItem) => {
      if (!paperItem) return;
      const relativeTime = event.time - element.startTime;
      const pivot = paperItem.position || paperItem.center;
      if (pivot) {
        // 心跳效果
        const pulseSpeed = 2;
        const pulsePhase = relativeTime * pulseSpeed * 2 * Math.PI;
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.15;
        const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
        paperItem.scale(pulseScale / currentScale, pivot);
      }
    },
    animations: ['fadeIn'],
  });

  // 圆形 SVG
  const circleSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="80" 
              fill="#ffe66d" 
              stroke="#ffffff" 
              stroke-width="5"/>
      <circle cx="100" cy="100" r="50" 
              fill="#4ecdc4" 
              stroke="#ffffff" 
              stroke-width="3"/>
    </svg>
  `;

  console.log('添加圆形 SVG...');
  scene.addSVG({
    svgString: circleSVG,
    x: '50%',
    y: '75%',
    width: 200,
    height: 200,
    anchor: [0.5, 0.5],
    fit: 'contain',
    duration: 5,
    startTime: 1.5,
    animations: ['fadeIn'],
  });

  // 导出视频
  const outputPath = path.join(__dirname, '../output/test-svg-simple.mp4');
  console.log('\n🎬 开始导出视频...');
  console.log(`输出路径: ${outputPath}\n`);

  await builder.export(outputPath, {
    usePipe: true,
  });

  console.log('\n✅ SVG 测试完成！');
  console.log(`📁 输出文件: ${outputPath}`);
}

testSVG().catch(console.error);

