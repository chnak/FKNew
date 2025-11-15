/**
 * 测试多轨道多场景的情况
 */
import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testMultiTrackScenes() {
  console.log('🎬 测试多轨道多场景...\n');

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);

  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  // ========== 轨道1：主内容（带转场效果）==========
  const track1 = builder.createTrack({ zIndex: 1, name: '主内容' });
  
  const scene1 = track1.createScene({ duration: 3, startTime: 0 });
  scene1
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '场景1 - 轨道1',
      color: '#FFFFFF',
      fontSize: 80,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn'],
    });

  const scene2 = track1.createScene({ duration: 3, startTime: 3 });
  scene2
    .addBackground({ color: '#2d3436' })
    .addText({
      text: '场景2 - 轨道1',
      color: '#FFFFFF',
      fontSize: 80,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn'],
    });

  const scene3 = track1.createScene({ duration: 3, startTime: 6 });
  scene3
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '场景3 - 轨道1',
      color: '#FFFFFF',
      fontSize: 80,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn'],
    });

  // 添加转场效果（轨道1内部）
  track1.addTransition({
    fromScene: scene1,
    toScene: scene2,
    name: 'fade',
    duration: 1,
  });

  track1.addTransition({
    fromScene: scene2,
    toScene: scene3,
    name: 'directional-left',
    duration: 1,
  });

  // ========== 轨道2：叠加层（无转场效果）==========
  const track2 = builder.createTrack({ zIndex: 2, name: '叠加层' });
  
  const overlay1 = track2.createScene({ duration: 5, startTime: 0 });
  overlay1
    .addText({
      text: '叠加层 - 场景1',
      color: '#FFD700',
      fontSize: 50,
      x: '50%',
      y: '15%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 5,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#FFD700',
      textShadowBlur: 20,
    });

  const overlay2 = track2.createScene({ duration: 4, startTime: 5 });
  overlay2
    .addText({
      text: '叠加层 - 场景2',
      color: '#4ECDC4',
      fontSize: 50,
      x: '50%',
      y: '85%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: 4,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#4ECDC4',
      textShadowBlur: 20,
    });

  // ========== 轨道3：装饰元素（全程显示）==========
  const track3 = builder.createTrack({ zIndex: 3, name: '装饰元素' });
  
  const decoration = track3.createScene({ duration: 9, startTime: 0 });
  decoration
    .addCircle({
      x: '10%',
      y: '10%',
      radius: 50,
      bgcolor: '#FF6B6B',
      anchor: [0.5, 0.5],
      duration: 9,
      animations: ['fadeIn'],
    })
    .addCircle({
      x: '90%',
      y: '90%',
      radius: 50,
      bgcolor: '#4ECDC4',
      anchor: [0.5, 0.5],
      duration: 9,
      animations: ['fadeIn'],
    });

  // 导出视频
  const outputPath = path.join(outputDir, 'test-multi-track-scenes.mp4');
  console.log(`🚀 开始导出视频...`);
  console.log(`输出路径: ${outputPath}\n`);
  console.log(`轨道数: ${builder.getTracks().length}`);
  
  for (let i = 0; i < builder.getTracks().length; i++) {
    const track = builder.getTracks()[i];
    console.log(`  轨道 ${i + 1} (${track.name}): ${track.scenes.length} 个场景, ${track.transitions.length} 个转场`);
  }
  console.log(`总时长: ${builder.getTotalDuration().toFixed(2)} 秒\n`);

  try {
    await builder.export(outputPath, {
      quality: 'high',
      bitrate: '10M',
    });
    
    console.log('✅ 视频导出成功！');
    console.log(`📁 文件位置: ${outputPath}`);
    console.log(`⏱️  总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  } catch (error) {
    console.error('❌ 导出失败:', error);
    throw error;
  } finally {
    builder.destroy();
  }
}

// 运行
testMultiTrackScenes().catch(console.error);

