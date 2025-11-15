import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试文本效果
 */
async function testTextEffects() {
  console.log('✨ 文本效果测试...\n');

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 场景1: 文本阴影效果
  const scene1 = mainTrack.createScene({ duration: 3, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "文本阴影效果",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textShadow: true,
      textShadowBlur: 10,
      textShadowColor: '#000000',
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
    })
    .addText({
      text: "彩色阴影",
      color: "#FFD700",
      fontSize: 80,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textShadow: true,
      textShadowBlur: 15,
      textShadowColor: '#FF0000',
      textShadowOffsetX: 8,
      textShadowOffsetY: 8,
    })
    .addText({
      text: "柔和阴影",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textShadow: true,
      textShadowBlur: 20,
      textShadowColor: '#000000',
      textShadowOffsetX: 3,
      textShadowOffsetY: 3,
    });

  // 场景2: 文本发光效果
  const scene2 = mainTrack.createScene({ duration: 3, startTime: 3 })
    .addBackground({ color: '#16213e' })
    .addText({
      text: "文本发光效果",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textGlow: true,
      textGlowBlur: 15,
      textGlowColor: '#00FFFF',
      textGlowIntensity: 1.5,
    })
    .addText({
      text: "金色发光",
      color: "#FFD700",
      fontSize: 80,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textGlow: true,
      textGlowBlur: 20,
      textGlowColor: '#FFD700',
      textGlowIntensity: 2,
    })
    .addText({
      text: "红色发光",
      color: "#FF0000",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textGlow: true,
      textGlowBlur: 25,
      textGlowColor: '#FF0000',
      textGlowIntensity: 1.8,
    });

  // 场景3: 渐变文字
  const scene3 = mainTrack.createScene({ duration: 3, startTime: 6 })
    .addBackground({ color: '#0f3460' })
    .addText({
      text: "渐变文字效果",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      gradient: true,
      gradientType: 'linear',
      gradientColors: ['#FF0000', '#00FF00', '#0000FF'],
      gradientStops: [0, 0.5, 1],
      gradientAngle: 0,
    })
    .addText({
      text: "垂直渐变",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      gradient: true,
      gradientType: 'linear',
      gradientColors: ['#FFD700', '#FF1493'],
      gradientAngle: 90,
    })
    .addText({
      text: "径向渐变",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      gradient: true,
      gradientType: 'radial',
      gradientColors: ['#FFFFFF', '#000000'],
      gradientX: 0.5,
      gradientY: 0.5,
    });

  // 场景4: 文本背景
  const scene4 = mainTrack.createScene({ duration: 3, startTime: 9 })
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: "文本背景效果",
      color: "#FFFFFF",
      fontSize: 60,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textBackground: true,
      textBackgroundColor: '#000000',
      textBackgroundOpacity: 0.7,
      textBackgroundPadding: 10,
      textBackgroundRadius: 10,
    })
    .addText({
      text: "彩色背景",
      color: "#FFFFFF",
      fontSize: 60,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textBackground: true,
      textBackgroundColor: '#FF1493',
      textBackgroundOpacity: 0.8,
      textBackgroundPadding: 15,
      textBackgroundRadius: 15,
    })
    .addText({
      text: "圆角背景",
      color: "#FFFFFF",
      fontSize: 60,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textBackground: true,
      textBackgroundColor: '#4A90E2',
      textBackgroundOpacity: 0.6,
      textBackgroundPadding: 20,
      textBackgroundRadius: 25,
    });

  // 场景5: 描边效果
  const scene5 = mainTrack.createScene({ duration: 3, startTime: 12 })
    .addBackground({ color: '#533483' })
    .addText({
      text: "描边效果",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      stroke: true,
      strokeColor: '#000000',
      strokeWidth: 3,
    })
    .addText({
      text: "彩色描边",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      stroke: true,
      strokeColor: '#FF0000',
      strokeWidth: 5,
    })
    .addText({
      text: "粗描边",
      color: "#FFD700",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      stroke: true,
      strokeColor: '#000000',
      strokeWidth: 8,
    });

  // 场景6: 组合效果
  const scene6 = mainTrack.createScene({ duration: 3, startTime: 15 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "组合效果",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "30%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      textShadow: true,
      textShadowBlur: 10,
      textShadowColor: '#000000',
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
      textGlow: true,
      textGlowBlur: 15,
      textGlowColor: '#00FFFF',
      textGlowIntensity: 1.2,
      stroke: true,
      strokeColor: '#000000',
      strokeWidth: 2,
    })
    .addText({
      text: "渐变+发光+阴影",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      split: 'letter',
      gradient: true,
      gradientType: 'linear',
      gradientColors: ['#FFD700', '#FF1493'],
      gradientAngle: 45,
      textGlow: true,
      textGlowBlur: 20,
      textGlowColor: '#FFD700',
      textGlowIntensity: 1.5,
      textShadow: true,
      textShadowBlur: 15,
      textShadowColor: '#000000',
      textShadowOffsetX: 8,
      textShadowOffsetY: 8,
    });

  // 场景7: 混合模式和模糊
  const scene7 = mainTrack.createScene({ duration: 3, startTime: 18 })
    .addBackground({ color: '#16213e' })
    .addText({
      text: "混合模式",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "30%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textBlendMode: 'screen',
    })
    .addText({
      text: "模糊效果",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textBlur: 5,
    });

  // 场景8: Stroke Style（描边样式）
  const scene8 = mainTrack.createScene({ duration: 3, startTime: 21 })
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: "虚线描边",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "20%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FF0000',
      strokeWidth: 3,
      strokeStyle: 'dashed',
      strokeDashArray: [10, 5],
    })
    .addText({
      text: "点线描边",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#00FF00',
      strokeWidth: 3,
      strokeStyle: 'dotted',
      strokeDashArray: [2, 4],
    })
    .addText({
      text: "圆角线帽",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#0000FF',
      strokeWidth: 5,
      strokeCap: 'round',
      strokeJoin: 'round',
    })
    .addText({
      text: "方角线帽",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "80%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFFF00',
      strokeWidth: 5,
      strokeCap: 'square',
      strokeJoin: 'bevel',
    });

  // 场景9: Shadow Style（阴影样式）
  const scene9 = mainTrack.createScene({ duration: 3, startTime: 24 })
    .addBackground({ color: '#34495e' })
    .addText({
      text: "外阴影",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "30%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textShadow: true,
      textShadowStyle: 'outer',
      textShadowColor: '#000000',
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
      textShadowBlur: 10,
      textShadowOpacity: 0.7,
    })
    .addText({
      text: "内阴影",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textShadow: true,
      textShadowStyle: 'inner',
      textShadowColor: '#000000',
      textShadowOffsetX: 3,
      textShadowOffsetY: 3,
      textShadowBlur: 8,
      textShadowOpacity: 0.6,
    });

  // 场景10: 组合样式
  const scene10 = mainTrack.createScene({ duration: 3, startTime: 27 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "虚线+外阴影",
      color: "#FFD700",
      fontSize: 70,
      x: "50%",
      y: "30%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FF0000',
      strokeWidth: 3,
      strokeStyle: 'dashed',
      strokeDashArray: [8, 4],
      strokeCap: 'round',
      textShadow: true,
      textShadowStyle: 'outer',
      textShadowColor: '#000000',
      textShadowOffsetX: 6,
      textShadowOffsetY: 6,
      textShadowBlur: 12,
      textShadowOpacity: 0.8,
    })
    .addText({
      text: "点线+内阴影",
      color: "#00FFFF",
      fontSize: 70,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 2,
      strokeStyle: 'dotted',
      strokeDashArray: [3, 3],
      textShadow: true,
      textShadowStyle: 'inner',
      textShadowColor: '#000000',
      textShadowOffsetX: 2,
      textShadowOffsetY: 2,
      textShadowBlur: 6,
      textShadowOpacity: 0.5,
    });

  const outputPath = path.join(outputDir, 'test-text-effects.mp4');

  try {
    console.log('\n🎬 开始渲染...');
    const startTime = Date.now();
    const videoMaker = builder.build();
    await videoMaker.export(outputPath);
    const endTime = Date.now();
    
    console.log('');
    console.log('✅ 文本效果测试完成！');
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`⏱️  耗时: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);
    
    videoMaker.destroy();
    builder.destroy();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.stack) {
      console.error('详细错误:', error.stack);
    }
  }
}

testTextEffects().catch(console.error);

