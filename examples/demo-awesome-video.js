/**
 * 酷炫视频演示 - 展示 FKNew 项目的各种功能
 * 
 * 包含：
 * - 文本特效（阴影、描边、渐变、发光）
 * - 丰富的动画效果（预设动画）
 * - 形状元素（圆形、矩形）
 * - 图片和视频元素
 * - 多场景切换
 * - 音频支持
 */
import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createAwesomeVideo() {
  console.log('🎬 开始创建酷炫视频演示...\n');

  const assetsDir = path.join(__dirname, '../assets');
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });
  let currentTime = 0;
  
  // 记录场景时间，用于调试
  const sceneTimes = [];

  // ========== 场景1: 开场 - 大标题动画 ==========
  console.log('📝 场景1: 开场标题...');
  sceneTimes.push({ name: '场景1', startTime: currentTime, duration: 4 });
  const scene1 = mainTrack.createScene({ 
    duration: 4, 
    startTime: currentTime 
  })
    .addBackground({ color: '#0a0a0a' })
    .addText({
      text: 'FKNew',
      color: '#FFFFFF',
      fontSize: 150,
      fontWeight: 'bold',
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['bigIn', 'fadeOut'],
      textShadow: true,
      textShadowColor: '#FFD700',
      textShadowBlur: 20,
      textShadowOffsetX: 0,
      textShadowOffsetY: 0,
      textShadowOpacity: 0.8,
    })
    .addText({
      text: '视频制作库',
      color: '#4ecdc4',
      fontSize: 80,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeInUp', 'fadeOut'],
      delay: 0.5,
      textShadow: true,
      textShadowColor: '#000000',
      textShadowBlur: 15,
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
    });
  currentTime += 4;

  // ========== 场景2: 文本特效展示 - 阴影和描边 ==========
  console.log('✨ 场景2: 文本阴影和描边效果...');
  const scene2 = mainTrack.createScene({ 
    duration: 5, 
    startTime: currentTime 
  })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '文本阴影',
      color: '#FFD700',
      fontSize: 100,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['slideInLeft', 'slideOutRight'],
      textShadow: true,
      textShadowColor: '#FF0000',
      textShadowBlur: 20,
      textShadowOffsetX: 10,
      textShadowOffsetY: 10,
      textShadowOpacity: 0.7,
    })
    .addText({
      text: '文本描边',
      color: '#FFFFFF',
      fontSize: 100,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['slideInRight', 'slideOutLeft'],
      stroke: true,
      strokeColor: '#4ecdc4',
      strokeWidth: 5,
      strokeStyle: 'solid',
    })
    .addText({
      text: '虚线描边',
      color: '#FF6B6B',
      fontSize: 100,
      x: '50%',
      y: '70%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['zoomIn', 'zoomOut'],
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 4,
      strokeStyle: 'dashed',
      strokeDashArray: [10, 5],
    });
  currentTime += 5;

  // ========== 场景3: 文本特效展示 - 渐变和发光 ==========
  console.log('🌈 场景3: 文本渐变和发光效果...');
  const scene3 = mainTrack.createScene({ 
    duration: 5, 
    startTime: currentTime 
  })
    .addBackground({ color: '#16213e' })
    .addText({
      text: '渐变文本',
      fontSize: 120,
      x: '50%',
      y: '35%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['fadeIn', 'fadeOut'],
      gradient: true,
      gradientColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      gradientDirection: 'horizontal',
    })
    .addText({
      text: '发光效果',
      color: '#FFD700',
      fontSize: 120,
      x: '50%',
      y: '65%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['bounceIn', 'bounceOut'],
      textGlow: true,
      textGlowColor: '#FFD700',
      textGlowBlur: 30,
      textGlowIntensity: 2,
    });
  currentTime += 5;

  // ========== 场景4: 形状动画展示 ==========
  console.log('🔷 场景4: 形状动画...');
  const scene4 = mainTrack.createScene({ 
    duration: 6, 
    startTime: currentTime 
  })
    .addBackground({ color: '#2d3436' })
    .addText({
      text: '形状元素',
      color: '#FFFFFF',
      fontSize: 80,
      x: '50%',
      y: '15%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 6,
      animations: ['fadeIn'],
    })
    // 圆形 - 左上
    .addCircle({
      x: '25%',
      y: '40%',
      radius: 100,
      bgcolor: '#FF6B6B',
      duration: 6,
      animations: ['zoomIn', 'rotateIn'],
    })
    // 圆形 - 右上
    .addCircle({
      x: '75%',
      y: '40%',
      radius: 100,
      bgcolor: '#4ECDC4',
      duration: 6,
      animations: ['zoomIn', 'rotateIn'],
      delay: 0.3,
    })
    // 矩形 - 左下
    .addRect({
      x: '25%',
      y: '70%',
      width: 200,
      height: 150,
      bgcolor: '#45B7D1',
      borderRadius: 20,
      duration: 6,
      animations: ['slideInLeft', 'slideOutLeft'],
    })
    // 矩形 - 右下
    .addRect({
      x: '75%',
      y: '70%',
      width: 200,
      height: 150,
      bgcolor: '#FFD700',
      borderRadius: 20,
      duration: 6,
      animations: ['slideInRight', 'slideOutRight'],
    });
  currentTime += 6;

  // ========== 场景5: 图片展示（如果有图片） ==========
  const imageFiles = [];
  if (await fs.pathExists(assetsDir)) {
    const files = await fs.readdir(assetsDir);
    imageFiles.push(...files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)));
  }

  if (imageFiles.length > 0) {
    console.log('🖼️  场景5: 图片展示...');
    const imagePath = path.join(assetsDir, imageFiles[0]);
    const scene5 = mainTrack.createScene({ 
      duration: 5, 
      startTime: currentTime 
    })
      .addBackground({ color: '#1a1a1a' })
      .addText({
        text: '图片元素',
        color: '#FFFFFF',
        fontSize: 80,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: 5,
        animations: ['fadeIn'],
      })
      .addImage({
        src: imagePath,
        x: '50%',
        y: '55%',
        width: '60%',
        height: '60%',
        anchor: [0.5, 0.5],
        fit: 'cover',
        duration: 5,
        animations: ['zoomIn', 'fadeOut'],
      });
    currentTime += 5;
  }

  // ========== 场景6: 视频展示（如果有视频） ==========
  const videoFiles = [];
  if (await fs.pathExists(assetsDir)) {
    const files = await fs.readdir(assetsDir);
    videoFiles.push(...files.filter(f => /\.(mp4|webm|mov)$/i.test(f)));
  }

  if (videoFiles.length > 0) {
    console.log('🎥 场景6: 视频展示...');
    const videoPath = path.join(assetsDir, videoFiles[0]);
    const scene6 = mainTrack.createScene({ 
      duration: 6, 
      startTime: currentTime 
    })
      .addBackground({ color: '#0a0a0a' })
      .addText({
        text: '视频元素',
        color: '#FFFFFF',
        fontSize: 80,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: 6,
        animations: ['fadeIn'],
      })
      .addVideo({
        src: videoPath,
        x: '50%',
        y: '55%',
        width: '70%',
        height: '60%',
        anchor: [0.5, 0.5],
        fit: 'cover',
        duration: 6,
        startTime: 0,
        animations: ['fadeIn'],
      });
    currentTime += 6;
  }

  // ========== 场景7: 组合效果 - 文字拆分动画 ==========
  console.log(`🎯 场景7: 文字拆分动画... (startTime: ${currentTime})`);
  sceneTimes.push({ name: '场景7', startTime: currentTime, duration: 6 });
  const scene7 = mainTrack.createScene({ 
    duration: 6, 
    startTime: currentTime 
  })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '文字拆分',
      color: '#4ECDC4',
      fontSize: 120,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 6,
      split: 'letter',
      animations: ['bigIn'],
      textShadow: true,
      textShadowColor: '#000000',
      textShadowBlur: 15,
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
    })
    .addText({
      text: '逐字动画',
      color: '#FFD700',
      fontSize: 120,
      x: '50%',
      y: '65%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 6,
      split: 'letter',
      animations: ['bounceIn'],
      delay: 1,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 3,
    });
  currentTime += 6;

  // ========== 场景8: 综合展示 - 多元素组合 ==========
  console.log(`🎨 场景8: 综合展示... (startTime: ${currentTime})`);
  sceneTimes.push({ name: '场景8', startTime: currentTime, duration: 8 });
  const scene8 = mainTrack.createScene({ 
    duration: 8, 
    startTime: currentTime 
  })
    .addBackground({ color: '#2d3436' })
    // 背景装饰圆形
    .addCircle({
      x: '20%',
      y: '30%',
      radius: 150,
      bgcolor: '#FF6B6B',
      opacity: 0.3,
      duration: 8,
      animations: ['zoomIn', 'rotateIn'],
    })
    .addCircle({
      x: '80%',
      y: '70%',
      radius: 150,
      bgcolor: '#4ECDC4',
      opacity: 0.3,
      duration: 8,
      animations: ['zoomIn', 'rotateIn'],
      delay: 0.5,
    })
    // 主标题
    .addText({
      text: '功能强大',
      color: '#FFFFFF',
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 8,
      animations: ['fadeInUp', 'fadeOutUp'],
      textShadow: true,
      textShadowColor: '#FFD700',
      textShadowBlur: 20,
      textShadowOffsetX: 0,
      textShadowOffsetY: 0,
    })
    // 副标题
    .addText({
      text: '易于使用',
      color: '#4ECDC4',
      fontSize: 80,
      x: '50%',
      y: '45%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 8,
      animations: ['fadeInUp', 'fadeOutUp'],
      delay: 0.5,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
    })
    // 特性列表
    .addText({
      text: '✨ 丰富的元素类型',
      color: '#FFD700',
      fontSize: 50,
      x: '50%',
      y: '65%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 8,
      animations: ['slideInLeft', 'fadeOut'],
      delay: 1,
    })
    .addText({
      text: '🎬 流畅的动画效果',
      color: '#FFD700',
      fontSize: 50,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 8,
      animations: ['slideInRight', 'fadeOut'],
      delay: 1.5,
    })
    .addText({
      text: '🎨 强大的视觉效果',
      color: '#FFD700',
      fontSize: 50,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 8,
      animations: ['slideInLeft', 'fadeOut'],
      delay: 2,
    });
  currentTime += 8;

  // ========== 场景9: 示波器展示 ==========
  console.log(`📊 场景9: 示波器展示... (startTime: ${currentTime})`);
  sceneTimes.push({ name: '场景9', startTime: currentTime, duration: 6 });
  const scene9 = mainTrack.createScene({ 
    duration: 6, 
    startTime: currentTime 
  })
    .addBackground({ color: '#0a0a0a' })
    .addText({
      text: '音频示波器',
      color: '#FFFFFF',
      fontSize: 80,
      x: '50%',
      y: '15%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 6,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#4ECDC4',
      textShadowBlur: 20,
      textShadowOffsetX: 0,
      textShadowOffsetY: 0,
    });

  // 如果有音频文件，添加示波器
  const audioFiles = [];
  if (await fs.pathExists(assetsDir)) {
    const files = await fs.readdir(assetsDir);
    audioFiles.push(...files.filter(f => /\.(mp3|m4a|wav|ogg)$/i.test(f)));
  }

  if (audioFiles.length > 0) {
    const audioPath = path.join(assetsDir, audioFiles[0]);
    
    // 线条样式示波器
    scene9.addOscilloscope({
      audioPath: audioPath,
      x: '50%',
      y: '40%',
      width: 1600,
      height: 200,
      waveColor: '#4ECDC4',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      style: 'line',
      lineWidth: 3,
      mirror: true,
      smoothing: 0.3,
      sensitivity: 1.0,
      windowSize: 0.1,
      startTime: 0,
      duration: 6,
      animations: ['fadeIn'],
    });

    // 柱状样式示波器
    scene9.addOscilloscope({
      audioPath: audioPath,
      x: '50%',
      y: '70%',
      width: 1600,
      height: 200,
      waveColor: '#FFD700',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      style: 'bars',
      barWidth: 4,
      barGap: 1,
      mirror: true,
      sensitivity: 1.2,
      windowSize: 0.1,
      startTime: 0,
      duration: 6,
      animations: ['fadeIn'],
      delay: 0.5,
    });
  } else {
    // 如果没有音频文件，显示提示文本
    scene9.addText({
      text: '需要音频文件才能显示示波器',
      color: '#999999',
      fontSize: 40,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 6,
      animations: ['fadeIn'],
    });
  }
  currentTime += 6;

  // ========== 场景10: 结尾 ==========
  console.log(`🏁 场景10: 结尾... (startTime: ${currentTime})`);
  sceneTimes.push({ name: '场景10', startTime: currentTime, duration: 5 });
  const scene10 = mainTrack.createScene({ 
    duration: 5, 
    startTime: currentTime 
  })
    .addBackground({ color: '#0a0a0a' })
    .addText({
      text: '感谢观看',
      color: '#FFFFFF',
      fontSize: 120,
      x: '50%',
      y: '45%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['bigIn', 'fadeOut'],
      textShadow: true,
      textShadowColor: '#FFD700',
      textShadowBlur: 25,
      textShadowOffsetX: 0,
      textShadowOffsetY: 0,
      textShadowOpacity: 0.9,
    })
    .addText({
      text: 'FKNew Video Library',
      color: '#4ECDC4',
      fontSize: 60,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['fadeInUp', 'fadeOut'],
      delay: 0.5,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
    });
  currentTime += 5;

  // ========== 添加音频（如果有） ==========
  // 注意：audioFiles 已经在场景9中定义过了，这里需要重新检查
  let backgroundAudioFiles = [];
  if (await fs.pathExists(assetsDir)) {
    const files = await fs.readdir(assetsDir);
    backgroundAudioFiles.push(...files.filter(f => /\.(mp3|m4a|wav|ogg)$/i.test(f)));
  }

  if (backgroundAudioFiles.length > 0) {
    console.log('🎵 添加背景音乐...');
    const audioPath = path.join(assetsDir, backgroundAudioFiles[0]);
    const totalDuration = builder.getTotalDuration();
    
    // 在第一个场景添加音频
    scene1.addAudio({
      src: audioPath,
      volume: 0.5,
      startTime: 0,
      duration: totalDuration,
    });
  }

  // ========== 导出视频 ==========
  const outputPath = path.join(outputDir, 'awesome-demo.mp4');
  console.log('\n📊 场景时间表:');
  sceneTimes.forEach(scene => {
    console.log(`  ${scene.name}: ${scene.startTime}s - ${scene.startTime + scene.duration}s (${scene.duration}s)`);
  });
  console.log(`\n🚀 开始导出视频...`);
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
createAwesomeVideo().catch(console.error);

