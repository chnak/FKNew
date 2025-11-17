// 导入完整的缓动函数库
import * as easingsLib from './easings.js';

/**
 * 缓动函数集合（向后兼容的简化版本）
 * 完整的缓动函数在 easings.js 中
 */
export const easingFunctions = {
  linear: easingsLib.linear,
  'ease-in': easingsLib.easeInQuad,
  'ease-out': easingsLib.easeOutQuad,
  'ease-in-out': easingsLib.easeInOutQuad,
  'ease-in-quad': easingsLib.easeInQuad,
  'ease-out-quad': easingsLib.easeOutQuad,
  'ease-in-out-quad': easingsLib.easeInOutQuad,
  'ease-in-cubic': easingsLib.easeInCubic,
  'ease-out-cubic': easingsLib.easeOutCubic,
  'ease-in-out-cubic': easingsLib.easeInOutCubic,
  // 添加更多缓动函数
  'ease-out-back': easingsLib.easeOutBack,
  'ease-in-back': easingsLib.easeInBack,
  'ease-out-bounce': easingsLib.easeOutBounce,
  'ease-in-bounce': easingsLib.easeInBounce,
};

/**
 * 应用缓动函数
 * 支持多种命名格式（驼峰、连字符等）
 */
export function applyEasing(t, easingType = 'linear') {
  if (!easingType) {
    return easingsLib.linear(Math.max(0, Math.min(1, t)));
  }
  
  // 尝试从 easingMap 获取（支持多种格式）
  const easing = easingsLib.getEasingFunction(easingType);
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

/**
 * 为回调函数自动关联上下文（用于平行渲染）
 * 
 * 使用示例：
 * ```javascript
 * const rotationSpeed = 3;
 * const phaseOffset = 0.5;
 * 
 * // 方法1：显式传递上下文对象
 * const onFrame = withContext((element, progress, time) => {
 *   element.rotation += rotationSpeed;
 *   const pulse = 1 + Math.sin(time * 4 + phaseOffset) * 0.2;
 *   element.scaleX = pulse;
 * }, { rotationSpeed, phaseOffset });
 * 
 * // 方法2：使用对象字面量（ES6 简写语法）
 * const onFrame = withContext((element, progress, time) => {
 *   element.rotation += rotationSpeed;
 *   const pulse = 1 + Math.sin(time * 4 + phaseOffset) * 0.2;
 *   element.scaleX = pulse;
 * }, { rotationSpeed, phaseOffset });
 * 
 * element.onFrame = onFrame;
 * ```
 * 
 * @param {Function} callback - 回调函数
 * @param {Object} context - 上下文对象，包含需要在 Worker 中使用的变量
 * @returns {Function} 带上下文的回调函数
 */
export function withContext(callback, context) {
  if (typeof callback !== 'function') {
    throw new TypeError('withContext: 第一个参数必须是函数');
  }
  
  if (!context || typeof context !== 'object') {
    throw new TypeError('withContext: 第二个参数必须是对象');
  }
  
  // 将上下文关联到函数上
  callback.__context = context;
  
  return callback;
}

/**
 * 自动从当前作用域捕获上下文变量（实验性功能）
 * 
 * 使用示例：
 * ```javascript
 * const rotationSpeed = 3;
 * const phaseOffset = 0.5;
 * 
 * // 使用 autoContext，自动从当前作用域捕获变量
 * const onFrame = autoContext((element, progress, time) => {
 *   element.rotation += rotationSpeed;
 *   const pulse = 1 + Math.sin(time * 4 + phaseOffset) * 0.2;
 *   element.scaleX = pulse;
 * }, () => ({ rotationSpeed, phaseOffset }));
 * 
 * element.onFrame = onFrame;
 * ```
 * 
 * 注意：由于 JavaScript 限制，需要提供一个函数来返回上下文对象
 * 推荐使用 withContext 并直接传递对象字面量
 * 
 * @param {Function} callback - 回调函数
 * @param {Function} contextGetter - 返回上下文对象的函数
 * @returns {Function} 带上下文的回调函数
 */
export function autoContext(callback, contextGetter) {
  if (typeof callback !== 'function') {
    throw new TypeError('autoContext: 第一个参数必须是函数');
  }
  
  if (typeof contextGetter !== 'function') {
    throw new TypeError('autoContext: 第二个参数必须是函数，用于获取上下文对象');
  }
  
  // 立即获取上下文（在定义时）
  const context = contextGetter();
  
  // 将上下文关联到函数上
  callback.__context = context;
  
  return callback;
}

/**
 * 智能上下文捕获 - 自动从函数代码中提取变量名（实验性）
 * 
 * 使用示例：
 * ```javascript
 * const rotationSpeed = 3;
 * const phaseOffset = 0.5;
 * 
 * // 自动提取函数中使用的变量
 * const onFrame = smartContext((element, progress, time) => {
 *   element.rotation += rotationSpeed;
 *   const pulse = 1 + Math.sin(time * 4 + phaseOffset) * 0.2;
 *   element.scaleX = pulse;
 * }, { rotationSpeed, phaseOffset }); // 提供作用域对象
 * 
 * element.onFrame = onFrame;
 * ```
 * 
 * 注意：由于 JavaScript 限制，仍需要提供作用域对象
 * 推荐使用 withContext 并直接传递对象字面量
 * 
 * @param {Function} callback - 回调函数
 * @param {Object} scope - 作用域对象，包含可能使用的变量
 * @returns {Function} 带上下文的回调函数
 */
export function smartContext(callback, scope) {
  if (typeof callback !== 'function') {
    throw new TypeError('smartContext: 第一个参数必须是函数');
  }
  
  if (!scope || typeof scope !== 'object') {
    throw new TypeError('smartContext: 第二个参数必须是对象');
  }
  
  // 解析函数代码，提取变量名
  const funcCode = callback.toString();
  
  // 简单的变量名提取（匹配标识符）
  // 排除函数参数、关键字、内置对象等
  const excluded = new Set([
    'element', 'progress', 'time', 'item', 'event', 'paperItem', 'paperInstance',
    'if', 'else', 'for', 'while', 'return', 'const', 'let', 'var', 'function',
    'Math', 'Date', 'Array', 'Object', 'String', 'Number', 'Boolean',
    'console', 'window', 'document', 'this', 'undefined', 'null', 'true', 'false'
  ]);
  
  // 提取函数体中的变量名
  const funcBodyMatch = funcCode.match(/\{([\s\S]*)\}/);
  if (funcBodyMatch) {
    const funcBody = funcBodyMatch[1];
    // 匹配标识符（变量名）
    const identifierRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    const usedVars = new Set();
    let match;
    
    while ((match = identifierRegex.exec(funcBody)) !== null) {
      const varName = match[1];
      if (!excluded.has(varName) && scope.hasOwnProperty(varName)) {
        usedVars.add(varName);
      }
    }
    
    // 只包含实际使用的变量
    const context = {};
    for (const varName of usedVars) {
      context[varName] = scope[varName];
    }
    
    callback.__context = context;
  } else {
    // 如果无法解析，使用整个作用域
    callback.__context = scope;
  }
  
  return callback;
}

/**
 * 自动捕获上下文变量（从当前作用域）
 * 
 * 使用示例：
 * ```javascript
 * const rotationSpeed = 3;
 * const phaseOffset = 0.5;
 * 
 * const onFrame = captureContext((element, progress, time) => {
 *   element.rotation += rotationSpeed;
 *   const pulse = 1 + Math.sin(time * 4 + phaseOffset) * 0.2;
 *   element.scaleX = pulse;
 * }, ['rotationSpeed', 'phaseOffset']);
 * 
 * element.onFrame = onFrame;
 * ```
 * 
 * 注意：此方法需要显式列出变量名，因为 JavaScript 无法自动检测闭包变量
 * 
 * @param {Function} callback - 回调函数
 * @param {Array<string>} variableNames - 需要捕获的变量名数组
 * @returns {Function} 带上下文的回调函数
 */
export function captureContext(callback, variableNames) {
  if (typeof callback !== 'function') {
    throw new TypeError('captureContext: 第一个参数必须是函数');
  }
  
  if (!Array.isArray(variableNames)) {
    throw new TypeError('captureContext: 第二个参数必须是字符串数组');
  }
  
  // 从当前作用域捕获变量
  // 注意：这需要在调用 captureContext 的作用域中，变量是可访问的
  const context = {};
  
  // 尝试从调用栈中获取变量（这需要一些技巧）
  // 由于 JavaScript 的限制，我们无法直接访问闭包变量
  // 所以这个方法实际上需要用户手动传递变量值
  
  // 更实用的方法：使用 withContext
  // 这里提供一个简化的实现，要求用户使用对象字面量
  throw new Error('captureContext: 由于 JavaScript 限制，无法自动捕获闭包变量。请使用 withContext 并显式传递上下文对象。');
}

