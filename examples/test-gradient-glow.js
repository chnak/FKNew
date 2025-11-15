/**
 * 测试文本渐变和发光效果
 */
import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGradientGlow() {
  console.log('🌈 测试文本渐变和发光效果...\n');

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 场景1: 渐变效果测试
  console.log('📝 场景1: 渐变效果...');
  const scene1 = mainTrack.createScene({ duration: 4, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '水平渐变',
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      gradient: true,
      gradientColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      gradientDirection: 'horizontal',
    })
    .addText({
      text: '垂直渐变',
      fontSize: 100,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      delay: 0.5,
      gradient: true,
      gradientColors: ['#FFD700', '#FF6B6B', '#9B59B6'],
      gradientDirection: 'vertical',
    })
    .addText({
      text: '对角线渐变',
      fontSize: 100,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      delay: 1,
      gradient: true,
      gradientColors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      gradientDirection: 'diagonal',
    });

  // 场景2: 发光效果测试
  console.log('✨ 场景2: 发光效果...');
  const scene2 = mainTrack.createScene({ duration: 4, startTime: 4 })
    .addBackground({ color: '#0a0a0a' })
    .addText({
      text: '金色发光',
      color: '#FFD700',
      fontSize: 120,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      textGlow: true,
      textGlowColor: '#FFD700',
      textGlowBlur: 30,
      textGlowIntensity: 1,
    })
    .addText({
      text: '蓝色发光',
      color: '#4ECDC4',
      fontSize: 120,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      delay: 0.5,
      textGlow: true,
      textGlowColor: '#4ECDC4',
      textGlowBlur: 40,
      textGlowIntensity: 0.8,
    })
    .addText({
      text: '红色发光',
      color: '#FF6B6B',
      fontSize: 120,
      x: '50%',
      y: '70%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      delay: 1,
      textGlow: true,
      textGlowColor: '#FF6B6B',
      textGlowBlur: 50,
      textGlowIntensity: 1.2,
    });

  // 场景3: 渐变+发光组合
  console.log('🎨 场景3: 渐变+发光组合...');
  const scene3 = mainTrack.createScene({ duration: 4, startTime: 8 })
    .addBackground({ color: '#2d3436' })
    .addText({
      text: '渐变+发光',
      fontSize: 120,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['bigIn'],
      gradient: true,
      gradientColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      gradientDirection: 'horizontal',
      textGlow: true,
      textGlowColor: '#FFFFFF',
      textGlowBlur: 25,
      textGlowIntensity: 0.9,
    });

  // 导出视频
  const outputPath = path.join(outputDir, 'test-gradient-glow.mp4');
  console.log('\n🚀 开始导出视频...');
  console.log(`输出路径: ${outputPath}\n`);

  try {
    await builder.export(outputPath, {
      quality: 'high',
      bitrate: '10M',
    });
    
    console.log('✅ 视频导出成功！');
    console.log(`📁 文件位置: ${outputPath}`);
    console.log(`⏱️  总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  } catch (error) {
    console.error('❌ 导出失败:', error);
    throw error;
  } finally {
    builder.destroy();
  }
}

// 运行
testGradientGlow().catch(console.error);

