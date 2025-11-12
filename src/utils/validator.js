import { z } from 'zod';

/**
 * 验证数值范围
 */
export function validateRange(value, min, max, name = 'value') {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${name} must be a number`);
  }
  if (value < min || value > max) {
    throw new Error(`${name} must be between ${min} and ${max}`);
  }
  return value;
}

/**
 * 验证时间值（秒）
 */
export function validateTime(value, name = 'time') {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
  return value;
}

/**
 * 验证颜色值
 */
export function validateColor(value, name = 'color') {
  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string`);
  }
  // 简单的颜色验证（支持 hex, rgb, rgba, 颜色名）
  const colorRegex = /^(#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|rgb\(|rgba\(|[a-zA-Z]+)$/;
  if (!colorRegex.test(value)) {
    throw new Error(`${name} must be a valid color value`);
  }
  return value;
}

/**
 * 验证坐标点
 */
export function validatePoint(point, name = 'point') {
  if (!Array.isArray(point) || point.length !== 2) {
    throw new Error(`${name} must be an array of [x, y]`);
  }
  if (typeof point[0] !== 'number' || typeof point[1] !== 'number') {
    throw new Error(`${name} coordinates must be numbers`);
  }
  return point;
}

/**
 * 验证尺寸
 */
export function validateSize(size, name = 'size') {
  if (!size || typeof size.width !== 'number' || typeof size.height !== 'number') {
    throw new Error(`${name} must be an object with width and height properties`);
  }
  if (size.width <= 0 || size.height <= 0) {
    throw new Error(`${name} width and height must be positive numbers`);
  }
  return size;
}

/**
 * 验证元素配置
 */
export const ElementConfigSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  opacity: z.number().min(0).max(1).optional(),
  rotation: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  anchor: z.array(z.number()).length(2).optional(),
});

/**
 * 验证动画配置
 */
export const AnimationConfigSchema = z.object({
  duration: z.number().positive(),
  delay: z.number().min(0).optional(),
  easing: z.string().optional(),
  iterations: z.number().int().positive().optional(),
});

