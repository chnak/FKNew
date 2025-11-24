/**
 * CodeBlock 快速测试
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

// 单一场景 - 快速测试
const track = builder.createTrack({ zIndex: 10 });
const scene = track.createScene({ duration: 5 })
  .addBackground({ color: '#ffffff' });

// 标题
scene.addText({
  text: 'CodeBlock Test',
  x: '50%',
  y: '15%',
  fontSize: 60,
  color: '#00d9ff',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 5,
  startTime: 0,
  padding:50,
  animations: ['fadeIn'],
});

// 创建代码块
const code = `function create() {
  const vision = dream.compile();
  return vision.render();
}`;

scene.addCode({
  code,
  language: 'javascript',
  theme: 'dark',
  x: '50%',
  y: '55%',
  width: 700,
  height: 300,
  anchor: [0.5, 0.5],
  startTime: 0,
  duration: 5,
  fontSize: 24,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 10,
  padding: 20,
  animationMode: 'fadeIn',
});

// 导出
async function test() {
  try {
    console.log('🎬 测试 CodeBlock 组件...');
    const outputPath = path.join(__dirname, '../output/codeblock-test.mp4');
    
    await builder.render(outputPath, {
      parallel: true,
      usePipe: true,
      maxWorkers: 4,
    });
    
    console.log('✨ 测试完成！输出:', outputPath);
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

test();
