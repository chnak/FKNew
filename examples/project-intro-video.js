/**
 * FKbuilder 项目简介视频
 * 使用指定的配色方案制作
 */
import { VideoBuilder, getAudioDuration } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 配色方案 ==========
const colors = {
  peach: '#fcdec3',           // Peach - 温暖、柔和
  pewter: '#e6e9e6',          // Pewter - 中性、优雅
  blueGrotto: '#208ab7',      // Blue Grotto - 主色、专业
  babyBlue: '#5acbed',        // Baby Blue - 明亮、清新
  babyBlueLight: '#cbe7e8',   // Baby Blue Light - 浅色、柔和
  babyBlueLighter: '#dbf3f4', // Baby Blue Lighter - 极浅、背景
  blueGrottoDark: '#0d659d',  // Blue Grotto Dark - 深色、强调
  ebony: '#2e3b3c',           // Ebony - 深色、对比
};

async function createProjectIntroVideo() {
  console.log('🎬 创建 FKbuilder 项目简介视频...\n');

  const assetsDir = path.join(__dirname, '../assets');
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });
  
  // 检查资源文件
  const imageFiles = [];
  const videoFiles = [];
  const audioFiles = [];
  if (await fs.pathExists(assetsDir)) {
    const files = await fs.readdir(assetsDir);
    imageFiles.push(...files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)));
    videoFiles.push(...files.filter(f => /\.(mp4|webm|mov)$/i.test(f)));
    audioFiles.push(...files.filter(f => /\.(mp3|m4a|wav|ogg)$/i.test(f)));
  }

  let currentTime = 0;
  const sceneDuration = 4; // 每个场景4秒
  const transitionDuration = 1; // 转场时长1秒

  // ========== 场景1：标题页 ==========
  console.log('创建场景1: 标题页...');
  const scene1 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: currentTime,
  })
    .addBackground({ color: colors.ebony })
    .addText({
      text: 'FKbuilder',
      color: colors.babyBlue,
      fontSize: 180,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['bigIn'],
      textShadow: true,
      textShadowColor: colors.ebony,
      textShadowBlur: 30,
      gradient: true,
      gradientColors: [colors.babyBlue, colors.blueGrotto],
      gradientDirection: 'horizontal',
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1) {
          // 呼吸效果：轻微缩放
          const breath = 1 + Math.sin((event.time - 1) * 2) * 0.03;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(breath / currentScale, pivot);
        }
      },
    })
    .addText({
      text: '程序化视频生成库',
      color: colors.pewter,
      fontSize: 60,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
      delay: 0.3,
      textShadow: true,
      textShadowColor: colors.ebony,
      textShadowBlur: 20,
    })
    .addText({
      text: 'GitHub: github.com/chnak/FKbuilder',
      color: colors.babyBlueLight,
      fontSize: 36,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
      delay: 0.5,
      textShadow: true,
      textShadowColor: colors.ebony,
      textShadowBlur: 15,
      opacity: 0.9,
    });

  currentTime += sceneDuration;

  // ========== 场景2：核心特性 - 文本效果 ==========
  console.log('创建场景2: 文本效果...');
  const scene2StartTime = currentTime - transitionDuration;
  const scene2 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene2StartTime,
  })
    .addBackground({ color: colors.pewter })
    .addText({
      text: '丰富的文本效果',
      color: colors.ebony,
      fontSize: 100,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 20,
    })
    .addText({
      text: '渐变 · 阴影 · 发光 · 描边',
      color: colors.blueGrotto,
      fontSize: 50,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
      delay: 0.3,
      gradient: true,
      gradientColors: [colors.babyBlue, colors.blueGrotto],
      gradientDirection: 'horizontal',
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1.2) {
          // 脉冲效果
          const pulse = 1 + Math.sin((event.time - 1.2) * 3) * 0.05;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(pulse / currentScale, pivot);
        }
      },
    })
    .addText({
      text: 'Split Animation',
      color: colors.ebony,
      fontSize: 70,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: '微软雅黑',
      split: 'letter',
      splitDelay: 0.1,
      animations: ['fadeIn'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 2) {
          // 在所有字母出现后添加轻微脉冲
          const pulse = 1 + Math.sin((event.time - 2) * 2.5) * 0.03;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(pulse / currentScale, pivot);
        }
      },
    });

  mainTrack.addTransition({
    name: 'CrossZoom',
    duration: transitionDuration,
    startTime: scene2StartTime,
  });

  currentTime = scene2StartTime + sceneDuration;

  // ========== 场景3：核心特性 - 动画系统 ==========
  console.log('创建场景3: 动画系统...');
  const scene3StartTime = currentTime - transitionDuration;
  const scene3 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene3StartTime,
  })
    .addBackground({ color: colors.ebony })
    .addText({
      text: '强大的动画系统',
      color: colors.babyBlue,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 20,
    })
    .addCircle({
      x: '30%',
      y: '60%',
      radius: 80,
      bgcolor: colors.babyBlue,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['bounce'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1) {
          // 旋转 + 脉冲
          const rotation = (event.time - 1) * 30;
          const currentRotation = paperItem.rotation || 0;
          paperItem.rotate(rotation - currentRotation, pivot);
          const pulse = 1 + Math.sin((event.time - 1) * 2) * 0.15;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(pulse / currentScale, pivot);
        }
      },
    })
    .addRect({
      x: '50%',
      y: '60%',
      width: 160,
      height: 160,
      bgcolor: colors.blueGrotto,
      borderRadius: 20,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['rotate'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1.2) {
          // 持续旋转
          const rotation = (event.time - 1.2) * 45;
          const currentRotation = paperItem.rotation || 0;
          paperItem.rotate(rotation - currentRotation, pivot);
        }
      },
    })
    .addCircle({
      x: '70%',
      y: '60%',
      radius: 80,
      bgcolor: colors.pewter,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      animations: ['scale'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1.4) {
          // 缩放脉冲
          const scale = 1 + Math.sin((event.time - 1.4) * 2.5) * 0.2;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(scale / currentScale, pivot);
        }
      },
    })
    .addText({
      text: '预设动画 · 关键帧 · 缓动函数',
      color: colors.pewter,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
    });

  mainTrack.addTransition({
    name: 'Swirl',
    duration: transitionDuration,
    startTime: scene3StartTime,
  });

  currentTime = scene3StartTime + sceneDuration;

  // ========== 场景4：核心特性 - 多轨道多场景 ==========
  console.log('创建场景4: 多轨道多场景...');
  const scene4StartTime = currentTime - transitionDuration;
  const scene4 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene4StartTime,
  })
    .addBackground({ color: colors.pewter })
    .addText({
      text: '多轨道多场景',
      color: colors.ebony,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 20,
    })
    .addRect({
      x: '25%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.babyBlue,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['fadeIn'],
      opacity: 0.8,
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        if (event.time > 1) {
          // 轻微上下浮动
          const float = Math.sin((event.time - 1) * 1.5) * 10;
          const baseY = 1080 * 0.55; // 原始Y位置
          if (paperItem.position) {
            paperItem.position.y = baseY + float;
          }
        }
      },
    })
    .addText({
      text: '轨道1',
      color: colors.ebony,
      fontSize: 50,
      x: '25%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '50%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.blueGrotto,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.6,
      animations: ['fadeIn'],
      opacity: 0.8,
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        if (event.time > 1.1) {
          // 轻微上下浮动（相位偏移）
          const float = Math.sin((event.time - 1.1) * 1.5 + Math.PI / 3) * 10;
          const baseY = 1080 * 0.55; // 原始Y位置
          if (paperItem.position) {
            paperItem.position.y = baseY + float;
          }
        }
      },
    })
    .addText({
      text: '轨道2',
      color: colors.pewter,
      fontSize: 50,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '75%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.ebony,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['fadeIn'],
      opacity: 0.8,
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        if (event.time > 1.2) {
          // 轻微上下浮动（相位偏移）
          const float = Math.sin((event.time - 1.2) * 1.5 + Math.PI * 2 / 3) * 10;
          const baseY = 1080 * 0.55; // 原始Y位置
          if (paperItem.position) {
            paperItem.position.y = baseY + float;
          }
        }
      },
    })
    .addText({
      text: '轨道3',
      color: colors.babyBlue,
      fontSize: 50,
      x: '75%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addText({
      text: '灵活的场景组合 · 丰富的转场效果',
      color: colors.blueGrotto,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
    });

  mainTrack.addTransition({
    name: 'GridFlip',
    duration: transitionDuration,
    startTime: scene4StartTime,
  });

  currentTime = scene4StartTime + sceneDuration;

  // ========== 场景5：核心特性 - 媒体支持 ==========
  console.log('创建场景5: 媒体支持...');
  const scene5StartTime = currentTime - transitionDuration;
  const scene5 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene5StartTime,
  })
    .addBackground({ color: colors.ebony })
    .addText({
      text: '完整的媒体支持',
      color: colors.babyBlue,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 20,
    })
    .addRect({
      x: '20%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.babyBlue,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['fadeIn'],
    })
    .addText({
      text: '图片',
      color: colors.ebony,
      fontSize: 40,
      x: '20%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '40%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.blueGrotto,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.6,
      animations: ['fadeIn'],
    })
    .addText({
      text: '视频',
      color: colors.pewter,
      fontSize: 40,
      x: '40%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '60%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.pewter,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['fadeIn'],
    })
    .addText({
      text: '音频',
      color: colors.ebony,
      fontSize: 40,
      x: '60%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '80%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.ebony,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      animations: ['fadeIn'],
    })
    .addText({
      text: '字幕',
      color: colors.babyBlue,
      fontSize: 40,
      x: '80%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addText({
      text: '图片 · 视频 · 音频 · 字幕 · 波形',
      color: colors.pewter,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
    });

  mainTrack.addTransition({
    name: 'Radial',
    duration: transitionDuration,
    startTime: scene5StartTime,
  });

  currentTime = scene5StartTime + sceneDuration;

  // ========== 场景6：分割文本动画 ==========
  console.log('创建场景6: 分割文本动画...');
  const scene6StartTime = currentTime - transitionDuration;
  const scene6 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene6StartTime,
  })
    .addBackground({ color: colors.ebony })
    .addText({
      text: '文字拆分动画',
      color: colors.babyBlue,
      fontSize: 100,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 20,
    })
    .addText({
      text: 'FKbuilder',
      color: colors.pewter,
      fontSize: 120,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      split: 'letter',
      splitDelay: 0.1,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 15,
      stroke: true,
      strokeColor: colors.babyBlue,
      strokeWidth: 2,
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
    })
    .addText({
      text: '逐字显示',
      color: colors.blueGrotto,
      fontSize: 80,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: '微软雅黑',
      split: 'word',
      splitDelay: 0.15,
      animations: ['bounceIn'],
      gradient: true,
      gradientColors: [colors.babyBlue, colors.blueGrotto],
      gradientDirection: 'horizontal',
    });

  mainTrack.addTransition({
    name: 'Mosaic',
    duration: transitionDuration,
    startTime: scene6StartTime,
  });

  currentTime = scene6StartTime + sceneDuration;

  // ========== 场景7：图片展示 ==========
  if (imageFiles.length > 0) {
    console.log('创建场景7: 图片展示...');
    const scene7StartTime = currentTime - transitionDuration;
    const imagePath = path.join(assetsDir, imageFiles[0]);
    const scene7 = mainTrack.createScene({
      duration: sceneDuration,
      startTime: scene7StartTime,
    })
      .addBackground({ color: colors.pewter })
      .addText({
        text: '图片元素',
        color: colors.ebony,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blueGrotto,
        textShadowBlur: 20,
      })
      .addImage({
        src: imagePath,
        x: '50%',
        y: '55%',
        width: '70%',
        height: '60%',
        anchor: [0.5, 0.5],
        fit: 'cover',
        duration: sceneDuration,
        startTime: 0.3,
        animations: ['zoomIn'],
        borderRadius: 20,
        shadowBlur: 30,
        shadowColor: colors.ebony,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
      })
      .addText({
        text: '支持多种图片格式 · 丰富的视觉效果',
        color: colors.blueGrotto,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: '微软雅黑',
        animations: ['fadeIn'],
      });

    mainTrack.addTransition({
      name: 'ZoomInCircles',
      duration: transitionDuration,
      startTime: scene7StartTime,
    });

    currentTime = scene7StartTime + sceneDuration;
  }

  // ========== 场景8：视频展示 ==========
  if (videoFiles.length > 0) {
    console.log('创建场景8: 视频展示...');
    const scene8StartTime = currentTime - transitionDuration;
    const videoPath = path.join(assetsDir, videoFiles[0]);
    const scene8 = mainTrack.createScene({
      duration: sceneDuration,
      startTime: scene8StartTime,
    })
      .addBackground({ color: colors.ebony })
      .addText({
        text: '视频元素',
        color: colors.babyBlue,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blueGrotto,
        textShadowBlur: 20,
      })
      .addVideo({
        src: videoPath,
        x: '50%',
        y: '55%',
        width: '70%',
        height: '60%',
        anchor: [0.5, 0.5],
        fit: 'cover',
        duration: sceneDuration,
        startTime: 0.3,
        animations: ['fadeIn'],
        borderRadius: 20,
        shadowBlur: 30,
        shadowColor: colors.ebony,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
      })
      .addText({
        text: '视频嵌入 · 音频提取 · 帧缓冲',
        color: colors.pewter,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: '微软雅黑',
        animations: ['fadeIn'],
      });

    mainTrack.addTransition({
      name: 'Bounce',
      duration: transitionDuration,
      startTime: scene8StartTime,
    });

    currentTime = scene8StartTime + sceneDuration;
  }

  // ========== 场景9：示波器展示 ==========
  if (audioFiles.length > 0) {
    console.log('创建场景9: 示波器展示...');
    const scene9StartTime = currentTime - transitionDuration;
    const audioPath = path.join(assetsDir, audioFiles[0]);
    const scene9 = mainTrack.createScene({
      duration: sceneDuration,
      startTime: scene9StartTime,
    })
      .addBackground({ color: colors.ebony })
      .addText({
        text: '音频示波器',
        color: colors.babyBlue,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: '微软雅黑',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blueGrotto,
        textShadowBlur: 20,
      })
      .addOscilloscope({
        audioPath: audioPath,
        x: '50%',
        y: '40%',
        width: 1600,
        height: 200,
        waveColor: colors.babyBlue,
        backgroundColor: `${colors.blueGrottoDark}80`,
        style: 'line',
        lineWidth: 3,
        mirror: true,
        duration: sceneDuration,
        startTime: 0.3,
        animations: ['fadeIn'],
      })
      .addOscilloscope({
        audioPath: audioPath,
        x: '50%',
        y: '70%',
        width: 1600,
        height: 300,
        waveColor: colors.blueGrotto,
        backgroundColor: `${colors.blueGrottoDark}50`,
        style: 'bars',
        barWidth: 4,
        barGap: 2,
        mirror: true,
        duration: sceneDuration,
        startTime: 0.5,
        animations: ['fadeIn'],
      })
      .addText({
        text: '线条样式 · 柱状样式 · 实时波形',
        color: colors.pewter,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: '微软雅黑',
        animations: ['fadeIn'],
      });

    mainTrack.addTransition({
      name: 'PolkaDotsCurtain',
      duration: transitionDuration,
      startTime: scene9StartTime,
    });

    currentTime = scene9StartTime + sceneDuration;
  }

  // ========== 场景10：结尾 ==========
  console.log('创建场景10: 结尾...');
  const scene10StartTime = currentTime - transitionDuration;
  const scene10 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene10StartTime,
  })
    .addBackground({ color: colors.ebony })
    .addText({
      text: 'FKbuilder',
      color: colors.babyBlue,
      fontSize: 150,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: '微软雅黑',
      fontWeight: 'bold',
      animations: ['bigIn'],
      textShadow: true,
      textShadowColor: colors.blueGrotto,
      textShadowBlur: 40,
      textGlow: true,
      textGlowColor: colors.babyBlue,
      textGlowBlur: 30,
      gradient: true,
      gradientColors: [colors.babyBlue, colors.blueGrotto],
      gradientDirection: 'horizontal',
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const pivot = paperItem.position || paperItem.center;
        if (pivot && event.time > 1.5) {
          // 呼吸效果：轻微缩放
          const breath = 1 + Math.sin((event.time - 1.5) * 2) * 0.04;
          const currentScale = paperItem.scaling ? paperItem.scaling.x : 1;
          paperItem.scale(breath / currentScale, pivot);
        }
      },
    })
    .addText({
      text: '让视频创作更简单',
      color: colors.pewter,
      fontSize: 60,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
      delay: 0.3,
    })
    .addText({
      text: 'Programmatic Video Generation',
      color: colors.blueGrotto,
      fontSize: 40,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.2,
      fontFamily: 'Arial',
      fontStyle: 'italic',
      animations: ['fadeIn'],
      delay: 0.5,
    })
    .addText({
      text: 'GitHub: github.com/chnak/FKbuilder',
      color: colors.babyBlueLight,
      fontSize: 38,
      x: '50%',
      y: '88%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.8,
      fontFamily: '微软雅黑',
      animations: ['fadeIn'],
      delay: 0.5,
      textShadow: true,
      textShadowColor: colors.ebony,
      textShadowBlur: 18,
      opacity: 0.9,
    });

  mainTrack.addTransition({
    name: 'Dreamy',
    duration: transitionDuration,
    startTime: scene10StartTime,
  });

  // 导出视频
  const outputPath = path.join(outputDir, 'project-intro-video.mp4');
  console.log(`\n🚀 开始渲染视频...`);
  console.log(`输出路径: ${outputPath}\n`);
  console.log(`总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  console.log(`场景数: ${mainTrack.scenes.length}`);
  console.log(`转场数: ${mainTrack.transitions.length}\n`);

  try {
    // 使用 render() 方法自动 build 和 export
    const resultPath = await builder.render(outputPath, {
      quality: 'high',
      bitrate: '10M',
    });

    console.log('✅ 视频渲染成功！');
    console.log(`📁 文件位置: ${resultPath}`);
    console.log(`⏱️  总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  } catch (error) {
    console.error('❌ 渲染失败:', error);
    throw error;
  }
}

// 运行
createProjectIntroVideo().catch(console.error);

