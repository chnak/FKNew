import { BaseLayer } from './BaseLayer.js';
import { LayerType } from '../types/enums.js';

/**
 * 叠加图层（用于水印、字幕等）
 */
export class OverlayLayer extends BaseLayer {
  constructor(config = {}) {
    super(config);
    this.type = LayerType.OVERLAY;
    this.blendMode = config.blendMode || 'normal'; // normal, multiply, screen, overlay 等
  }

  /**
   * 设置混合模式
   */
  setBlendMode(mode) {
    this.blendMode = mode;
  }

  /**
   * 渲染叠加图层
   */
  render(scene, time) {
    if (!this.isActiveAtTime(time)) return;

    // 渲染所有元素（可以应用混合模式）
    for (const element of this.elements) {
      if (element.visible) {
        // 注意：SpriteJS 的混合模式需要通过样式设置
        // 这里先渲染元素，混合模式可以在元素配置中设置
        element.render(scene, time);
      }
    }
  }
}

