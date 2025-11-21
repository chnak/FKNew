import { VideoBuilder, withContext } from '../src/index.js'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const builder = new VideoBuilder({ width: 1920, height: 1080, fps: 30 })

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主内容' })
  const overlayTrack = builder.createTrack({ zIndex: 2, name: '叠加装饰' })

  let currentTime = 0
  const sceneDuration = 10
  const transitionDuration = 1

  const scene1 = mainTrack
    .createScene({ duration: sceneDuration, startTime: currentTime })
    .addBackground({ color: '#0b132b' })
    .addText({
      text: 'FKbuilder',
      color: '#5acbed',
      fontSize: 180,
      x: '50%',
      y: '40%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      gradient: true,
      gradientColors: ['#5acbed', '#208ab7'],
      gradientDirection: 'horizontal',
      textGlow: true,
      textGlowColor: '#5acbed',
      textGlowBlur: 24,
      stroke: true,
      strokeColor: '#0b132b',
      strokeWidth: 3,
      animations: [
        'bigIn',
        { type: 'transform', fromScaleX: 1, fromScaleY: 1, toScaleX: 1.08, toScaleY: 1.08, duration: 3, delay: 1.5, easing: 'easeInOut' }
      ],
      onFrame: withContext((element, progress, time) => {
        const pulse = 1 + Math.sin(Math.max(0, time - 1.2) * 2.2) * 0.03
        if (element.config) {
          element.config.scaleX = pulse
          element.config.scaleY = pulse
        }
      }, {})
    })
    .addText({
      text: '程序化视频生成库',
      color: '#e6e9e6',
      fontSize: 60,
      x: '50%',
      y: '62%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0.8,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#2e3b3c',
      textShadowBlur: 18
    })
    .addText({
      text: '多轨道 · 多场景 · 转场 · 并行渲染',
      color: '#b9d6f2',
      fontSize: 44,
      x: '50%',
      y: '75%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 2,
      animations: ['fadeInUp']
    })

  currentTime += sceneDuration

  const scene2StartTime = currentTime - transitionDuration
  const scene2 = mainTrack
    .createScene({ duration: sceneDuration, startTime: scene2StartTime })
    .addBackground({ color: '#1c2541' })
    .addText({
      text: '图片与排版',
      color: '#dbf3f4',
      fontSize: 90,
      x: '50%',
      y: '12%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 0,
      animations: ['fadeIn']
    })
    .addImage({
      src: path.join(__dirname, '../assets/img1.jpg'),
      x: '25%',
      y: '58%',
      width: '40%',
      height: '60%',
      anchor: [0.5, 0.5],
      fit: 'cover',
      duration: sceneDuration,
      startTime: 0.2,
      borderRadius: 24,
      shadowBlur: 26,
      shadowColor: '#000000',
      animations: ['zoomIn']
    })
    .addImage({
      src: path.join(__dirname, '../assets/img2.jpg'),
      x: '62%',
      y: '58%',
      width: '28%',
      height: '28%',
      anchor: [0.5, 0.5],
      fit: 'cover',
      duration: sceneDuration,
      startTime: 0.8,
      borderRadius: 18,
      animations: ['slideInRight']
    })
    .addImage({
      src: path.join(__dirname, '../assets/img3.jpg'),
      x: '80%',
      y: '78%',
      width: '20%',
      height: '20%',
      anchor: [0.5, 0.5],
      fit: 'cover',
      duration: sceneDuration,
      startTime: 1.6,
      borderRadius: 18,
      animations: ['bounceIn']
    })
    .addRect({
      x: '50%',
      y: '90%',
      width: '70%',
      height: 120,
      bgcolor: 'rgba(13,101,157,0.3)',
      borderRadius: 16,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 2.4,
      animations: ['fadeIn']
    })
    .addText({
      text: '支持 cover/contain 填充 · 阴影 · 边框 · 玻璃效果',
      color: '#b9d6f2',
      fontSize: 38,
      x: '50%',
      y: '90%',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 2.6,
      animations: ['fadeInUp']
    })

  mainTrack.addTransition({ name: 'CrossZoom', duration: transitionDuration, startTime: scene2StartTime })
  currentTime = scene2StartTime + sceneDuration

  const scene3StartTime = currentTime - transitionDuration
  const scene3 = mainTrack
    .createScene({ duration: sceneDuration, startTime: scene3StartTime })
    .addBackground({ color: '#0a0a0a' })
    .addText({
      text: '音频可视化 + 歌词',
      color: '#5acbed',
      fontSize: 90,
      x: '50%',
      y: '12%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 0,
      animations: ['fadeIn']
    })
    .addOscilloscope({
      audioPath: path.join(__dirname, '../assets/有何不可.mp3'),
      x: '50%',
      y: '45%',
      width: 1600,
      height: 220,
      style: 'line',
      waveColor: '#5acbed',
      backgroundColor: 'rgba(32,138,183,0.35)',
      lineWidth: 3,
      mirror: true,
      duration: sceneDuration,
      startTime: 0.4,
      animations: ['fadeIn']
    })
    .addOscilloscope({
      audioPath: path.join(__dirname, '../assets/有何不可.mp3'),
      x: '50%',
      y: '75%',
      width: 1600,
      height: 240,
      style: 'bars',
      waveColor: '#208ab7',
      backgroundColor: 'rgba(13,101,157,0.35)',
      duration: sceneDuration,
      startTime: 1.0,
      animations: ['fadeIn']
    })
    .addSubtitle({
      text: '自动分段字幕：支持阴影/描边/渐变/发光',
      fontSize: 48,
      color: '#e6e9e6',
      x: '50%',
      y: '88%',
      textAlign: 'center',
      split: 'line',
      splitDelay: 0.06,
      splitDuration: 0.3,
      duration: 6,
      startTime: 2.2,
      textGlow: true,
      textGlowColor: '#5acbed',
      textGlowBlur: 14
    })
    .addRect({
      x: '50%',
      y: '88%',
      width: '60%',
      height: 80,
      bgcolor: 'rgba(11,19,43,0.65)',
      borderRadius: 12,
      anchor: [0.5, 0.5],
      duration: 6,
      startTime: 2.1,
      animations: ['fadeIn']
    })

  mainTrack.addTransition({ name: 'Mosaic', duration: transitionDuration, startTime: scene3StartTime })
  currentTime = scene3StartTime + sceneDuration

  const scene4StartTime = currentTime - transitionDuration
  const scene4 = mainTrack
    .createScene({ duration: sceneDuration, startTime: scene4StartTime })
    .addBackground({ color: '#2e3b3c' })
    .addText({
      text: 'SVG · 路径 · 形状',
      color: '#dbf3f4',
      fontSize: 90,
      x: '50%',
      y: '12%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 0,
      animations: ['fadeIn']
    })
    .addSVG({
      svgString: '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 200 200"><polygon points="100,10 120,70 180,70 135,110 155,170 100,135 45,170 65,110 20,70 80,70" fill="#5acbed" stroke="#208ab7" stroke-width="3"/></svg>',
      x: '30%',
      y: '55%',
      width: 320,
      height: 320,
      anchor: [0.5, 0.5],
      fit: 'contain',
      duration: sceneDuration,
      startTime: 0.6,
      animations: [
        { type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.8 },
        { type: 'transform', fromRotation: 0, toRotation: 360, duration: 6, delay: 1, easing: 'linear' }
      ]
    })
    .addPath({
      points: [
        { x: 900, y: 520 },
        { x: 1100, y: 460 },
        { x: 1300, y: 520 },
        { x: 1500, y: 460 },
        { x: 1700, y: 520 }
      ],
      closed: false,
      smooth: true,
      strokeColor: '#b9d6f2',
      strokeWidth: 6,
      duration: sceneDuration,
      startTime: 1.2,
      x: 0,
      y: 0,
      animations: [{ type: 'fade', fromOpacity: 0, toOpacity: 1, duration: 0.8 }]
    })
    .addCircle({
      x: '70%',
      y: '70%',
      radius: 80,
      fillColor: '#208ab7',
      duration: sceneDuration,
      startTime: 2.2,
      animations: [{ type: 'transform', fromScaleX: 0.7, fromScaleY: 0.7, toScaleX: 1.1, toScaleY: 1.1, duration: 4, easing: 'easeInOut' }]
    })

  mainTrack.addTransition({ name: 'ZoomInCircles', duration: transitionDuration, startTime: scene4StartTime })
  currentTime = scene4StartTime + sceneDuration

  const scene5StartTime = currentTime - transitionDuration
  const scene5 = mainTrack
    .createScene({ duration: sceneDuration, startTime: scene5StartTime })
    .addBackground({ color: '#2e3b3c' })
    .addVideo({
      src: path.join(__dirname, '../assets/palawan.mp4'),
      x: "50%",
      y: "50%",
      width: "60%",
      height: "70%",
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      fit: 'cover',
      mute: true,
      loop: true,
      animations: ['fadeIn'],
      zIndex:0
    })
    .addText({
      text: '视频嵌入 · 编解码 · 帧级渲染',
      color: '#dbf3f4',
      fontSize: 80,
      x: '50%',
      y: '12%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 0,
      animations: ['fadeIn'],
      zIndex:10
    })
    .addRect({
      x: '50%',
      y: '88%',
      width: '70%',
      height: 110,
      bgcolor: 'rgba(32,138,183,0.25)',
      borderRadius: 16,
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1.2,
      animations: ['fadeIn'],
      zIndex:12
    })
    .addText({
      text: '支持 PNG/RAW 管道 · Worker 并行 · 高质量导出',
      color: '#b9d6f2',
      fontSize: 40,
      x: '50%',
      y: '88%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 1.4,
      animations: ['fadeInUp'],
      zIndex:13
    })

  currentTime = scene5StartTime + sceneDuration

  const scene6StartTime = currentTime - transitionDuration
  const scene6 = mainTrack
    .createScene({ duration: sceneDuration, startTime: scene6StartTime })
    .addBackground({ color: '#0b132b' })
    .addText({
      text: '让创作更简单',
      color: '#5acbed',
      fontSize: 120,
      x: '50%',
      y: '45%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 0,
      animations: ['bigIn'],
      gradient: true,
      gradientColors: ['#5acbed', '#208ab7'],
      gradientDirection: 'horizontal'
    })
    .addText({
      text: '开箱即用 · 可扩展 · 贴合生产',
      color: '#e6e9e6',
      fontSize: 48,
      x: '50%',
      y: '66%',
      textAlign: 'center',
      duration: sceneDuration,
      startTime: 1.4,
      animations: ['fadeIn']
    })

  mainTrack.addTransition({ name: 'Dreamy', duration: transitionDuration, startTime: scene5StartTime })
  mainTrack.addTransition({ name: 'Swirl', duration: transitionDuration, startTime: scene6StartTime })

  const outputDir = path.join(__dirname, '../output')
  await fs.ensureDir(outputDir)
  const outputPath = path.join(outputDir, 'intro-unique.mp4')
  const preview = process.env.FK_PREVIEW === '1'
  const exportOptions = preview
    ? { usePipe: true, parallel: true,maxWorkers: 4 }
    : { usePipe: true, maxWorkers: 4, parallel: true }
  await builder.export(outputPath, exportOptions)
  builder.destroy()
}

main().catch(console.error)