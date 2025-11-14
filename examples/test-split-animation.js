import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试文本分割动画
 */
async function testSplitAnimation() {
  console.log('🧪 测试文本分割动画...\n');

  const builder = new VideoBuilder({
    width: 720,
    height: 1280,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 创建场景
  const scene = mainTrack.createScene({ duration: 5 })
    .addBackground({ color: "#000000" })
    .addText({
      text: "测试文本",
      color: "#FFFFFF",
      fontSize: 80,
      x: "50%",
      y: "50%",
      textAlign: "center",
      anchor: [0.5, 0.5],
      duration: 5,
      startTime: 0,
      zIndex: 10,
      split: 'letter',
      splitDelay: 0.1, // 每个字母延迟 0.1 秒出现
      splitDuration: 0.5, // 每个字母动画时长 0.5 秒
      animations: ['bigIn','bigOut'],
    });

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, 'test-split-animation.mp4');

  try {
    console.log('🎬 开始渲染...');
    const videoMaker = builder.build();
    
    await videoMaker.export(outputPath);
    
    console.log('');
    console.log('✅ 测试完成！');
    console.log(`📁 输出文件: ${outputPath}`);
    
    videoMaker.destroy();
    builder.destroy();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  }
}

testSplitAnimation().catch(console.error);

