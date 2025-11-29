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
    const maxKFTime = this.keyframes.reduce((m, kf) => {
      const t = (kf && typeof kf.time === 'number') ? kf.time : 0;
      return Math.max(m, t);
    }, 0);
    if (maxKFTime > 1.000001 && (this.config.duration === undefined || this.config.duration < maxKFTime)) {
      this.config.duration = maxKFTime;
      this.endTime = this.startTime + this.config.duration;
    }
  }

  /**
   * 设置关键帧
   */
  setKeyframes(keyframes) {
    this.keyframes = keyframes.sort((a, b) => a.time - b.time);
    const maxKFTime = this.keyframes.reduce((m, kf) => {
      const t = (kf && typeof kf.time === 'number') ? kf.time : 0;
      return Math.max(m, t);
    }, 0);
    if (maxKFTime > 1.000001 && (this.config.duration === undefined || this.config.duration < maxKFTime)) {
      this.config.duration = maxKFTime;
      this.endTime = this.startTime + this.config.duration;
    }
  }

  /**
   * 获取指定时间的关键帧状态
   */
  getStateAtTime(time) {
    if (this.keyframes.length === 0) return {};

    const progress = this.getEasedProgress(time);
    const duration = this.config.duration || 1;

    const maxKFTime = this.keyframes.reduce((m, kf) => {
      const t = (kf && typeof kf.time === 'number') ? kf.time : 0;
      return Math.max(m, t);
    }, 0);

    const useSeconds = maxKFTime > 1.000001;
    const normalizedTime = useSeconds ? (time - this.startTime) : (progress * duration);

    let startKeyframe = this.keyframes[0];
    let endKeyframe = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      const currentTime = useSeconds ? this.keyframes[i].time : (this.keyframes[i].time * duration);
      const nextTime = useSeconds ? this.keyframes[i + 1].time : (this.keyframes[i + 1].time * duration);
      if (normalizedTime >= currentTime && normalizedTime <= nextTime) {
        startKeyframe = this.keyframes[i];
        endKeyframe = this.keyframes[i + 1];
        break;
      }
    }

    const startTime = useSeconds ? startKeyframe.time : (startKeyframe.time * duration);
    const endTime = useSeconds ? endKeyframe.time : (endKeyframe.time * duration);
    const segmentDuration = endTime - startTime;
    const segmentProgress = segmentDuration > 0 ? (normalizedTime - startTime) / segmentDuration : 0;

    const state = {};
    const startProps = startKeyframe.props || startKeyframe;
    const endProps = endKeyframe.props || endKeyframe;
    const allProps = new Set([
      ...Object.keys(startProps).filter(k => k !== 'time'),
      ...Object.keys(endProps).filter(k => k !== 'time'),
    ]);

    for (const prop of allProps) {
      const startValue = startProps[prop] ?? 0;
      const endValue = endProps[prop] ?? 0;
      state[prop] = lerp(startValue, endValue, segmentProgress);
    }

    return state;
  }

  /**
   * 获取初始状态（第一个关键帧的值）
   */
  getInitialState() {
    if (this.keyframes.length === 0) return {};
    
    const firstKeyframe = this.keyframes[0];
    const props = firstKeyframe.props || firstKeyframe;
    const state = {};
    
    // 排除 time 属性
    for (const key of Object.keys(props)) {
      if (key !== 'time') {
        state[key] = props[key];
      }
    }
    
    return state;
  }

  /**
   * 获取结束状态（最后一个关键帧的值）
   */
  getFinalState() {
    if (this.keyframes.length === 0) return {};
    
    const lastKeyframe = this.keyframes[this.keyframes.length - 1];
    const props = lastKeyframe.props || lastKeyframe;
    const state = {};
    
    // 排除 time 属性
    for (const key of Object.keys(props)) {
      if (key !== 'time') {
        state[key] = props[key];
      }
    }
    
    return state;
  }
}

