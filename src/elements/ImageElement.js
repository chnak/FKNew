import { BaseElement } from './BaseElement.js';
import { DEFAULT_IMAGE_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import { imageLoader } from '../utils/image-loader.js';
import spritejs from 'spritejs';

const { Sprite } = spritejs;

/**
 * 图片元素
 */
export class ImageElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.IMAGE;
    // 重新合并配置，确保传入的config优先级最高
    this.config = deepMerge({}, DEFAULT_IMAGE_CONFIG, config);
    this.imageData = null;
    this.loaded = false;
  }

  /**
   * 加载图片
   */
  async load() {
    if (this.config.src) {
      try {
        this.imageData = await imageLoader.load(this.config.src);
        this.loaded = true;
      } catch (error) {
        console.error(`Failed to load image: ${this.config.src}`, error);
        this.loaded = false;
      }
    }
  }

  /**
   * 设置图片源
   */
  async setSrc(src) {
    this.config.src = src;
    await this.load();
  }

  /**
   * 设置图片适配方式
   */
  setFit(fit) {
    this.config.fit = fit; // cover, contain, fill, none
  }

  /**
   * 渲染图片元素
   */
  render(scene, time) {
    if (!this.visible || !this.loaded || !this.imageData) return null;

    const state = this.getStateAtTime(time);

    const sprite = new Sprite({
      id: this.id,
      texture: this.imageData,
      pos: [state.x, state.y],
      size: [state.width, state.height],
      opacity: state.opacity,
      anchor: state.anchor,
      rotate: state.rotation,
      scale: [state.scaleX, state.scaleY],
      bgcolor: 'transparent',
    });

    // 处理图片适配方式
    if (state.fit === 'cover' || state.fit === 'contain') {
      // SpriteJS 会自动处理，这里可以添加额外逻辑
    }

    scene.appendChild(sprite);
    return sprite;
  }

  /**
   * 直接使用Canvas 2D API渲染图片
   */
  renderToCanvas(ctx, time) {
    // 检查可见性和时间范围（父类方法会检查）
    if (!this.isActiveAtTime(time) || !this.loaded || !this.imageData) return;

    // 获取Canvas尺寸用于单位转换
    const canvas = ctx.canvas;
    const context = { width: canvas.width, height: canvas.height };
    const state = this.getStateAtTime(time, context);

    // 注意：这里需要将Buffer转换为Image对象
    // 由于Node.js环境限制，图片渲染可能需要特殊处理
    // 暂时跳过，或者使用其他图片处理库
    console.warn('ImageElement.renderToCanvas: 图片渲染在Node.js环境下需要额外处理');
  }
}

