import { BaseElement } from './BaseElement.js';
import { DEFAULT_IMAGE_CONFIG } from '../types/constants.js';
import { deepMerge } from '../utils/helpers.js';
import { ElementType } from '../types/enums.js';
import { Image, createCanvas } from 'canvas';
import { toPixels } from '../utils/unit-converter.js';
import paper from 'paper-jsdom-canvas';

/**
 * 图片元素
 */
export class ImageElement extends BaseElement {
  constructor(config = {}) {
    super(config);
    this.type = ElementType.IMAGE;
    // 重新合并配置，确保传入的config优先级最高
    this.config = deepMerge({}, DEFAULT_IMAGE_CONFIG, config);
    this.imageData = null;
    this.loaded = false;
  }

  /**
   * 初始化方法 - 使用 canvas 库的 Image 类加载图片
   */
  async initialize() {
    if (this.config.src && !this.loaded) {
      try {
        // 使用 canvas 库的 Image 类加载图片
        const image = new Image();
        
        // 使用 Promise 包装 Image 的加载过程
        await new Promise((resolve, reject) => {
          image.onload = () => {
            this.imageData = image;
            this.loaded = true;
            // 调用 onLoaded 回调（注意：此时还没有 paperItem，所以传递 null）
            // paperInstance 会在 render 时保存
            this._callOnLoaded(this.startTime || 0, null, null);
            resolve();
          };
          image.onerror = (error) => {
            this.loaded = false;
            reject(new Error(`Failed to load image: ${this.config.src}`));
          };
          // 设置图片源，触发加载
          image.src = this.config.src;
        });
      } catch (error) {
        console.error(`Failed to load image: ${this.config.src}`, error);
        this.loaded = false;
      }
    }
  }

  /**
   * 加载图片（向后兼容，内部调用 initialize）
   */
  async load() {
    await this.initialize();
  }

  /**
   * 设置图片源
   */
  async setSrc(src) {
    this.config.src = src;
    await this.load();
  }

  /**
   * 设置图片适配方式
   */
  setFit(fit) {
    this.config.fit = fit; // cover, contain, fill, none
  }

  /**
   * 应用视觉效果（滤镜、边框、阴影等）
   * @param {paper.Raster} raster - Paper.js Raster 对象
   * @param {Object} state - 元素状态
   * @param {number} width - 元素宽度
   * @param {number} height - 元素高度
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   * @returns {paper.Group|paper.Raster} 应用效果后的对象
   */
  applyVisualEffects(raster, state, width, height, paperInstance = null) {
    // 获取 Paper.js 实例
    const { paper: p } = this.getPaperInstance(paperInstance);
    // 检查是否有视觉效果
    const hasBorder = state.borderWidth > 0;
    const hasShadow = state.shadowBlur > 0;
    const hasFlip = state.flipX || state.flipY;
    const hasBlendMode = state.blendMode && state.blendMode !== 'normal';
    const hasFilter = state.filter || 
      (state.brightness !== 1 || state.contrast !== 1 || state.saturation !== 1 || 
       state.hue !== 0 || state.grayscale > 0);
    const hasGlassEffect = state.glassEffect;

    if (!hasBorder && !hasShadow && !hasFlip && !hasBlendMode && !hasFilter && !hasGlassEffect) {
      return raster;
    }

    // 创建组来包含所有效果
    const group = new p.Group();
    
    // 应用翻转
    if (hasFlip) {
      if (state.flipX) {
        raster.scale(-1, 1, raster.position);
      }
      if (state.flipY) {
        raster.scale(1, -1, raster.position);
      }
    }

    // 应用混合模式
    if (hasBlendMode) {
      raster.blendMode = state.blendMode;
    }

    // 应用阴影（通过创建阴影层）
    if (hasShadow) {
      const shadowRaster = raster.clone();
      shadowRaster.position = new p.Point(
        raster.position.x + (state.shadowOffsetX || 0),
        raster.position.y + (state.shadowOffsetY || 0)
      );
      shadowRaster.opacity = 0.3; // 阴影透明度
      
      // 应用阴影颜色（通过 tint）
      if (state.shadowColor) {
        const shadowColor = new p.Color(state.shadowColor);
        shadowRaster.tint = shadowColor;
      }
      
      // 应用模糊（通过降低分辨率模拟）
      if (state.shadowBlur > 0) {
        const blurFactor = Math.max(1, state.shadowBlur / 10);
        shadowRaster.size = new p.Size(
          shadowRaster.size.width * (1 + blurFactor * 0.1),
          shadowRaster.size.height * (1 + blurFactor * 0.1)
        );
      }
      
      group.addChild(shadowRaster);
    }

    // 添加主图片
    group.addChild(raster);

    // 应用边框（通过绘制边框路径）
    if (hasBorder) {
      const borderPath = new p.Path.Rectangle({
        rectangle: new p.Rectangle(
          raster.position.x - width / 2,
          raster.position.y - height / 2,
          width,
          height
        ),
        radius: state.borderRadius || 0,
      });
      borderPath.strokeColor = new p.Color(state.borderColor || '#000000');
      borderPath.strokeWidth = state.borderWidth;
      borderPath.fillColor = null;
      group.addChild(borderPath);
    }

    // 毛玻璃效果：添加边框（如果启用）
    if (hasGlassEffect && state.glassBorder) {
      const glassBorderPath = new p.Path.Rectangle({
        rectangle: new p.Rectangle(
          raster.position.x - width / 2,
          raster.position.y - height / 2,
          width,
          height
        ),
        radius: state.borderRadius || 0,
      });
      glassBorderPath.strokeColor = new p.Color(state.glassBorderColor || '#ffffff');
      glassBorderPath.strokeWidth = state.glassBorderWidth || 1;
      glassBorderPath.fillColor = null;
      glassBorderPath.opacity = 0.5; // 半透明边框
      group.addChild(glassBorderPath);
    }

    return group.children.length > 1 ? group : raster;
  }

  /**
   * 渲染图片元素（使用 Paper.js）
   * @param {paper.Layer} layer - Paper.js 图层
   * @param {number} time - 当前时间（秒）
   * @param {Object} paperInstance - Paper.js 实例 { project, paper }
   */
  render(layer, time, paperInstance = null) {
    if (!this.visible || !this.loaded || !this.imageData) return null;

    // 获取 Paper.js 实例
    const { paper: p, project } = this.getPaperInstance(paperInstance);

    const viewSize = project && project.view && project.view.viewSize 
      ? project.view.viewSize 
      : { width: 1920, height: 1080 };
    const context = { width: viewSize.width, height: viewSize.height };
    const state = this.getStateAtTime(time, context);

    // 使用 BaseElement 的通用方法转换尺寸
    // state.x 和 state.y 已经在 getStateAtTime 中转换了单位
    const { width, height } = this.convertSize(state.width, state.height, context);
    const x = state.x || 0;
    const y = state.y || 0;

    // 使用 BaseElement 的通用方法计算位置（包括 anchor 对齐）
    const { x: rectX, y: rectY } = this.calculatePosition(state, context, {
      elementWidth: width,
      elementHeight: height,
    });

    // 应用滤镜效果（在创建 Raster 之前）
    let imageData = this.imageData;
    const hasFilter = state.filter || 
      (state.brightness !== 1 || state.contrast !== 1 || state.saturation !== 1 || 
       state.hue !== 0 || state.grayscale > 0);
    const hasGlassEffect = state.glassEffect;
    
    if (hasFilter || hasGlassEffect) {
      try {
        // 创建临时 canvas 应用滤镜
        const imgWidth = this.imageData.width || width;
        const imgHeight = this.imageData.height || height;
        const tempCanvas = createCanvas(imgWidth, imgHeight);
        const tempCtx = tempCanvas.getContext('2d');
        
        // 绘制原始图片
        tempCtx.drawImage(this.imageData, 0, 0, imgWidth, imgHeight);
        
        // 构建滤镜字符串
        let filterString = state.filter || '';
        if (!state.filter) {
          const filters = [];
          if (state.brightness !== 1) {
            filters.push(`brightness(${state.brightness})`);
          }
          if (state.contrast !== 1) {
            filters.push(`contrast(${state.contrast})`);
          }
          if (state.saturation !== 1) {
            filters.push(`saturate(${state.saturation})`);
          }
          if (state.hue !== 0) {
            filters.push(`hue-rotate(${state.hue}deg)`);
          }
          if (state.grayscale > 0) {
            filters.push(`grayscale(${state.grayscale})`);
          }
          // 毛玻璃效果：添加模糊
          if (hasGlassEffect && state.glassBlur > 0) {
            filters.push(`blur(${state.glassBlur}px)`);
          }
          filterString = filters.join(' ');
        } else if (hasGlassEffect && state.glassBlur > 0) {
          // 如果已有 filter 字符串，追加 blur
          filterString += ` blur(${state.glassBlur}px)`;
        }
        
        // 应用滤镜
        if (filterString) {
          tempCtx.filter = filterString;
          const originalData = tempCtx.getImageData(0, 0, imgWidth, imgHeight);
          tempCtx.clearRect(0, 0, imgWidth, imgHeight);
          tempCtx.putImageData(originalData, 0, 0);
          
          // 毛玻璃效果：添加半透明色调层
          if (hasGlassEffect) {
            tempCtx.globalAlpha = state.glassOpacity !== undefined ? state.glassOpacity : 0.7;
            tempCtx.fillStyle = state.glassTint || '#ffffff';
            tempCtx.fillRect(0, 0, imgWidth, imgHeight);
            tempCtx.globalAlpha = 1.0;
          }
          
          // 创建新的 Image 对象
          const filteredImage = new Image();
          filteredImage.src = tempCanvas.toDataURL();
          imageData = filteredImage;
        }
      } catch (error) {
        console.warn('应用滤镜失败:', error.message);
        // 如果滤镜失败，使用原始图片
        imageData = this.imageData;
      }
    }

    // 使用 Paper.js 的 Raster 渲染图片
    const raster = new p.Raster(imageData);
    raster.position = new p.Point(x, y);
    raster.size = new p.Size(width, height);

    // 处理图片适配方式
    if (state.fit === 'cover' || state.fit === 'contain') {
      // Paper.js 的 Raster 需要手动处理适配
      // 这里可以添加额外逻辑
    }

    // 使用统一的变换方法应用动画
    this.applyTransform(raster, state, {
      applyPosition: false, // 位置已经通过 raster.position 设置了
      paperInstance: paperInstance,
    });

    // 应用视觉效果
    const finalItem = this.applyVisualEffects(raster, state, width, height, paperInstance);

    // 添加到 layer
    layer.addChild(finalItem);
    
    // 调用 onRender 回调（传递 paperItem 和 paperInstance）
    this._callOnRender(time, finalItem, paperInstance);
    
    return finalItem;
  }

}

