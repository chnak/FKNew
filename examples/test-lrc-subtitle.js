import { VideoMaker, ElementLayer, TextElement, SubtitleElement, RectElement } from '../src/index.js';
import { LRCSubtitleBuilder } from '../src/utils/lrcSubtitleBuilder.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLRCSubtitle() {
  console.log('=== 测试 LRC 歌词导入功能（直接使用 VideoMaker）===\n');
  
  // 创建示例 LRC 文件（如果不存在）
  const lrcFile = path.join(__dirname, '../assets/test.lrc');
  const lrcDir = path.dirname(lrcFile);
  await fs.ensureDir(lrcDir);
  
  if (!await fs.pathExists(lrcFile)) {
    console.log('创建示例 LRC 文件...');
    const sampleLRC = `[ti:测试歌曲]
[ar:测试歌手]
[al:测试专辑]
[00:00.00]开始渲染，字幕视频开始播放
[00:03.50]第二句歌词
[00:07.20]第三句歌词
[00:11.00]第四句歌词
[00:14.80]第五句歌词
[00:18.50]第六句歌词
`;
    await fs.writeFile(lrcFile, sampleLRC, 'utf-8');
    console.log(`✅ 已创建示例 LRC 文件: ${lrcFile}\n`);
  }
  
  // 直接创建 VideoMaker 实例
  const videoMaker = new VideoMaker({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 20,
  });

  // 创建元素图层
  const layer = videoMaker.createElementLayer({
    zIndex: 1,
    startTime: 0,
    endTime: 20,
  });

  // 添加背景
  const background = new RectElement({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    bgcolor: '#4a90e2',
    startTime: 0,
    duration: 20,
    zIndex: 0,
  });
  layer.addElement(background);

  // 添加标题文本
  const titleText = new TextElement({
    text: "LRC 歌词测试",
    color: "#ffffff",
    fontSize: 80,
    x: "50%",
    y: "25%",
    textAlign: "center",
    duration: 20,
    startTime: 0,
    zIndex: 1,
  });
  layer.addElement(titleText);
  
  // 加载 LRC 文件并创建字幕元素
  const subtitleConfigs = await LRCSubtitleBuilder.loadFromFile(lrcFile, {
    textColor: '#ffffff',
    fontSize: 48,
    x: '50%',
    y: '80%',
    textAlign: 'center',
    minDuration: 1,
    maxDuration: 5,
    sceneDuration: 20, // 传递场景时长，用于计算最后一句歌词的显示时长
  });

  // 为每个字幕配置创建 SubtitleElement 并添加到图层
  for (const subtitleConfig of subtitleConfigs) {
    const subtitleElement = new SubtitleElement({
      ...subtitleConfig,
      zIndex: 2,
    });
    layer.addElement(subtitleElement);
  }
  
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'test-lrc-subtitle.mp4');
  
  console.log('开始渲染视频...');
  const startTime = Date.now();
  await videoMaker.export(outputPath);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ 视频导出完成: ${outputPath}`);
  console.log(`⏱️  总耗时: ${duration} 秒`);
  
  videoMaker.destroy();
}

testLRCSubtitle().catch(console.error);



