/**
 * FKNew 功能展示视频
 * 全面展示所有支持的功能特性
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

const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
});

// ========== 第一部分：文本动画展示 ==========
const textTrack = builder.createTrack({ zIndex: 10, name: '文本动画' });
const textScene = textTrack.createScene({ duration: 8 })
  .addBackground({ color: '#1a1a2e' })
  // 标题
  .addText({
    text: 'FKNew 功能展示',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 8,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    stroke: true,
    strokeColor: '#000000',
    strokeWidth: 3,
    animations: ['fadeIn']
  })
  // 文本动画展示
  .addText({
    text: '文本动画效果',
    color: '#ff6b6b',
    fontSize: '36rpx',
    x: '50vw',
    y: '20vh',
    textAlign: 'center',
    duration: 3,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    split: 'letter',
    splitDelay: 0.05,
    splitDuration: 0.3,
    animations: ['zoomIn']
  })
  .addText({
    text: '淡入上移',
    color: '#4ecdc4',
    fontSize: '32rpx',
    x: '25vw',
    y: '35vh',
    textAlign: 'center',
    duration: 2,
    startTime: 1,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeInUp']
  })
  .addText({
    text: '旋转进入',
    color: '#ffe66d',
    fontSize: '32rpx',
    x: '50vw',
    y: '35vh',
    textAlign: 'center',
    duration: 2,
    startTime: 1.5,
    fontFamily: 'MicrosoftYaHei',
    split: 'letter',
    splitDelay: 0.05,
    animations: ['rotateIn']
  })
  .addText({
    text: '弹跳效果',
    color: '#a8e6cf',
    fontSize: '32rpx',
    x: '75vw',
    y: '35vh',
    textAlign: 'center',
    duration: 2,
    startTime: 2,
    fontFamily: 'MicrosoftYaHei',
    animations: ['bounceIn']
  })
  .addText({
    text: '滑动动画',
    color: '#ff8b94',
    fontSize: '32rpx',
    x: '25vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 3,
    fontFamily: 'MicrosoftYaHei',
    animations: ['slideInLeft']
  })
  .addText({
    text: '缩放动画',
    color: '#c7ceea',
    fontSize: '32rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 3.5,
    fontFamily: 'MicrosoftYaHei',
    animations: ['bigIn']
  })
  .addText({
    text: '组合动画',
    color: '#ffd3a5',
    fontSize: '32rpx',
    x: '75vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 4,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeInUp', 'fadeOutDown']
  });

// ========== 第二部分：图片和视觉效果 ==========
const imageTrack = builder.createTrack({ zIndex: 5, name: '图片效果' });
const imageScene = imageTrack.createScene({ duration: 6, startTime: 8 })
  .addBackground({ color: '#16213e' })
  .addText({
    text: '图片元素与视觉效果',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 6,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  // 普通图片
  .addImage({
    src: path.join(__dirname, '../assets/1pdqf001ut51d.png'),
    x: '25vw',
    y: '50vh',
    width: '300px',
    height: '300px',
    duration: 6,
    startTime: 0,
    animations: ['fadeIn', 'zoomIn']
  })
  // 带边框的图片
  .addImage({
    src: path.join(__dirname, '../assets/1pdqg001ut51d.png'),
    x: '50vw',
    y: '50vh',
    width: '300px',
    height: '300px',
    duration: 6,
    startTime: 0.5,
    borderWidth: 5,
    borderColor: '#ff6b6b',
    borderRadius: 20,
    animations: ['slideInTop']
  })
  // 带阴影的图片
  .addImage({
    src: path.join(__dirname, '../assets/1pdqg003ut51d.png'),
    x: '75vw',
    y: '50vh',
    width: '300px',
    height: '300px',
    duration: 6,
    startTime: 1,
    shadowBlur: 20,
    shadowOffsetX: 10,
    shadowOffsetY: 10,
    shadowColor: '#000000',
    animations: ['bounceIn']
  })
  // 滤镜效果
  .addText({
    text: '滤镜效果：亮度、对比度、饱和度',
    color: '#ffffff',
    fontSize: '24rpx',
    x: '50vw',
    y: '80vh',
    textAlign: 'center',
    duration: 4,
    startTime: 2,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// ========== 第三部分：形状元素 ==========
const shapeTrack = builder.createTrack({ zIndex: 5, name: '形状元素' });
const shapeScene = shapeTrack.createScene({ duration: 6, startTime: 14 })
  .addBackground({ color: '#0f3460' })
  .addText({
    text: '形状元素',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 6,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  // 矩形
  .addRect({
    x: '25vw',
    y: '50vh',
    width: '200px',
    height: '200px',
    bgcolor: '#ff6b6b',
    borderRadius: 20,
    duration: 6,
    startTime: 0,
    animations: ['rotateIn']
  })
  // 圆形
  .addCircle({
    x: '50vw',
    y: '50vh',
    radius: '100px',
    bgcolor: '#4ecdc4',
    duration: 6,
    startTime: 0.5,
    animations: ['bounceIn']
  })
  // 带边框的矩形
  .addRect({
    x: '75vw',
    y: '50vh',
    width: '200px',
    height: '200px',
    bgcolor: '#ffe66d',
    borderWidth: 5,
    borderColor: '#ffffff',
    borderRadius: 10,
    duration: 6,
    startTime: 1,
    animations: ['zoomIn']
  })
  .addText({
    text: '矩形 | 圆形 | 圆角矩形',
    color: '#ffffff',
    fontSize: '24rpx',
    x: '50vw',
    y: '80vh',
    textAlign: 'center',
    duration: 4,
    startTime: 2,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// ========== 第四部分：音频可视化（示波器） ==========
const audioTrack = builder.createTrack({ zIndex: 5, name: '音频可视化' });
const audioScene = audioTrack.createScene({ duration: 10, startTime: 20 })
  .addBackground({ color: '#1a1a1a' })
  .addText({
    text: '音频可视化 - 示波器效果',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  // 线条波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '25vw',
    y: '40vh',
    width: '400px',
    height: '200px',
    style: 'line',
    waveColor: '#ff6b6b',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '线条波形',
    color: '#ff6b6b',
    fontSize: '20rpx',
    x: '25vw',
    y: '55vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 柱状波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '50vw',
    y: '40vh',
    width: '400px',
    height: '200px',
    style: 'bars',
    waveColor: '#4ecdc4',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '柱状波形',
    color: '#4ecdc4',
    fontSize: '20rpx',
    x: '50vw',
    y: '55vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 圆形波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '75vw',
    y: '40vh',
    width: '400px',
    height: '200px',
    style: 'circle',
    waveColor: '#ffe66d',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '圆形波形',
    color: '#ffe66d',
    fontSize: '20rpx',
    x: '75vw',
    y: '55vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 粒子波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '25vw',
    y: '70vh',
    width: '400px',
    height: '200px',
    style: 'particles',
    waveColor: '#a8e6cf',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '粒子波形',
    color: '#a8e6cf',
    fontSize: '20rpx',
    x: '25vw',
    y: '85vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 频谱波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '50vw',
    y: '70vh',
    width: '400px',
    height: '200px',
    style: 'spectrum',
    waveColor: '#ff8b94',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '频谱波形',
    color: '#ff8b94',
    fontSize: '20rpx',
    x: '50vw',
    y: '85vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 螺旋波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '75vw',
    y: '70vh',
    width: '400px',
    height: '200px',
    style: 'spiral',
    waveColor: '#c7ceea',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '螺旋波形',
    color: '#c7ceea',
    fontSize: '20rpx',
    x: '75vw',
    y: '85vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  });

// ========== 第五部分：高级示波器效果 ==========
const advancedOscilloscopeTrack = builder.createTrack({ zIndex: 5, name: '高级示波器' });
const advancedOscilloscopeScene = advancedOscilloscopeTrack.createScene({ duration: 10, startTime: 30 })
  .addBackground({ color: '#0a0a0a' })
  .addText({
    text: '高级音频可视化效果',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  // Blob 球体碰撞
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '25vw',
    y: '40vh',
    width: '400px',
    height: '400px',
    style: 'blob',
    waveColor: '#ff6b6b',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: 'Blob 球体碰撞',
    color: '#ff6b6b',
    fontSize: '20rpx',
    x: '25vw',
    y: '65vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 3D旋转波形
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '50vw',
    y: '40vh',
    width: '400px',
    height: '400px',
    style: 'rotating3d',
    waveColor: '#4ecdc4',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '3D旋转波形',
    color: '#4ecdc4',
    fontSize: '20rpx',
    x: '50vw',
    y: '65vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 粒子轨迹追踪
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '75vw',
    y: '40vh',
    width: '400px',
    height: '400px',
    style: 'trail',
    waveColor: '#ffe66d',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '粒子轨迹追踪',
    color: '#ffe66d',
    fontSize: '20rpx',
    x: '75vw',
    y: '65vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 波形编织
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '25vw',
    y: '75vh',
    width: '400px',
    height: '200px',
    style: 'weave',
    waveColor: '#a8e6cf',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '波形编织',
    color: '#a8e6cf',
    fontSize: '20rpx',
    x: '25vw',
    y: '90vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 光波扩散
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '50vw',
    y: '75vh',
    width: '400px',
    height: '200px',
    style: 'lightwave',
    waveColor: '#ff8b94',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '光波扩散',
    color: '#ff8b94',
    fontSize: '20rpx',
    x: '50vw',
    y: '90vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  })
  // 粒子流
  .addOscilloscope({
    audioPath: path.join(__dirname, '../assets/happy-day.mp3'),
    x: '75vw',
    y: '75vh',
    width: '400px',
    height: '200px',
    style: 'particleflow',
    waveColor: '#c7ceea',
    duration: 10,
    startTime: 0
  })
  .addText({
    text: '粒子流',
    color: '#c7ceea',
    fontSize: '20rpx',
    x: '75vw',
    y: '90vh',
    textAlign: 'center',
    duration: 10,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei'
  });

// ========== 第六部分：字幕功能 ==========
const subtitleTrack = builder.createTrack({ zIndex: 8, name: '字幕' });
const subtitleScene = subtitleTrack.createScene({ duration: 8, startTime: 40 })
  .addBackground({ color: '#2d3436' })
  .addText({
    text: '字幕功能',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 8,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  .addText({
    text: '支持 LRC 字幕文件',
    color: '#ffffff',
    fontSize: '36rpx',
    x: '50vw',
    y: '30vh',
    textAlign: 'center',
    duration: 3,
    startTime: 1,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeInUp']
  })
  .addText({
    text: '支持时间轴精确控制',
    color: '#ffffff',
    fontSize: '36rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 3,
    startTime: 3,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeInUp']
  })
  .addText({
    text: '支持自定义样式和动画',
    color: '#ffffff',
    fontSize: '36rpx',
    x: '50vw',
    y: '70vh',
    textAlign: 'center',
    duration: 3,
    startTime: 5,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeInUp']
  });

// ========== 第七部分：转场效果 ==========
const transitionTrack = builder.createTrack({ zIndex: 5, name: '转场' });
const transitionScene1 = transitionTrack.createScene({ duration: 3, startTime: 48 })
  .addBackground({ color: '#6c5ce7' })
  .addText({
    text: '转场效果',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 3,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

const transitionScene2 = transitionTrack.createScene({ duration: 3, startTime: 51 })
  .addBackground({ color: '#00b894' })
  .addText({
    text: '支持多种转场动画',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 3,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// 在轨道上添加转场
transitionTrack.addTransition({
  type: 'fade',
  duration: 1,
  startTime: 51 // 转场开始时间
});

// ========== 第八部分：嵌套合成 ==========
const nestedTrack = builder.createTrack({ zIndex: 5, name: '嵌套合成' });
const nestedScene = nestedTrack.createScene({ duration: 6, startTime: 54 })
  .addBackground({ color: '#2d3436' })
  .addText({
    text: '嵌套合成功能',
    color: '#ffffff',
    fontSize: '48rpx',
    x: '50vw',
    y: '8vh',
    textAlign: 'center',
    duration: 6,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  .addText({
    text: '支持多层嵌套',
    color: '#ffffff',
    fontSize: '32rpx',
    x: '50vw',
    y: '30vh',
    textAlign: 'center',
    duration: 3,
    startTime: 1,
    fontFamily: 'MicrosoftYaHei',
    animations: ['zoomIn']
  })
  .addText({
    text: '支持独立时间轴',
    color: '#ffffff',
    fontSize: '32rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 3,
    startTime: 2.5,
    fontFamily: 'MicrosoftYaHei',
    animations: ['zoomIn']
  })
  .addText({
    text: '支持独立动画控制',
    color: '#ffffff',
    fontSize: '32rpx',
    x: '50vw',
    y: '70vh',
    textAlign: 'center',
    duration: 3,
    startTime: 4,
    fontFamily: 'MicrosoftYaHei',
    animations: ['zoomIn']
  });

// ========== 第九部分：总结 ==========
const summaryTrack = builder.createTrack({ zIndex: 10, name: '总结' });
const summaryScene = summaryTrack.createScene({ duration: 8, startTime: 60 })
  .addBackground({ color: '#000000' })
  .addText({
    text: 'FKNew 视频制作库',
    color: '#ffffff',
    fontSize: '64rpx',
    x: '50vw',
    y: '35vh',
    textAlign: 'center',
    duration: 8,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    stroke: true,
    strokeColor: '#000000',
    strokeWidth: 3,
    animations: ['bigIn']
  })
  .addText({
    text: '功能完整 | 易于使用 | 性能优秀',
    color: '#4ecdc4',
    fontSize: '36rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 6,
    startTime: 2,
    fontFamily: 'MicrosoftYaHei',
    split: 'letter',
    splitDelay: 0.05,
    splitDuration: 0.3,
    animations: ['fadeInUp']
  })
  .addText({
    text: '支持文本、图片、形状、音频可视化、视频、字幕等',
    color: '#ffffff',
    fontSize: '28rpx',
    x: '50vw',
    y: '65vh',
    textAlign: 'center',
    duration: 5,
    startTime: 3,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  .addText({
    text: '丰富的动画效果和转场',
    color: '#ffe66d',
    fontSize: '28rpx',
    x: '50vw',
    y: '75vh',
    textAlign: 'center',
    duration: 4,
    startTime: 4,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  })
  .addText({
    text: '感谢使用！',
    color: '#ff6b6b',
    fontSize: '48rpx',
    x: '50vw',
    y: '88vh',
    textAlign: 'center',
    duration: 3,
    startTime: 5.5,
    fontFamily: 'MicrosoftYaHei',
    animations: ['bounceIn']
  });

// ========== 导出视频 ==========
async function main() {
  const outputPath = path.join(__dirname, '../output/feature-showcase.mp4');
  console.log('开始渲染功能展示视频...');
  console.log('总时长:', builder.getTotalDuration(), '秒');
  
  await builder.export(outputPath, {
    // 可以添加导出选项
  });
  
  console.log(`视频已生成: ${outputPath}`);
  builder.destroy();
}

main().catch(console.error);

