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
const scene = track.createScene({ duration: 20 })
  .addBackground({ color: '#ffffff' });

// 标题
scene.addText({
  text: 'CodeBlock Test',
  x: '50%',
  y: '10%',
  fontSize: 60,
  color: '#00d9ff',
  textAlign: 'center',
  fontFamily: 'monospace',
  duration: 20,
  startTime: 0,
  padding:50,
  animations: ['fadeIn'],
});

// 创建代码块
const code = `const { Op } = require('sequelize');

// 最简洁的写法
const result = await db.YourModel.findAll({
  where: {
    id: {
      [Op.gt]: '100',
      [Op.notLike]: '%A%'
    }
  },
  order: [['id', 'ASC']]
});

console.log('查询结果数量:', result.length);
console.log('样例ID:', result.slice(0, 5).map(item => item.id));`;

scene.addCode({
  code,
  language: 'javascript',
  theme: 'dark',
  x: '50%',
  y: '55%',
  width: '80%',
  height: 300,
  anchor: [0.5, 0.5],
  startTime: 0,
  duration: 20,
  fontSize: 24,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 10,
  padding: 20,
  animationMode: 'fadeIn',
  // 打字效果配置
  cursor: true,
  cursorColor: '#00d9ff',
  split: 'word',
  splitDelay: 0.3
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
