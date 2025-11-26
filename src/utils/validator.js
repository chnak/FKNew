import { z } from 'zod';
import { PRESET_ANIMATIONS } from '../animations/preset-animations.js';
import { easingMap } from './easings.js';
import { AllTransitions } from './transition-renderer.js';

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
const Unit = z.union([z.number(), z.string()]).describe('数值或单位字符串，支持 px、rpx、vw、vh、%');
const Color = z.string().describe('CSS 颜色值，如 #fff、rgba(...) 或颜色名');

export const ElementConfigSchema = z.object({
  x: Unit.optional().describe('位置 X'),
  y: Unit.optional().describe('位置 Y'),
  width: Unit.optional().describe('元素宽度'),
  height: Unit.optional().describe('元素高度'),
  opacity: z.number().min(0).max(1).optional().describe('透明度 0–1'),
  rotation: Unit.optional().describe('旋转角度或单位'),
  scaleX: Unit.optional().describe('水平缩放'),
  scaleY: Unit.optional().describe('垂直缩放'),
  anchor: z.array(z.number()).length(2).optional().describe('锚点 [0–1, 0–1]'),
}).describe('通用元素配置');

/**
 * 验证动画配置
 */
const EasingNameSchema = z.enum(Object.keys(easingMap)).describe('缓动函数名称，来自 easings.js');
const PresetNameSchema = z.enum(Object.keys(PRESET_ANIMATIONS)).describe('预设动画名称，来自 preset-animations.js');

const AnimationOverridePresetSchema = z.object({
  type: PresetNameSchema.describe('预设动画类型'),
  duration: z.number().positive().optional().describe('持续时间（秒）'),
  delay: z.number().min(0).optional().describe('延迟（秒）'),
  easing: z.union([EasingNameSchema, z.string()]).optional().describe('缓动函数'),
  startTime: z.number().min(0).optional().describe('动画开始时间（相对元素）'),
}).describe('以预设为类型的动画，允许覆盖时长/延迟/easing');

const TransformStateSchema = z.object({
  x: Unit.optional().describe('位置 X'),
  y: Unit.optional().describe('位置 Y'),
  opacity: z.number().min(0).max(1).optional().describe('透明度 0–1'),
  rotation: Unit.optional().describe('旋转角度或单位'),
  scaleX: Unit.optional().describe('水平缩放'),
  scaleY: Unit.optional().describe('垂直缩放'),
}).describe('变换状态');

const AnimationTransformSchema = z.object({
  type: z.literal('transform').describe('动画类型：transform'),
  from: TransformStateSchema.optional().describe('起始状态'),
  to: TransformStateSchema.optional().describe('结束状态'),
  duration: z.number().positive().describe('持续时间（秒）'),
  delay: z.number().min(0).optional().describe('延迟（秒）'),
  easing: z.union([EasingNameSchema, z.string()]).optional().describe('缓动函数'),
  startTime: z.number().min(0).optional().describe('动画开始时间（相对元素）'),
}).describe('基础变换动画');

const KeyframePointSchema = z.object({
  time: z.number().min(0).describe('关键帧时间（0–1 或秒）'),
  x: Unit.optional().describe('位置 X'),
  y: Unit.optional().describe('位置 Y'),
  opacity: z.number().min(0).max(1).optional().describe('透明度 0–1'),
  rotation: Unit.optional().describe('旋转角度或单位'),
  scaleX: Unit.optional().describe('水平缩放'),
  scaleY: Unit.optional().describe('垂直缩放'),
  translateX: Unit.optional().describe('水平位移'),
  translateY: Unit.optional().describe('垂直位移'),
}).describe('关键帧点');

const AnimationKeyframeSchema = z.object({
  type: z.literal('keyframe').describe('动画类型：keyframe'),
  keyframes: z.array(KeyframePointSchema).min(1).describe('关键帧数组'),
  duration: z.number().positive().describe('持续时间（秒）'),
  delay: z.number().min(0).optional().describe('延迟（秒）'),
  easing: z.union([EasingNameSchema, z.string()]).optional().describe('缓动函数'),
  startTime: z.number().min(0).optional().describe('动画开始时间（相对元素）'),
}).describe('关键帧动画');

 

export const AnimationConfigSchema = z.union([
  AnimationOverridePresetSchema,
  AnimationTransformSchema,
  AnimationKeyframeSchema,
]).describe('动画配置联合：preset/transform/keyframe');

export const AnimationInputSchema = z.union([
  PresetNameSchema,
  AnimationConfigSchema,
]).describe('动画输入：预设名或动画对象');

const BaseTimingSchema = z.object({
  startTime: z.number().min(0).optional(),
  endTime: z.number().optional(),
  duration: z.number().positive().optional(),
  zIndex: z.number().optional(),
  visible: z.boolean().optional(),
  animations: z.array(AnimationInputSchema).optional(),
}).describe('通用时间与显示控制');

const ElementBaseSchema = ElementConfigSchema.merge(BaseTimingSchema).extend({
  type: z.string().describe('元素类型'),
}).describe('元素基础配置');

export const TextElementSchema = ElementBaseSchema.extend({
  type: z.literal('text'),
  text: z.string().describe('文本内容'),
  fontSize: Unit.optional().describe('字号'),
  fontFamily: z.string().optional().describe('字体'),
  fontWeight: z.union([z.string(), z.number()]).optional(),
  fontStyle: z.string().optional(),
  color: Color.optional().describe('文字颜色'),
  textAlign: z.enum(['left', 'center', 'right']).optional().describe('水平对齐'),
  textBaseline: z.enum(['top', 'middle', 'bottom', 'alphabetic']).optional().describe('垂直对齐'),
  lineHeight: z.union([z.number(), z.string()]).optional(),
  stroke: z.boolean().optional(),
  strokeColor: Color.optional(),
  strokeWidth: Unit.optional(),
  split: z.union([z.literal('letter'), z.literal('word'), z.literal('line')]).nullable().optional().describe('文本拆分粒度'),
  splitDelay: z.number().optional().describe('拆分延迟'),
  splitDuration: z.number().optional().describe('拆分片段持续时间'),
}).describe('文本元素');

export const ImageElementSchema = ElementBaseSchema.extend({
  type: z.literal('image'),
  src: z.string().describe('图片路径'),
  fit: z.enum(['contain', 'cover', 'fill', 'scale-down', 'none']).optional().describe('缩放模式'),
  preserveAspectRatio: z.boolean().optional().describe('保持纵横比'),
  blendMode: z.string().optional().describe('混合模式'),
  borderRadius: Unit.optional(),
  borderWidth: Unit.optional(),
  borderColor: Color.optional(),
  shadowBlur: z.number().min(0).optional().describe('阴影模糊半径'),
  shadowColor: Color.optional().describe('阴影颜色'),
  shadowOffsetX: z.number().optional().describe('阴影 X 偏移'),
  shadowOffsetY: z.number().optional().describe('阴影 Y 偏移'),
  filter: z.union([z.string(), z.null()]).optional().describe('滤镜'),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  brightness: z.number().min(0).max(2).optional().describe('亮度 0–2'),
  contrast: z.number().min(0).max(2).optional().describe('对比度 0–2'),
  saturation: z.number().min(0).max(2).optional().describe('饱和度 0–2'),
  hue: z.number().min(0).max(360).optional().describe('色相 0–360'),
  grayscale: z.number().min(0).max(1).optional().describe('灰度 0–1'),
  glassEffect: z.boolean().optional().describe('毛玻璃效果'),
  glassBlur: z.number().min(0).optional().describe('毛玻璃模糊半径'),
  glassOpacity: z.number().min(0).max(1).optional().describe('毛玻璃透明度 0–1'),
  glassTint: Color.optional().describe('毛玻璃色调'),
  glassBorder: z.boolean().optional().describe('毛玻璃边框'),
  glassBorderColor: Color.optional().describe('毛玻璃边框颜色'),
  glassBorderWidth: z.number().min(0).optional().describe('毛玻璃边框宽度'),
}).describe('图片元素');

export const VideoElementSchema = ElementBaseSchema.extend({
  type: z.literal('video'),
  src: z.string().optional().describe('视频源 URL'),
  videoPath: z.string().optional().describe('视频文件路径'),
  fit: z.enum(['contain', 'cover', 'fill', 'scale-down', 'none']).optional().describe('缩放模式'),
  blendMode: z.string().optional().describe('混合模式'),
  borderRadius: Unit.optional(),
  borderWidth: Unit.optional(),
  borderColor: Color.optional(),
  shadowBlur: z.number().min(0).optional().describe('阴影模糊半径'),
  shadowColor: Color.optional().describe('阴影颜色'),
  shadowOffsetX: z.number().optional().describe('阴影 X 偏移'),
  shadowOffsetY: z.number().optional().describe('阴影 Y 偏移'),
  filter: z.union([z.string(), z.null()]).optional().describe('滤镜'),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  brightness: z.number().min(0).max(2).optional().describe('亮度 0–2'),
  contrast: z.number().min(0).max(2).optional().describe('对比度 0–2'),
  saturation: z.number().min(0).max(2).optional().describe('饱和度 0–2'),
  hue: z.number().min(0).max(360).optional().describe('色相 0–360'),
  grayscale: z.number().min(0).max(1).optional().describe('灰度 0–1'),
  glassEffect: z.boolean().optional().describe('毛玻璃效果'),
  glassBlur: z.number().min(0).optional().describe('毛玻璃模糊半径'),
  glassOpacity: z.number().min(0).max(1).optional().describe('毛玻璃透明度 0–1'),
  glassTint: Color.optional().describe('毛玻璃色调'),
  glassBorder: z.boolean().optional().describe('毛玻璃边框'),
  glassBorderColor: Color.optional().describe('毛玻璃边框颜色'),
  glassBorderWidth: z.number().min(0).optional().describe('毛玻璃边框宽度'),
  cutFrom: z.number().min(0).optional().describe('裁剪起始时间（秒）'),
  cutTo: z.number().optional().describe('裁剪结束时间（秒）'),
  speed: z.number().positive().optional().describe('播放速度倍数'),
  loop: z.boolean().optional().describe('循环播放'),
  mute: z.boolean().optional().describe('静音'),
  volume: z.number().min(0).max(1).optional().describe('音量 0–1'),
}).describe('视频元素');

export const RectElementSchema = ElementBaseSchema.extend({
  type: z.literal('rect'),
  bgcolor: Color.optional(),
  borderRadius: Unit.optional(),
  borderWidth: Unit.optional(),
  borderColor: Color.optional(),
}).describe('矩形元素');

export const CircleElementSchema = ElementBaseSchema.extend({
  type: z.literal('circle'),
  radius: Unit.optional(),
  bgcolor: Color.optional(),
  borderWidth: Unit.optional(),
  borderColor: Color.optional(),
}).describe('圆形元素');

export const PathElementSchema = ElementBaseSchema.extend({
  type: z.literal('path'),
  points: z.array(z.array(Unit)).optional(),
  closed: z.boolean().optional(),
  fillColor: Color.optional(),
  strokeColor: Color.optional(),
  strokeWidth: Unit.optional(),
  dashArray: z.array(Unit).optional(),
  dashOffset: Unit.optional(),
}).describe('路径元素');

export const SVGElementSchema = ElementBaseSchema.extend({
  type: z.literal('svg'),
  src: z.string().optional().describe('SVG 文件路径'),
  svgString: z.string().optional().describe('SVG 字符串'),
  fit: z.enum(['contain', 'cover', 'fill', 'scale-down', 'none']).optional().describe('缩放模式'),
  preserveAspectRatio: z.boolean().optional().describe('保持纵横比'),
  enableSVGAnimations: z.boolean().optional().describe('启用原生 SVG 动画'),
}).describe('SVG 元素');

export const AudioElementSchema = ElementBaseSchema.extend({
  type: z.literal('audio'),
  src: z.string().optional().describe('音频源 URL'),
  audioPath: z.string().optional().describe('音频文件路径'),
  cutFrom: z.number().min(0).optional().describe('裁剪起始时间（秒）'),
  cutTo: z.number().optional().describe('裁剪结束时间（秒）'),
  volume: z.number().min(0).max(1).optional().describe('音量 0–1'),
  loop: z.boolean().optional().describe('循环播放'),
}).describe('音频元素');

export const SubtitleElementSchema = ElementBaseSchema.extend({
  type: z.literal('subtitle'),
  text: z.string().describe('字幕内容'),
  fontSize: Unit.optional().describe('字号'),
  fontFamily: z.string().optional().describe('字体'),
  color: Color.optional().describe('文字颜色'),
  textAlign: z.enum(['left', 'center', 'right']).optional().describe('水平对齐'),
  split: z.union([z.literal('letter'), z.literal('word'), z.literal('line')]).nullable().optional().describe('文本拆分粒度'),
  splitDelay: z.number().optional().describe('拆分延迟'),
  splitDuration: z.number().optional().describe('拆分片段持续时间'),
}).describe('字幕元素');

export const OscilloscopeElementSchema = ElementBaseSchema.extend({
  type: z.literal('oscilloscope'),
  src: z.string().optional().describe('音频源路径或 URL'),
  waveColor: Color.optional().describe('波形颜色'),
  backgroundColor: Color.optional().describe('背景颜色'),
  lineWidth: Unit.optional().describe('波形线宽'),
  smoothing: z.number().optional().describe('平滑系数'),
  mirror: z.boolean().optional().describe('镜像显示'),
  style: z.string().optional().describe('样式类型'),
  sensitivity: z.number().optional().describe('灵敏度'),
  windowSize: z.number().optional().describe('窗口大小'),
  scrollSpeed: z.number().optional().describe('滚动速度'),
  cutFrom: z.number().min(0).optional().describe('裁剪起始时间'),
  cutTo: z.number().optional().describe('裁剪结束时间'),
}).describe('示波器元素');

export const EChartsElementSchema = ElementBaseSchema.extend({
  type: z.literal('echarts'),
  option: z.record(z.any()).optional().describe('ECharts 配置对象'),
  renderer: z.enum(['canvas', 'svg']).optional().describe('渲染器类型'),
  theme: z.union([z.string(), z.null()]).optional().describe('主题名称或 null'),
  bgcolor: Color.optional().describe('背景颜色'),
}).describe('ECharts 元素');

export const CodeElementSchema = ElementBaseSchema.extend({
  type: z.literal('code'),
  code: z.string().optional().describe('代码字符串'),
  language: z.string().optional().describe('代码语言'),
  theme: z.enum(['dark', 'light', 'monokai', 'dracula']).optional().describe('主题'),
  showLineNumbers: z.boolean().optional().describe('显示行号'),
  padding: Unit.optional().describe('内容内边距'),
  lineHeight: z.union([z.number(), z.string()]).optional().describe('行高'),
  fontSize: Unit.optional().describe('字号'),
  showBorder: z.boolean().optional().describe('显示边框'),
  borderRadius: Unit.optional().describe('圆角'),
  borderWidth: Unit.optional().describe('边框宽度'),
  bgcolor: Color.optional().describe('背景颜色'),
  borderColor: Color.optional().describe('边框颜色'),
  split: z.union([z.literal('letter'), z.literal('word'), z.literal('line')]).nullable().optional().describe('文本拆分粒度'),
  splitDelay: z.number().optional().describe('拆分延迟'),
  splitDuration: z.number().optional().describe('拆分片段持续时间'),
  cursor: z.boolean().optional().describe('显示光标'),
  cursorWidth: Unit.optional().describe('光标宽度'),
  cursorColor: Color.optional().describe('光标颜色'),
  cursorBlinkPeriod: z.number().optional().describe('光标闪烁周期'),
}).describe('代码元素');

export const SpriteElementSchema = ElementBaseSchema.extend({
  type: z.literal('sprite'),
  spriteType: z.enum(['Sprite', 'Rect', 'Circle', 'Label']).optional().describe('Sprite 类型'),
  spriteConfig: z.record(z.any()).optional().describe('Sprite 配置对象'),
  frames: z.array(z.string()).optional().describe('序列帧图片路径数组'),
  frameRate: z.number().positive().optional().describe('帧率（帧/秒）'),
  loop: z.boolean().optional().describe('是否循环播放'),
  autoplay: z.boolean().optional().describe('是否自动播放'),
  playMode: z.enum(['forward', 'reverse', 'pingpong']).optional().describe('播放模式'),
  fit: z.enum(['contain', 'cover', 'fill', 'scale-down', 'none']).optional().describe('缩放模式'),
  preserveAspectRatio: z.boolean().optional().describe('保持纵横比'),
  src: z.string().optional().describe('精灵图图片路径'),
  columns: z.number().positive().optional().describe('图集中列数（每行帧数）'),
  rows: z.number().positive().optional().describe('图集中行数'),
  frameWidth: z.number().positive().optional().describe('单帧宽度（像素）'),
  frameHeight: z.number().positive().optional().describe('单帧高度（像素）'),
  frameCount: z.number().positive().optional().describe('总帧数'),
  margin: z.number().min(0).optional().describe('外边距（像素）'),
  spacing: z.number().min(0).optional().describe('帧间距（像素）'),
  startIndex: z.number().min(0).optional().describe('起始帧索引'),
  orientation: z.enum(['row-major', 'column-major']).optional().describe('索引扫描方式'),
}).describe('精灵元素');

export const JSONElementSchema = ElementBaseSchema.extend({
  type: z.literal('json'),
  src: z.string().optional().describe('JSON 文件路径'),
  jsonData: z.record(z.any()).optional().describe('JSON 对象'),
  jsonString: z.string().optional().describe('JSON 字符串'),
  fit: z.enum(['contain', 'cover', 'fill', 'scale-down', 'none']).optional().describe('缩放模式'),
  preserveAspectRatio: z.boolean().optional().describe('保持纵横比'),
}).describe('JSON 元素');

export const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ImageElementSchema,
  VideoElementSchema,
  RectElementSchema,
  CircleElementSchema,
  PathElementSchema,
  SVGElementSchema,
  AudioElementSchema,
  SubtitleElementSchema,
  OscilloscopeElementSchema,
  EChartsElementSchema,
  CodeElementSchema,
  SpriteElementSchema,
  JSONElementSchema,
]).describe('元素联合 Schema，根据 type 选择具体结构');

export const SceneConfigSchema = z.object({
  duration: z.number().positive(),
  startTime: z.number().min(0).optional(),
  name: z.string().optional(),
}).describe('场景配置');

export const TrackConfigSchema = z.object({
  zIndex: z.number().optional(),
  name: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  fps: z.number().optional(),
}).describe('轨道配置');

export const VideoBuilderConfigSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  fps: z.number().positive(),
  backgroundColor: Color.optional(),
}).describe('VideoBuilder 配置');

export const PresetAnimationNamesSchema = PresetNameSchema.describe('预设动画名称枚举');
export const EasingNamesSchema = EasingNameSchema.describe('缓动函数名称枚举');
const TransitionNameSchema = z.enum(AllTransitions).describe('转场名称，来自 transition-renderer.js AllTransitions');
export const TransitionNamesSchema = TransitionNameSchema.describe('转场名称枚举');

