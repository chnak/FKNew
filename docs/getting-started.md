# 快速开始指南

本指南将帮助你快速上手使用视频制作库。

## 安装

首先确保你已经安装了 Node.js (>= 16.0.0) 和 FFmpeg。

```bash
# 克隆或下载项目
cd FKNew

# 安装依赖
npm install
```

## 第一个视频

创建一个简单的视频：

```javascript
import { Composition, TextElement, FadeAnimation } from './src/index.js';

async function createVideo() {
  // 1. 创建合成
  const composition = new Composition({
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 5,
    backgroundColor: '#1a1a1a',
  });

  // 2. 创建图层
  const layer = composition.createElementLayer();

  // 3. 创建文本元素
  const text = new TextElement({
    text: 'Hello, Video!',
    x: 960,
    y: 540,
    fontSize: 72,
    color: '#ffffff',
    textAlign: 'center',
  });

  // 4. 添加动画
  const fadeIn = new FadeAnimation({
    duration: 1,
    fromOpacity: 0,
    toOpacity: 1,
  });
  text.addAnimation(fadeIn);

  // 5. 将元素添加到图层
  layer.addElement(text);

  // 6. 导出视频
  await composition.export('./output/my-video.mp4');
  console.log('视频创建完成！');
}

createVideo();
```

运行：

```bash
node your-script.js
```

## 下一步

- 查看 [API 参考文档](./api-reference.md)
- 浏览 [示例代码](../examples/)
- 了解 [动画系统](./animations.md)

