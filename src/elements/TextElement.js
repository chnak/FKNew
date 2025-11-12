import { BaseElement } from './BaseElement.js';
import { DEFAULT_TEXT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import { toFontSizePixels } from '../utils/unit-converter.js';
import { getDefaultFontFamily, isFontRegistered } from '../utils/font-manager.js';
import spritejs from 'spritejs';

const { Label } = spritejs;

/**
 * 文本元素
 */
export class TextElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.TEXT;
    // 重新合并配置，确保传入的config优先级最高
    this.config = deepMerge({}, DEFAULT_TEXT_CONFIG, config);
  }

  /**
   * 设置文本内容
   */
  setText(text) {
    this.config.text = text;
  }

  /**
   * 设置字体大小
   */
  setFontSize(size) {
    this.config.fontSize = size;
  }

  /**
   * 设置字体
   */
  setFont(fontFamily, fontWeight = 'normal', fontStyle = 'normal') {
    this.config.fontFamily = fontFamily;
    this.config.fontWeight = fontWeight;
    this.config.fontStyle = fontStyle;
  }

  /**
   * 设置颜色
   */
  setColor(color) {
    this.config.color = color;
  }

  /**
   * 设置文本对齐
   */
  setTextAlign(align) {
    this.config.textAlign = align;
  }

  /**
   * 渲染文本元素
   */
  render(scene, time) {
    if (!this.visible) return null;

    const state = this.getStateAtTime(time);

    const label = new Label({
      id: this.id,
      text: state.text,
      pos: [state.x, state.y],
      size: [state.width, state.height],
      font: `${state.fontStyle} ${state.fontWeight} ${state.fontSize}px ${state.fontFamily}`,
      color: state.color,
      textAlign: state.textAlign,
      textBaseline: state.textBaseline,
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
    });

    scene.appendChild(label);
    return label;
  }

  /**
   * 直接使用Canvas 2D API渲染文本
   */
  renderToCanvas(ctx, time) {
    // 检查可见性和时间范围（父类方法会检查）
    if (!this.isActiveAtTime(time)) return;

    // 获取Canvas尺寸用于单位转换
    const canvas = ctx.canvas;
    const context = { width: canvas.width, height: canvas.height, baseFontSize: 16 };
    const state = this.getStateAtTime(time, context);
    
    // 转换字体大小单位（必须在getStateAtTime之后，因为fontSize可能还是字符串）
    let fontSize = state.fontSize;
    if (typeof fontSize === 'string') {
      fontSize = toFontSizePixels(fontSize, context);
    }
    
    // 确保字体大小有效
    if (!fontSize || fontSize <= 0) {
      fontSize = 24; // 默认字体大小
    }
    
    ctx.save();
    ctx.globalAlpha = state.opacity;
    
    // 设置字体（确保fontStyle和fontWeight有默认值）
    const fontStyle = state.fontStyle || 'normal';
    const fontWeight = state.fontWeight || 'normal';
    let fontFamily = state.fontFamily || getDefaultFontFamily();
    
    // 如果指定的字体未注册，使用默认字体
    if (!isFontRegistered(fontFamily)) {
      fontFamily = getDefaultFontFamily();
    }
    
    // 构建字体字符串
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = state.color || '#000000';
    ctx.textAlign = state.textAlign || 'center';
    ctx.textBaseline = state.textBaseline || 'middle';
    
    // 应用变换
    ctx.translate(state.x, state.y);
    ctx.rotate((state.rotation || 0) * Math.PI / 180);
    ctx.scale(state.scaleX || 1, state.scaleY || 1);
    
    // 绘制文本
    if (state.text) {
      ctx.fillText(state.text, 0, 0);
    }
    
    ctx.restore();
  }
}

