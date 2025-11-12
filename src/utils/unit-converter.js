/**
 * 单位转换工具
 * 支持: %, vw, vh, vm, vmin, vmax, px, rpx
 */

/**
 * 解析带单位的数值
 * @param {string|number} value - 带单位的字符串或数值
 * @returns {Object} { value: number, unit: string }
 */
export function parseUnit(value) {
  if (typeof value === 'number') {
    return { value, unit: 'px' };
  }
  
  if (typeof value !== 'string') {
    return { value: 0, unit: 'px' };
  }

  const trimmed = value.trim();
  
  // 匹配数字和单位（按长度从长到短匹配，避免vmin被误识别为vm）
  // 先尝试匹配长单位（vmin, vmax, rpx）
  const longUnitMatch = trimmed.match(/^(-?\d*\.?\d+)(vmin|vmax|rpx)$/);
  if (longUnitMatch) {
    return {
      value: parseFloat(longUnitMatch[1]),
      unit: longUnitMatch[2],
    };
  }
  
  // 再匹配其他单位
  const match = trimmed.match(/^(-?\d*\.?\d+)(%|vw|vh|vm|px)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2],
    };
  }
  
  // 纯数字
  const numMatch = trimmed.match(/^(-?\d*\.?\d+)$/);
  if (numMatch) {
    return {
      value: parseFloat(numMatch[1]),
      unit: 'px',
    };
  }
  
  // 如果都不匹配，尝试解析为数字
  return { value: parseFloat(trimmed) || 0, unit: 'px' };
}

/**
 * 将带单位的值转换为像素值
 * @param {string|number} value - 带单位的字符串或数值
 * @param {Object} context - 上下文对象 { width, height, dimension }
 * @param {string} dimension - 维度类型 'x'|'y'|'width'|'height'，用于确定百分比基准
 * @returns {number} 像素值
 */
export function toPixels(value, context = {}, dimension = 'width') {
  const { value: numValue, unit } = parseUnit(value);
  const { width = 1920, height = 1080 } = context;

  switch (unit) {
    case '%':
      // 百分比：x和width基于宽度，y和height基于高度
      if (dimension === 'y' || dimension === 'height') {
        return (numValue / 100) * height;
      } else {
        return (numValue / 100) * width;
      }
    
    case 'vw':
      // 视口宽度单位 (1vw = 1% of viewport width)
      return (numValue / 100) * width;
    
    case 'vh':
      // 视口高度单位 (1vh = 1% of viewport height)
      return (numValue / 100) * height;
    
    case 'vm':
      // 视口较小尺寸单位 (1vm = 1% of smaller viewport dimension)
      return (numValue / 100) * Math.min(width, height);
    
    case 'vmin':
      // 视口最小尺寸单位 (1vmin = 1% of smaller viewport dimension)
      return (numValue / 100) * Math.min(width, height);
    
    case 'vmax':
      // 视口最大尺寸单位 (1vmax = 1% of larger viewport dimension)
      return (numValue / 100) * Math.max(width, height);
    
    case 'rpx':
      // 响应式像素单位 (类似小程序rpx，750rpx = 100% width)
      return (numValue / 750) * width;
    
    case 'px':
    default:
      return numValue;
  }
}

/**
 * 转换字体大小单位
 * @param {string|number} fontSize - 字体大小
 * @param {Object} context - 上下文对象 { width, height, baseFontSize }
 * @returns {number} 像素值
 */
export function toFontSizePixels(fontSize, context = {}) {
  if (typeof fontSize === 'number') {
    return fontSize;
  }
  
  const { value: numValue, unit } = parseUnit(fontSize);
  const { width = 1920, height = 1080, baseFontSize = 16 } = context;

  switch (unit) {
    case '%':
      // 百分比相对于基准字体大小
      return (numValue / 100) * baseFontSize;
    
    case 'rpx':
      // 响应式像素单位 (750rpx = 100% width)
      return (numValue / 750) * width;
    
    case 'vw':
      // 视口宽度单位
      return (numValue / 100) * width;
    
    case 'vh':
      // 视口高度单位
      return (numValue / 100) * height;
    
    case 'vmin':
      // 视口最小尺寸单位
      return (numValue / 100) * Math.min(width, height);
    
    case 'vmax':
      // 视口最大尺寸单位
      return (numValue / 100) * Math.max(width, height);
    
    case 'px':
    default:
      return numValue;
  }
}

/**
 * 批量转换对象中的单位值
 * @param {Object} obj - 包含需要转换的值对象
 * @param {Array<string>} keys - 需要转换的键名数组
 * @param {Object} context - 上下文对象
 * @param {Function} converter - 转换函数 (默认为 toPixels)
 * @returns {Object} 转换后的对象
 */
export function convertUnits(obj, keys, context, converter = toPixels) {
  const result = { ...obj };
  
  for (const key of keys) {
    if (key in result && result[key] != null) {
      result[key] = converter(result[key], context);
    }
  }
  
  return result;
}

