/**
 * 基础功能测试
 */
import { Composition, TextElement, RectElement, FadeAnimation, MoveAnimation } from './src/index.js';

console.log('开始基础功能测试...\n');

try {
  // 测试 1: 创建合成
  console.log('测试 1: 创建合成...');
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });
  console.log('✓ 合成创建成功');
  console.log(`  - ID: ${composition.id}`);
  console.log(`  - 尺寸: ${composition.width}x${composition.height}`);
  console.log(`  - 帧率: ${composition.fps} fps`);
  console.log(`  - 时长: ${composition.duration} 秒\n`);

  // 测试 2: 创建图层
  console.log('测试 2: 创建图层...');
  const layer = composition.createElementLayer();
  console.log('✓ 图层创建成功');
  console.log(`  - 图层数量: ${composition.getLayers().length}\n`);

  // 测试 3: 创建文本元素
  console.log('测试 3: 创建文本元素...');
  const textElement = new TextElement({
    text: 'Hello, Video Composition!',
    x: 960,
    y: 400,
    fontSize: 72,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    width: 1920,
    height: 100,
  });
  console.log('✓ 文本元素创建成功');
  console.log(`  - 元素ID: ${textElement.id}`);
  console.log(`  - 元素类型: ${textElement.type}\n`);

  // 测试 4: 创建动画
  console.log('测试 4: 创建动画...');
  const fadeIn = new FadeAnimation({
    duration: 1,
    delay: 0,
    fromOpacity: 0,
    toOpacity: 1,
    easing: 'ease-out',
  });
  textElement.addAnimation(fadeIn);
  console.log('✓ 淡入动画创建成功');
  console.log(`  - 动画ID: ${fadeIn.id}`);
  console.log(`  - 动画数量: ${textElement.animations.length}\n`);

  // 测试 5: 添加元素到图层
  console.log('测试 5: 添加元素到图层...');
  layer.addElement(textElement);
  console.log('✓ 元素添加到图层成功');
  console.log(`  - 图层元素数量: ${layer.getElements().length}\n`);

  // 测试 6: 创建矩形元素
  console.log('测试 6: 创建矩形元素...');
  const rectElement = new RectElement({
    x: 960,
    y: 600,
    width: 400,
    height: 200,
    bgcolor: '#4a90e2',
    borderRadius: 20,
  });
  layer.addElement(rectElement);
  console.log('✓ 矩形元素创建并添加成功\n');

  // 测试 7: 测试时间线
  console.log('测试 7: 测试时间线...');
  composition.timeline.setTime(1.5);
  console.log('✓ 时间线设置成功');
  console.log(`  - 当前时间: ${composition.timeline.getTime()} 秒`);
  console.log(`  - 当前帧: ${composition.timeline.getCurrentFrame()}\n`);

  // 测试 8: 测试元素状态获取
  console.log('测试 8: 测试元素状态获取...');
  const state = textElement.getStateAtTime(0.5);
  console.log('✓ 元素状态获取成功');
  console.log(`  - 位置: (${state.x}, ${state.y})`);
  console.log(`  - 透明度: ${state.opacity.toFixed(2)}\n`);

  // 测试 9: 测试移动动画
  console.log('测试 9: 测试移动动画...');
  const moveUp = new MoveAnimation({
    duration: 2,
    delay: 1,
    fromX: 960,
    fromY: 400,
    toX: 960,
    toY: 300,
    easing: 'ease-in-out',
  });
  textElement.addAnimation(moveUp);
  const stateAt2s = textElement.getStateAtTime(2);
  console.log('✓ 移动动画测试成功');
  console.log(`  - 2秒时位置: (${stateAt2s.x.toFixed(1)}, ${stateAt2s.y.toFixed(1)})\n`);

  console.log('✅ 所有基础功能测试通过！');
  console.log('\n提示: 要导出视频，请运行: npm run example:basic');

  // 清理
  composition.destroy();

} catch (error) {
  console.error('❌ 测试失败:', error);
  console.error(error.stack);
  process.exit(1);
}

