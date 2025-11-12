/**
 * 缓动函数集合
 */
export const easingFunctions = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => t * (2 - t),
  'ease-in-out': (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  'ease-in-quad': (t) => t * t,
  'ease-out-quad': (t) => t * (2 - t),
  'ease-in-out-quad': (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  'ease-in-cubic': (t) => t * t * t,
  'ease-out-cubic': (t) => (--t) * t * t + 1,
  'ease-in-out-cubic': (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
};

/**
 * 应用缓动函数
 */
export function applyEasing(t, easingType = 'linear') {
  const easing = easingFunctions[easingType] || easingFunctions.linear;
  return easing(Math.max(0, Math.min(1, t)));
}

/**
 * 线性插值
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * 角度转弧度
 */
export function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * 弧度转角度
 */
export function radToDeg(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * 限制数值在范围内
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 生成唯一ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * 深度合并对象（支持多个源对象）
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    const output = { ...target };
    Object.keys(source).forEach((key) => {
      if (isObject(source[key]) && !Array.isArray(source[key])) {
        if (!(key in target)) {
          output[key] = { ...source[key] };
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
    // 递归合并剩余源对象
    return sources.length ? deepMerge(output, ...sources) : output;
  }
  return source || target;
}

/**
 * 判断是否为对象
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 格式化时间（秒转时分秒）
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 帧数转时间（秒）
 */
export function framesToTime(frames, fps) {
  return frames / fps;
}

/**
 * 时间转帧数
 */
export function timeToFrames(time, fps) {
  return Math.floor(time * fps);
}

