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

