/**
 * 移植自 FKVideo 的 app.js 示例
 */
import { VideoBuilder } from '../src/index.js';
import { registerFontFile } from '../src/utils/font-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 注册字体（如果字体文件存在）
const fontPath = 'D:/code/foliko-trade/public/fonts/MicrosoftYaHei-Bold-01.ttf';
try {
  registerFontFile(fontPath, 'MicrosoftYaHei');
} catch (error) {
  console.warn('字体注册失败，将使用默认字体:', error.message);
}

const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
  backgroundColor: '#000000',
});

const mainTrack = builder.createTrack({ zIndex: 1 });
// 创建更长的场景以展示所有动画效果
const scene = mainTrack.createScene({ duration: 10 })
  .addBackground()
  // 1. bigIn + bigOut (整体文本，无分割)
  .addText({
    text: "缩放动画 - bigIn/bigOut",
    color: "#ffffff",
    fontSize: "24rpx",
    x: "50vw",
    y: "10vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    fontFamily: "MicrosoftYaHei",
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bigIn", "bigOut"]
  })
  // 2. zoomIn + zoomOut (字母分割)
  .addText({
    text: "缩放动画 - zoomIn/zoomOut",
    color: "#ff6b6b",
    fontSize: "24rpx",
    x: "50vw",
    y: "20vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomIn", "zoomOut"]
  })
  // 3. fadeInUp (字母分割)
  .addText({
    text: "淡入上移 - fadeInUp",
    color: "#4ecdc4",
    fontSize: "24rpx",
    x: "50vw",
    y: "30vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInUp"]
  })
  // 4. rotateIn (字母分割)
  .addText({
    text: "旋转进入 - rotateIn",
    color: "#ffe66d",
    fontSize: "24rpx",
    x: "50vw",
    y: "40vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.5,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["rotateIn"]
  })
  // 5. bounceIn (字母分割)
  .addText({
    text: "弹跳进入 - bounceIn",
    color: "#a8e6cf",
    fontSize: "24rpx",
    x: "50vw",
    y: "50vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceIn"]
  })
  // 6. slideInLeft (字母分割)
  .addText({
    text: "左侧滑入 - slideInLeft",
    color: "#ff8b94",
    fontSize: "24rpx",
    x: "50vw",
    y: "60vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInLeft"]
  })
  // 7. slideInRight (字母分割)
  .addText({
    text: "右侧滑入 - slideInRight",
    color: "#c7ceea",
    fontSize: "24rpx",
    x: "50vw",
    y: "70vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInRight"]
  })
  // 8. slideInTop (字母分割)
  .addText({
    text: "上方滑入 - slideInTop",
    color: "#ffd3a5",
    fontSize: "24rpx",
    x: "50vw",
    y: "80vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInTop"]
  })
  // 9. fadeIn + fadeOut (整体文本)
  .addText({
    text: "淡入淡出 - fadeIn/fadeOut",
    color: "#ffaaa5",
    fontSize: "24rpx",
    x: "50vw",
    y: "90vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    fontFamily: "MicrosoftYaHei",
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "fadeOut"]
  })
  // 10. fadeInDown (字母分割)
  .addText({
    text: "淡入下移 - fadeInDown",
    color: "#95e1d3",
    fontSize: "24rpx",
    x: "50vw",
    y: "15vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInDown"]
  })
  // 11. rotateIn + rotateOut (字母分割)
  .addText({
    text: "旋转进出 - rotateIn/rotateOut",
    color: "#f38181",
    fontSize: "24rpx",
    x: "50vw",
    y: "25vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.5,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["rotateIn", "rotateOut"]
  })
  // 12. slideInBottom (字母分割)
  .addText({
    text: "下方滑入 - slideInBottom",
    color: "#aae3e2",
    fontSize: "24rpx",
    x: "50vw",
    y: "35vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInBottom"]
  })
  // 13. slideInLeft + slideOutRight (字母分割)
  .addText({
    text: "左侧滑入右侧滑出",
    color: "#ffd89b",
    fontSize: "24rpx",
    x: "50vw",
    y: "45vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInLeft", "slideOutRight"]
  })
  // 14. slideInTop + slideOutBottom (字母分割)
  .addText({
    text: "上方滑入下方滑出",
    color: "#a8edea",
    fontSize: "24rpx",
    x: "50vw",
    y: "55vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInTop", "slideOutBottom"]
  })
  // 15. bounceIn + bounceOut (字母分割)
  .addText({
    text: "弹跳进出 - bounceIn/bounceOut",
    color: "#fad0c4",
    fontSize: "24rpx",
    x: "50vw",
    y: "65vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceIn", "bounceOut"]
  })
  // 16. fadeInUp + fadeOutDown (字母分割)
  .addText({
    text: "淡入上移淡出下移",
    color: "#ffecd2",
    fontSize: "24rpx",
    x: "50vw",
    y: "75vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInUp", "fadeOutDown"]
  })
  // 17. fadeInDown + fadeOutUp (字母分割)
  .addText({
    text: "淡入下移淡出上移",
    color: "#fcb69f",
    fontSize: "24rpx",
    x: "50vw",
    y: "85vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInDown", "fadeOutUp"]
  })
  // 18. slideInRight + slideOutLeft (字母分割)
  .addText({
    text: "右侧滑入左侧滑出",
    color: "#a1c4fd",
    fontSize: "24rpx",
    x: "50vw",
    y: "95vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideInRight", "slideOutLeft"]
  })

// 第二场景：覆盖剩余的所有预设动画
const scene2 = mainTrack.createScene({ duration: 10 })
  .addBackground()
  .addText({
    text: "旋转变体 - rotateInLeft/rotateOutLeft",
    color: "#ffffff",
    fontSize: "24rpx",
    x: "50vw",
    y: "10vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["rotateInLeft", "rotateOutLeft"]
  })
  .addText({
    text: "旋转变体 - rotateInRight/rotateOutRight",
    color: "#4ecdc4",
    fontSize: "24rpx",
    x: "50vw",
    y: "20vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["rotateInRight", "rotateOutRight"]
  })
  .addText({
    text: "缩放淡入淡出 - zoomInFade/zoomOutFade",
    color: "#f39c12",
    fontSize: "24rpx",
    x: "50vw",
    y: "30vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomInFade", "zoomOutFade"]
  })
  .addText({
    text: "缩放旋转 - zoomRotateIn/zoomRotateOut",
    color: "#e74c3c",
    fontSize: "24rpx",
    x: "50vw",
    y: "40vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomRotateIn", "zoomRotateOut"]
  })
  .addText({
    text: "弹跳方向 - bounceInUp",
    color: "#9b59b6",
    fontSize: "24rpx",
    x: "50vw",
    y: "50vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceInUp"]
  })
  .addText({
    text: "弹跳方向 - bounceInDown",
    color: "#1abc9c",
    fontSize: "24rpx",
    x: "50vw",
    y: "60vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceInDown"]
  })
  .addText({
    text: "弹跳方向 - bounceInLeft",
    color: "#2ecc71",
    fontSize: "24rpx",
    x: "50vw",
    y: "70vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceInLeft"]
  })
  .addText({
    text: "弹跳方向 - bounceInRight",
    color: "#3498db",
    fontSize: "24rpx",
    x: "50vw",
    y: "80vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["bounceInRight"]
  })
  .addText({
    text: "弹跳退出 - bounceOutUp",
    color: "#8e44ad",
    fontSize: "24rpx",
    x: "50vw",
    y: "90vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "bounceOutUp"]
  })
  .addText({
    text: "弹跳退出 - bounceOutDown",
    color: "#c0392b",
    fontSize: "24rpx",
    x: "50vw",
    y: "15vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.4,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "bounceOutDown"]
  })
  .addText({
    text: "缩放方向 - zoomInUp/zoomOutUp",
    color: "#d35400",
    fontSize: "24rpx",
    x: "50vw",
    y: "25vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomInUp", "zoomOutUp"]
  })
  .addText({
    text: "缩放方向 - zoomInDown/zoomOutDown",
    color: "#e67e22",
    fontSize: "24rpx",
    x: "50vw",
    y: "35vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomInDown", "zoomOutDown"]
  })
  .addText({
    text: "缩放方向 - zoomInLeft/zoomOutLeft",
    color: "#95a5a6",
    fontSize: "24rpx",
    x: "50vw",
    y: "45vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomInLeft", "zoomOutLeft"]
  })
  .addText({
    text: "缩放方向 - zoomInRight/zoomOutRight",
    color: "#27ae60",
    fontSize: "24rpx",
    x: "50vw",
    y: "55vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["zoomInRight", "zoomOutRight"]
  })
  .addText({
    text: "翻转 - flipInX/flipOutX",
    color: "#2980b9",
    fontSize: "24rpx",
    x: "50vw",
    y: "65vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["flipInX", "flipOutX"]
  })
  .addText({
    text: "翻转 - flipInY/flipOutY",
    color: "#8e44ad",
    fontSize: "24rpx",
    x: "50vw",
    y: "75vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["flipInY", "flipOutY"]
  })
  .addText({
    text: "弹性 - elasticIn/elasticOut",
    color: "#c0392b",
    fontSize: "24rpx",
    x: "50vw",
    y: "85vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["elasticIn", "elasticOut"]
  })
  .addText({
    text: "效果 - swing/pulse/shake/flash",
    color: "#d35400",
    fontSize: "24rpx",
    x: "50vw",
    y: "95vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["swing", "pulse", "shake", "flash"]
  })

// 第三场景：滑出与滑入淡入组合
const scene3 = mainTrack.createScene({ duration: 10 })
  .addBackground()
  .addText({
    text: "缩放淡入 - fadeInScale/fadeOutScale",
    color: "#e67e22",
    fontSize: "24rpx",
    x: "50vw",
    y: "10vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInScale", "fadeOutScale"]
  })
  .addText({
    text: "淡入旋转 - fadeInRotate/fadeOutRotate",
    color: "#3498db",
    fontSize: "24rpx",
    x: "50vw",
    y: "20vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeInRotate", "fadeOutRotate"]
  })
  .addText({
    text: "滑入淡入 - slideFadeInLeft",
    color: "#95a5a6",
    fontSize: "24rpx",
    x: "50vw",
    y: "30vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideFadeInLeft"]
  })
  .addText({
    text: "滑入淡入 - slideFadeInRight",
    color: "#27ae60",
    fontSize: "24rpx",
    x: "50vw",
    y: "40vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideFadeInRight"]
  })
  .addText({
    text: "滑入淡入 - slideFadeInUp",
    color: "#2980b9",
    fontSize: "24rpx",
    x: "50vw",
    y: "50vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideFadeInUp"]
  })
  .addText({
    text: "滑入淡入 - slideFadeInDown",
    color: "#8e44ad",
    fontSize: "24rpx",
    x: "50vw",
    y: "60vh",
    textAlign: "center",
    duration: 5,
    startTime: 0,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["slideFadeInDown"]
  })
  .addText({
    text: "滑出淡出 - slideFadeOutLeft",
    color: "#c0392b",
    fontSize: "24rpx",
    x: "50vw",
    y: "70vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideFadeOutLeft"]
  })
  .addText({
    text: "滑出淡出 - slideFadeOutRight",
    color: "#d35400",
    fontSize: "24rpx",
    x: "50vw",
    y: "80vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideFadeOutRight"]
  })
  .addText({
    text: "滑出淡出 - slideFadeOutUp",
    color: "#e67e22",
    fontSize: "24rpx",
    x: "50vw",
    y: "90vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideFadeOutUp"]
  })
  .addText({
    text: "滑出淡出 - slideFadeOutDown",
    color: "#3498db",
    fontSize: "24rpx",
    x: "50vw",
    y: "15vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideFadeOutDown"]
  })
  .addText({
    text: "仅滑出 - slideOutTop",
    color: "#95a5a6",
    fontSize: "24rpx",
    x: "50vw",
    y: "25vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideOutTop"]
  })
  .addText({
    text: "仅滑出 - slideOutBottom",
    color: "#27ae60",
    fontSize: "24rpx",
    x: "50vw",
    y: "35vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideOutBottom"]
  })
  .addText({
    text: "仅滑出 - slideOutLeft",
    color: "#2980b9",
    fontSize: "24rpx",
    x: "50vw",
    y: "45vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideOutLeft"]
  })
  .addText({
    text: "仅滑出 - slideOutRight",
    color: "#8e44ad",
    fontSize: "24rpx",
    x: "50vw",
    y: "55vh",
    textAlign: "center",
    duration: 5,
    startTime: 5,
    fontFamily: "MicrosoftYaHei",
    split: "letter",
    splitDelay: 0.05,
    splitDuration: 0.3,
    stroke: true,
    strokeColor: "#000000",
    strokeWidth: 2,
    animations: ["fadeIn", "slideOutRight"]
  });
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "30vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "fadeInUp", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "40vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "rotateIn", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "50vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "zoomIn", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "60vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "bounceIn", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "70vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "slideInLeft", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "80vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "slideInLeft", // 映射到现有的预设动画
  //   ]
  // })
  // .addText({
  //   text: "一天，奇奇发现了一颗特别大的金色橡果，它兴奋地跳来跳去",
  //   color: "#ffffff",
  //   fontSize: "18rpx",
  //   x: "50vw",
  //   y: "100vh",
  //   textAlign: "center",
  //   duration: 10,
  //   startTime: 0,
  //   fontFamily: "MicrosoftYaHei",
  //   split: "letter",
  //   splitDelay: 0.1,
  //   splitDuration: 0.3,
  //   stroke: true,
  //   strokeColor: "#000000",
  //   strokeWidth: 2,
  //   animations: [
  //     "fadeInUp", // 映射到现有的预设动画
  //   ]
  // });

async function main() {
  const outputPath = path.join(__dirname, '../output/my-video.mp4');
  console.log('开始渲染视频...');
  await builder.export(outputPath);
  console.log(`视频已生成: ${outputPath}`);
  builder.destroy();
}

main().catch(console.error);

