# CompositionElement 说明

## compositionConfig 是什么？

`compositionConfig` 是 `CompositionElement` 构造函数的一个配置参数，用于**创建嵌套合成（Composition）的配置对象**。

### 使用场景

`CompositionElement` 需要包含一个 `Composition` 对象作为嵌套合成。有三种方式提供：

#### 方式1：直接传入已创建的 Composition 对象

```javascript
// 先创建一个 Composition
const nestedComp = new Composition({
  width: 800,
  height: 600,
  fps: 30,
  duration: 5,
  backgroundColor: 'transparent',
});

// 然后传入 CompositionElement
const compElement = new CompositionElement({
  x: 960,
  y: 540,
  width: 800,
  height: 600,
  composition: nestedComp, // 直接传入已创建的对象
});
```

#### 方式2：使用 compositionConfig 自动创建

```javascript
// 使用 compositionConfig，会自动创建一个新的 Composition
const compElement = new CompositionElement({
  x: 960,
  y: 540,
  width: 800,
  height: 600,
  compositionConfig: {  // 这个配置会用来创建新的 Composition
    width: 800,
    height: 600,
    fps: 30,
    duration: 5,
    backgroundColor: 'transparent',
  },
});
```

#### 方式3：不提供任何配置，使用默认值

```javascript
// 如果不提供 composition 和 compositionConfig，会使用默认配置创建
const compElement = new CompositionElement({
  x: 960,
  y: 540,
  width: 800,
  height: 600,
  // 会自动创建一个默认的 Composition
});
```

### compositionConfig 的配置项

`compositionConfig` 支持所有 `Composition` 构造函数的配置项：

- `width` (number): 合成宽度，默认 1920
- `height` (number): 合成高度，默认 1080
- `fps` (number): 帧率，默认 30
- `duration` (number): 持续时间（秒），默认 5
- `backgroundColor` (string): 背景颜色，默认 'transparent'

### 推荐用法

**推荐使用 `compositionConfig`**，因为它更简洁，不需要先创建 Composition 对象：

```javascript
const compElement = new CompositionElement({
  x: '50%',
  y: '50%',
  width: 800,
  height: 600,
  compositionConfig: {
    width: 800,
    height: 600,
    fps: 30,
    duration: 10,
    backgroundColor: 'transparent',
  },
});

// 然后直接添加元素
compElement
  .addRect({ x: 400, y: 300, width: 800, height: 600, bgcolor: '#2c3e50' })
  .addText({ text: '标题', x: 400, y: 200, fontSize: 48 });
```

### 注意事项

1. `composition` 和 `compositionConfig` 不能同时使用，如果同时提供，`composition` 优先级更高
2. 如果都不提供，会使用默认配置创建一个 Composition
3. 嵌套合成的尺寸（width/height）通常应该与 CompositionElement 的尺寸一致

