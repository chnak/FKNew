/**
 * 代码块组件演示
 * 展示如何使用 CodeBlock 组件创建带语法高亮的代码块
 */
import { VideoBuilder, CodeElement } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
});

// ============ 场景1：JavaScript代码块 (0-8s) ============
const scene1Track = builder.createTrack({ zIndex: 10, name: 'JavaScript代码' });
const scene1 = scene1Track.createScene({ duration: 8 })
  .addBackground({ color: '#0a0e27' });

// 标题
scene1.addText({
  text: 'JavaScript Code Block',
  x: '50%',
  y: '10%',
  fontSize: 60,
  color: '#00d9ff',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 8,
  startTime: 0,
  animations: ['fadeIn'],
  textGlow: true,
  textGlowColor: '#00d9ff',
  textGlowBlur: 25,
});

// 创建JavaScript代码块
const jsCode = `function create() {
  const vision = dream.compile();
  return vision.render();
}`;

scene1.addCode({
  code: jsCode,
  language: 'javascript',
  theme: 'dark',
  x: '50%',
  y: '55%',
  width: 700,
  height: 350,
  anchor: [0.5, 0.5],
  startTime: 1,
  duration: 7,
  fontSize: 24,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 12,
  animationMode: 'fadeIn',
});

// ============ 场景2：Python代码块 (8-16s) ============
const scene2Track = builder.createTrack({ zIndex: 10, name: 'Python代码' });
const scene2 = scene2Track.createScene({ duration: 8, startTime: 8 })
  .addBackground({ color: '#0f1419' });

// 标题
scene2.addText({
  text: 'Python Code Block',
  x: '50%',
  y: '10%',
  fontSize: 60,
  color: '#00ff88',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 8,
  startTime: 0,
  animations: ['fadeIn'],
  textGlow: true,
  textGlowColor: '#00ff88',
  textGlowBlur: 25,
});

// 创建Python代码块
const pyCode = `def create_art():
    vision = dream.compile()
    return vision.render()

result = create_art()`;

scene2.addCode({
  code: pyCode,
  language: 'python',
  theme: 'monokai',
  x: '50%',
  y: '55%',
  width: 700,
  height: 350,
  anchor: [0.5, 0.5],
  startTime: 1,
  duration: 7,
  fontSize: 24,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 12,
  animationMode: 'fadeIn',
});

// ============ 场景3：Java代码块 - 带逐行动画 (16-24s) ============
const scene3Track = builder.createTrack({ zIndex: 10, name: 'Java代码' });
const scene3 = scene3Track.createScene({ duration: 8, startTime: 16 })
  .addBackground({ color: '#1a0f2e' });

// 标题
scene3.addText({
  text: 'Java Code Block - Line by Line',
  x: '50%',
  y: '10%',
  fontSize: 60,
  color: '#ff6b9d',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 8,
  startTime: 0,
  animations: ['fadeIn'],
  textGlow: true,
  textGlowColor: '#ff6b9d',
  textGlowBlur: 25,
});

// 创建Java代码块
const javaCode = `public class VideoMaker {
  public static void main(String[] args) {
    Vision vision = new Vision();
    vision.render();
  }
}`;

scene3.addCode({
  code: javaCode,
  language: 'java',
  theme: 'dracula',
  x: '50%',
  y: '55%',
  width: 700,
  height: 350,
  anchor: [0.5, 0.5],
  startTime: 1,
  duration: 7,
  fontSize: 24,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 12,
  animationMode: 'lineByLine',
  staggerDelay: 0.3,
});

// ============ 场景4：多个主题对比 (24-40s) ============
const scene4Track = builder.createTrack({ zIndex: 10, name: '主题对比' });
const scene4 = scene4Track.createScene({ duration: 16, startTime: 24 })
  .addBackground({ color: '#0a0e27' });

// 标题
scene4.addText({
  text: 'Theme Showcase',
  x: '50%',
  y: '8%',
  fontSize: 60,
  color: '#ffd700',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 16,
  startTime: 0,
  animations: ['fadeIn'],
  textGlow: true,
  textGlowColor: '#ffd700',
  textGlowBlur: 25,
});

// 简单代码样本
const simpleCode = `const art = code;
return render();`;

// Dark主题
scene4.addCode({
  code: simpleCode,
  language: 'javascript',
  theme: 'dark',
  x: '25%',
  y: '35%',
  width: 500,
  height: 250,
  anchor: [0.5, 0.5],
  startTime: 0,
  duration: 16,
  fontSize: 20,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 8,
});

// Light主题
scene4.addCode({
  code: simpleCode,
  language: 'javascript',
  theme: 'light',
  x: '75%',
  y: '35%',
  width: 500,
  height: 250,
  anchor: [0.5, 0.5],
  startTime: 1,
  duration: 15,
  fontSize: 20,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 8,
});

// Monokai主题
scene4.addCode({
  code: simpleCode,
  language: 'javascript',
  theme: 'monokai',
  x: '25%',
  y: '75%',
  width: 500,
  height: 250,
  anchor: [0.5, 0.5],
  startTime: 2,
  duration: 14,
  fontSize: 20,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 8,
});

// Dracula主题
scene4.addCode({
  code: simpleCode,
  language: 'javascript',
  theme: 'dracula',
  x: '75%',
  y: '75%',
  width: 500,
  height: 250,
  anchor: [0.5, 0.5],
  startTime: 3,
  duration: 13,
  fontSize: 20,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 8,
});

// 标签文字
scene4.addText({
  text: 'Dark',
  x: '25%',
  y: '52%',
  fontSize: 28,
  color: '#00d9ff',
  textAlign: 'center',
  duration: 16,
  startTime: 0,
});

scene4.addText({
  text: 'Light',
  x: '75%',
  y: '52%',
  fontSize: 28,
  color: '#00d9ff',
  textAlign: 'center',
  duration: 16,
  startTime: 0,
});

scene4.addText({
  text: 'Monokai',
  x: '25%',
  y: '92%',
  fontSize: 28,
  color: '#00ff88',
  textAlign: 'center',
  duration: 16,
  startTime: 0,
});

scene4.addText({
  text: 'Dracula',
  x: '75%',
  y: '92%',
  fontSize: 28,
  color: '#ff6b9d',
  textAlign: 'center',
  duration: 16,
  startTime: 0,
});

// ============ 场景5：高级特性演示 (40-50s) ============
const scene5Track = builder.createTrack({ zIndex: 10, name: '高级特性' });
const scene5 = scene5Track.createScene({ duration: 10, startTime: 40 })
  .addBackground({ color: '#1a1a2e' });

// 标题
scene5.addText({
  text: 'Advanced Features',
  x: '50%',
  y: '10%',
  fontSize: 60,
  color: '#00ff88',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 10,
  startTime: 0,
  animations: ['fadeIn'],
  textGlow: true,
  textGlowColor: '#00ff88',
  textGlowBlur: 25,
});

// 复杂代码示例
const complexCode = `class VideoBuilder {
  constructor(config) {
    this.config = config;
    this.tracks = [];
  }
  
  addTrack(track) {
    this.tracks.push(track);
    return this;
  }
}`;

scene5.addCode({
  code: complexCode,
  language: 'javascript',
  theme: 'dracula',
  x: '50%',
  y: '55%',
  width: 800,
  height: 400,
  anchor: [0.5, 0.5],
  startTime: 1,
  duration: 9,
  fontSize: 22,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 12,
  padding: 20,
  lineHeight: 1.8,
  animationMode: 'fadeIn',
});

// ============ 场景6：结尾 (50-55s) ============
const endTrack = builder.createTrack({ zIndex: 10, name: '结尾' });
const endScene = endTrack.createScene({ duration: 5, startTime: 50 })
  .addBackground({ color: '#000000' });

endScene.addText({
  text: 'CodeBlock Component',
  x: '50%',
  y: '35%',
  fontSize: 90,
  color: '#00d9ff',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 5,
  startTime: 0,
  animations: ['bigIn'],
  textGlow: true,
  textGlowColor: '#00d9ff',
  textGlowBlur: 40,
  split: 'letter',
  splitDelay: 0.05,
});

endScene.addText({
  text: '完美展示你的代码艺术',
  x: '50%',
  y: '55%',
  fontSize: 48,
  color: '#ff00ff',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 4,
  startTime: 1,
  animations: ['fadeInUp'],
});

endScene.addText({
  text: '支持多种主题、语言、动画效果',
  x: '50%',
  y: '70%',
  fontSize: 40,
  color: '#00ff88',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 3,
  startTime: 2,
  animations: ['fadeInUp'],
});

// ============ 导出 ============
async function createCodeBlockDemo() {
  try {
    console.log('🎬 开始渲染代码块演示视频...');
    console.log('⏱️  总时长:', builder.getTotalDuration(), '秒');
    
    const outputPath = path.join(__dirname, '../output/code-block-demo.mp4');
    
    await builder.render(outputPath, {
      parallel: true,
      usePipe: true,
      maxWorkers: 4,
    });
    
    console.log('✨ 视频已生成！');
    console.log('📁 输出位置:', outputPath);
    
  } catch (error) {
    console.error('❌ 渲染失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createCodeBlockDemo();
