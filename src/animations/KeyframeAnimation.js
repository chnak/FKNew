import { Animation } from './Animation.js';
import { AnimationType } from '../types/enums.js';
import { lerp } from '../utils/helpers.js';

/**
 * 关键帧动画
 */
export class KeyframeAnimation extends Animation {
  constructor(config = {}) {
    super(config);
    this.type = AnimationType.KEYFRAME;
    this.keyframes = config.keyframes || []; // [{ time: 0, props: {...} }, ...]
    this.properties = config.properties || []; // 要动画的属性列表
  }

  /**
   * 添加关键帧
   */
  addKeyframe(time, props) {
    this.keyframes.push({ time, props });
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * 设置关键帧
   */
  setKeyframes(keyframes) {
    this.keyframes = keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * 获取指定时间的关键帧状态
   */
  getStateAtTime(time) {
    if (this.keyframes.length === 0) return {};

    const progress = this.getEasedProgress(time);
    const normalizedTime = progress * this.config.duration;

    // 找到当前时间所在的关键帧区间
    let startKeyframe = this.keyframes[0];
    let endKeyframe = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (normalizedTime >= this.keyframes[i].time && normalizedTime <= this.keyframes[i + 1].time) {
        startKeyframe = this.keyframes[i];
        endKeyframe = this.keyframes[i + 1];
        break;
      }
    }

    // 计算区间内的插值进度
    const segmentDuration = endKeyframe.time - startKeyframe.time;
    const segmentProgress = segmentDuration > 0 
      ? (normalizedTime - startKeyframe.time) / segmentDuration 
      : 0;

    // 插值所有属性
    const state = {};
    const allProps = new Set([
      ...Object.keys(startKeyframe.props || {}),
      ...Object.keys(endKeyframe.props || {}),
    ]);

    for (const prop of allProps) {
      const startValue = startKeyframe.props[prop] ?? 0;
      const endValue = endKeyframe.props[prop] ?? 0;
      state[prop] = lerp(startValue, endValue, segmentProgress);
    }

    return state;
  }
}

