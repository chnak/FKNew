# onFrame 与 onRender 的区别

## 概述

`onFrame` 和 `onRender` 都是元素配置中的回调函数，但它们的调用时机、参数和用途不同。

## 主要区别

| 特性 | onRender | onFrame |
|------|----------|---------|
| **调用时机** | 在元素渲染时调用 | 在所有元素渲染完成后调用 |
| **调用频率** | 每帧调用一次 | 每帧调用一次 |
| **执行顺序** | 先执行（元素渲染时） | 后执行（所有元素渲染完成后） |
| **参数** | `(element, time)` | `(element, event, paperItem)` |
| **主要用途** | 修改元素配置，影响渲染 | 直接操作 Paper.js 项目，实现动画 |
| **可访问内容** | 元素配置、状态 | 元素配置、状态 + Paper.js 项目 |
| **修改方式** | 通过 `element.config` 修改配置 | 直接操作 `paperItem` 属性 |

## 详细对比

### 1. 调用时机

#### onRender
- **时机**: 在元素的 `render()` 方法执行时调用
- **位置**: 在创建 Paper.js 项目之后，添加到图层之前
- **特点**: 每个元素独立调用，互不影响

#### onFrame
- **时机**: 在所有元素渲染完成后，在 `view.update()` 之前调用
- **位置**: 在所有图层渲染完成后统一调用
- **特点**: 所有元素的 `onFrame` 在同一帧中依次调用

### 2. 执行顺序

```
渲染流程：
1. 元素1.render() → 创建 Paper.js 项目 → onRender(element1, time) → 添加到图层
2. 元素2.render() → 创建 Paper.js 项目 → onRender(element2, time) → 添加到图层
3. 元素3.render() → 创建 Paper.js 项目 → onRender(element3, time) → 添加到图层
...
N. 所有元素渲染完成
N+1. onFrame(element1, event, paperItem1)
N+2. onFrame(element2, event, paperItem2)
N+3. onFrame(element3, event, paperItem3)
N+4. view.update() → 更新视图
```

### 3. 参数对比

#### onRender 参数

```javascript
onRender: function(element, time) {
  // element: 元素实例
  // time: 当前时间（秒，绝对时间）
}
```

#### onFrame 参数

```javascript
onFrame: function(element, event, paperItem) {
  // element: 元素实例
  // event: { count, time, delta } - 帧事件对象
  // paperItem: Paper.js 项目引用
}
```

### 4. 使用场景

#### onRender 适用场景

1. **修改元素配置**
   ```javascript
   onRender: function(element, time) {
     // 根据时间修改元素配置
     if (time > 2) {
       element.config.color = '#ff0000';
     }
   }
   ```

2. **条件渲染**
   ```javascript
   onRender: function(element, time) {
     // 根据条件修改元素可见性
     element.visible = time > 1 && time < 3;
   }
   ```

3. **基于配置的动画**
   ```javascript
   onRender: function(element, time) {
     // 修改配置，影响下一帧的渲染
     element.config.rotation = time * 60;
     element.config.scaleX = 1 + Math.sin(time * Math.PI) * 0.2;
   }
   ```

#### onFrame 适用场景

1. **直接操作 Paper.js 项目**
   ```javascript
   onFrame: function(element, event, paperItem) {
     if (paperItem) {
       // 直接操作 Paper.js 项目
       paperItem.rotation = event.time * 60;
       paperItem.fillColor.hue = (event.time * 60) % 360;
     }
   }
   ```

2. **使用 Paper.js 原生功能**
   ```javascript
   onFrame: function(element, event, paperItem) {
     if (paperItem) {
       // 使用 Paper.js 的 Color 对象属性
       paperItem.fillColor.hue += 1;
       paperItem.fillColor.brightness = 0.5 + Math.sin(event.time) * 0.3;
     }
   }
   ```

3. **基于帧数的动画**
   ```javascript
   onFrame: function(element, event, paperItem) {
     if (paperItem) {
       // 使用 event.count 实现基于帧数的动画
       if (event.count % 10 === 0) {
         paperItem.fillColor = new paper.Color('hsl(' + (event.count * 3) + ', 70%, 60%)');
       }
     }
   }
   ```

### 5. 性能考虑

#### onRender
- **性能**: 修改配置后，元素会在下一帧重新渲染
- **开销**: 需要重新计算元素状态和创建 Paper.js 项目
- **适用**: 配置变化不频繁的场景

#### onFrame
- **性能**: 直接操作已创建的 Paper.js 项目，无需重新渲染
- **开销**: 只修改属性，性能更好
- **适用**: 需要频繁修改属性的动画场景

### 6. 修改方式对比

#### onRender - 通过配置修改

```javascript
onRender: function(element, time) {
  // 修改配置，影响渲染
  element.config.rotation = time * 60;
  element.config.scaleX = 1 + Math.sin(time * Math.PI) * 0.2;
  element.config.color = `hsl(${time * 60 % 360}, 70%, 60%)`;
}
```

**特点**:
- 修改的是配置，会在下一帧生效
- 需要重新计算元素状态
- 可以修改任何配置属性

#### onFrame - 直接操作 Paper.js 项目

```javascript
onFrame: function(element, event, paperItem) {
  if (paperItem) {
    // 直接操作 Paper.js 项目
    paperItem.rotation = event.time * 60;
    paperItem.scaling = new paper.Point(
      1 + Math.sin(event.time * Math.PI) * 0.2,
      1 + Math.sin(event.time * Math.PI) * 0.2
    );
    paperItem.fillColor.hue = (event.time * 60) % 360;
  }
}
```

**特点**:
- 直接修改 Paper.js 项目属性，立即生效
- 无需重新计算，性能更好
- 只能修改 Paper.js 支持的属性

## 使用建议

### 何时使用 onRender

1. ✅ 需要修改元素配置（如颜色、尺寸、位置等）
2. ✅ 需要条件性地显示/隐藏元素
3. ✅ 需要基于配置的动画（通过修改配置实现）
4. ✅ 动画变化不频繁的场景

### 何时使用 onFrame

1. ✅ 需要直接操作 Paper.js 项目
2. ✅ 需要使用 Paper.js 原生功能（如 Color 对象的 hue、brightness 等）
3. ✅ 需要频繁修改属性的动画（性能更好）
4. ✅ 需要基于帧数的动画（使用 `event.count`）
5. ✅ 需要精确控制 Paper.js 项目的属性

### 可以同时使用

`onRender` 和 `onFrame` 可以同时使用，它们会在不同的时机被调用：

```javascript
scene.addCircle({
  x: '50%',
  y: '50%',
  radius: 100,
  onRender: function(element, time) {
    // 在渲染时修改配置
    if (time > 2) {
      element.config.bgcolor = '#00ff00';
    }
  },
  onFrame: function(element, event, paperItem) {
    // 在帧更新时直接操作 Paper.js 项目
    if (paperItem) {
      paperItem.rotation = event.time * 60;
    }
  },
});
```

## 注意事项

1. **onRender 中的修改会在下一帧生效**
   - 修改 `element.config` 后，元素会在下一帧重新渲染
   - 如果需要立即生效，使用 `onFrame`

2. **onFrame 中的修改会覆盖配置**
   - 直接修改 `paperItem` 会覆盖元素的配置
   - 如果需要保留配置，建议在 `onFrame` 中基于配置进行计算

3. **paperItem 可能为 null**
   - 在 `onFrame` 中，`paperItem` 可能为 `null`（首次渲染时）
   - 建议在使用前检查: `if (paperItem) { ... }`

4. **执行顺序**
   - `onRender` 先执行，`onFrame` 后执行
   - 在 `onFrame` 中的修改会覆盖 `onRender` 中的修改（如果修改的是同一属性）

