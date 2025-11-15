import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 简单测试文本效果（只测试一个效果）
 */
async function testTextEffectsSimple() {
  console.log('✨ 简单文本效果测试...\n');

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 只测试阴影效果
  const scene1 = mainTrack.createScene({ duration: 2, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: "阴影效果",
      color: "#FFFFFF",
      fontSize: 100,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 2,
      textShadow: true,
      textShadowBlur: 10,
      textShadowColor: '#000000',
      textShadowOffsetX: 5,
      textShadowOffsetY: 5,
    });

  // 只测试发光效果
  const scene2 = mainTrack.createScene({ duration: 2, startTime: 2 })
    .addBackground({ color: '#16213e' })
    .addText({
      text: "发光效果",
      color: "#FFFFFF",
      fontSize: 100,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 2,
      textGlow: true,
      textGlowBlur: 15,
      textGlowColor: '#00FFFF',
      textGlowIntensity: 1.5,
    });

  // 只测试渐变效果
  const scene3 = mainTrack.createScene({ duration: 2, startTime: 4 })
    .addBackground({ color: '#0f3460' })
    .addText({
      text: "渐变效果",
      color: "#FFFFFF",
      fontSize: 100,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 2,
      gradient: true,
      gradientType: 'linear',
      gradientColors: ['#FF0000', '#00FF00', '#0000FF'],
      gradientAngle: 0,
    });

  const outputPath = path.join(outputDir, 'test-text-effects-simple.mp4');

  try {
    console.log('\n🎬 开始渲染...');
    const startTime = Date.now();
    const videoMaker = builder.build();
    await videoMaker.export(outputPath);
    const endTime = Date.now();
    
    console.log('');
    console.log('✅ 简单文本效果测试完成！');
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

testTextEffectsSimple().catch(console.error);

