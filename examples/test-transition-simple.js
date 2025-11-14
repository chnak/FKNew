/**
 * 简单的转场效果测试
 * 测试两个场景之间的转场
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

// 创建一个轨道
const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });

// 场景 1：红色背景
const scene1 = mainTrack.createScene({ duration: 2, startTime: 0 })
  .addBackground({ color: '#e74c3c' }) // 红色
  .addText({
    text: '场景 1 - 红色',
    color: '#ffffff',
    fontSize: '96rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// 场景 2：蓝色背景（转场：fade）
const scene2 = mainTrack.createScene({ duration: 2, startTime: 2 })
  .addBackground({ color: '#3498db' }) // 蓝色
  .addText({
    text: '场景 2 - 蓝色',
    color: '#ffffff',
    fontSize: '96rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// 添加 fade 转场（从场景1到场景2）
mainTrack.addTransition({
  name: 'fade',
  duration: 1, // 转场时长 1 秒
  startTime: 2, // 转场开始时间（场景2的开始时间）
});

// 场景 3：绿色背景（转场：wipe）
const scene3 = mainTrack.createScene({ duration: 2, startTime: 4 })
  .addBackground({ color: '#2ecc71' }) // 绿色
  .addText({
    text: '场景 3 - 绿色',
    color: '#ffffff',
    fontSize: '96rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// 添加 directional 转场（从场景2到场景3）
mainTrack.addTransition({
  name: 'directional-left',
  duration: 1,
  startTime: 4,
});

// 场景 4：紫色背景（转场：circle）
const scene4 = mainTrack.createScene({ duration: 2, startTime: 6 })
  .addBackground({ color: '#9b59b6' }) // 紫色
  .addText({
    text: '场景 4 - 紫色',
    color: '#ffffff',
    fontSize: '96rpx',
    x: '50vw',
    y: '50vh',
    textAlign: 'center',
    duration: 2,
    startTime: 0,
    fontFamily: 'MicrosoftYaHei',
    animations: ['fadeIn']
  });

// 添加 CircleCrop 转场（从场景3到场景4）
mainTrack.addTransition({
  name: 'CircleCrop',
  duration: 1,
  startTime: 6,
});

// 导出视频
async function main() {
  const outputPath = path.join(__dirname, '../output/test-transition-simple.mp4');
  console.log('开始渲染简单转场效果测试视频...');
  console.log('总时长:', builder.getTotalDuration(), '秒');
  console.log('场景数量:', mainTrack.scenes.length);
  console.log('转场数量:', mainTrack.transitions.length);
  console.log('\n转场列表:');
  mainTrack.transitions.forEach((t, i) => {
    console.log(`  ${i + 1}. ${t.name} - 开始时间: ${t.startTime}s, 时长: ${t.duration}s`);
  });
  
  await builder.export(outputPath, {
    usePipe: true, // 使用管道模式加速
  });
  
  console.log(`\n✅ 视频已生成: ${outputPath}`);
  console.log('\n注意：如果转场效果没有显示，可能需要实现转场渲染逻辑。');
  builder.destroy();
}

main().catch(console.error);

