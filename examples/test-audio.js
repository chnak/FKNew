import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAudio() {
  console.log('=== 测试音频功能 ===');
  
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });
  
  // 场景1：添加背景和文本，并添加音频
  const scene1 = mainTrack.createScene({ duration: 10 })
    .addBackground({ color: '#4a90e2', duration: 5 })
    .addText({
      text: "场景1：带音频的视频",
      color: "#ffffff",
      fontSize: 64,
      x: "50%",
      y: "40%",
      textAlign: "center",
      duration: 5,
      startTime: 0,
      zIndex: 1,
    })
    .addAudio({
      src: path.join(__dirname, '../assets/music_11.mp3'),
      startTime: 0,        // 在视频中的开始时间
      duration: 5,         // 在视频中的持续时间
      cutFrom: 0,          // 从音频文件的第0秒开始裁剪
      cutTo: 5,            // 裁剪到音频文件的第5秒
      volume: 0.8,         // 音量 80%
      fadeIn: 0.5,         // 淡入 0.5秒
      fadeOut: 0.5,        // 淡出 0.5秒
    });

  // 场景2：添加另一个音频（从音频文件的中间部分裁剪）
  const scene2 = mainTrack.createScene({ duration: 5 })
    .addBackground({ color: '#e24a4a', duration: 10 })
    .addText({
      text: "场景2：裁剪音频片段",
      color: "#ffffff",
      fontSize: 64,
      x: "50%",
      y: "40%",
      textAlign: "center",
      duration: 10,
      startTime: 0,
      zIndex: 1,
    })
    .addAudio({
      src: path.join(__dirname, '../assets/winxp.mp3'),
      startTime: 0,        // 在视频中的开始时间
      duration: 10,        // 在视频中的持续时间
      volume: 0.7,         // 音量 70%
      fadeIn: 0.5,         // 淡入 0.5秒
      fadeOut: 0.5,        // 淡出 0.5秒
    });

  // 场景3：添加多个音频（测试音频混合）
  const scene3 = mainTrack.createScene({ duration: 5 })
    .addBackground({ color: '#4ae24a', duration: 5 })
    .addText({
      text: "场景3：多个音频混合",
      color: "#ffffff",
      fontSize: 64,
      x: "50%",
      y: "40%",
      textAlign: "center",
      duration: 5,
      startTime: 0,
      zIndex: 1,
    })
    .addAudio({
      src: path.join(__dirname, '../assets/music_11.mp3'),
      startTime: 0,
      duration: 5,
      cutFrom: 0,
      cutTo: 5,
      volume: 0.5,         // 音量 50%（用于混合）
      fadeIn: 0.3,
      fadeOut: 0.3,
    })
    .addAudio({
      src: path.join(__dirname, '../assets/winxp.mp3'),
      startTime: 0,
      duration: 5,
      volume: 0.3,         // 音量 30%（用于混合）
      fadeIn: 0.3,
      fadeOut: 0.3,
    });

  const videoMaker = builder.build();
  
  console.log('开始导出视频...');
  const outputPath = path.join(__dirname, '../output/test-audio.mp4');
  await fs.ensureDir(path.dirname(outputPath));
  
  await videoMaker.export(outputPath);
  
  console.log(`视频已生成: ${outputPath}`);
  videoMaker.destroy();
}

testAudio().catch(console.error);

