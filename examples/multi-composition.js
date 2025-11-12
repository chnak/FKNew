/**
 * 多个Composition示例
 * 演示嵌套合成和多个独立合成的使用
 */
import { Composition, TextElement, RectElement, FadeAnimation, MoveAnimation, CompositionElement } from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function multiCompositionExample() {
  console.log('创建多个Composition示例...\n');

  // ========== 示例1: 嵌套合成 ==========
  console.log('示例1: 创建嵌套合成...');

  // 创建主合成
  const mainComposition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });

  const mainLayer = mainComposition.createElementLayer();

  // 创建子合成1：标题卡片
  const titleComposition = new Composition({
    width: 800,
    height: 200,
    fps: 30,
    duration: 5,
    backgroundColor: 'transparent', // 透明背景
  });

  const titleLayer = titleComposition.createElementLayer();
  
  // 子合成中的背景矩形
  const titleBg = new RectElement({
    x: 400,
    y: 100,
    width: 800,
    height: 200,
    bgcolor: '#4a90e2',
    borderRadius: 20,
    anchor: [0.5, 0.5],
  });
  titleLayer.addElement(titleBg);

  // 子合成中的文本
  const titleText = new TextElement({
    text: '嵌套合成示例',
    x: 400,
    y: 100,
    fontSize: 48,
    fontFamily: 'PatuaOne',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    anchor: [0.5, 0.5],
  });
  
  const titleFade = new FadeAnimation({
    duration: 1,
    fromOpacity: 0,
    toOpacity: 1,
  });
  titleText.addAnimation(titleFade);
  titleLayer.addElement(titleText);

  // 将子合成作为元素添加到主合成
  const titleCompositionElement = new CompositionElement({
    x: 960,
    y: 300,
    width: 800,
    height: 200,
    composition: titleComposition,
    anchor: [0.5, 0.5],
  });
  
  const titleMove = new MoveAnimation({
    duration: 2,
    delay: 1,
    fromX: 960,
    fromY: 200,
    toX: 960,
    toY: 300,
    easing: 'ease-out',
  });
  titleCompositionElement.addAnimation(titleMove);
  mainLayer.addElement(titleCompositionElement);

  // 创建子合成2：内容卡片
  const contentComposition = new Composition({
    width: 600,
    height: 400,
    fps: 30,
    duration: 5,
    backgroundColor: 'transparent',
  });

  const contentLayer = contentComposition.createElementLayer();
  
  // 内容背景
  const contentBg = new RectElement({
    x: 300,
    y: 200,
    width: 600,
    height: 400,
    bgcolor: '#2c3e50',
    borderRadius: 15,
    anchor: [0.5, 0.5],
  });
  contentLayer.addElement(contentBg);

  // 内容文本
  const contentText = new TextElement({
    text: '这是子合成中的内容\n支持多行文本',
    x: 300,
    y: 200,
    fontSize: 36,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
    anchor: [0.5, 0.5],
  });
  
  const contentFade = new FadeAnimation({
    duration: 1.5,
    delay: 0.5,
    fromOpacity: 0,
    toOpacity: 1,
  });
  contentText.addAnimation(contentFade);
  contentLayer.addElement(contentText);

  // 将内容合成添加到主合成
  const contentCompositionElement = new CompositionElement({
    x: 960,
    y: 650,
    width: 600,
    height: 400,
    composition: contentComposition,
    anchor: [0.5, 0.5],
  });
  
  const contentScale = new FadeAnimation({
    duration: 1.5,
    delay: 1,
    fromOpacity: 0,
    toOpacity: 1,
  });
  contentCompositionElement.addAnimation(contentScale);
  mainLayer.addElement(contentCompositionElement);

  // 主合成中的其他元素
  const mainText = new TextElement({
    text: '主合成内容',
    x: '50%',
    y: '10%',
    fontSize: 32,
    fontFamily: 'PatuaOne',
    color: '#ffffff',
    textAlign: 'center',
  });
  mainLayer.addElement(mainText);

  // 导出主合成
  const outputPath1 = path.join(__dirname, '../output/multi-composition-nested.mp4');
  console.log('\n导出嵌套合成视频...');
  await mainComposition.export(outputPath1);
  console.log(`✅ 嵌套合成视频导出完成: ${outputPath1}`);

  // ========== 示例2: 多个独立合成 ==========
  console.log('\n示例2: 创建多个独立合成...');

  // 合成A：开场动画
  const compositionA = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 3,
    backgroundColor: '#000000',
  });

  const layerA = compositionA.createElementLayer();
  const textA = new TextElement({
    text: '场景 A',
    x: '50%',
    y: '50%',
    fontSize: 96,
    fontFamily: 'PatuaOne',
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
  });
  
  const fadeA = new FadeAnimation({
    duration: 2,
    fromOpacity: 0,
    toOpacity: 1,
  });
  textA.addAnimation(fadeA);
  layerA.addElement(textA);

  // 合成B：中间场景
  const compositionB = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 3,
    backgroundColor: '#1a1a1a',
  });

  const layerB = compositionB.createElementLayer();
  const textB = new TextElement({
    text: '场景 B',
    x: '50%',
    y: '50%',
    fontSize: 96,
    fontFamily: 'PatuaOne',
    fontWeight: 'bold',
    color: '#4ecdc4',
    textAlign: 'center',
  });
  
  const moveB = new MoveAnimation({
    duration: 2,
    fromX: 960,
    fromY: 200,
    toX: 960,
    toY: 540,
    easing: 'ease-out',
  });
  textB.addAnimation(moveB);
  layerB.addElement(textB);

  // 合成C：结束场景
  const compositionC = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 3,
    backgroundColor: '#2c3e50',
  });

  const layerC = compositionC.createElementLayer();
  const textC = new TextElement({
    text: '场景 C',
    x: '50%',
    y: '50%',
    fontSize: 96,
    fontFamily: 'PatuaOne',
    fontWeight: 'bold',
    color: '#ffe66d',
    textAlign: 'center',
  });
  
  const fadeC = new FadeAnimation({
    duration: 2,
    fromOpacity: 0,
    toOpacity: 1,
  });
  textC.addAnimation(fadeC);
  layerC.addElement(textC);

  // 导出各个独立合成
  console.log('\n导出独立合成视频...');
  
  const outputPathA = path.join(__dirname, '../output/multi-composition-A.mp4');
  await compositionA.export(outputPathA);
  console.log(`✅ 合成A导出完成: ${outputPathA}`);

  const outputPathB = path.join(__dirname, '../output/multi-composition-B.mp4');
  await compositionB.export(outputPathB);
  console.log(`✅ 合成B导出完成: ${outputPathB}`);

  const outputPathC = path.join(__dirname, '../output/multi-composition-C.mp4');
  await compositionC.export(outputPathC);
  console.log(`✅ 合成C导出完成: ${outputPathC}`);

  // ========== 示例3: 组合多个合成为一个视频 ==========
  console.log('\n示例3: 组合多个合成为一个完整视频...');

  // 创建一个主合成，包含所有场景
  const combinedComposition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 9, // 3个场景，每个3秒
    backgroundColor: '#000000',
  });

  const combinedLayer = combinedComposition.createElementLayer();

  // 场景A（0-3秒）
  const sceneA = new CompositionElement({
    x: 960,
    y: 540,
    width: 1920,
    height: 1080,
    composition: compositionA,
    anchor: [0.5, 0.5],
  });
  combinedLayer.addElement(sceneA);

  // 场景B（3-6秒）- 使用时间控制
  const sceneB = new CompositionElement({
    x: 960,
    y: 540,
    width: 1920,
    height: 1080,
    composition: compositionB,
    anchor: [0.5, 0.5],
    startTime: 3, // 3秒后开始
    endTime: 6,   // 6秒结束
  });
  combinedLayer.addElement(sceneB);

  // 场景C（6-9秒）
  const sceneC = new CompositionElement({
    x: 960,
    y: 540,
    width: 1920,
    height: 1080,
    composition: compositionC,
    anchor: [0.5, 0.5],
    startTime: 6,
    endTime: 9,
  });
  combinedLayer.addElement(sceneC);

  // 导出组合视频
  const outputPathCombined = path.join(__dirname, '../output/multi-composition-combined.mp4');
  console.log('\n导出组合视频...');
  await combinedComposition.export(outputPathCombined);
  console.log(`✅ 组合视频导出完成: ${outputPathCombined}`);

  // 清理
  mainComposition.destroy();
  compositionA.destroy();
  compositionB.destroy();
  compositionC.destroy();
  combinedComposition.destroy();

  console.log('\n✅ 所有示例完成！');
}

multiCompositionExample().catch(console.error);

