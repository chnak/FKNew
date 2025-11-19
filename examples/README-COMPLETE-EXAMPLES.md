# 完整示例说明

本目录包含两个完整的示例文件，展示如何使用 `fkbuilder` 创建包含各种元素的视频。

## 示例文件

### 1. ESM 示例 (`example-complete-esm.js`)

**运行方式：**
```bash
node examples/example-complete-esm.js
```

**特点：**
- 使用 ES Module (ESM) 语法
- 支持并行渲染（`parallel: true`）
- 包含所有元素类型：文本、图片、视频、矩形、圆形、SVG
- 包含转场效果

**输出文件：** `output/example-complete-esm.mp4`

### 2. CommonJS 示例 (`example-complete-commonjs.cjs`)

**运行方式：**
```bash
node examples/example-complete-commonjs.cjs
```

**特点：**
- 使用 CommonJS 语法（`require`）
- 使用串行渲染（`parallel: false`），更适合 CommonJS 环境
- 包含所有元素类型：文本、图片、视频、矩形、圆形、SVG
- 包含转场效果

**输出文件：** `output/example-complete-commonjs.mp4`

## 示例内容

两个示例都包含以下场景：

### 场景1: 文本元素
- 演示不同类型的文本样式
- 普通文本、粗体文本、斜体文本
- 使用 `fadeIn` 动画

### 场景2: 图片元素
- 加载并显示图片
- 使用 `contain` 适配模式
- 使用 `zoomIn` 动画

### 场景3: 视频元素
- 加载并播放视频
- 使用 `cover` 适配模式
- 静音播放，循环播放

### 场景4: 矩形和圆形元素
- 创建带圆角的矩形
- 创建圆形
- 使用多种动画效果（`fadeIn`, `slideInLeft`, `slideInRight`, `zoomIn`）

### 场景5: SVG 元素
- 创建星形 SVG
- 创建心形 SVG
- 使用旋转和缩放动画

### 转场效果
- 场景1 → 场景2: `fade`（淡入淡出）
- 场景2 → 场景3: `directional-left`（从左滑入）
- 场景3 → 场景4: `CircleCrop`（圆形裁剪）
- 场景4 → 场景5: `wipeLeft`（从左擦除）

## 代码结构

```javascript
// 1. 导入/引入库
import { VideoBuilder } from '../src/index.js';  // ESM
// 或
const { VideoBuilder } = require('../dist/cjs/index.cjs');  // CommonJS

// 2. 创建视频构建器
const builder = new VideoBuilder({
  width: 1920,
  height: 1080,
  fps: 30,
});

// 3. 创建轨道
const track = builder.createTrack({ zIndex: 1 });

// 4. 创建场景并添加元素
const scene = track.createScene({ duration: 3 })
  .addBackground({ color: '#1a1a2e' })
  .addText({ text: 'Hello', ... })
  .addImage({ src: 'path/to/image.jpg', ... });

// 5. 添加转场
track.addTransition({
  name: 'fade',
  duration: 0.5,
  startTime: 3,
});

// 6. 渲染视频
await builder.render('output.mp4', {
  parallel: true,  // ESM: true, CommonJS: false
  usePipe: true,
});
```

## 注意事项

1. **资源文件**：示例会自动查找 `assets/` 目录下的图片和视频文件
2. **输出目录**：视频会输出到 `output/` 目录
3. **渲染模式**：
   - ESM 示例使用并行渲染（更快）
   - CommonJS 示例使用串行渲染（更稳定）
4. **转场效果**：如果渲染卡住，可以注释掉转场相关代码

## 常见问题

### Q: 渲染卡住了怎么办？
A: 可能是转场渲染导致的，可以：
1. 注释掉转场代码
2. 使用 `parallel: false` 串行渲染
3. 检查 FFmpeg 是否正常工作

### Q: 找不到资源文件？
A: 确保 `assets/` 目录存在，并且包含图片或视频文件

### Q: 字体警告？
A: 这是正常的，系统会回退到默认字体

## 更多示例

查看 `examples/` 目录下的其他示例文件：
- `test-builder-simple.js` - 简单示例
- `test-multi-track-scene.js` - 多轨道多场景示例
- `test-visual-effects.js` - 视觉效果示例
- `test-transition-simple.js` - 转场效果示例

