/**
 * VideoBuilder 完整示例
 * 演示多轨道多场景的链式编码
 */
import { VideoBuilder } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function completeExample() {
  console.log('VideoBuilder 完整示例\n');

  // 创建视频构建器
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
    backgroundColor: '#000000',
  });

  // ========== 轨道1：主内容 ==========
  const track1 = builder.createTrack({ zIndex: 1 });

  // 场景1：开场
  const scene1 = track1.createScene({ duration: 5 });
  scene1
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: '欢迎观看',
      x: '50%',
      y: '40%',
      fontSize: 80,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addText({
      text: 'VideoBuilder 示例',
      x: '50%',
      y: '60%',
      fontSize: 60,
      fontFamily: 'PatuaOne',
      color: '#3498db',
      textAlign: 'center',
    });

  // 场景2：内容展示
  const scene2 = track1.createScene({ duration: 8 });
  scene2
    .addBackground({ color: '#34495e' })
    .addRect({
      x: '50%',
      y: '50%',
      width: 600,
      height: 400,
      bgcolor: '#3498db',
      borderRadius: 20,
      anchor: [0.5, 0.5],
    })
    .addText({
      text: '场景 2',
      x: '50%',
      y: '50%',
      fontSize: 72,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    });

  // 场景3：结束
  const scene3 = track1.createScene({ duration: 5 });
  scene3
    .addBackground({ color: '#2c3e50' })
    .addCircle({
      x: '50%',
      y: '50%',
      radius: 100,
      bgcolor: '#e74c3c',
      anchor: [0.5, 0.5],
    })
    .addText({
      text: '结束',
      x: '50%',
      y: '50%',
      fontSize: 64,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    });

  // 添加转场效果
  track1.addTransition({
    type: 'fade',
    duration: 1,
    fromSceneIndex: 0,
    toSceneIndex: 1,
  });

  track1.addTransition({
    type: 'fade',
    duration: 1,
    fromSceneIndex: 1,
    toSceneIndex: 2,
  });

  // ========== 轨道2：叠加层 ==========
  const track2 = builder.createTrack({ zIndex: 2 });

  // 叠加场景1（前10秒）
  const overlay1 = track2.createScene({ duration: 10 });
  overlay1.addText({
    text: '顶部标题',
    x: '50%',
    y: '10%',
    fontSize: 48,
    fontFamily: 'PatuaOne',
    color: '#f39c12',
    textAlign: 'center',
  });

  // 叠加场景2（后8秒）
  const overlay2 = track2.createScene({ duration: 8, startTime: 10 });
  overlay2.addText({
    text: '底部字幕',
    x: '50%',
    y: '90%',
    fontSize: 40,
    fontFamily: 'PatuaOne',
    color: '#9b59b6',
    textAlign: 'center',
  });

  // ========== 轨道3：装饰元素 ==========
  const track3 = builder.createTrack({ zIndex: 3 });

  // 装饰场景（全程显示）
  const decoration = track3.createScene({ duration: 18 });
  decoration
    .addRect({
      x: '10%',
      y: '10%',
      width: 200,
      height: 200,
      bgcolor: '#1abc9c',
      borderRadius: 10,
      anchor: [0.5, 0.5],
    })
    .addRect({
      x: '90%',
      y: '90%',
      width: 200,
      height: 200,
      bgcolor: '#e67e22',
      borderRadius: 10,
      anchor: [0.5, 0.5],
    });

  // 导出视频
  const outputPath = path.join(__dirname, '../output/video-builder-complete.mp4');
  console.log('开始导出视频...');
  console.log(`总时长: ${builder.getTotalDuration()} 秒`);
  console.log(`轨道数: ${builder.getTracks().length}`);
  
  for (let i = 0; i < builder.getTracks().length; i++) {
    const track = builder.getTracks()[i];
    console.log(`  轨道 ${i + 1}: ${track.scenes.length} 个场景, ${track.transitions.length} 个转场`);
  }
  
  await builder.export(outputPath);
  console.log(`\n✅ 视频导出完成: ${outputPath}`);

  builder.destroy();
}

completeExample().catch(console.error);

