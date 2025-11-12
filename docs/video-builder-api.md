# VideoBuilder API 文档

VideoBuilder 提供了高级的链式 API，用于创建多轨道多场景的视频。

## 基本用法

```javascript
import { VideoBuilder } from './src/index.js';

const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
  backgroundColor: '#000000',
});

// 创建轨道
const track1 = builder.createTrack({ zIndex: 1 });

// 创建场景
const scene1 = track1.createScene({ duration: 10 });

// 链式添加元素
scene1
  .addBackground({ color: '#2c3e50' })
  .addText({ text: 'Hello', x: '50%', y: '50%', fontSize: 72 })
  .addRect({ x: '50%', y: '60%', width: 400, height: 100, bgcolor: '#3498db' });

// 添加转场
track1.addTransition({ type: 'fade', duration: 1 });

// 导出视频
await builder.export('./output/video.mp4');
```

## VideoBuilder

### 构造函数

```javascript
new VideoBuilder(config)
```

**参数：**
- `config.width` (number): 视频宽度，默认 1920
- `config.height` (number): 视频高度，默认 1080
- `config.fps` (number): 帧率，默认 30
- `config.backgroundColor` (string): 背景颜色，默认 '#000000'

### 方法

#### `createTrack(config)`
创建新轨道。

**参数：**
- `config.zIndex` (number): 轨道层级，数字越大越在上层
- `config.name` (string): 轨道名称（可选）

**返回：** `Track` 实例

#### `getTracks()`
获取所有轨道。

**返回：** `Array<Track>`

#### `getTotalDuration()`
计算总时长（所有轨道中最长的）。

**返回：** `number` (秒)

#### `export(outputPath, options)`
导出视频。

**参数：**
- `outputPath` (string): 输出文件路径
- `options` (object): 导出选项

**返回：** `Promise<void>`

#### `renderFrame(time)`
渲染一帧。

**参数：**
- `time` (number): 时间（秒）

**返回：** `Promise<Canvas>`

#### `destroy()`
销毁构建器，释放资源。

## Track

### 方法

#### `createScene(config)`
创建场景。

**参数：**
- `config.duration` (number): 场景时长（秒），默认 5
- `config.startTime` (number): 场景开始时间（可选，不指定则自动计算）
- `config.name` (string): 场景名称（可选）

**返回：** `Scene` 实例

#### `addTransition(config)`
添加转场效果。

**参数：**
- `config.type` (string): 转场类型 ('fade', 'slide', 'zoom')，默认 'fade'
- `config.duration` (number): 转场时长（秒），默认 0.5
- `config.fromScene` (Scene): 源场景（可选）
- `config.toScene` (Scene): 目标场景（可选）
- `config.fromSceneIndex` (number): 源场景索引（可选）
- `config.toSceneIndex` (number): 目标场景索引（可选）

**返回：** `Track` 实例（支持链式调用）

#### `getScenes()`
获取所有场景。

**返回：** `Array<Scene>`

#### `getTotalDuration()`
计算轨道总时长。

**返回：** `number` (秒)

## Scene

### 方法

所有添加元素的方法都返回 `Scene` 实例，支持链式调用。

#### `addBackground(config)`
添加背景。

**参数：**
- `config.color` 或 `config.backgroundColor` (string): 背景颜色

**返回：** `Scene` 实例

#### `addText(config)`
添加文本元素。

**参数：**
- `config.text` (string): 文本内容
- `config.x` (string|number): X 坐标（支持单位：%, vw, vh, px 等）
- `config.y` (string|number): Y 坐标
- `config.fontSize` (string|number): 字体大小（支持单位：%, rpx, vw, px 等）
- `config.fontFamily` (string): 字体族，默认 'PatuaOne'
- `config.color` (string): 文本颜色
- `config.textAlign` (string): 文本对齐方式
- 其他 TextElement 支持的配置...

**返回：** `Scene` 实例

#### `addImage(config)`
添加图片元素。

**参数：**
- `config.src` (string): 图片路径
- `config.x`, `config.y`, `config.width`, `config.height`: 位置和尺寸
- 其他 ImageElement 支持的配置...

**返回：** `Scene` 实例

#### `addRect(config)`
添加矩形元素。

**参数：**
- `config.x`, `config.y`, `config.width`, `config.height`: 位置和尺寸
- `config.bgcolor` (string): 背景颜色
- `config.borderRadius` (number): 圆角半径
- 其他 RectElement 支持的配置...

**返回：** `Scene` 实例

#### `addCircle(config)`
添加圆形元素。

**参数：**
- `config.x`, `config.y`: 位置
- `config.radius` (number): 半径
- `config.bgcolor` (string): 背景颜色
- 其他 CircleElement 支持的配置...

**返回：** `Scene` 实例

#### `addElement(element)`
添加自定义元素。

**参数：**
- `element` (BaseElement): 元素实例

**返回：** `Scene` 实例

## 完整示例

```javascript
import { VideoBuilder } from './src/index.js';

const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
});

// 轨道1
const track1 = builder.createTrack({ zIndex: 1 });

const scene1 = track1.createScene({ duration: 10 });
scene1
  .addBackground({ color: '#2c3e50' })
  .addText({
    text: '场景 1',
    x: '50%',
    y: '50%',
    fontSize: 72,
    color: '#ffffff',
  });

const scene2 = track1.createScene({ duration: 10 });
scene2
  .addBackground({ color: '#34495e' })
  .addRect({
    x: '50%',
    y: '50%',
    width: 400,
    height: 200,
    bgcolor: '#3498db',
  });

track1.addTransition({
  type: 'fade',
  duration: 1,
  fromSceneIndex: 0,
  toSceneIndex: 1,
});

// 导出
await builder.export('./output/video.mp4');
builder.destroy();
```

## 单位支持

所有位置和尺寸属性都支持以下单位：

- `%` - 百分比（x/width 基于宽度，y/height 基于高度）
- `vw`, `vh` - 视口单位
- `vmin`, `vmax` - 视口最小/最大单位
- `rpx` - 响应式像素（750rpx = 100% width）
- `px` - 像素（默认）

字体大小支持：`%`, `rpx`, `vw`, `vh`, `vmin`, `vmax`, `px`

## 注意事项

1. 场景的 `startTime` 如果不指定，会自动按顺序计算
2. 转场效果目前支持基本类型，具体实现可以根据需要扩展
3. 每个场景的背景是独立的，会覆盖全局背景
4. 轨道按 `zIndex` 排序，数字越大越在上层
5. 使用完毕后建议调用 `builder.destroy()` 释放资源

