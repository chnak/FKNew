# 视频制作库

基于 Node.js + SpriteJS 的纯 JavaScript 视频制作库。

## 特性

- 🎬 **强大的合成系统** - 灵活的图层和元素管理
- 🎨 **丰富的元素类型** - 文本、图片、形状等
- ✨ **流畅的动画** - 关键帧动画、变换动画、淡入淡出等
- 🎯 **时间线管理** - 精确的时间控制和事件系统
- 🚀 **高性能渲染** - 基于 SpriteJS 的 2D 渲染引擎
- 📹 **视频导出** - 支持 MP4、WebM、GIF 格式导出

## 安装

```bash
npm install
# 或
yarn install
```

## 系统要求

- Node.js >= 16.0.0
- FFmpeg（用于视频编码）

### 安装 FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
下载并安装 [FFmpeg](https://ffmpeg.org/download.html)，确保添加到系统 PATH。

## 快速开始

### 基础示例

```javascript
import { Composition, TextElement, FadeAnimation } from './src/index.js';

// 创建合成
const composition = new Composition({
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 5,
  backgroundColor: '#1a1a1a',
});

// 创建图层
const layer = composition.createElementLayer();

// 创建文本元素
const textElement = new TextElement({
  text: 'Hello, World!',
  x: 960,
  y: 540,
  fontSize: 72,
  color: '#ffffff',
});

// 添加淡入动画
const fadeIn = new FadeAnimation({
  duration: 1,
  fromOpacity: 0,
  toOpacity: 1,
});
textElement.addAnimation(fadeIn);

layer.addElement(textElement);

// 导出视频
await composition.export('./output/video.mp4');
```

## 核心概念

### Composition（合成）

合成是视频制作的容器，管理所有图层和动画时间线。

```javascript
const composition = new Composition({
  width: 1920,        // 宽度
  height: 1080,       // 高度
  fps: 30,            // 帧率
  duration: 10,       // 持续时间（秒）
  backgroundColor: '#000000', // 背景颜色
});
```

### Layer（图层）

图层用于组织和管理元素。

```javascript
// 创建元素图层
const layer = composition.createElementLayer();

// 创建叠加图层（用于水印等）
const overlayLayer = composition.createOverlayLayer();
```

### Element（元素）

元素是视觉内容的基本单位。

#### 文本元素

```javascript
const textElement = new TextElement({
  text: 'Hello',
  x: 960,
  y: 540,
  fontSize: 48,
  fontFamily: 'Arial',
  color: '#ffffff',
});
```

#### 图片元素

```javascript
const imageElement = new ImageElement({
  src: './path/to/image.jpg',
  x: 960,
  y: 540,
  width: 800,
  height: 600,
  fit: 'cover', // cover, contain, fill, none
});

// 加载图片
await imageElement.load();
```

#### 形状元素

```javascript
// 矩形
const rect = new RectElement({
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  bgcolor: '#4a90e2',
  borderRadius: 10,
});

// 圆形
const circle = new CircleElement({
  x: 500,
  y: 500,
  radius: 100,
  bgcolor: '#ff6b6b',
});
```

### Animation（动画）

#### 淡入淡出动画

```javascript
const fadeIn = new FadeAnimation({
  duration: 1,
  delay: 0,
  fromOpacity: 0,
  toOpacity: 1,
  easing: 'ease-out',
});
```

#### 移动动画

```javascript
const move = new MoveAnimation({
  duration: 2,
  fromX: 0,
  fromY: 0,
  toX: 100,
  toY: 100,
  easing: 'ease-in-out',
});
```

#### 变换动画

```javascript
const transform = new TransformAnimation({
  duration: 1.5,
  from: { scaleX: 0.5, scaleY: 0.5, rotation: 0 },
  to: { scaleX: 1, scaleY: 1, rotation: 360 },
  easing: 'ease-out',
});
```

#### 关键帧动画

```javascript
const keyframeAnim = new KeyframeAnimation({
  duration: 2,
  easing: 'ease-out',
});

keyframeAnim.addKeyframe(0, { opacity: 0, scaleX: 0.5 });
keyframeAnim.addKeyframe(0.5, { opacity: 1, scaleX: 1.1 });
keyframeAnim.addKeyframe(1, { opacity: 1, scaleX: 1 });
```

## 示例

查看 `examples/` 目录获取更多示例：

- `basic-composition.js` - 基础合成示例
- `text-animation.js` - 文本动画示例
- `image-slideshow.js` - 图片幻灯片示例

运行示例：

```bash
npm run example:basic
```

## API 文档

详细的 API 文档请参考 [docs/api-reference.md](./docs/api-reference.md)。

## 项目结构

```
video-composition-engine/
├── src/
│   ├── core/           # 核心类
│   ├── elements/       # 元素类
│   ├── layers/         # 图层类
│   ├── animations/     # 动画类
│   ├── utils/          # 工具函数
│   └── types/          # 类型定义
├── examples/           # 使用示例
├── docs/               # 文档
├── tests/              # 测试文件
└── config/             # 配置文件
```

## 开发

```bash
# 运行测试
npm test

# 运行示例
npm start
```

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

