import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试重构后的 VideoBuilder（不使用 CompositionElement）
 */
async function testBuilderRefactored() {
  console.log('=== 测试重构后的 VideoBuilder（直接使用 Layer）===\n');
  
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  // 创建轨道1：背景轨道
  const track1 = builder.createTrack({ zIndex: 0 });
  
  // 场景1：蓝色背景（0-10秒）
  track1.createScene({ duration: 10 })
    .addBackground({ color: '#4a90e2' });
  
  // 场景2：绿色背景（10-20秒）
  track1.createScene({ duration: 10 })
    .addBackground({ color: '#2ecc71' });
  
  // 场景3：红色背景（20-30秒）
  track1.createScene({ duration: 10 })
    .addBackground({ color: '#e74c3c' });

  // 创建轨道2：标题轨道
  const track2 = builder.createTrack({ zIndex: 1 });
  
  // 场景1：标题1（0-10秒）
  track2.createScene({ duration: 10 })
    .addText({
      text: "场景 1：蓝色背景",
      color: "#ffffff",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 1,
    });
  
  // 场景2：标题2（10-20秒）
  track2.createScene({ duration: 10 })
    .addText({
      text: "场景 2：绿色背景",
      color: "#ffffff",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 1,
    });
  
  // 场景3：标题3（20-30秒）
  track2.createScene({ duration: 10 })
    .addText({
      text: "场景 3：红色背景",
      color: "#ffffff",
      fontSize: 80,
      x: "50%",
      y: "20%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 1,
    });

  // 创建轨道3：字幕轨道
  const track3 = builder.createTrack({ zIndex: 2 });
  
  // 场景1：字幕1（0-10秒）
  track3.createScene({ duration: 10 })
    .addText({
      text: "这是第一个场景的字幕内容",
      color: "#ffffff",
      fontSize: 48,
      x: "50%",
      y: "80%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 2,
    });
  
  // 场景2：字幕2（10-20秒）
  track3.createScene({ duration: 10 })
    .addText({
      text: "这是第二个场景的字幕内容",
      color: "#ffffff",
      fontSize: 48,
      x: "50%",
      y: "80%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 2,
    });
  
  // 场景3：字幕3（20-30秒）
  track3.createScene({ duration: 10 })
    .addText({
      text: "这是第三个场景的字幕内容",
      color: "#ffffff",
      fontSize: 48,
      x: "50%",
      y: "80%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 2,
    });

  // 构建 VideoMaker
  const videoMaker = builder.build();
  
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'test-builder-refactored.mp4');
  
  console.log('开始渲染视频...');
  console.log(`轨道数: ${videoMaker.getLayers().length}`);
  console.log(`总元素数: ${videoMaker.getLayers().reduce((sum, layer) => sum + layer.getElements().length, 0)}`);
  
  const startTime = Date.now();
  await videoMaker.export(outputPath);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ 视频导出完成: ${outputPath}`);
  console.log(`⏱️  总耗时: ${duration} 秒`);
  console.log(`📊 平均每帧: ${(duration / 900 * 1000).toFixed(2)} ms (900帧)`);
  
  videoMaker.destroy();
  builder.destroy();
}

testBuilderRefactored().catch(console.error);

