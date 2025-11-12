/**
 * VideoBuilder 使用示例
 * 演示多轨道多场景的链式编码
 */
import { VideoBuilder } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function videoBuilderExample() {
  console.log('创建 VideoBuilder 示例...\n');

  // 创建视频构建器
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
    backgroundColor: '#1a1a1a',
  });

  // 创建轨道1
  const track1 = builder.createTrack({ zIndex: 1 });

  // 创建场景1
  const scene1 = track1.createScene({ duration: 10 });
  scene1
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: '场景 1',
      x: '50%',
      y: '40%',
      fontSize: 72,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addRect({
      x: '50%',
      y: '60%',
      width: 400,
      height: 100,
      bgcolor: '#3498db',
      borderRadius: 10,
      anchor: [0.5, 0.5],
    });

  // 创建场景2
  const scene2 = track1.createScene({ duration: 10 });
  scene2
    .addBackground({ color: '#34495e' })
    .addText({
      text: '场景 2',
      x: '50%',
      y: '40%',
      fontSize: 72,
      fontFamily: 'PatuaOne',
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    })
    .addCircle({
      x: '50%',
      y: '60%',
      radius: 80,
      bgcolor: '#e74c3c',
      anchor: [0.5, 0.5],
    });

  // 添加转场效果（使用 gl-transitions）
  track1.addTransition({
    name: 'fade', // 使用 gl-transitions 的转场名称
    duration: 1,
    fromSceneIndex: 0,
    toSceneIndex: 1,
    easing: 'easeInOutQuad',
  });

  // 创建轨道2（叠加层）
  const track2 = builder.createTrack({ zIndex: 2 });

  // 轨道2的场景1
  const track2Scene1 = track2.createScene({ duration: 5 });
  track2Scene1
    .addText({
      text: '叠加文本',
      x: '50%',
      y: '10%',
      fontSize: 48,
      fontFamily: 'PatuaOne',
      color: '#f39c12',
      textAlign: 'center',
    });

  // 轨道2的场景2
  const track2Scene2 = track2.createScene({ duration: 5, startTime: 5 });
  track2Scene2
    .addText({
      text: '另一个叠加文本',
      x: '50%',
      y: '90%',
      fontSize: 48,
      fontFamily: 'PatuaOne',
      color: '#9b59b6',
      textAlign: 'center',
    });

  // 导出视频
  const outputPath = path.join(__dirname, '../output/video-builder-example.mp4');
  console.log('开始导出视频...');
  console.log(`总时长: ${builder.getTotalDuration()} 秒`);
  console.log(`轨道数: ${builder.getTracks().length}`);
  
  await builder.export(outputPath);
  console.log(`✅ 视频导出完成: ${outputPath}`);

  builder.destroy();
}

videoBuilderExample().catch(console.error);

