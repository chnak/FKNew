/**
 * 测试各种过渡效果
 */
import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { AllTransitions } from '../src/utils/transition-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTransitions() {
  console.log('🎬 测试各种过渡效果...\n');

  const assetsDir = path.join(__dirname, '../assets');
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 常用的过渡效果列表（使用 gl-transitions 的实际名称）
  const commonTransitions = [
    'fade',              // 淡入淡出（如果存在）
    'CrossZoom',         // 交叉缩放
    'CircleCrop',        // 圆形裁剪
    'LinearBlur',        // 线性模糊
    'Swirl',             // 漩涡
    'Directional',       // 方向擦除
    'Bounce',            // 弹跳
    'Dreamy',            // 梦幻
    'Radial',            // 径向
    'GridFlip',          // 网格翻转
    'Mosaic',            // 马赛克
    'PolkaDotsCurtain',  // 圆点窗帘
    'directional-left',  // 从左滑入（别名）
    'directional-right', // 从右滑入（别名）
    'directional-up',    // 从上滑入（别名）
    'directional-down',  // 从下滑入（别名）
    'ZoomInCircles',     // 圆形缩放
    'burn',              // 燃烧（小写）
    'circleopen',        // 圆形展开（小写）
    'GlitchDisplace',    // 故障位移
  ];

  // 如果过渡效果不存在，使用默认的 fade
  const availableTransitions = commonTransitions.filter(name => {
    try {
      return AllTransitions.includes(name);
    } catch (e) {
      return false;
    }
  });

  console.log(`可用过渡效果: ${availableTransitions.length} 个\n`);

  const sceneDuration = 3; // 每个场景3秒
  const transitionDuration = 1; // 过渡时长1秒

  // 创建第一个场景（作为起始场景）
  let currentTime = 0;
  const scene1 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: currentTime,
  })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '过渡效果演示',
      color: '#FFFFFF',
      fontSize: 100,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#4ECDC4',
      textShadowBlur: 20,
    });

  // 更新当前时间（场景1结束时间）
  currentTime += sceneDuration;

  // 为每个过渡效果创建一个场景
  for (let i = 0; i < Math.min(availableTransitions.length, 15); i++) {
    const transitionName = availableTransitions[i];
    const sceneIndex = i + 2;
    
    console.log(`创建场景 ${sceneIndex}: ${transitionName}...`);

    // 计算新场景的开始时间
    // 场景开始时间 = 前一个场景结束时间 - 转场时长（重叠）
    const sceneStartTime = currentTime - transitionDuration;

    // 创建新场景
    const scene = mainTrack.createScene({
      duration: sceneDuration,
      startTime: sceneStartTime,
    })
      .addBackground({ 
        color: i % 2 === 0 ? '#2d3436' : '#1a1a2e' 
      })
      .addText({
        text: transitionName,
        color: '#FFFFFF',
        fontSize: 80,
        x: '50%',
        y: '40%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: '#FFD700',
        textShadowBlur: 15,
      })
      .addText({
        text: `场景 ${sceneIndex}`,
        color: '#4ECDC4',
        fontSize: 50,
        x: '50%',
        y: '60%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        animations: ['fadeIn'],
        delay: 0.3,
      });

    // 添加过渡效果（从前一个场景到当前场景）
    // 参照 test-transition-debug.js 的用法：只需要指定 name, duration, startTime
    // startTime 是转场结束的时间点（目标场景开始的时间）
    mainTrack.addTransition({
      name: transitionName,
      duration: transitionDuration,
      startTime: sceneStartTime, // 转场结束时间（目标场景开始时间）
    });

    // 更新当前时间（当前场景结束时间）
    currentTime = sceneStartTime + sceneDuration;
  }

  // 导出视频
  const outputPath = path.join(outputDir, 'test-transitions.mp4');
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
    console.log(`\n测试了 ${Math.min(availableTransitions.length, 15)} 种过渡效果`);
  } catch (error) {
    console.error('❌ 导出失败:', error);
    throw error;
  } finally {
    builder.destroy();
  }
}

// 运行
testTransitions().catch(console.error);

