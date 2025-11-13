import { VideoMaker, ElementLayer, TextElement, SubtitleElement, RectElement } from '../src/index.js';
import { LRCSubtitleBuilder } from '../src/utils/lrcSubtitleBuilder.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 不使用 CompositionElement 实现多轨道多场景
 * 
 * 方案：
 * 1. 多轨道 = 多个 ElementLayer，每个 Layer 有不同的 zIndex
 * 2. 多场景 = 在同一个 Layer 中，不同时间段的元素形成不同的"场景"
 * 
 * 优势：
 * - 所有元素都在同一层级，无需嵌套渲染
 * - 无需创建临时 canvas 和 Raster 转换
 * - 渲染速度快，性能好
 */
async function testMultiTrackSceneDirect() {
  console.log('=== 测试多轨道多场景（直接方式，不使用 CompositionElement）===\n');
  
  // 创建 VideoMaker 实例
  const videoMaker = new VideoMaker({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 30, // 30秒视频
  });

  // ========== 轨道1：背景轨道（zIndex: 0）==========
  const track1 = videoMaker.createElementLayer({
    zIndex: 0,
    startTime: 0,
    endTime: 30,
  });

  // 场景1：蓝色背景（0-10秒）
  const scene1Bg = new RectElement({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    bgcolor: '#4a90e2',
    startTime: 0,
    duration: 10,
    zIndex: 0,
  });
  track1.addElement(scene1Bg);

  // 场景2：绿色背景（10-20秒）
  const scene2Bg = new RectElement({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    bgcolor: '#2ecc71',
    startTime: 10,
    duration: 10,
    zIndex: 0,
  });
  track1.addElement(scene2Bg);

  // 场景3：红色背景（20-30秒）
  const scene3Bg = new RectElement({
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
    bgcolor: '#e74c3c',
    startTime: 20,
    duration: 10,
    zIndex: 0,
  });
  track1.addElement(scene3Bg);

  // ========== 轨道2：标题轨道（zIndex: 1）==========
  const track2 = videoMaker.createElementLayer({
    zIndex: 1,
    startTime: 0,
    endTime: 30,
  });

  // 场景1：标题1（0-10秒）
  const scene1Title = new TextElement({
    text: "场景 1：蓝色背景",
    color: "#ffffff",
    fontSize: 80,
    x: "50%",
    y: "20%",
    textAlign: "center",
    startTime: 0,
    duration: 10,
    zIndex: 1,
  });
  track2.addElement(scene1Title);

  // 场景2：标题2（10-20秒）
  const scene2Title = new TextElement({
    text: "场景 2：绿色背景",
    color: "#ffffff",
    fontSize: 80,
    x: "50%",
    y: "20%",
    textAlign: "center",
    startTime: 10,
    duration: 10,
    zIndex: 1,
  });
  track2.addElement(scene2Title);

  // 场景3：标题3（20-30秒）
  const scene3Title = new TextElement({
    text: "场景 3：红色背景",
    color: "#ffffff",
    fontSize: 80,
    x: "50%",
    y: "20%",
    textAlign: "center",
    startTime: 20,
    duration: 10,
    zIndex: 1,
  });
  track2.addElement(scene3Title);

  // ========== 轨道3：字幕轨道（zIndex: 2）==========
  const track3 = videoMaker.createElementLayer({
    zIndex: 2,
    startTime: 0,
    endTime: 30,
  });

  // 场景1：字幕1（0-10秒）
  const scene1Subtitle = new TextElement({
    text: "这是第一个场景的字幕内容",
    color: "#ffffff",
    fontSize: 48,
    x: "50%",
    y: "80%",
    textAlign: "center",
    startTime: 0,
    duration: 10,
    zIndex: 2,
  });
  track3.addElement(scene1Subtitle);

  // 场景2：字幕2（10-20秒）
  const scene2Subtitle = new TextElement({
    text: "这是第二个场景的字幕内容",
    color: "#ffffff",
    fontSize: 48,
    x: "50%",
    y: "80%",
    textAlign: "center",
    startTime: 10,
    duration: 10,
    zIndex: 2,
  });
  track3.addElement(scene2Subtitle);

  // 场景3：字幕3（20-30秒）
  const scene3Subtitle = new TextElement({
    text: "这是第三个场景的字幕内容",
    color: "#ffffff",
    fontSize: 48,
    x: "50%",
    y: "80%",
    textAlign: "center",
    startTime: 20,
    duration: 10,
    zIndex: 2,
  });
  track3.addElement(scene3Subtitle);

  // ========== 轨道4：LRC 歌词轨道（zIndex: 3）==========
  // 如果有 LRC 文件，可以添加歌词轨道
  const lrcFile = path.join(__dirname, '../assets/test.lrc');
  if (await fs.pathExists(lrcFile)) {
    const track4 = videoMaker.createElementLayer({
      zIndex: 3,
      startTime: 0,
      endTime: 30,
    });

    // 加载 LRC 文件并创建字幕元素
    const subtitleConfigs = await LRCSubtitleBuilder.loadFromFile(lrcFile, {
      textColor: '#ffff00',
      fontSize: 40,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      minDuration: 1,
      maxDuration: 5,
      sceneDuration: 30,
    });

    // 为每个字幕配置创建 SubtitleElement 并添加到图层
    for (const subtitleConfig of subtitleConfigs) {
      // 只添加前30秒的字幕
      if (subtitleConfig.startTime < 30) {
        const subtitleElement = new SubtitleElement({
          ...subtitleConfig,
          zIndex: 3,
        });
        track4.addElement(subtitleElement);
      }
    }
  }

  // 导出视频
  const outputDir = path.join(__dirname, '../output');
  await fs.ensureDir(outputDir);
  
  const outputPath = path.join(outputDir, 'test-multi-track-scene-direct.mp4');
  
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
}

testMultiTrackSceneDirect().catch(console.error);

