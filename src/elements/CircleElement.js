import { BaseElement } from './BaseElement.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import { toPixels } from '../utils/unit-converter.js';
import spritejs from 'spritejs';

const { Circle } = spritejs;

/**
 * 圆形元素
 */
export class CircleElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.CIRCLE;
    // 重新合并配置，确保传入的config优先级最高
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, config);
    this.config.bgcolor = this.config.bgcolor || '#ffffff';
    this.config.borderWidth = this.config.borderWidth || 0;
    this.config.borderColor = this.config.borderColor || '#000000';
    // 圆形使用 width 作为半径
    if (!this.config.radius) {
      this.config.radius = Math.min(this.config.width, this.config.height) / 2;
    }
  }

  /**
   * 设置半径
   */
  setRadius(radius) {
    this.config.radius = radius;
    this.config.width = radius * 2;
    this.config.height = radius * 2;
  }

  /**
   * 设置背景颜色
   */
  setBgColor(color) {
    this.config.bgcolor = color;
  }

  /**
   * 设置边框
   */
  setBorder(width, color) {
    this.config.borderWidth = width;
    this.config.borderColor = color;
  }

  /**
   * 渲染圆形元素
   */
  render(scene, time) {
    if (!this.visible) return null;

    const state = this.getStateAtTime(time);

    const circle = new Circle({
      id: this.id,
      pos: [state.x, state.y],
      radius: state.radius || Math.min(state.width, state.height) / 2,
      bgcolor: state.bgcolor,
      border: state.borderWidth > 0 ? {
        width: state.borderWidth,
        color: state.borderColor,
      } : null,
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
    });

    scene.appendChild(circle);
    return circle;
  }

  /**
   * 直接使用Canvas 2D API渲染圆形
   */
  renderToCanvas(ctx, time) {
    // 检查可见性和时间范围（父类方法会检查）
    if (!this.isActiveAtTime(time)) return;

    // 获取Canvas尺寸用于单位转换
    const canvas = ctx.canvas;
    const context = { width: canvas.width, height: canvas.height };
    const state = this.getStateAtTime(time, context);

    // 计算半径（支持单位转换）
    let radius = state.radius;
    if (typeof radius === 'string') {
      radius = toPixels(radius, context);
    } else if (!radius) {
      radius = Math.min(state.width, state.height) / 2;
    }

    ctx.save();
    ctx.globalAlpha = state.opacity;

    // 应用变换
    ctx.translate(state.x, state.y);
    ctx.rotate((state.rotation || 0) * Math.PI / 180);
    ctx.scale(state.scaleX || 1, state.scaleY || 1);

    // 绘制圆形
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = state.bgcolor || '#ffffff';
    ctx.fill();

    // 绘制边框
    if (state.borderWidth > 0) {
      ctx.strokeStyle = state.borderColor || '#000000';
      ctx.lineWidth = state.borderWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}

