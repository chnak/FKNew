import { VideoBuilder } from '../src/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const builder = new VideoBuilder({ width: 1280, height: 720, fps: 30 })

const track = builder.createTrack({ zIndex: 1, name: 'Intro' })

const scene1 = track.createScene({ duration: 4, startTime: 0 })
  .addBackground({ color: '#0a0e27' })
scene1.addText({
  text: 'FKbuilder',
  x: '50%',
  y: '40%',
  fontSize: 96,
  color: '#00d9ff',
  textAlign: 'center',
  duration: 4,
  startTime: 0,
  animations: ['bigIn']
})
scene1.addText({
  text: '程序化视频生成库',
  x: '50%',
  y: '60%',
  fontSize: 36,
  color: '#ffffff',
  textAlign: 'center',
  duration: 4,
  startTime: 0.5,
  animations: ['fadeIn']
})

const scene2 = track.createScene({ duration: 6, startTime: 4 })
  .addBackground({ color: '#101622' })
scene2.addText({
  text: '核心特性',
  x: '50%',
  y: '18%',
  fontSize: 48,
  color: '#00ff88',
  textAlign: 'center',
  duration: 6,
  startTime: 0,
  animations: ['fadeIn']
})
const features = [
  '多轨道多场景',
  '丰富元素与动画',
  '并行渲染与转场',
  '组件化与持续动画'
]
features.forEach((f, i) => {
  scene2.addText({
    text: `• ${f}`,
    x: '50%',
    y: `${35 + i * 12}%`,
    fontSize: 30,
    color: '#ffffff',
    textAlign: 'center',
    duration: 6,
    startTime: 0.4 + i * 0.3,
    animations: ['fadeIn']
  })
})

const scene3 = track.createScene({ duration: 7, startTime: 9 })
  .addBackground({ color: '#0f1419' })
const quickCode = `import { VideoBuilder } from 'fkbuilder'

const builder = new VideoBuilder({ width: 1280, height: 720, fps: 30 })
const track = builder.createTrack({ zIndex: 1 })
const scene = track.createScene({ duration: 5 })
      .addBackground({ color: '#1a1a2e' })
      .addText({ 
        text: 'Hello', 
        x: '50%', 
        y: '50%', 
        fontSize: 80, 
        color: '#fff', 
        textAlign: 'center', 
        duration: 5, 
        startTime: 0 
      })
await builder.render('./output/video.mp4')`
scene3.addText({
  text: '快速开始',
  x: '50%',
  y: '16%',
  fontSize: 44,
  color: '#ff6b9d',
  textAlign: 'center',
  duration: 7,
  startTime: 0,
  animations: ['fadeIn']
})
scene3.addCode({
  code: quickCode,
  language: 'javascript',
  theme: 'dark',
  x: '50%',
  y: '60%',
  width: 980,
  height: 360,
  anchor: [0.5, 0.5],
  startTime: 0.2,
  duration: 6.8,
  fontSize: 22,
  showLineNumbers: true,
  showBorder: true,
  borderRadius: 10,
  cursor: true,
  split: 'letter',
  splitDelay: 0.01,
  splitDuration: 0.03,
  autoScroll: true,
  padding: 18,
  paddingBottom: 26,
  scrollPaddingBottom: 24
})

const scene4Start = 16
const scene4 = track.createScene({ duration: 6, startTime: scene4Start })
  .addBackground({ color: '#1a0f2e' })
scene4.addText({
  text: '多场景与转场',
  x: '50%',
  y: '18%',
  fontSize: 44,
  color: '#ffd700',
  textAlign: 'center',
  duration: 6,
  startTime: 0,
  animations: ['fadeIn']
})
scene4.addText({
  text: '场景 A',
  x: '30%',
  y: '60%',
  fontSize: 64,
  color: '#ffffff',
  textAlign: 'center',
  duration: 3,
  startTime: 0.6,
  animations: ['bigIn']
})
const scene5Start = scene4Start + 3
const scene5 = track.createScene({ duration: 6, startTime: scene5Start })
  .addBackground({ color: '#2d3436' })
scene5.addText({
  text: '场景 B',
  x: '70%',
  y: '60%',
  fontSize: 64,
  color: '#ffffff',
  textAlign: 'center',
  duration: 6,
  startTime: 0.6,
  animations: ['bigIn']
})
track.addTransition({ name: 'CrossZoom', duration: 1, startTime: scene5Start })

const scene6 = track.createScene({ duration: 5, startTime: 22 })
  .addBackground({ color: '#000000' })
scene6.addText({
  text: '安装与运行',
  x: '50%',
  y: '30%',
  fontSize: 54,
  color: '#00d9ff',
  textAlign: 'center',
  duration: 5,
  startTime: 0,
  animations: ['fadeIn']
})
scene6.addCode({
  code: `npm install fkbuilder\nnode examples/api-usage-demo.js`,
  language: 'javascript',
  theme: 'dark',
  x: '50%',
  y: '60%',
  width: 700,
  height: 160,
  anchor: [0.5, 0.5],
  startTime: 0.2,
  duration: 4.8,
  fontSize: 26,
  showLineNumbers: false,
  showBorder: true,
  borderRadius: 10,
  padding: 16,
  split: 'letter',
  splitDelay: 0.06
})

async function main() {
  const outputPath = path.join(__dirname, '../output/fkbuilder-intro-video.mp4')
  await builder.render(outputPath, { parallel: true, usePipe: true, maxWorkers: 4 })
}

main()
