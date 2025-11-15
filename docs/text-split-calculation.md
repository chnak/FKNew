# 文本拆分计算方法说明

## 概述

文本拆分功能可以将文本按字符（letter）、单词（word）或行（line）进行分割，每个片段可以独立设置动画，实现逐字、逐词或逐行动画效果。

## 配置参数

```javascript
{
  split: 'letter',        // 拆分类型：'letter' | 'word' | 'line' | null
  splitDelay: 0.1,        // 每个片段之间的延迟时间（秒）
  splitDuration: 0.3,     // 每个片段的动画持续时间（秒）
}
```

## 计算流程

### 1. 文本分割（TextSplitter）

使用 `TextSplitter` 类将文本分割成片段：

#### 字符分割（letter）
- 使用 `Array.from(text)` 将文本转换为字符数组
- 每个字符作为一个片段
- 计算每个字符的宽度和位置

#### 单词分割（word）
- 使用正则表达式 `text.split(/(\s+)/)` 分割文本
- 保留空格作为独立的片段
- 计算每个单词的宽度和位置

#### 行分割（line）
- 使用 `text.split('\n')` 按换行符分割
- 每行作为一个片段
- 计算每行的宽度和位置

### 2. 文本尺寸估算

`TextSplitter` 使用估算方式计算文本尺寸（不使用 Canvas API）：

```javascript
// 字符宽度估算规则
- 空格字符：fontSize * 0.25
- 符号字符：fontSize * 0.5
- 中文字符：fontSize * 1.0
- 英文字母和数字：fontSize * 0.6
```

#### 动态间距计算

如果启用了 `dynamicSpacing`（默认启用），会根据字符/单词的宽度动态调整间距：

- **字符间距**：默认 `fontSize * 0.1`
- **单词间距**：默认 `fontSize * 0.3`
- **行高**：默认 `fontSize * 1.2`

动态间距会根据相邻字符/单词的宽度比例进行调整，使排版更自然。

### 3. 位置计算

#### 片段相对位置

每个片段都有一个相对于文本起始位置的偏移量：

```javascript
segment = {
  text: '字符或单词',
  x: 0,              // 相对于文本起始位置的 X 偏移（像素）
  y: 0,              // 相对于文本起始位置的 Y 偏移（像素）
  width: 20,         // 片段宽度（像素）
  height: 24,        // 片段高度（像素）
  index: 0           // 片段索引
}
```

#### 最终位置计算

在渲染时，会根据父元素的位置、对齐方式和 anchor 计算每个片段的最终位置：

```javascript
// 1. 转换父元素位置单位（支持百分比和像素）
parentXPixels = toPixels(parentX, context, 'x')
parentYPixels = toPixels(parentY, context, 'y')

// 2. 根据 anchor 和 textAlign 计算文本基准位置
baseX = parentXPixels - (totalWidth * anchor[0])
baseY = parentYPixels - (totalHeight * anchor[1])

// 3. 根据 textAlign 调整水平位置
if (textAlign === 'center') {
  baseX = baseX - totalWidth / 2
} else if (textAlign === 'right') {
  baseX = baseX - totalWidth
}

// 4. 计算片段最终位置
finalX = baseX + segmentOffsetX + animOffsetX
finalY = baseY + segmentOffsetY + animOffsetY
```

### 4. 时间计算

#### 片段开始时间

每个片段的开始时间按以下公式计算：

```javascript
segmentStartTime = parentStartTime + index * splitDelay
```

**示例**：
- 父元素开始时间：`0` 秒
- `splitDelay`：`0.1` 秒
- 片段 0：`0 + 0 * 0.1 = 0` 秒
- 片段 1：`0 + 1 * 0.1 = 0.1` 秒
- 片段 2：`0 + 2 * 0.1 = 0.2` 秒
- ...

#### 片段结束时间

所有片段都持续到父元素结束：

```javascript
segmentEndTime = parentEndTime
```

**示例**：
- 父元素结束时间：`5` 秒
- 所有片段的结束时间都是 `5` 秒

#### 片段持续时间

```javascript
segmentDuration = segmentEndTime - segmentStartTime
```

**示例**：
- 片段 0：`5 - 0 = 5` 秒
- 片段 1：`5 - 0.1 = 4.9` 秒
- 片段 2：`5 - 0.2 = 4.8` 秒
- ...

### 5. 动画应用

#### 默认动画

如果用户没有指定任何动画，每个片段会自动添加一个淡入动画：

```javascript
{
  type: 'fade',
  fromOpacity: 0,
  toOpacity: 1,
  duration: splitDuration,  // 默认 0.3 秒
  startTime: 0,
  easing: 'easeOut'
}
```

#### 自定义动画

如果用户指定了动画，每个片段都会应用相同的动画配置，但动画的开始时间会根据片段的 `startTime` 自动调整。

**重要**：动画的 `delay` 不需要手动调整，系统会根据片段的 `startTime` 自动计算动画的生效时间。

## 完整示例

```javascript
const textElement = new TextElement({
  text: 'Hello World',
  x: '50%',
  y: '50%',
  fontSize: 72,
  color: '#ffffff',
  textAlign: 'center',
  anchor: [0.5, 0.5],
  duration: 5,
  startTime: 0,
  split: 'letter',        // 按字符拆分
  splitDelay: 0.1,        // 每个字符延迟 0.1 秒
  splitDuration: 0.3,     // 每个字符动画持续 0.3 秒
  animations: ['fadeIn'], // 淡入动画
});
```

### 计算过程

1. **文本分割**：
   - 片段 0: 'H' (x: 0, width: 43.2)
   - 片段 1: 'e' (x: 50.4, width: 43.2)
   - 片段 2: 'l' (x: 100.8, width: 43.2)
   - ...（共 11 个字符，包括空格）

2. **时间计算**：
   - 片段 0: startTime = 0, endTime = 5, duration = 5
   - 片段 1: startTime = 0.1, endTime = 5, duration = 4.9
   - 片段 2: startTime = 0.2, endTime = 5, duration = 4.8
   - ...

3. **位置计算**：
   - 父元素位置：(960, 540) - 屏幕中心
   - 文本总宽度：约 475 像素
   - 片段 0 最终位置：(960 - 237.5 + 0, 540 - 36) = (722.5, 504)
   - 片段 1 最终位置：(960 - 237.5 + 50.4, 540 - 36) = (772.9, 504)
   - ...

4. **动画应用**：
   - 每个片段在 `startTime` 时开始淡入动画
   - 动画持续 `splitDuration`（0.3 秒）
   - 之后保持完全可见直到父元素结束

## 注意事项

1. **时间单位**：所有时间都以秒为单位
2. **位置单位**：支持像素值和百分比（如 '50%'）
3. **对齐方式**：`textAlign` 和 `anchor` 会影响所有片段的位置
4. **动画延迟**：不需要手动调整动画的 `delay`，系统会自动处理
5. **片段持续时间**：所有片段都持续到父元素结束，而不是只显示 `splitDuration`

## 性能优化

- 文本尺寸使用估算方式，不依赖 Canvas API，性能更好
- 动态间距计算在初始化时完成，不会影响渲染性能
- 片段位置在渲染时动态计算，支持响应式布局

