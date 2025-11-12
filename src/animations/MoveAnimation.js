import { Animation } from './Animation.js';
import { AnimationType } from '../types/enums.js';
import { lerp } from '../utils/helpers.js';

/**
 * 移动动画
 */
export class MoveAnimation extends Animation {
  constructor(config = {}) {
    super(config);
    this.type = AnimationType.MOVE;
    this.fromX = config.fromX !== undefined ? config.fromX : 0;
    this.fromY = config.fromY !== undefined ? config.fromY : 0;
    this.toX = config.toX !== undefined ? config.toX : 0;
    this.toY = config.toY !== undefined ? config.toY : 0;
  }

  /**
   * 设置起始位置
   */
  setFrom(x, y) {
    this.fromX = x;
    this.fromY = y;
  }

  /**
   * 设置结束位置
   */
  setTo(x, y) {
    this.toX = x;
    this.toY = y;
  }

  /**
   * 设置移动路径（直线）
   */
  setPath(fromX, fromY, toX, toY) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
  }

  /**
   * 获取位置状态
   */
  getStateAtTime(time) {
    const progress = this.getEasedProgress(time);
    return {
      x: lerp(this.fromX, this.toX, progress),
      y: lerp(this.fromY, this.toY, progress),
    };
  }
}

