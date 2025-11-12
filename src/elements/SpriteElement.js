import { BaseElement } from './BaseElement.js';
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import spritejs from 'spritejs';

/**
 * SpriteJS 精灵元素（通用元素包装器）
 */
export class SpriteElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.SPRITE;
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, this.config, config);
    this.spriteType = config.spriteType || 'Sprite'; // Sprite, Rect, Circle, Label 等
    this.spriteConfig = config.spriteConfig || {};
  }

  /**
   * 设置 Sprite 类型
   */
  setSpriteType(type) {
    this.spriteType = type;
  }

  /**
   * 设置 Sprite 配置
   */
  setSpriteConfig(config) {
    this.spriteConfig = { ...this.spriteConfig, ...config };
  }

  /**
   * 渲染 Sprite 元素
   */
  render(scene, time) {
    if (!this.visible) return null;

    const state = this.getStateAtTime(time);
    const SpriteClass = spritejs[this.spriteType] || spritejs.Sprite;

    const spriteConfig = {
      id: this.id,
      pos: [state.x, state.y],
      size: [state.width, state.height],
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
      ...this.spriteConfig,
    };

    const sprite = new SpriteClass(spriteConfig);
    scene.appendChild(sprite);
    return sprite;
  }
}

