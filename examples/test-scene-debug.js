import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试多场景显示（调试版本）
 */
async function testSceneDebug() {
  console.log('=== 测试多场景显示（调试）===\n');
  
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  // 创建轨道1：背景轨道
  const track1 = builder.createTrack({ zIndex: 0 });
  
  // 场景1：蓝色背景（0-5秒）
  track1.createScene({ duration: 5 })
    .addBackground({ color: '#4a90e2' });
  
  // 场景2：绿色背景（5-10秒）
  track1.createScene({ duration: 5 })
    .addBackground({ color: '#2ecc71' });
  
  // 场景3：红色背景（10-15秒）
  track1.createScene({ duration: 5 })
    .addBackground({ color: '#e74c3c' });

  // 构建 VideoMaker
  const videoMaker = builder.build();
  
  // 调试：打印所有元素的时间信息
  console.log('=== 元素时间信息 ===');
  for (const layer of videoMaker.getLayers()) {
    console.log(`\nLayer zIndex: ${layer.zIndex}`);
    for (const element of layer.getElements()) {
      console.log(`  Element: ${element.type}, startTime: ${element.startTime}, endTime: ${element.endTime}, duration: ${element.duration}`);
      if (element.type === 'rect' && element.config) {
        console.log(`    bgcolor: ${element.config.bgcolor}`);
      }
    }
  }
  
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'test-scene-debug.mp4');
  
  console.log('\n开始渲染视频...');
  const startTime = Date.now();
  await videoMaker.export(outputPath);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ 视频导出完成: ${outputPath}`);
  console.log(`⏱️  总耗时: ${duration} 秒`);
  
  videoMaker.destroy();
  builder.destroy();
}

testSceneDebug().catch(console.error);

