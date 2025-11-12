import { Animation } from './Animation.js';
import { AnimationType } from '../types/enums.js';
import { lerp } from '../utils/helpers.js';

/**
 * 变换动画（位置、旋转、缩放）
 */
export class TransformAnimation extends Animation {
  constructor(config = {}) {
    super(config);
    this.type = AnimationType.TRANSFORM;
    this.from = config.from || {}; // { x, y, rotation, scaleX, scaleY }
    this.to = config.to || {};
  }

  /**
   * 设置起始状态
   */
  setFrom(from) {
    this.from = { ...this.from, ...from };
  }

  /**
   * 设置结束状态
   */
  setTo(to) {
    this.to = { ...this.to, ...to };
  }

  /**
   * 获取变换状态
   */
  getStateAtTime(time) {
    const progress = this.getEasedProgress(time);
    const state = {};

    if (this.from.x !== undefined && this.to.x !== undefined) {
      state.x = lerp(this.from.x, this.to.x, progress);
    }
    if (this.from.y !== undefined && this.to.y !== undefined) {
      state.y = lerp(this.from.y, this.to.y, progress);
    }
    if (this.from.rotation !== undefined && this.to.rotation !== undefined) {
      state.rotation = lerp(this.from.rotation, this.to.rotation, progress);
    }
    if (this.from.scaleX !== undefined && this.to.scaleX !== undefined) {
      state.scaleX = lerp(this.from.scaleX, this.to.scaleX, progress);
    }
    if (this.from.scaleY !== undefined && this.to.scaleY !== undefined) {
      state.scaleY = lerp(this.from.scaleY, this.to.scaleY, progress);
    }

    return state;
  }
}

