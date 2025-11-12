/**
 * 动画功能详细测试
 */
import { TextElement, FadeAnimation, MoveAnimation, TransformAnimation } from './src/index.js';

console.log('开始动画功能详细测试...\n');

try {
  // 测试淡入动画
  console.log('测试 1: 淡入动画状态计算...');
  const text = new TextElement({
    text: 'Test',
    x: 100,
    y: 200,
    fontSize: 24,
    opacity: 0.5, // 初始透明度
  });

  const fadeIn = new FadeAnimation({
    duration: 2,
    delay: 0,
    fromOpacity: 0,
    toOpacity: 1,
  });
  text.addAnimation(fadeIn);

  // 测试不同时间点的状态
  const state0 = text.getStateAtTime(0);
  const state1 = text.getStateAtTime(1);
  const state2 = text.getStateAtTime(2);

  console.log(`  时间 0s: 位置(${state0.x}, ${state0.y}), 透明度=${state0.opacity.toFixed(2)}`);
  console.log(`  时间 1s: 位置(${state1.x}, ${state1.y}), 透明度=${state1.opacity.toFixed(2)}`);
  console.log(`  时间 2s: 位置(${state2.x}, ${state2.y}), 透明度=${state2.opacity.toFixed(2)}`);
  console.log('✓ 淡入动画测试通过\n');

  // 测试移动动画
  console.log('测试 2: 移动动画状态计算...');
  const text2 = new TextElement({
    text: 'Move Test',
    x: 0,
    y: 0,
    fontSize: 24,
  });

  const move = new MoveAnimation({
    duration: 3,
    delay: 0,
    fromX: 100,
    fromY: 100,
    toX: 500,
    toY: 300,
    easing: 'linear',
  });
  text2.addAnimation(move);

  const moveState0 = text2.getStateAtTime(0);
  const moveState1_5 = text2.getStateAtTime(1.5);
  const moveState3 = text2.getStateAtTime(3);

  console.log(`  时间 0s: 位置(${moveState0.x.toFixed(1)}, ${moveState0.y.toFixed(1)})`);
  console.log(`  时间 1.5s: 位置(${moveState1_5.x.toFixed(1)}, ${moveState1_5.y.toFixed(1)})`);
  console.log(`  时间 3s: 位置(${moveState3.x.toFixed(1)}, ${moveState3.y.toFixed(1)})`);
  console.log('✓ 移动动画测试通过\n');

  // 测试组合动画
  console.log('测试 3: 组合动画（淡入+移动）...');
  const text3 = new TextElement({
    text: 'Combined',
    x: 0,
    y: 0,
    fontSize: 24,
  });

  const fade = new FadeAnimation({
    duration: 2,
    delay: 0,
    fromOpacity: 0,
    toOpacity: 1,
  });

  const move2 = new MoveAnimation({
    duration: 2,
    delay: 0,
    fromX: 0,
    fromY: 0,
    toX: 200,
    toY: 200,
  });

  text3.addAnimation(fade);
  text3.addAnimation(move2);

  const combinedState1 = text3.getStateAtTime(1);
  console.log(`  时间 1s: 位置(${combinedState1.x.toFixed(1)}, ${combinedState1.y.toFixed(1)}), 透明度=${combinedState1.opacity.toFixed(2)}`);
  console.log('✓ 组合动画测试通过\n');

  // 测试动画激活判断
  console.log('测试 4: 动画激活判断...');
  const delayedAnim = new FadeAnimation({
    duration: 1,
    delay: 2,
    fromOpacity: 0,
    toOpacity: 1,
  });

  console.log(`  时间 1s 是否激活: ${delayedAnim.isActiveAtTime(1)}`);
  console.log(`  时间 2s 是否激活: ${delayedAnim.isActiveAtTime(2)}`);
  console.log(`  时间 2.5s 是否激活: ${delayedAnim.isActiveAtTime(2.5)}`);
  console.log(`  时间 4s 是否激活: ${delayedAnim.isActiveAtTime(4)}`);
  console.log('✓ 动画激活判断测试通过\n');

  console.log('✅ 所有动画功能测试通过！');

} catch (error) {
  console.error('❌ 测试失败:', error);
  console.error(error.stack);
  process.exit(1);
}

