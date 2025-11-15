# onFrame 回调函数参数说明

`onFrame` 回调函数会在每帧渲染时被调用，用于实现基于 Paper.js 的动画效果。

## 函数签名

```javascript
onFrame: function(element, event, paperItem) {
  // 动画逻辑
}
```

## 参数详解

### 1. `element` - 元素实例

**类型**: `BaseElement` 或其子类实例

**含义**: 当前元素的实例对象，继承自 `BaseElement`

**可访问的属性和方法**:

#### 属性
- `element.config` - 元素的配置对象
  - `element.config.x` - X 坐标
  - `element.config.y` - Y 坐标
  - `element.config.width` - 宽度
  - `element.config.height` - 高度
  - `element.config.color` / `element.config.bgcolor` - 颜色
  - 等等...
- `element.type` - 元素类型（如 `'circle'`, `'text'`, `'rect'`, `'path'` 等）
- `element.id` - 元素的唯一标识符
- `element.startTime` - 元素的开始时间（秒）
- `element.endTime` - 元素的结束时间（秒）
- `element.duration` - 元素的持续时间（秒）
- `element.visible` - 元素是否可见

#### 方法
- `element.getStateAtTime(time, context)` - 获取元素在指定时间的状态
- `element.isActiveAtTime(time)` - 判断元素在指定时间是否激活
- `element.getProgressAtTime(time)` - 获取元素在指定时间的进度（0-1）

**使用示例**:
```javascript
onFrame: function(element, event, paperItem) {
  // 访问元素配置
  const x = element.config.x;
  const color = element.config.bgcolor;
  
  // 获取元素进度
  const progress = element.getProgressAtTime(event.time);
  
  // 判断元素是否激活
  if (element.isActiveAtTime(event.time)) {
    // 元素处于激活状态
  }
}
```

---

### 2. `event` - 帧事件对象

**类型**: `Object`

**含义**: 包含当前帧的信息，用于实现基于时间或帧数的动画

**属性**:

#### `event.count` - 帧计数
- **类型**: `number`
- **含义**: 从视频开始到当前帧的帧数（从 0 开始）
- **示例**: 
  - 第 1 帧: `count = 0`
  - 第 2 帧: `count = 1`
  - 第 30 帧: `count = 29`
  - 第 60 帧: `count = 59`
- **用途**: 实现基于帧数的动画（如每帧旋转 2 度）

#### `event.time` - 当前时间
- **类型**: `number`
- **单位**: 秒
- **含义**: 从视频开始到当前帧的绝对时间
- **示例**:
  - 30fps 时，第 1 帧: `time = 0.033`
  - 30fps 时，第 2 帧: `time = 0.067`
  - 30fps 时，第 30 帧: `time = 1.0`
  - 30fps 时，第 60 帧: `time = 2.0`
- **用途**: 实现基于时间的动画（如每秒旋转 60 度）

#### `event.delta` - 帧间隔
- **类型**: `number`
- **单位**: 秒
- **含义**: 相邻两帧之间的时间间隔
- **示例**:
  - 30fps 时: `delta ≈ 0.033` 秒
  - 60fps 时: `delta ≈ 0.017` 秒
- **用途**: 实现基于帧间隔的动画（如每帧移动 `delta * speed` 的距离）

**使用示例**:
```javascript
onFrame: function(element, event, paperItem) {
  // 基于帧数的动画
  const rotation1 = event.count * 2; // 每帧旋转 2 度
  
  // 基于时间的动画
  const rotation2 = event.time * 60; // 每秒旋转 60 度
  
  // 基于帧间隔的动画
  const speed = 100; // 每秒移动 100 像素
  const moveX = event.delta * speed; // 每帧移动的距离
}
```

---

### 3. `paperItem` - Paper.js 项目引用

**类型**: `paper.Item` 或其子类（如 `paper.Path.Circle`, `paper.PointText`, `paper.Path.Rectangle` 等）

**含义**: Paper.js 的原生项目对象，可以直接操作 Paper.js 的属性

**可访问的属性**:

#### 位置和变换
- `paperItem.position` - 位置（`paper.Point`）
- `paperItem.rotation` - 旋转角度（度）
- `paperItem.scaling` - 缩放（`paper.Point`，如 `new paper.Point(1.5, 1.5)`）
- `paperItem.opacity` - 透明度（0-1）

#### 样式
- `paperItem.fillColor` - 填充颜色（`paper.Color`）
- `paperItem.strokeColor` - 描边颜色（`paper.Color`）
- `paperItem.strokeWidth` - 描边宽度

#### Paper.js Color 对象的属性
- `paperItem.fillColor.hue` - 色相（0-360）
- `paperItem.fillColor.saturation` - 饱和度（0-1）
- `paperItem.fillColor.brightness` - 亮度（0-1）
- `paperItem.fillColor.alpha` - 透明度（0-1）

**使用示例**:
```javascript
onFrame: function(element, event, paperItem) {
  if (paperItem) {
    // 修改位置
    paperItem.position = new paper.Point(100, 200);
    
    // 修改旋转
    paperItem.rotation = event.time * 60; // 每秒旋转 60 度
    
    // 修改缩放
    const scale = 1 + Math.sin(event.time * Math.PI * 2) * 0.3;
    paperItem.scaling = new paper.Point(scale, scale);
    
    // 修改颜色
    paperItem.fillColor = new paper.Color('#ff0000');
    
    // 修改颜色的色相
    paperItem.fillColor.hue = (event.time * 60) % 360;
    
    // 修改透明度
    paperItem.opacity = 0.5 + Math.sin(event.time * Math.PI) * 0.5;
  }
}
```

---

## 三个参数的配合使用

### 典型使用场景

1. **使用 `element` 获取元素配置和状态**
   ```javascript
   const baseColor = element.config.bgcolor;
   const progress = element.getProgressAtTime(event.time);
   ```

2. **使用 `event` 获取时间和帧信息**
   ```javascript
   const rotation = event.time * 60; // 基于时间
   const frameBasedRotation = event.count * 2; // 基于帧数
   ```

3. **使用 `paperItem` 直接操作 Paper.js 项目**
   ```javascript
   paperItem.rotation = rotation;
   paperItem.fillColor.hue = (event.time * 60) % 360;
   ```

### 完整示例

```javascript
scene.addCircle({
  x: '50%',
  y: '50%',
  radius: 100,
  bgcolor: '#ff6b6b',
  onFrame: function(element, event, paperItem) {
    if (paperItem) {
      // 1. 从 element 获取基础配置
      const baseColor = element.config.bgcolor;
      
      // 2. 从 event 获取时间信息
      const time = event.time;
      const progress = element.getProgressAtTime(time);
      
      // 3. 使用 paperItem 直接操作 Paper.js 项目
      paperItem.rotation = time * 60; // 每秒旋转 60 度
      
      const scale = 1 + Math.sin(time * Math.PI * 2) * 0.3;
      paperItem.scaling = new paper.Point(scale, scale);
      
      // 修改颜色
      paperItem.fillColor = new paper.Color(baseColor);
      paperItem.fillColor.hue = (time * 60) % 360;
    }
  },
});
```

---

## 注意事项

1. **`paperItem` 可能为 `null`**
   - 在元素首次渲染时，`paperItem` 可能还未创建
   - 建议在使用前检查: `if (paperItem) { ... }`

2. **`event.time` 是绝对时间**
   - `event.time` 是相对于视频开始的时间，不是相对于元素开始的时间
   - 如果需要相对于元素的时间，使用: `event.time - element.startTime`

3. **`event.count` 从 0 开始**
   - 第 1 帧的 `count` 是 0，第 2 帧是 1，以此类推

4. **`event.delta` 是固定值**
   - 对于固定的 fps，`delta` 是固定的（如 30fps 时 `delta = 1/30 ≈ 0.033`）

5. **直接操作 `paperItem` 会覆盖配置**
   - 在 `onFrame` 中直接修改 `paperItem` 的属性会覆盖元素的配置
   - 如果需要保留配置，建议在 `onFrame` 中基于配置进行计算

