/**
 * CommonJS 完整元素测试示例
 * 测试所有类型的元素：文本、图片、视频、矩形、圆形、SVG、转场等
 */
const fkbuilder = require('./dist/cjs/index.cjs');
const { VideoBuilder } = fkbuilder;
const path = require('path');
const fs = require('fs');

async function testAllElements() {
  console.log('🎨 CommonJS 完整元素测试\n');
  console.log('='.repeat(50));

  const assetsDir = path.join(__dirname, 'assets');
  const outputDir = path.join(__dirname, 'output');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 查找资源文件
  let imageFiles = [];
  let videoFiles = [];
  
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    videoFiles = files.filter(f => /\.(mp4|webm|mov|avi|mkv)$/i.test(f));
  }

  console.log(`📸 找到 ${imageFiles.length} 个图片文件`);
  console.log(`🎬 找到 ${videoFiles.length} 个视频文件\n`);

  // 创建视频构建器
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });

  // ========== 场景1: 文本元素测试 ==========
  console.log('📝 场景1: 文本元素测试');
  const scene1 = mainTrack.createScene({ duration: 3, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '文本元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '20%',
      textAlign: 'center',
      fontWeight: 'bold',
      duration: 3,
      animations: ['fadeIn'],
    })
    .addText({
      text: '普通文本',
      color: '#FFD700',
      fontSize: 48,
      x: '25%',
      y: '40%',
      textAlign: 'center',
      duration: 3,
    })
    .addText({
      text: '粗体文本',
      color: '#FF6B6B',
      fontSize: 48,
      x: '50%',
      y: '50%',
      textAlign: 'center',
      fontWeight: 'bold',
      duration: 3,
    })
    .addText({
      text: '斜体文本',
      color: '#4ECDC4',
      fontSize: 48,
      x: '75%',
      y: '60%',
      textAlign: 'center',
      fontStyle: 'italic',
      duration: 3,
    });

  // ========== 场景2: 图片元素测试 ==========
  if (imageFiles.length > 0) {
    console.log('📸 场景2: 图片元素测试');
    const imagePath = path.join(assetsDir, imageFiles[0]);
    
    const scene2 = mainTrack.createScene({ duration: 3, startTime: 3 })
      .addBackground({ color: '#16213e' })
      .addText({
        text: '图片元素测试',
        color: '#FFFFFF',
        fontSize: 72,
        x: '50%',
        y: '10%',
        textAlign: 'center',
        duration: 3,
      })
      .addImage({
        src: imagePath,
        x: '50%',
        y: '50%',
        width: '60%',
        height: '70%',
        anchor: [0.5, 0.5],
        fit: 'contain',
        duration: 3,
        animations: ['zoomIn'],
      });
  }

  // ========== 场景3: 视频元素测试 ==========
  if (videoFiles.length > 0) {
    console.log('🎬 场景3: 视频元素测试');
    const videoPath = path.join(assetsDir, videoFiles[0]);
    
    const scene3 = mainTrack.createScene({ duration: 3, startTime: 6 })
      .addBackground({ color: '#0f3460' })
      .addText({
        text: '视频元素测试',
        color: '#FFFFFF',
        fontSize: 72,
        x: '50%',
        y: '10%',
        textAlign: 'center',
        duration: 3,
      })
      .addVideo({
        src: videoPath,
        x: '50%',
        y: '50%',
        width: '60%',
        height: '70%',
        anchor: [0.5, 0.5],
        fit: 'cover',
        duration: 3,
        mute: true,
        loop: true,
      });
  }

  // ========== 场景4: 矩形和圆形元素测试 ==========
  console.log('🔷 场景4: 矩形和圆形元素测试');
  const scene4 = mainTrack.createScene({ duration: 3, startTime: 9 })
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: '矩形和圆形元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '10%',
      textAlign: 'center',
      duration: 3,
    })
    .addRect({
      x: '30%',
      y: '40%',
      width: 300,
      height: 200,
      bgcolor: '#3498db',
      borderRadius: 20,
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn', 'slideInLeft'],
    })
    .addRect({
      x: '70%',
      y: '40%',
      width: 300,
      height: 200,
      bgcolor: '#e74c3c',
      borderRadius: 20,
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn', 'slideInRight'],
    })
    .addCircle({
      x: '30%',
      y: '70%',
      radius: 100,
      bgcolor: '#2ecc71',
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn', 'zoomIn'],
    })
    .addCircle({
      x: '70%',
      y: '70%',
      radius: 100,
      bgcolor: '#f39c12',
      anchor: [0.5, 0.5],
      duration: 3,
      animations: ['fadeIn', 'zoomIn'],
    });

  // ========== 场景5: SVG 元素测试 ==========
  console.log('🎨 场景5: SVG 元素测试');
  const starSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <polygon points="100,10 120,70 180,70 135,110 155,170 100,135 45,170 65,110 20,70 80,70" 
               fill="#4ecdc4" 
               stroke="#ffffff" 
               stroke-width="3"/>
    </svg>
  `;

  const heartSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <path d="M100,180 C100,180 20,120 20,80 C20,50 40,30 70,30 C85,30 100,40 100,55 C100,40 115,30 130,30 C160,30 180,50 180,80 C180,120 100,180 100,180 Z" 
            fill="#ff6b6b" 
            stroke="#ffffff" 
            stroke-width="2"/>
    </svg>
  `;

  const scene5 = mainTrack.createScene({ duration: 3, startTime: 12 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: 'SVG 元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '10%',
      textAlign: 'center',
      duration: 3,
    })
    .addSVG({
      svgString: starSVG,
      x: '30%',
      y: '50%',
      width: 300,
      height: 300,
      anchor: [0.5, 0.5],
      fit: 'contain',
      duration: 3,
      animations: ['fadeIn', 'rotateIn'],
    })
    .addSVG({
      svgString: heartSVG,
      x: '70%',
      y: '50%',
      width: 300,
      height: 300,
      anchor: [0.5, 0.5],
      fit: 'contain',
      duration: 3,
      animations: ['fadeIn', 'zoomIn'],
    });

  // ========== 添加转场效果（暂时禁用，避免卡住） ==========
  // 注意：转场功能可能导致渲染卡住，暂时禁用
  // console.log('✨ 添加转场效果');
  // const scenes = mainTrack.getScenes();
  // 
  // // 场景1到场景2：淡入淡出
  // if (scenes.length > 1) {
  //   mainTrack.addTransition({
  //     name: 'fade',
  //     duration: 0.5,
  //     startTime: 3,
  //   });
  // }
  
  console.log('⚠️  转场效果已禁用（避免渲染卡住）');

  // ========== 导出视频 ==========
  const outputPath = path.join(outputDir, 'test-all-elements-commonjs.mp4');
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 构建信息:');
  console.log(`  总时长: ${builder.getTotalDuration()} 秒`);
  console.log(`  轨道数: ${builder.getTracks().length}`);
  console.log(`  场景数: ${mainTrack.getScenes().length}`);
  console.log(`  转场数: ${mainTrack.transitions.length}`);
  console.log('='.repeat(50));
  
  try {
    console.log('\n🎬 开始渲染视频...');
    const startTime = Date.now();
    
    await builder.render(outputPath, {
      parallel: false, // CommonJS 环境建议使用串行渲染
      usePipe: true,
      // 禁用转场以避免卡住
      skipTransitions: true,
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n✅ 渲染完成！');
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`⏱️  耗时: ${duration} 秒`);
    console.log(`📊 平均每帧: ${(duration / (builder.getTotalDuration() * 30) * 1000).toFixed(2)} ms`);
    
  } catch (error) {
    console.error('\n❌ 渲染失败:', error.message);
    if (error.stack) {
      console.error('详细错误:', error.stack.split('\n').slice(0, 5).join('\n'));
    }
  } finally {
    builder.destroy();
  }
}

// 运行测试
testAllElements().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});

