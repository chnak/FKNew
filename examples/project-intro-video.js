/**
 * FKNew 项目简介视频
 * 使用指定的配色方案制作
 */
import { VideoBuilder } from '../src/index.js';
import { registerFontFile } from '../src/utils/font-manager.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配色方案
const colors = {
  aquamarine: '#75b7d0',
  navyBlue: '#263f60',
  lint: '#e4ebe0',
  blue: '#3982b0',
};

// 注册字体
const fontPath = 'D:/code/foliko-trade/public/fonts/MicrosoftYaHei-Bold-01.ttf';
try {
  registerFontFile(fontPath, 'MicrosoftYaHei');
} catch (error) {
  console.warn('字体注册失败，将使用默认字体:', error.message);
}

async function createProjectIntroVideo() {
  console.log('🎬 创建 FKNew 项目简介视频...\n');

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
    .addBackground({ color: colors.navyBlue })
    .addText({
      text: 'FKNew',
      color: colors.aquamarine,
      fontSize: 180,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['bigIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 30,
    })
    .addText({
      text: '程序化视频生成库',
      color: colors.lint,
      fontSize: 60,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: 'MicrosoftYaHei',
      animations: ['fadeIn'],
      delay: 0.3,
    });

  currentTime += sceneDuration;

  // ========== 场景2：核心特性 - 文本效果 ==========
  console.log('创建场景2: 文本效果...');
  const scene2StartTime = currentTime - transitionDuration;
  const scene2 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene2StartTime,
  })
    .addBackground({ color: colors.lint })
    .addText({
      text: '丰富的文本效果',
      color: colors.navyBlue,
      fontSize: 100,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 20,
    })
    .addText({
      text: '渐变 · 阴影 · 发光 · 描边',
      color: colors.blue,
      fontSize: 50,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: 'MicrosoftYaHei',
      animations: ['fadeIn'],
      delay: 0.3,
      gradient: true,
      gradientColors: [colors.aquamarine, colors.blue],
      gradientDirection: 'horizontal',
    })
    .addText({
      text: 'Split Animation',
      color: colors.navyBlue,
      fontSize: 70,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: 'MicrosoftYaHei',
      split: 'letter',
      splitDelay: 0.1,
      animations: ['fadeIn'],
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
    .addBackground({ color: colors.navyBlue })
    .addText({
      text: '强大的动画系统',
      color: colors.aquamarine,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 20,
    })
    .addCircle({
      x: '30%',
      y: '60%',
      radius: 80,
      bgcolor: colors.aquamarine,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['bounce'],
    })
    .addRect({
      x: '50%',
      y: '60%',
      width: 160,
      height: 160,
      bgcolor: colors.blue,
      borderRadius: 20,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['rotate'],
    })
    .addCircle({
      x: '70%',
      y: '60%',
      radius: 80,
      bgcolor: colors.lint,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      animations: ['scale'],
    })
    .addText({
      text: '预设动画 · 关键帧 · 缓动函数',
      color: colors.lint,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: 'MicrosoftYaHei',
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
    .addBackground({ color: colors.lint })
    .addText({
      text: '多轨道多场景',
      color: colors.navyBlue,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 20,
    })
    .addRect({
      x: '25%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.aquamarine,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['fadeIn'],
      opacity: 0.8,
    })
    .addText({
      text: '轨道1',
      color: colors.navyBlue,
      fontSize: 50,
      x: '25%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '50%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.blue,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.6,
      animations: ['fadeIn'],
      opacity: 0.8,
    })
    .addText({
      text: '轨道2',
      color: colors.lint,
      fontSize: 50,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '75%',
      y: '55%',
      width: 300,
      height: 200,
      bgcolor: colors.navyBlue,
      borderRadius: 15,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['fadeIn'],
      opacity: 0.8,
    })
    .addText({
      text: '轨道3',
      color: colors.aquamarine,
      fontSize: 50,
      x: '75%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addText({
      text: '灵活的场景组合 · 丰富的转场效果',
      color: colors.blue,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: 'MicrosoftYaHei',
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
    .addBackground({ color: colors.navyBlue })
    .addText({
      text: '完整的媒体支持',
      color: colors.aquamarine,
      fontSize: 100,
      x: '50%',
      y: '25%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 20,
    })
    .addRect({
      x: '20%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.aquamarine,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      animations: ['fadeIn'],
    })
    .addText({
      text: '图片',
      color: colors.navyBlue,
      fontSize: 40,
      x: '20%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '40%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.blue,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.6,
      animations: ['fadeIn'],
    })
    .addText({
      text: '视频',
      color: colors.lint,
      fontSize: 40,
      x: '40%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '60%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.lint,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.7,
      animations: ['fadeIn'],
    })
    .addText({
      text: '音频',
      color: colors.navyBlue,
      fontSize: 40,
      x: '60%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.9,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addRect({
      x: '80%',
      y: '60%',
      width: 200,
      height: 200,
      bgcolor: colors.navyBlue,
      borderRadius: 10,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      animations: ['fadeIn'],
    })
    .addText({
      text: '字幕',
      color: colors.aquamarine,
      fontSize: 40,
      x: '80%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
    })
    .addText({
      text: '图片 · 视频 · 音频 · 字幕 · 波形',
      color: colors.lint,
      fontSize: 45,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: 'MicrosoftYaHei',
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
    .addBackground({ color: colors.navyBlue })
    .addText({
      text: '文字拆分动画',
      color: colors.aquamarine,
      fontSize: 100,
      x: '50%',
      y: '30%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 20,
    })
    .addText({
      text: 'FKNew',
      color: colors.lint,
      fontSize: 120,
      x: '50%',
      y: '55%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.5,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      split: 'letter',
      splitDelay: 0.1,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 15,
      stroke: true,
      strokeColor: colors.aquamarine,
      strokeWidth: 2,
    })
    .addText({
      text: '逐字显示',
      color: colors.blue,
      fontSize: 80,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.5,
      fontFamily: 'MicrosoftYaHei',
      split: 'word',
      splitDelay: 0.15,
      animations: ['bounceIn'],
      gradient: true,
      gradientColors: [colors.aquamarine, colors.blue],
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
      .addBackground({ color: colors.lint })
      .addText({
        text: '图片元素',
        color: colors.navyBlue,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: 'MicrosoftYaHei',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blue,
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
        shadowColor: colors.navyBlue,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
      })
      .addText({
        text: '支持多种图片格式 · 丰富的视觉效果',
        color: colors.blue,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: 'MicrosoftYaHei',
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
      .addBackground({ color: colors.navyBlue })
      .addText({
        text: '视频元素',
        color: colors.aquamarine,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: 'MicrosoftYaHei',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blue,
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
        shadowColor: colors.navyBlue,
        shadowOffsetX: 0,
        shadowOffsetY: 10,
      })
      .addText({
        text: '视频嵌入 · 音频提取 · 帧缓冲',
        color: colors.lint,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: 'MicrosoftYaHei',
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
      .addBackground({ color: colors.navyBlue })
      .addText({
        text: '音频示波器',
        color: colors.aquamarine,
        fontSize: 100,
        x: '50%',
        y: '15%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 0,
        fontFamily: 'MicrosoftYaHei',
        fontWeight: 'bold',
        animations: ['fadeIn'],
        textShadow: true,
        textShadowColor: colors.blue,
        textShadowBlur: 20,
      })
      .addOscilloscope({
        audioPath: audioPath,
        x: '50%',
        y: '40%',
        width: 1600,
        height: 200,
        waveColor: colors.aquamarine,
        backgroundColor: 'rgba(38, 63, 96, 0.5)',
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
        waveColor: colors.blue,
        backgroundColor: 'rgba(38, 63, 96, 0.3)',
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
        color: colors.lint,
        fontSize: 45,
        x: '50%',
        y: '90%',
        textAlign: 'center',
        anchor: [0.5, 0.5],
        duration: sceneDuration,
        startTime: 1.5,
        fontFamily: 'MicrosoftYaHei',
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
    .addBackground({ color: colors.navyBlue })
    .addText({
      text: 'FKNew',
      color: colors.aquamarine,
      fontSize: 150,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      animations: ['bigIn'],
      textShadow: true,
      textShadowColor: colors.blue,
      textShadowBlur: 40,
      textGlow: true,
      textGlowColor: colors.aquamarine,
      textGlowBlur: 30,
    })
    .addText({
      text: '让视频创作更简单',
      color: colors.lint,
      fontSize: 60,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      fontFamily: 'MicrosoftYaHei',
      animations: ['fadeIn'],
      delay: 0.3,
    })
    .addText({
      text: 'Programmatic Video Generation',
      color: colors.blue,
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
    });

  mainTrack.addTransition({
    name: 'Dreamy',
    duration: transitionDuration,
    startTime: scene10StartTime,
  });

  // 导出视频
  const outputPath = path.join(outputDir, 'project-intro-video.mp4');
  console.log(`\n🚀 开始导出视频...`);
  console.log(`输出路径: ${outputPath}\n`);
  console.log(`总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  console.log(`场景数: ${mainTrack.scenes.length}`);
  console.log(`转场数: ${mainTrack.transitions.length}\n`);

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
createProjectIntroVideo().catch(console.error);

