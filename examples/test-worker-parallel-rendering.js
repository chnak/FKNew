import { VideoBuilder } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Worker 并行渲染测试
 */
async function testWorkerParallelRendering() {
  console.log('🎬 Worker 并行渲染测试\n');

  const width = 1920;
  const height = 1080;
  const fps = 30;
  const duration = 10; // 10秒视频
  const totalFrames = Math.ceil(duration * fps);

  console.log(`视频参数: ${width}x${height} @ ${fps}fps, 时长: ${duration}秒, 总帧数: ${totalFrames}\n`);

  // --- 测试 1: 串行渲染 ---
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('测试 1: 串行渲染（parallel: false）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const builder1 = new VideoBuilder({
    width,
    height,
    fps,
    backgroundColor: '#1a1a2e',
  });
  const track1 = builder1.createTrack({ zIndex: 1, name: '测试轨道1' });
  const scene1 = track1.createScene({
    duration: duration,
    startTime: 0,
  });
  
  for (let i = 0; i < 5; i++) {
    scene1.addText({
      text: `串行渲染测试 ${i + 1}`,
      x: '50%',
      y: `${20 + i * 15}%`,
      fontSize: 60,
      color: '#e0e0e0',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: duration,
      animations: ['fadeIn', 'fadeOut'],
    });
  }

  for (let i = 0; i < 3; i++) {
    scene1.addCircle({
      x: `${25 + i * 25}%`,
      y: '70%',
      radius: 50,
      bgcolor: `hsl(${i * 120}, 70%, 60%)`,
      anchor: [0.5, 0.5],
      startTime: i * 2,
      duration: 5,
      animations: ['fadeIn'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const relativeTime = event.time - element.startTime;
        const rotation = (relativeTime * 90) % 360;
        paperItem.rotation = rotation;
      },
    });
  }

  const outputPathSerial = path.join(__dirname, '../output/test-worker-parallel-serial.mp4');
  const startTime1 = performance.now();
  await builder1.export(outputPathSerial, {
    usePipe: false,
    parallel: false,
  });
  const endTime1 = performance.now();
  const serialTime = ((endTime1 - startTime1) / 1000).toFixed(2);
  console.log(`串行渲染耗时: ${serialTime} 秒\n`);

  // --- 测试 2: Worker 并行渲染（文件模式） ---
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('测试 2: Worker 并行渲染 - 文件模式（parallel: true, usePipe: false）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const builder2 = new VideoBuilder({
    width,
    height,
    fps,
    backgroundColor: '#1a1a2e',
  });
  const track2 = builder2.createTrack({ zIndex: 1, name: '测试轨道2' });
  const scene2 = track2.createScene({
    duration: duration,
    startTime: 0,
  });
  
  for (let i = 0; i < 5; i++) {
    scene2.addText({
      text: `Worker并行渲染测试 ${i + 1}`,
      x: '50%',
      y: `${20 + i * 15}%`,
      fontSize: 60,
      color: '#e0e0e0',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: duration,
      animations: ['fadeIn', 'fadeOut'],
    });
  }

  for (let i = 0; i < 3; i++) {
    scene2.addCircle({
      x: `${25 + i * 25}%`,
      y: '70%',
      radius: 50,
      bgcolor: `hsl(${i * 120}, 70%, 60%)`,
      anchor: [0.5, 0.5],
      startTime: i * 2,
      duration: 5,
      animations: ['fadeIn'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const relativeTime = event.time - element.startTime;
        const rotation = (relativeTime * 90) % 360;
        paperItem.rotation = rotation;
      },
    });
  }

  const outputPathWorkerFile = path.join(__dirname, '../output/test-worker-parallel-file.mp4');
  const startTime2 = performance.now();
  await builder2.export(outputPathWorkerFile, {
    usePipe: false,
    parallel: true,
    maxWorkers: 4,
  });
  const endTime2 = performance.now();
  const workerFileTime = ((endTime2 - startTime2) / 1000).toFixed(2);
  console.log(`Worker 并行渲染（文件模式）耗时: ${workerFileTime} 秒\n`);

  // --- 测试 3: Worker 并行渲染（管道模式） ---
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('测试 3: Worker 并行渲染 - 管道模式（parallel: true, usePipe: true）');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const builder3 = new VideoBuilder({
    width,
    height,
    fps,
    backgroundColor: '#1a1a2e',
  });
  const track3 = builder3.createTrack({ zIndex: 1, name: '测试轨道3' });
  const scene3 = track3.createScene({
    duration: duration,
    startTime: 0,
  });
  
  for (let i = 0; i < 5; i++) {
    scene3.addText({
      text: `Worker管道模式测试 ${i + 1}`,
      x: '50%',
      y: `${20 + i * 15}%`,
      fontSize: 60,
      color: '#e0e0e0',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: duration,
      animations: ['fadeIn', 'fadeOut'],
    });
  }

  for (let i = 0; i < 3; i++) {
    scene3.addCircle({
      x: `${25 + i * 25}%`,
      y: '70%',
      radius: 50,
      bgcolor: `hsl(${i * 120}, 70%, 60%)`,
      anchor: [0.5, 0.5],
      startTime: i * 2,
      duration: 5,
      animations: ['fadeIn'],
      onFrame: (element, event, paperItem) => {
        if (!paperItem) return;
        const relativeTime = event.time - element.startTime;
        const rotation = (relativeTime * 90) % 360;
        paperItem.rotation = rotation;
      },
    });
  }

  const outputPathWorkerPipe = path.join(__dirname, '../output/test-worker-parallel-pipe.mp4');
  const startTime3 = performance.now();
  await builder3.export(outputPathWorkerPipe, {
    usePipe: true,
    parallel: true,
    maxWorkers: 4,
  });
  const endTime3 = performance.now();
  const workerPipeTime = ((endTime3 - startTime3) / 1000).toFixed(2);
  console.log(`Worker 并行渲染（管道模式）耗时: ${workerPipeTime} 秒\n`);

  // --- 性能对比 ---
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('性能对比');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`串行渲染: ${serialTime} 秒`);
  console.log(`Worker 并行（文件模式）: ${workerFileTime} 秒`);
  console.log(`Worker 并行（管道模式）: ${workerPipeTime} 秒`);
  
  const speedupFile = (parseFloat(serialTime) / parseFloat(workerFileTime)).toFixed(2);
  const improvementFile = ((1 - parseFloat(workerFileTime) / parseFloat(serialTime)) * 100).toFixed(1);
  console.log(`\n文件模式加速比: ${speedupFile}x (性能提升: ${improvementFile}%)`);
  
  const speedupPipe = (parseFloat(serialTime) / parseFloat(workerPipeTime)).toFixed(2);
  const improvementPipe = ((1 - parseFloat(workerPipeTime) / parseFloat(serialTime)) * 100).toFixed(1);
  console.log(`管道模式加速比: ${speedupPipe}x (性能提升: ${improvementPipe}%)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('✅ 测试完成！');
  console.log(`输出文件:`);
  console.log(`  - 串行: ${outputPathSerial}`);
  console.log(`  - Worker 并行（文件）: ${outputPathWorkerFile}`);
  console.log(`  - Worker 并行（管道）: ${outputPathWorkerPipe}`);
}

testWorkerParallelRendering().catch(console.error);

