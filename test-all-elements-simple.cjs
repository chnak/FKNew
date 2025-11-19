/**
 * CommonJS 简化元素测试示例（不包含转场和视频）
 * 测试基本元素：文本、图片、矩形、圆形、SVG
 */
const fkbuilder = require('./dist/cjs/index.cjs');
const { VideoBuilder } = fkbuilder;
const path = require('path');
const fs = require('fs');

async function testAllElementsSimple() {
  console.log('🎨 CommonJS 简化元素测试（无转场、无视频）\n');
  console.log('='.repeat(50));

  const assetsDir = path.join(__dirname, 'assets');
  const outputDir = path.join(__dirname, 'output');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 查找资源文件
  let imageFiles = [];
  
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  }

  console.log(`📸 找到 ${imageFiles.length} 个图片文件\n`);

  // 创建视频构建器
  const builder = new VideoBuilder({
    width: 1920,
    height: 1080,
    fps: 30,
  });

  const mainTrack = builder.createTrack({ zIndex: 1, name: '主轨道' });

  // ========== 场景1: 文本元素测试 ==========
  console.log('📝 场景1: 文本元素测试');
  const scene1 = mainTrack.createScene({ duration: 2, startTime: 0 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: '文本元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '20%',
      textAlign: 'center',
      fontWeight: 'bold',
      duration: 2,
      animations: ['fadeIn'],
    })
    .addText({
      text: '普通文本',
      color: '#FFD700',
      fontSize: 48,
      x: '25%',
      y: '50%',
      textAlign: 'center',
      duration: 2,
    })
    .addText({
      text: '粗体文本',
      color: '#FF6B6B',
      fontSize: 48,
      x: '50%',
      y: '60%',
      textAlign: 'center',
      fontWeight: 'bold',
      duration: 2,
    })
    .addText({
      text: '斜体文本',
      color: '#4ECDC4',
      fontSize: 48,
      x: '75%',
      y: '70%',
      textAlign: 'center',
      fontStyle: 'italic',
      duration: 2,
    });

  // ========== 场景2: 图片元素测试 ==========
  if (imageFiles.length > 0) {
    console.log('📸 场景2: 图片元素测试');
    const imagePath = path.join(assetsDir, imageFiles[0]);
    
    const scene2 = mainTrack.createScene({ duration: 2, startTime: 2 })
      .addBackground({ color: '#16213e' })
      .addText({
        text: '图片元素测试',
        color: '#FFFFFF',
        fontSize: 72,
        x: '50%',
        y: '10%',
        textAlign: 'center',
        duration: 2,
      })
      .addImage({
        src: imagePath,
        x: '50%',
        y: '50%',
        width: '60%',
        height: '70%',
        anchor: [0.5, 0.5],
        fit: 'contain',
        duration: 2,
        animations: ['zoomIn'],
      });
  }

  // ========== 场景3: 矩形和圆形元素测试 ==========
  console.log('🔷 场景3: 矩形和圆形元素测试');
  const scene3 = mainTrack.createScene({ duration: 2, startTime: 4 })
    .addBackground({ color: '#2c3e50' })
    .addText({
      text: '矩形和圆形元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '10%',
      textAlign: 'center',
      duration: 2,
    })
    .addRect({
      x: '30%',
      y: '40%',
      width: 300,
      height: 200,
      bgcolor: '#3498db',
      borderRadius: 20,
      anchor: [0.5, 0.5],
      duration: 2,
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
      duration: 2,
      animations: ['fadeIn', 'slideInRight'],
    })
    .addCircle({
      x: '30%',
      y: '70%',
      radius: 100,
      bgcolor: '#2ecc71',
      anchor: [0.5, 0.5],
      duration: 2,
      animations: ['fadeIn', 'zoomIn'],
    })
    .addCircle({
      x: '70%',
      y: '70%',
      radius: 100,
      bgcolor: '#f39c12',
      anchor: [0.5, 0.5],
      duration: 2,
      animations: ['fadeIn', 'zoomIn'],
    });

  // ========== 场景4: SVG 元素测试 ==========
  console.log('🎨 场景4: SVG 元素测试');
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

  const scene4 = mainTrack.createScene({ duration: 2, startTime: 6 })
    .addBackground({ color: '#1a1a2e' })
    .addText({
      text: 'SVG 元素测试',
      color: '#FFFFFF',
      fontSize: 72,
      x: '50%',
      y: '10%',
      textAlign: 'center',
      duration: 2,
    })
    .addSVG({
      svgString: starSVG,
      x: '30%',
      y: '50%',
      width: 300,
      height: 300,
      anchor: [0.5, 0.5],
      fit: 'contain',
      duration: 2,
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
      duration: 2,
      animations: ['fadeIn', 'zoomIn'],
    });

  // ========== 导出视频（不使用转场，避免卡住） ==========
  const outputPath = path.join(outputDir, 'test-all-elements-simple-commonjs.mp4');
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 构建信息:');
  console.log(`  总时长: ${builder.getTotalDuration()} 秒`);
  console.log(`  轨道数: ${builder.getTracks().length}`);
  console.log(`  场景数: ${mainTrack.getScenes().length}`);
  console.log(`  转场数: 0 (已禁用)`);
  console.log('='.repeat(50));
  
  try {
    console.log('\n🎬 开始渲染视频（串行模式，无转场）...');
    const startTime = Date.now();
    
    await builder.render(outputPath, {
      parallel: false, // 使用串行渲染
      usePipe: true,
    });
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n✅ 渲染完成！');
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`⏱️  耗时: ${duration} 秒`);
    const totalFrames = builder.getTotalDuration() * 30;
    console.log(`📊 平均每帧: ${(duration / totalFrames * 1000).toFixed(2)} ms (${totalFrames}帧)`);
    
  } catch (error) {
    console.error('\n❌ 渲染失败:', error.message);
    if (error.stack) {
      console.error('详细错误:', error.stack.split('\n').slice(0, 10).join('\n'));
    }
  } finally {
    builder.destroy();
  }
}

// 运行测试
testAllElementsSimple().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});

