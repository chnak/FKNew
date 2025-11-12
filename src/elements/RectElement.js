import { BaseElement } from './BaseElement.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import spritejs from 'spritejs';

const { Rect } = spritejs;

/**
 * 矩形元素
 */
export class RectElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.RECT;
    // 重新合并配置，确保传入的config优先级最高
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, config);
    this.config.bgcolor = this.config.bgcolor || '#ffffff';
    this.config.borderRadius = this.config.borderRadius || 0;
    this.config.borderWidth = this.config.borderWidth || 0;
    this.config.borderColor = this.config.borderColor || '#000000';
  }

  /**
   * 设置背景颜色
   */
  setBgColor(color) {
    this.config.bgcolor = color;
  }

  /**
   * 设置圆角
   */
  setBorderRadius(radius) {
    this.config.borderRadius = radius;
  }

  /**
   * 设置边框
   */
  setBorder(width, color) {
    this.config.borderWidth = width;
    this.config.borderColor = color;
  }

  /**
   * 渲染矩形元素
   */
  render(scene, time) {
    if (!this.visible) return null;

    const state = this.getStateAtTime(time);

    const rect = new Rect({
      id: this.id,
      pos: [state.x, state.y],
      size: [state.width, state.height],
      bgcolor: state.bgcolor,
      borderRadius: state.borderRadius,
      border: state.borderWidth > 0 ? {
        width: state.borderWidth,
        color: state.borderColor,
      } : null,
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
    });

    scene.appendChild(rect);
    return rect;
  }

  /**
   * 直接使用Canvas 2D API渲染矩形
   */
  renderToCanvas(ctx, time) {
    // 检查可见性和时间范围（父类方法会检查）
    if (!this.isActiveAtTime(time)) return;

    // 获取Canvas尺寸用于单位转换
    const canvas = ctx.canvas;
    const context = { width: canvas.width, height: canvas.height };
    const state = this.getStateAtTime(time, context);
    
    ctx.save();
    ctx.globalAlpha = state.opacity;
    
    // 应用变换
    ctx.translate(state.x, state.y);
    ctx.rotate((state.rotation || 0) * Math.PI / 180);
    ctx.scale(state.scaleX || 1, state.scaleY || 1);
    
    // 绘制矩形
    ctx.fillStyle = state.bgcolor || '#ffffff';
    if (state.borderRadius > 0) {
      // 圆角矩形
      const x = -state.width * (state.anchor?.[0] || 0.5);
      const y = -state.height * (state.anchor?.[1] || 0.5);
      const w = state.width;
      const h = state.height;
      const r = state.borderRadius;
      
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    } else {
      const x = -state.width * (state.anchor?.[0] || 0.5);
      const y = -state.height * (state.anchor?.[1] || 0.5);
      ctx.fillRect(x, y, state.width, state.height);
    }
    
    // 绘制边框
    if (state.borderWidth > 0) {
      ctx.strokeStyle = state.borderColor || '#000000';
      ctx.lineWidth = state.borderWidth;
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

