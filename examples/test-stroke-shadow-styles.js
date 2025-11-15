import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试文本 Stroke Style 和 Shadow Style
 */
async function testStrokeShadowStyles() {
  console.log('✨ 文本 Stroke Style 和 Shadow Style 测试...\n');

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 场景1: Stroke Style - 实线、虚线、点线
  const scene1 = mainTrack.createScene({ duration: 3, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "实线描边",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "25%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FF0000',
      strokeWidth: 4,
      strokeStyle: 'solid',
    })
    .addText({
      text: "虚线描边",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#00FF00',
      strokeWidth: 4,
      strokeStyle: 'dashed',
      strokeDashArray: [10, 5],
    })
    .addText({
      text: "点线描边",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "75%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#0000FF',
      strokeWidth: 4,
      strokeStyle: 'dotted',
      strokeDashArray: [3, 5],
    });

  // 场景2: Stroke Style - 线帽样式
  const scene2 = mainTrack.createScene({ duration: 3, startTime: 3 })
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: "平头线帽",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "25%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFD700',
      strokeWidth: 6,
      strokeCap: 'butt',
    })
    .addText({
      text: "圆头线帽",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FF1493',
      strokeWidth: 6,
      strokeCap: 'round',
    })
    .addText({
      text: "方头线帽",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "75%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#00FFFF',
      strokeWidth: 6,
      strokeCap: 'square',
    });

  // 场景3: Stroke Style - 连接样式
  const scene3 = mainTrack.createScene({ duration: 3, startTime: 6 })
    .addBackground({ color: '#34495e' })
    .addText({
      text: "尖角连接",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "25%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FF6B6B',
      strokeWidth: 5,
      strokeJoin: 'miter',
      strokeMiterLimit: 4,
    })
    .addText({
      text: "圆角连接",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#4ECDC4',
      strokeWidth: 5,
      strokeJoin: 'round',
    })
    .addText({
      text: "斜角连接",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "75%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#95E1D3',
      strokeWidth: 5,
      strokeJoin: 'bevel',
    });

  // 场景4: Shadow Style - 外阴影
  const scene4 = mainTrack.createScene({ duration: 3, startTime: 9 })
    .addBackground({ color: '#16213e' })
    .addText({
      text: "外阴影效果",
      color: "#FFFFFF",
      fontSize: 90,
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
      text: "彩色外阴影",
      color: "#FFD700",
      fontSize: 90,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textShadow: true,
      textShadowStyle: 'outer',
      textShadowColor: '#FF0000',
      textShadowOffsetX: 8,
      textShadowOffsetY: 8,
      textShadowBlur: 15,
      textShadowOpacity: 0.8,
    });

  // 场景5: Shadow Style - 内阴影
  const scene5 = mainTrack.createScene({ duration: 3, startTime: 12 })
    .addBackground({ color: '#0f3460' })
    .addText({
      text: "内阴影效果",
      color: "#FFFFFF",
      fontSize: 90,
      x: "50%",
      y: "30%",
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
    })
    .addText({
      text: "彩色内阴影",
      color: "#00FFFF",
      fontSize: 90,
      x: "50%",
      y: "60%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      textShadow: true,
      textShadowStyle: 'inner',
      textShadowColor: '#FF1493',
      textShadowOffsetX: 4,
      textShadowOffsetY: 4,
      textShadowBlur: 12,
      textShadowOpacity: 0.7,
    });

  // 场景6: 组合效果 - Stroke + Shadow
  const scene6 = mainTrack.createScene({ duration: 3, startTime: 15 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "虚线+外阴影",
      color: "#FFD700",
      fontSize: 75,
      x: "50%",
      y: "25%",
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
      fontSize: 75,
      x: "50%",
      y: "50%",
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
    })
    .addText({
      text: "圆角+外阴影",
      color: "#FF1493",
      fontSize: 75,
      x: "50%",
      y: "75%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 5,
      strokeCap: 'round',
      strokeJoin: 'round',
      textShadow: true,
      textShadowStyle: 'outer',
      textShadowColor: '#000000',
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
      textShadowBlur: 10,
      textShadowOpacity: 0.7,
    });

  // 场景7: 高级组合效果
  const scene7 = mainTrack.createScene({ duration: 3, startTime: 18 })
    .addBackground({ color: '#533483' })
    .addText({
      text: "完整样式组合",
      color: "#FFFFFF",
      fontSize: 70,
      x: "50%",
      y: "40%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFD700',
      strokeWidth: 4,
      strokeStyle: 'dashed',
      strokeDashArray: [10, 5],
      strokeCap: 'round',
      strokeJoin: 'round',
      textShadow: true,
      textShadowStyle: 'outer',
      textShadowColor: '#000000',
      textShadowOffsetX: 7,
      textShadowOffsetY: 7,
      textShadowBlur: 15,
      textShadowOpacity: 0.8,
      textShadowSpread: 2,
    })
    .addText({
      text: "内阴影+虚线",
      color: "#FF6B6B",
      fontSize: 70,
      x: "50%",
      y: "70%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 3,
      stroke: true,
      strokeColor: '#FFFFFF',
      strokeWidth: 3,
      strokeStyle: 'dotted',
      strokeDashArray: [4, 4],
      strokeCap: 'square',
      textShadow: true,
      textShadowStyle: 'inner',
      textShadowColor: '#000000',
      textShadowOffsetX: 3,
      textShadowOffsetY: 3,
      textShadowBlur: 10,
      textShadowOpacity: 0.6,
    });

  const outputPath = path.join(outputDir, 'test-stroke-shadow-styles.mp4');

  try {
    console.log('\n🎬 开始渲染...');
    const startTime = Date.now();
    const videoMaker = builder.build();
    await videoMaker.export(outputPath);
    const endTime = Date.now();
    
    console.log('');
    console.log('✅ Stroke Style 和 Shadow Style 测试完成！');
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

testStrokeShadowStyles().catch(console.error);

