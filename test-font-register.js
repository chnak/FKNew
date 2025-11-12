/**
 * 测试字体注册
 */
import { registerFont, createCanvas } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(__dirname, 'src/fonts/PatuaOne-Regular.ttf');

console.log('字体文件路径:', fontPath);
console.log('文件存在:', fs.pathExistsSync(fontPath));

try {
  // 尝试注册字体
  registerFont(fontPath, { family: 'PatuaOne' });
  console.log('✓ 字体已注册: PatuaOne');
  
  // 创建Canvas并测试
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 800, 600);
  
  // 测试使用注册的字体
  ctx.font = 'normal normal 48px PatuaOne';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('测试中文：你好世界', 400, 200);
  
  // 测试中英文混合
  ctx.fillText('Hello 世界！Video 视频', 400, 300);
  
  // 保存
  const outputPath = path.join(__dirname, 'output', 'test-font-register.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 测试图片已保存: ${outputPath}`);
} catch (error) {
  console.error('❌ 字体注册失败:', error);
}

