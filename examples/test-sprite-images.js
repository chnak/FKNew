import { VideoBuilder } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const builder = new VideoBuilder({ width: 720, height: 720, fps: 30 });
  const track = builder.createTrack({ zIndex: 1 });

  track
    .createScene({ duration: 4, startTime: 0 })
    .addBackground({ color: '#222222', duration: 4 })
    .addSprite({
      x: '50%',
      y: '50%',
      width: '60%',
      height: '60%',
      // 使用目录序列（不要同时设置 src）
      srcDir: path.join(__dirname, '../assets/sprite'),
      // 播放控制
      frameRate: 12,
      loop: true,
      autoplay: true,
      playMode: 'ping-pong', // 或 'forward' / 'reverse'
      // 适配方式（与 ImageElement 一致）
      fit: 'contain', // contain/cover/fill/scale-down/none
    });

  await builder.export(path.join(__dirname, '../output/sequence-demo.mp4'));
}

main().catch(console.error);