/**
 * 文本分割功能测试
 * 测试中文、英文、中英文混合、符号等场景
 */
import { VideoBuilder } from '../src/index.js';
import { registerFontFile } from '../src/utils/font-manager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 注册字体
const fontPath = 'D:/code/foliko-trade/public/fonts/MicrosoftYaHei-Bold-01.ttf';
try {
  registerFontFile(fontPath, 'MicrosoftYaHei');
} catch (error) {
  console.warn('字体注册失败，将使用默认字体:', error.message);
}

async function testTextSplit() {
  console.log('🎬 开始测试文本分割功能...\n');

  const outputDir = path.join(__dirname, '../output');
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });

  let currentTime = 0;
  const sceneDuration = 5; // 每个场景5秒
  const transitionDuration = 0.5;

  // ========== 场景1：纯中文 ==========
  console.log('创建场景1: 纯中文...');
  const scene1 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: currentTime,
  })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '程序化视频生成',
      x: '50%',
      y: '40%',
      fontSize: 100,
      color: '#4ECDC4',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'MicrosoftYaHei',
      fontWeight: 'bold',
      split: 'letter',
      splitDelay: 0.15,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#000000',
      textShadowBlur: 20,
    })
    .addText({
      text: '纯中文测试',
      x: '50%',
      y: '60%',
      fontSize: 80,
      color: '#FFD700',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: 'MicrosoftYaHei',
      split: 'letter',
      splitDelay: 0.1,
      animations: ['bounceIn'],
    });

  currentTime += sceneDuration;

  // ========== 场景2：纯英文 ==========
  console.log('创建场景2: 纯英文...');
  const scene2StartTime = currentTime - transitionDuration;
  const scene2 = mainTrack.createScene({
    duration: sceneDuration,
    startTime: scene2StartTime,
  })
    .addBackground({ color: '#2d3436' })
    .addText({
      text: 'Hello World',
      x: '50%',
      y: '40%',
      fontSize: 120,
      color: '#74b9ff',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 0,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      // split: 'letter',
      // splitDelay: 0.1,
      animations: ['fadeIn'],
      textShadow: true,
      textShadowColor: '#000000',
      textShadowBlur: 15,
    })
    .addText({
      text: 'English Text',
      x: '50%',
      y: '60%',
      fontSize: 100,
      color: '#a29bfe',
      textAlign: 'center',
      anchor: [0.5, 0.5],
      duration: sceneDuration,
      startTime: 1,
      fontFamily: 'Arial',
      split: 'word',
      splitDelay: 0.2,
      //animations: ['slideInLeft'],
    });

  mainTrack.addTransition({
    name: 'fade',
    duration: transitionDuration,
    startTime: scene2StartTime,
  });

  currentTime = scene2StartTime + sceneDuration;

  // // ========== 场景3：中英文混合 ==========
  // console.log('创建场景3: 中英文混合...');
  // const scene3StartTime = currentTime - transitionDuration;
  // const scene3 = mainTrack.createScene({
  //   duration: sceneDuration,
  //   startTime: scene3StartTime,
  // })
  //   .addBackground({ color: '#1a1a2e' })
  //   .addText({
  //     text: 'FKNew 视频生成库',
  //     x: '50%',
  //     y: '40%',
  //     fontSize: 100,
  //     color: '#4ECDC4',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0,
  //     fontFamily: 'MicrosoftYaHei',
  //     fontWeight: 'bold',
  //     split: 'letter',
  //     splitDelay: 0.1,
  //     animations: ['fadeIn'],
  //     textShadow: true,
  //     textShadowColor: '#000000',
  //     textShadowBlur: 20,
  //   })
  //   .addText({
  //     text: 'Programmatic Video Generation',
  //     x: '50%',
  //     y: '60%',
  //     fontSize: 60,
  //     color: '#FFD700',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 1,
  //     fontFamily: 'Arial',
  //     split: 'word',
  //     splitDelay: 0.15,
  //     animations: ['bounceIn'],
  //   });

  // mainTrack.addTransition({
  //   name: 'CrossZoom',
  //   duration: transitionDuration,
  //   startTime: scene3StartTime,
  // });

  // currentTime = scene3StartTime + sceneDuration;

  // // ========== 场景4：包含符号 ==========
  // console.log('创建场景4: 包含符号...');
  // const scene4StartTime = currentTime - transitionDuration;
  // const scene4 = mainTrack.createScene({
  //   duration: sceneDuration,
  //   startTime: scene4StartTime,
  // })
  //   .addBackground({ color: '#2d3436' })
  //   .addText({
  //     text: 'Hello, World!',
  //     x: '50%',
  //     y: '35%',
  //     fontSize: 100,
  //     color: '#ff6b6b',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0,
  //     fontFamily: 'Arial',
  //     fontWeight: 'bold',
  //     split: 'letter',
  //     splitDelay: 0.1,
  //     animations: ['fadeIn'],
  //     textShadow: true,
  //     textShadowColor: '#000000',
  //     textShadowBlur: 15,
  //   })
  //   .addText({
  //     text: '价格：¥99.99 / $19.99',
  //     x: '50%',
  //     y: '55%',
  //     fontSize: 80,
  //     color: '#4ECDC4',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0.5,
  //     fontFamily: 'MicrosoftYaHei',
  //     split: 'letter',
  //     splitDelay: 0.1,
  //     animations: ['fadeIn'],
  //   })
  //   .addText({
  //     text: 'Email: test@example.com',
  //     x: '50%',
  //     y: '75%',
  //     fontSize: 70,
  //     color: '#a29bfe',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 1,
  //     fontFamily: 'Arial',
  //     split: 'letter',
  //     splitDelay: 0.08,
  //     animations: ['fadeIn'],
  //   });

  // mainTrack.addTransition({
  //   name: 'Swirl',
  //   duration: transitionDuration,
  //   startTime: scene4StartTime,
  // });

  // currentTime = scene4StartTime + sceneDuration;

  // // ========== 场景5：包含空格 ==========
  // console.log('创建场景5: 包含空格...');
  // const scene5StartTime = currentTime - transitionDuration;
  // const scene5 = mainTrack.createScene({
  //   duration: sceneDuration,
  //   startTime: scene5StartTime,
  // })
  //   .addBackground({ color: '#1a1a2e' })
  //   .addText({
  //     text: 'Hello   World', // 多个空格
  //     x: '50%',
  //     y: '40%',
  //     fontSize: 100,
  //     color: '#FFD700',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0,
  //     fontFamily: 'Arial',
  //     fontWeight: 'bold',
  //     split: 'letter',
  //     splitDelay: 0.1,
  //     animations: ['fadeIn'],
  //     textShadow: true,
  //     textShadowColor: '#000000',
  //     textShadowBlur: 15,
  //   })
  //   .addText({
  //     text: '中 文 测 试', // 中文字符之间有空格
  //     x: '50%',
  //     y: '60%',
  //     fontSize: 90,
  //     color: '#4ECDC4',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 1,
  //     fontFamily: 'MicrosoftYaHei',
  //     split: 'letter',
  //     splitDelay: 0.12,
  //     animations: ['bounceIn'],
  //   });

  // mainTrack.addTransition({
  //   name: 'Bounce',
  //   duration: transitionDuration,
  //   startTime: scene5StartTime,
  // });

  // currentTime = scene5StartTime + sceneDuration;

  // // ========== 场景6：多行文本 ==========
  // console.log('创建场景6: 多行文本...');
  // const scene6StartTime = currentTime - transitionDuration;
  // const scene6 = mainTrack.createScene({
  //   duration: sceneDuration,
  //   startTime: scene6StartTime,
  // })
  //   .addBackground({ color: '#2d3436' })
  //   .addText({
  //     text: '第一行\n第二行\n第三行',
  //     x: '50%',
  //     y: '50%',
  //     fontSize: 80,
  //     color: '#74b9ff',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0,
  //     fontFamily: 'MicrosoftYaHei',
  //     fontWeight: 'bold',
  //     split: 'line',
  //     splitDelay: 0.3,
  //     animations: ['fadeIn'],
  //     textShadow: true,
  //     textShadowColor: '#000000',
  //     textShadowBlur: 20,
  //   });

  // mainTrack.addTransition({
  //   name: 'Dreamy',
  //   duration: transitionDuration,
  //   startTime: scene6StartTime,
  // });

  // currentTime = scene6StartTime + sceneDuration;

  // // ========== 场景7：复杂混合 ==========
  // console.log('创建场景7: 复杂混合（中文+英文+符号+空格）...');
  // const scene7StartTime = currentTime - transitionDuration;
  // const scene7 = mainTrack.createScene({
  //   duration: sceneDuration,
  //   startTime: scene7StartTime,
  // })
  //   .addBackground({ color: '#1a1a2e' })
  //   .addText({
  //     text: 'FKNew v1.0.0 - 程序化视频生成库',
  //     x: '50%',
  //     y: '40%',
  //     fontSize: 85,
  //     color: '#4ECDC4',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0,
  //     fontFamily: 'MicrosoftYaHei',
  //     fontWeight: 'bold',
  //     split: 'letter',
  //     splitDelay: 0.08,
  //     animations: ['fadeIn'],
  //     textShadow: true,
  //     textShadowColor: '#000000',
  //     textShadowBlur: 20,
  //     stroke: true,
  //     strokeColor: '#FFFFFF',
  //     strokeWidth: 2,
  //   })
  //   .addText({
  //     text: '支持：中文、English、符号!@#$%',
  //     x: '50%',
  //     y: '60%',
  //     fontSize: 70,
  //     color: '#FFD700',
  //     textAlign: 'center',
  //     anchor: [0.5, 0.5],
  //     duration: sceneDuration,
  //     startTime: 0.8,
  //     fontFamily: 'MicrosoftYaHei',
  //     split: 'letter',
  //     splitDelay: 0.08,
  //     animations: ['bounceIn'],
  //     gradient: true,
  //     gradientColors: ['#FFD700', '#FF6B6B'],
  //     gradientDirection: 'horizontal',
  //   });

  // mainTrack.addTransition({
  //   name: 'Radial',
  //   duration: transitionDuration,
  //   startTime: scene7StartTime,
  // });

  // 导出视频
  const outputPath = path.join(outputDir, 'test-text-split.mp4');
  console.log(`\n🚀 开始导出视频...`);
  console.log(`输出路径: ${outputPath}\n`);
  console.log(`总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
  console.log(`场景数: ${mainTrack.scenes.length}`);
  console.log(`转场数: ${mainTrack.transitions.length}\n`);

  try {
    await builder.export(outputPath, {
      quality: 'high',
      bitrate: '10M',
    });

    console.log('✅ 视频导出成功！');
    console.log(`📁 文件位置: ${outputPath}`);
    console.log(`⏱️  总时长: ${builder.getTotalDuration().toFixed(2)} 秒`);
    console.log('\n测试场景：');
    console.log('  1. 纯中文 - 逐字动画');
    console.log('  2. 纯英文 - 逐字和逐词动画');
    console.log('  3. 中英文混合 - 逐字和逐词动画');
    console.log('  4. 包含符号 - 逗号、感叹号、货币符号、@等');
    console.log('  5. 包含空格 - 多个空格、中文字符间空格');
    console.log('  6. 多行文本 - 逐行动画');
    console.log('  7. 复杂混合 - 中文+英文+符号+空格组合');
  } catch (error) {
    console.error('❌ 导出失败:', error);
    throw error;
  }
}

testTextSplit().catch(console.error);
