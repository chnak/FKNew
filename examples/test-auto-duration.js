import { VideoBuilder, getAudioDuration } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 测试自动检测音频时长功能
 * 使用多轨道构建器实现
 */
async function testAutoDuration() {
  console.log('🧪 测试自动检测音频时长功能...\n');

  const name = "帝女芳魂";
  const audioFile = path.join(__dirname, `../assets/${name}.mp3`);
  const lrcFile = path.join(__dirname, `../assets/${name}.lrc`);

  // 检查文件是否存在
  if (!await fs.pathExists(audioFile)) {
    console.error(`音频文件不存在: ${audioFile}`);
    return;
  }

  if (!await fs.pathExists(lrcFile)) {
    console.error(`LRC 文件不存在: ${lrcFile}`);
    return;
  }

  // 获取音频时长
  console.log('📊 正在获取音频时长...');
  const audioDuration = await getAudioDuration(audioFile);
  const audioDurationNum = Number(audioDuration) || 0;
  
  if (audioDurationNum <= 0) {
    console.error('无法获取音频时长');
    return;
  }

  console.log(`✅ 音频时长: ${audioDurationNum.toFixed(2)} 秒\n`);

  const builder = new VideoBuilder({
    width: 720,
    height: 1280,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });

  // 创建场景，使用音频时长作为场景时长
  const scene = mainTrack.createScene({ duration: audioDurationNum })
    .addBackground({ color: "#251F36" })
    .addText({
      text: name,
      color: "#FFFFFF",
      fontSize: 60,
      x: "50%",
      y: "18%",
      textAlign: "center",
      anchor: [0.5, 0.5], // 明确设置 anchor
      duration: audioDurationNum,
      startTime: 0,
      zIndex: 10, // 提高 zIndex，确保文本在示波器上方
      split: 'letter',
      splitDelay: 0.05, // 字母出现延迟
      splitDuration: 0.3, // 字母动画时长
      animations: [
        { type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.3 },
        { type: 'fade', fromOpacity: 1, toOpacity: 0, duration: 0.3, delay: audioDurationNum - 0.3 },
      ],
    });

  // 添加示波器（音频可视化器）- 多彩圆点粒子样式
  await scene.addOscilloscope({
    audioPath: audioFile,
    x: "50%",
    y: "50%",
    width: 600,
    height: 600,
    anchor: [0.5, 0.5], // 明确设置 anchor，确保位置正确
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    style: 'particles',
    mirror: true,
    sensitivity: 1.5,
    particleCount: 80,
    particleMinSize: 5,
    particleMaxSize: 25,
    particleColors: [
      '#ff0080', '#ff4080', '#ff8000', '#ffc000',
      '#ffff00', '#80ff00', '#00ff80', '#00ffff',
      '#0080ff', '#8000ff', '#ff00ff', '#ff0080',
    ],
    particleTrail: true,
    windowSize: 0.1, // 显示窗口 0.1 秒
    duration: audioDurationNum,
    startTime: 0,
    zIndex: 0, // 降低 zIndex，确保在文本下方
  });

  // 添加音频
  scene.addAudio({
    src: audioFile,
    volume: 1,
    duration: audioDurationNum,
    startTime: 0,
  });

  // 添加 LRC 歌词
  await scene.addLRC(lrcFile, {
    textColor: '#ffffff',
    fontSize: 38,
    x: '50%',
    y: '80%',
    textAlign: 'center',
    split: 'letter',
    minDuration: 1,
    maxDuration: 5,
    animations: [
      { type: 'fadeIn', duration: 0.3 },
      { type: 'fadeOut', duration: 0.3 },
    ],
  });

  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  const outputPath = path.join(outputDir, `${name}.mp4`);

  try {
    console.log('🎬 开始渲染（自动检测时长）...');
    const videoMaker = builder.build();
    
    console.log(`场景时长: ${audioDurationNum.toFixed(2)} 秒`);
    console.log(`总帧数: ${Math.ceil(audioDurationNum * 30)} 帧\n`);
    
    await videoMaker.export(outputPath);
    
    console.log('');
    console.log('✅ 测试完成！');
    console.log(`📁 输出文件: ${outputPath}`);
    console.log('✨ 自动检测音频时长功能正常工作！');
    
    videoMaker.destroy();
    builder.destroy();
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  }
}

testAutoDuration().catch(console.error);

