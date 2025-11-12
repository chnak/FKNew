# API 参考文档

## Composition

视频合成容器类。

### 构造函数

```javascript
new Composition(config)
```

**参数:**
- `config.width` (number) - 合成宽度，默认 1920
- `config.height` (number) - 合成高度，默认 1080
- `config.fps` (number) - 帧率，默认 30
- `config.duration` (number) - 持续时间（秒），默认 10
- `config.backgroundColor` (string) - 背景颜色，默认 '#000000'

### 方法

#### `setSize(width, height)`
设置合成尺寸。

#### `setBackgroundColor(color)`
设置背景颜色。

#### `setDuration(duration)`
设置持续时间。

#### `addLayer(layer)`
添加图层。

#### `removeLayer(layer)`
移除图层。

#### `createElementLayer(config)`
创建元素图层。

#### `createOverlayLayer(config)`
创建叠加图层。

#### `renderFrame(time)`
渲染指定时间的一帧。

#### `export(outputPath, options)`
导出视频。

## Element

### TextElement

文本元素。

#### 构造函数

```javascript
new TextElement(config)
```

**配置:**
- `text` (string) - 文本内容
- `x`, `y` (number) - 位置
- `fontSize` (number) - 字体大小
- `fontFamily` (string) - 字体族
- `color` (string) - 文本颜色
- `textAlign` (string) - 文本对齐

### ImageElement

图片元素。

#### 构造函数

```javascript
new ImageElement(config)
```

**配置:**
- `src` (string) - 图片路径或 URL
- `x`, `y` (number) - 位置
- `width`, `height` (number) - 尺寸
- `fit` (string) - 适配方式：'cover', 'contain', 'fill', 'none'

#### `load()`
加载图片（异步）。

## Animation

### FadeAnimation

淡入淡出动画。

#### 构造函数

```javascript
new FadeAnimation(config)
```

**配置:**
- `duration` (number) - 持续时间（秒）
- `delay` (number) - 延迟时间（秒）
- `fromOpacity` (number) - 起始透明度 (0-1)
- `toOpacity` (number) - 结束透明度 (0-1)
- `easing` (string) - 缓动函数

### MoveAnimation

移动动画。

#### 构造函数

```javascript
new MoveAnimation(config)
```

**配置:**
- `duration` (number) - 持续时间
- `fromX`, `fromY` (number) - 起始位置
- `toX`, `toY` (number) - 结束位置
- `easing` (string) - 缓动函数

### TransformAnimation

变换动画。

#### 构造函数

```javascript
new TransformAnimation(config)
```

**配置:**
- `duration` (number) - 持续时间
- `from` (object) - 起始状态 { x, y, rotation, scaleX, scaleY }
- `to` (object) - 结束状态
- `easing` (string) - 缓动函数

### KeyframeAnimation

关键帧动画。

#### 构造函数

```javascript
new KeyframeAnimation(config)
```

#### `addKeyframe(time, props)`
添加关键帧。

**参数:**
- `time` (number) - 关键帧时间（相对于动画开始）
- `props` (object) - 属性对象

## 缓动函数

支持的缓动函数：
- `linear` - 线性
- `ease-in` - 缓入
- `ease-out` - 缓出
- `ease-in-out` - 缓入缓出
- `ease-in-quad` - 二次缓入
- `ease-out-quad` - 二次缓出
- `ease-in-cubic` - 三次缓入
- `ease-out-cubic` - 三次缓出

