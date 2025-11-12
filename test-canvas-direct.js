/**
 * 直接使用Canvas 2D API测试
 */
import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testCanvasDirect() {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // 绘制背景
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 800, 600);

  // 绘制文本
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Hello, Video!', 400, 300);

  // 绘制矩形
  ctx.fillStyle = '#4a90e2';
  ctx.fillRect(300, 400, 200, 100);

  // 保存
  const outputPath = path.join(__dirname, 'output', 'test-canvas-direct.png');
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  console.log(`✓ 直接Canvas测试完成: ${outputPath}`);
  console.log(`  文件大小: ${(buffer.length / 1024).toFixed(2)} KB`);
}

testCanvasDirect();

