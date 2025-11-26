import { VideoBuilder } from '../src/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const builder = new VideoBuilder({ width: 720, height: 720, fps: 30 });

  const track = builder.createTrack({ zIndex: 1 });
  track
    .createScene({ duration: 3, startTime: 0 })
    .addBackground({ color: '#222222', duration: 3 })
    .addSprite({
      // 位置（支持 %/px 等单位）
      x: '50%', // 水平居中
      y: '50%', // 垂直居中
      // 显示尺寸（目标显示大小）
      width: 136, // 显示宽度（像素）
      height: 141, // 显示高度（像素）
      // 精灵图资源（spritesheet 路径）
      src: path.join(__dirname, '../assets/9efde8fc65d823e3651ac2ad2a216e83.png'),
      // 图集布局（列数/行数）
      columns: 2, // 每行帧数
      rows: 3, // 总行数
      // 单帧原始尺寸（应与图集中每帧像素大小一致）
      frameWidth: 136, // 单帧宽度（像素）
      frameHeight: 141, // 单帧高度（像素）
      // 播放控制
      frameRate: 12, // 每秒播放帧数
      loop: true, // 循环播放
      autoplay: true, // 自动播放（为 false 时停留首帧）
      playMode: 'forward', // 播放模式：forward/reverse/ping-pong
      // 适配模式（图像如何适配显示尺寸）
      fit: 'contain', // contain/cover/fill/scale-down/none
    });

  await fs.ensureDir(path.join(__dirname, '../output'));
  await builder.export(path.join(__dirname, '../output/test-sprite.mp4'));
}

main().catch(console.error);
