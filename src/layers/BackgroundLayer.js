import { BaseLayer } from './BaseLayer.js';
import { LayerType } from '../types/enums.js';
import { RectElement } from '../elements/RectElement.js';

/**
 * 背景图层
 */
export class BackgroundLayer extends BaseLayer {
  constructor(config = {}) {
    super(config);
    this.type = LayerType.BACKGROUND;
    this.backgroundColor = config.backgroundColor || '#000000';
    this.backgroundElement = null;
  }

  /**
   * 设置背景颜色
   */
  setBackgroundColor(color) {
    this.backgroundColor = color;
    if (this.backgroundElement) {
      this.backgroundElement.setBgColor(color);
    }
  }

  /**
   * 初始化背景元素
   */
  initBackground(width, height) {
    if (!this.backgroundElement) {
      this.backgroundElement = new RectElement({
        x: width / 2,  // 中心位置
        y: height / 2, // 中心位置
        width: width,
        height: height,
        bgcolor: this.backgroundColor,
        anchor: [0.5, 0.5], // 中心锚点，这样矩形会以中心为基准覆盖整个画布
        zIndex: -9999, // 确保在最底层
      });
      this.addElement(this.backgroundElement);
    } else {
      this.backgroundElement.setSize(width, height);
      this.backgroundElement.setBgColor(this.backgroundColor);
      // 更新位置到中心
      this.backgroundElement.setPosition(width / 2, height / 2);
    }
  }

  /**
   * 渲染背景图层
   */
  render(scene, time) {
    if (!this.isActiveAtTime(time)) return;

    // 渲染背景元素
    if (this.backgroundElement) {
      this.backgroundElement.render(scene, time);
    }

    // 渲染其他元素
    for (const element of this.elements) {
      if (element !== this.backgroundElement && element.visible) {
        element.render(scene, time);
      }
    }
  }

  /**
   * 直接使用Canvas 2D API渲染背景图层
   */
  renderToCanvas(ctx, time) {
    if (!this.isActiveAtTime(time)) return;

    // 背景已经在Renderer中绘制了，这里不需要再绘制背景元素
    // 只渲染其他元素
    for (const element of this.elements) {
      if (element !== this.backgroundElement && element.visible && typeof element.renderToCanvas === 'function') {
        element.renderToCanvas(ctx, time);
      }
    }
  }
}

