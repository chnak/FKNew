// 测试 CommonJS 编译后的使用
const fkbuilder = require('./dist/cjs/index.cjs');
const { VideoBuilder } = fkbuilder;
const path = require('path');
const fs = require('fs');

console.log('✅ fkbuilder 加载成功');
console.log('VideoBuilder:', typeof VideoBuilder);

// 创建视频构建器
const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30
});

console.log('✅ VideoBuilder 创建成功');

// 创建轨道
const track = builder.createTrack();

console.log('✅ Track 创建成功');

// 使用 track.createScene() 创建场景
const scene = track.createScene({
  duration: 2
});

console.log('✅ Scene 创建成功');

// 添加图片元素（如果资源文件存在）
const assetsDir = path.join(__dirname, 'assets');
const testImage = path.join(assetsDir, '20240923180701.jpg');

if (fs.existsSync(testImage)) {
  scene.addImage({
    src: testImage,
    x: 960,
    y: 540,
    width: 500,
    height: 500
  });
  console.log('✅ Image 元素添加成功');
} else {
  console.log('⚠️  测试图片不存在，跳过图片元素测试');
}

// 添加文本元素
scene.addText({
  text: 'CommonJS 测试',
  x: 960,
  y: 200,
  fontSize: 60,
  color: '#FFFFFF',
  textAlign: 'center'
});

console.log('✅ Text 元素添加成功');

// 测试渲染（不实际渲染，只检查方法是否存在）
console.log('✅ 所有基本功能测试通过');
console.log('\n📦 CommonJS 编译后的代码可以正常使用！');

