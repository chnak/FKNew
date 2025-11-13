import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAudioSimple() {
  console.log('=== 简单音频测试 ===');
  
  // 检查音频文件是否存在（尝试多个可能的文件）
  let audioPath = path.join(__dirname, '../assets/music_11.mp3');
  let audioExists = await fs.pathExists(audioPath);
  
  if (!audioExists) {
    // 尝试其他音频文件
    audioPath = path.join(__dirname, '../assets/winxp.mp3');
    audioExists = await fs.pathExists(audioPath);
  }
  
  console.log(`音频文件存在: ${audioExists}, 路径: ${audioPath}`);
  
  if (!audioExists) {
    console.error('音频文件不存在，请检查路径');
    return;
  }
  
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1 });
  
  // 创建一个简单的场景，只添加背景、文本和音频
  const scene = mainTrack.createScene({ duration: 5 })
    .addBackground({ color: '#4a90e2', duration: 5 })
    .addText({
      text: "音频测试",
      color: "#ffffff",
      fontSize: 80,
      x: "50%",
      y: "50%",
      textAlign: "center",
      duration: 5,
      startTime: 0,
      zIndex: 1,
    })
    .addAudio({
      src: audioPath,
      startTime: 0,
      duration: 5,
      cutFrom: 0,
      cutTo: 5,
      volume: 1.0,
      fadeIn: 0,
      fadeOut: 0,
    });
  
  // 调试：检查 Scene 的元素
  console.log(`Scene 元素数: ${scene.elements.length}`);
  scene.elements.forEach((e, idx) => {
    console.log(`  元素 ${idx}: type=${e.element ? e.element.type : e.type}`);
  });
  
  // 调试：检查 Scene.build() 返回的配置
  const sceneConfig = scene.build();
  console.log(`Scene.build() 返回的配置: elements=${sceneConfig.elements ? sceneConfig.elements.length : 0}`);
  if (sceneConfig.elements) {
    sceneConfig.elements.forEach((e, idx) => {
      console.log(`  配置元素 ${idx}: type=${e.type}`);
      if (e.type === 'audio') {
        console.log(`    音频路径: ${e.audioPath || e.src}`);
      }
    });
  }

  const videoMaker = builder.build();
  
  // 调试：检查 CompositionElement 的结构
  console.log('\n=== 调试 CompositionElement 结构 ===');
  const debugComposition = (comp, depth = 0) => {
    const indent = '  '.repeat(depth);
    if (!comp) return;
    
    if (comp.elementsConfig) {
      console.log(`${indent}Composition (配置): elementsConfig=${comp.elementsConfig.length}`);
      comp.elementsConfig.forEach((child, idx) => {
        console.log(`${indent}  子元素 ${idx}: type=${child.type}`);
        if (child.type === 'audio') {
          console.log(`${indent}    音频路径: ${child.audioPath || child.src}`);
        } else if (child.type === 'composition') {
          if (child.elements) {
            console.log(`${indent}    嵌套 elements: ${child.elements.length}`);
            child.elements.forEach((subChild, subIdx) => {
              console.log(`${indent}      子元素 ${subIdx}: type=${subChild.type}`);
              if (subChild.type === 'audio') {
                console.log(`${indent}        音频路径: ${subChild.audioPath || subChild.src}`);
              }
            });
          }
          if (child.elementsConfig) {
            console.log(`${indent}    嵌套 elementsConfig: ${child.elementsConfig.length}`);
          }
          debugComposition(child, depth + 2);
        }
      });
    }
  };
  
  for (const layer of videoMaker.timeline.getLayers()) {
    console.log(`图层: ${layer.type}, elements=${layer.elements ? layer.elements.length : 0}`);
    if (layer.elements) {
      for (const element of layer.elements) {
        if (element && element.type === 'composition') {
          debugComposition(element, 1);
        }
      }
    }
  }
  
  // 检查音频元素
  const audioConfigs = videoMaker.collectAllAudioElements();
  console.log(`\n收集到 ${audioConfigs.length} 个音频元素`);
  audioConfigs.forEach((audio, index) => {
    console.log(`音频 ${index + 1}:`, {
      path: audio.path,
      startTime: audio.startTime,
      duration: audio.duration,
      cutFrom: audio.audioStartTime,
      cutTo: audio.audioEndTime,
      volume: audio.volume,
    });
  });
  
  console.log('开始导出视频...');
  const outputPath = path.join(__dirname, '../output/test-audio-simple.mp4');
  await fs.ensureDir(path.dirname(outputPath));
  
  await videoMaker.export(outputPath);
  
  console.log(`视频已生成: ${outputPath}`);
  console.log('请检查视频是否有声音');
  
  videoMaker.destroy();
}

testAudioSimple().catch(console.error);

