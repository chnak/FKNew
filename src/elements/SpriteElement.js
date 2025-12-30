import { BaseElement } from './BaseElement.js'
<<<<<<< HEAD
import { deepMerge } from '../utils/helpers.js'
import { ElementType } from '../types/enums.js'
import { DEFAULT_ELEMENT_CONFIG, DEFAULT_SPRITE_CONFIG } from '../types/constants.js'
import { loadImage, createCanvas } from 'canvas'
import paper from 'paper'
import { calculateImageFit } from '../utils/image-fit.js'

/**
 * 精灵动画元素（Sprite）
 *
 * 使用精灵图（spritesheet）进行序列帧动画渲染，支持循环、正向/反向/往返播放和尺寸适配。
 *
 * 配置参数（在构造时传入 config）：
 * - src: string 精灵图图片路径
 * - columns: number 图集列数（每行帧数）
 * - rows: number 图集行数
 * - frameWidth: number 单帧原始宽度（像素）
 * - frameHeight: number 单帧原始高度（像素）
 * - frameCount: number 实际播放的帧总数（不一定等于 columns*rows）
 * - frameRate: number 播放帧率（帧/秒）
 * - loop: boolean 是否循环播放
 * - autoplay: boolean 是否自动播放（false 时停留首帧）
 * - playMode: 'forward' | 'reverse' | 'ping-pong' 播放模式
 * - fit: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none' 显示适配模式
 * - x, y: number|string 元素位置，支持 %/px 等单位（继承 BaseElement）
 * - width, height: number|string 元素显示尺寸（继承 BaseElement）
 */

=======
import { DEFAULT_ELEMENT_CONFIG } from '../types/constants.js'
import { deepMerge } from '../utils/helpers.js'
import { ElementType } from '../types/enums.js'
import { loadImage, createCanvas } from 'canvas'
import { calculateImageFit } from '../utils/image-fit.js'
import fs from 'fs'
import path from 'path'

>>>>>>> spine
export class SpriteElement extends BaseElement {
  constructor(config = {}) {
    super(config)
    this.type = ElementType.SPRITE
<<<<<<< HEAD
    this.config = deepMerge({}, DEFAULT_SPRITE_CONFIG || DEFAULT_ELEMENT_CONFIG, config)
    this.src = this.config.src || ''
=======
    this.config = deepMerge({}, DEFAULT_ELEMENT_CONFIG, config)
    this.src = this.config.src
    this.srcDir = this.config.srcDir
>>>>>>> spine
    this.columns = this.config.columns || 1
    this.rows = this.config.rows || 1
    this.frameWidth = this.config.frameWidth || 0
    this.frameHeight = this.config.frameHeight || 0
<<<<<<< HEAD
    this.frameCount = this.config.frameCount || this.columns * this.rows
=======
>>>>>>> spine
    this.frameRate = this.config.frameRate || 12
    this.loop = this.config.loop !== undefined ? this.config.loop : true
    this.autoplay = this.config.autoplay !== undefined ? this.config.autoplay : true
    this.playMode = this.config.playMode || 'forward'
<<<<<<< HEAD
    this.fit = this.config.fit || 'contain'
    this.imageData = null
    this.loaded = false
    this._offscreen = null
  }

  /**
   * 初始化：加载精灵图资源
   * @returns {Promise<boolean>} 是否初始化成功
   */
  async initialize() {
    await super.initialize()
    if (this.src && !this.loaded) {
      this.imageData = await loadImage(this.src)
      this.loaded = true
      this._callOnLoaded(this.startTime || 0, null, null)
    }
    return true
  }

  isInitialized() {
    return !!this.loaded
  }

  /**
   * 计算在指定时间的帧索引
   * @param {number} time 当前时间（秒）
   * @returns {number} 帧索引（0-based）
   */
  _getFrameIndex(time) {
    if (!this.autoplay) return 0
    const epsilon = 0.0001
    const localTime = Math.max(0, time - (this.startTime || 0))
    const framesPassed = Math.floor(localTime * this.frameRate + epsilon)
    if (this.playMode === 'reverse') {
      const idx = this.loop ? framesPassed % this.frameCount : Math.min(framesPassed, this.frameCount - 1)
      return this.frameCount - 1 - idx
    } else if (this.playMode === 'ping-pong' || this.playMode === 'pingpong') {
      const period = this.frameCount > 1 ? (this.frameCount * 2 - 2) : 1
      const k = this.loop ? framesPassed % period : Math.min(framesPassed, period - 1)
      return k < this.frameCount ? k : (period - k)
    }
    const idx = this.loop ? framesPassed % this.frameCount : Math.min(framesPassed, this.frameCount - 1)
    return idx
  }

  /**
   * 渲染精灵元素
   * @param {paper.Layer} layer Paper.js 图层
   * @param {number} time 当前时间（秒）
   * @param {Object} paperInstance Paper.js 实例 { project, paper }
   * @returns {Promise<paper.Raster|null>} 创建的 Raster
   */
  async render(layer, time, paperInstance = null) {
    if (!this.visible) return null
    if (!this.isActiveAtTime(time)) return null
    if (!this.loaded) {
      await this.initialize()
    }
    if (!this.imageData) return null

=======
    this.fit = this.config.fit || 'cover'
    this.imageData = null
    this.sequenceImages = []
    this.loaded = false
    this._warnedMissing = false
  }

  async initialize(loaded) {
    if (!loaded) {
      await super.initialize()
    }
    if (this.src && !this.loaded) {
      try {
        this.imageData = await loadImage(this.src)
        this.loaded = true
        this._callOnLoaded(this.startTime || 0, null, null)
      } catch (e) {
        this.loaded = false
      }
    }
    if (this.srcDir && this.sequenceImages.length === 0) {
      try {
        const files = fs.readdirSync(this.srcDir)
        const images = files
          .filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        for (const f of images) {
          const img = await loadImage(path.join(this.srcDir, f))
          this.sequenceImages.push(img)
        }
        this._callOnLoaded(this.startTime || 0, null, null)
      } catch (e) {}
    }
  }

  _getFrameIndex(time, total) {
    if (!this.autoplay) return 0
    if (total <= 1) return 0
    const t = Math.max(0, time - (this.startTime || 0))
    const f = Math.floor(t * this.frameRate)
    if (this.playMode === 'reverse') {
      if (this.loop) {
        return total - 1 - (f % total)
      }
      const capped = Math.min(f, total - 1)
      return Math.max(0, total - 1 - capped)
    }
    if (this.playMode === 'ping-pong') {
      const cycle = Math.max(1, total * 2 - 2)
      const n = this.loop ? (f % cycle) : Math.min(f, cycle)
      return n < total ? n : (cycle - n)
    }
    if (this.loop) {
      return f % total
    }
    return Math.min(f, total - 1)
  }

  applyVisualEffects(raster, state, width, height, paperInstance = null) {
    const { paper: p } = this.getPaperInstance(paperInstance)
    const hasBorder = state.borderWidth > 0
    const hasShadow = state.shadowBlur > 0
    const hasFlip = state.flipX || state.flipY
    const hasBlendMode = state.blendMode && state.blendMode !== 'normal'
    const hasFilter = state.filter || (state.brightness !== 1 || state.contrast !== 1 || state.saturation !== 1 || state.hue !== 0 || state.grayscale > 0)
    const hasGlassEffect = state.glassEffect
    if (!hasBorder && !hasShadow && !hasFlip && !hasBlendMode && !hasFilter && !hasGlassEffect) {
      return raster
    }
    const group = new p.Group()
    if (hasFlip) {
      if (state.flipX) {
        raster.scale(-1, 1, raster.position)
      }
      if (state.flipY) {
        raster.scale(1, -1, raster.position)
      }
    }
    if (hasBlendMode) {
      raster.blendMode = state.blendMode
    }
    if (hasShadow) {
      const shadowRaster = raster.clone()
      shadowRaster.position = new p.Point(
        raster.position.x + (state.shadowOffsetX || 0),
        raster.position.y + (state.shadowOffsetY || 0)
      )
      shadowRaster.opacity = 0.3
      if (state.shadowColor) {
        const shadowColor = new p.Color(state.shadowColor)
        shadowRaster.tint = shadowColor
      }
      if (state.shadowBlur > 0) {
        const blurFactor = Math.max(1, state.shadowBlur / 10)
        shadowRaster.size = new p.Size(
          shadowRaster.size.width * (1 + blurFactor * 0.1),
          shadowRaster.size.height * (1 + blurFactor * 0.1)
        )
      }
      group.addChild(shadowRaster)
    }
    group.addChild(raster)
    if (hasBorder) {
      const borderPath = new p.Path.Rectangle({
        rectangle: new p.Rectangle(
          raster.position.x - width / 2,
          raster.position.y - height / 2,
          width,
          height
        ),
        radius: state.borderRadius || 0,
      })
      borderPath.strokeColor = new p.Color(state.borderColor || '#000000')
      borderPath.strokeWidth = state.borderWidth
      borderPath.fillColor = null
      group.addChild(borderPath)
    }
    if (hasGlassEffect && state.glassBorder) {
      const glassBorderPath = new p.Path.Rectangle({
        rectangle: new p.Rectangle(
          raster.position.x - width / 2,
          raster.position.y - height / 2,
          width,
          height
        ),
        radius: state.borderRadius || 0,
      })
      glassBorderPath.strokeColor = new p.Color(state.glassBorderColor || '#ffffff')
      glassBorderPath.strokeWidth = state.glassBorderWidth || 1
      glassBorderPath.fillColor = null
      glassBorderPath.opacity = 0.5
      group.addChild(glassBorderPath)
    }
    return group.children.length > 1 ? group : raster
  }

  async render(layer, time, paperInstance = null) {
    if (!this.visible) return null
    if (!this.isActiveAtTime(time)) return null
    if (!this.loaded && (!this.srcDir || this.sequenceImages.length === 0)) {
      try {
        await Promise.race([
          this.initialize(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Sprite initialization timeout (5s)')), 5000))
        ])
      } catch (_) {
        return null
      }
    }
>>>>>>> spine
    const { paper: p, project } = this.getPaperInstance(paperInstance)
    const viewSize = project?.view?.viewSize || { width: 1920, height: 1080 }
    const context = { width: viewSize.width, height: viewSize.height }
    const state = this.getStateAtTime(time, context)
<<<<<<< HEAD

    const containerSize = this.convertSize(state.width, state.height, context)
    const containerWidth = containerSize.width || this.frameWidth || viewSize.width
    const containerHeight = containerSize.height || this.frameHeight || viewSize.height

    const fw = this.frameWidth || Math.floor((this.imageData.width || 0) / Math.max(1, this.columns))
    const fh = this.frameHeight || Math.floor((this.imageData.height || 0) / Math.max(1, this.rows))

    const fitResult = calculateImageFit({
      imageWidth: fw,
      imageHeight: fh,
      containerWidth,
      containerHeight,
      fit: this.fit || state.fit || 'contain'
    })

    const width = fitResult.width
    const height = fitResult.height

    const idx = this._getFrameIndex(time)
    const col = this.columns > 0 ? (idx % this.columns) : 0
    const row = this.columns > 0 ? Math.floor(idx / this.columns) : 0
    const sx = col * fw
    const sy = row * fh

    if (!this._offscreen || this._offscreen.width !== fw || this._offscreen.height !== fh) {
      this._offscreen = createCanvas(fw, fh)
    }
    const ctx = this._offscreen.getContext('2d')
    ctx.clearRect(0, 0, fw, fh)
    ctx.drawImage(this.imageData, sx, sy, fw, fh, 0, 0, fw, fh)

    // 如果 state 中没有位置，使用配置中的起始位置回退（支持 startPosition 数组 或 startX/startY）
    if ((state.x === undefined || state.x === null) || (state.y === undefined || state.y === null)) {
      const sp = this.config.startPosition || (this.config.spriteConfig && this.config.spriteConfig.startPosition)
      if (Array.isArray(sp) && sp.length >= 2) {
        if (state.x === undefined || state.x === null) state.x = sp[0]
        if (state.y === undefined || state.y === null) state.y = sp[1]
      } else {
        const sx = this.config.startX !== undefined ? this.config.startX : (this.config.spriteConfig && this.config.spriteConfig.startX !== undefined ? this.config.spriteConfig.startX : undefined)
        const sy = this.config.startY !== undefined ? this.config.startY : (this.config.spriteConfig && this.config.spriteConfig.startY !== undefined ? this.config.spriteConfig.startY : undefined)
        if ((state.x === undefined || state.x === null) && sx !== undefined) state.x = sx
        if ((state.y === undefined || state.y === null) && sy !== undefined) state.y = sy
      }
    }

    const { x, y } = this.calculatePosition(state, context, { elementWidth: width, elementHeight: height })

    const raster = new p.Raster(this._offscreen)
    raster.position = new p.Point(x, y)

    const scaleX = width / fw
    const scaleY = height / fh
    raster.scale(scaleX, scaleY, raster.position)

    this.applyTransform(raster, state, { applyPosition: false, paperInstance: p })

    if (layer) layer.addChild(raster)
    this._callOnRender(time, raster, paperInstance)
    return raster
=======
    const containerSize = this.convertSize(state.width, state.height, context)
    const containerWidth = containerSize.width || viewSize.width
    const containerHeight = containerSize.height || viewSize.height

    let raster = null
    let width = containerWidth
    let height = containerHeight

    if (this.sequenceImages.length > 0) {
      const total = this.sequenceImages.length
      const idx = this._getFrameIndex(time, total)
      const img = this.sequenceImages[Math.max(0, Math.min(idx, total - 1))]
      const imageWidth = img.width || 0
      const imageHeight = img.height || 0
      const fit = state.fit || this.fit
      const fitResult = calculateImageFit({
        imageWidth,
        imageHeight,
        containerWidth,
        containerHeight,
        fit
      })
      width = fitResult.width
      height = fitResult.height
      const pos = this.calculatePosition(state, context, { width, height })
      raster = new p.Raster(img)
      raster.position = new p.Point(pos.x, pos.y)
      const sourceWidth = imageWidth || width
      const sourceHeight = imageHeight || height
      if (sourceWidth > 0 && sourceHeight > 0) {
        const scaleX = width / sourceWidth
        const scaleY = height / sourceHeight
        raster.scale(scaleX, scaleY, raster.position)
      } else {
        raster.size = new p.Size(width, height)
      }
    } else if (this.imageData) {
      let fw = this.frameWidth
      let fh = this.frameHeight
      const sheetW = this.imageData.width || 0
      const sheetH = this.imageData.height || 0
      if (!fw && this.columns > 0) fw = Math.floor(sheetW / this.columns)
      if (!fh && this.rows > 0) fh = Math.floor(sheetH / this.rows)
      const total = Math.max(1, this.columns * this.rows)
      const idx = this._getFrameIndex(time, total)
      const col = this.columns > 0 ? (idx % this.columns) : 0
      const row = this.columns > 0 ? Math.floor(idx / this.columns) : 0
      let sx = col * fw
      let sy = row * fh
      if (sx + fw > sheetW) sx = Math.max(0, sheetW - fw)
      if (sy + fh > sheetH) sy = Math.max(0, sheetH - fh)
      const canvas = createCanvas(fw, fh)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.imageData, sx, sy, fw, fh, 0, 0, fw, fh)
      const imageWidth = fw
      const imageHeight = fh
      const fit = state.fit || this.fit
      const fitResult = calculateImageFit({
        imageWidth,
        imageHeight,
        containerWidth,
        containerHeight,
        fit
      })
      width = fitResult.width
      height = fitResult.height
      const pos = this.calculatePosition(state, context, { width, height })
      raster = new p.Raster(canvas)
      raster.position = new p.Point(pos.x, pos.y)
      const scaleX = width / imageWidth
      const scaleY = height / imageHeight
      raster.scale(scaleX, scaleY, raster.position)
    } else {
      if (!this._warnedMissing) {
        this._warnedMissing = true
      }
      return null
    }

    this.applyTransform(raster, state, { applyPosition: false, paperInstance: p })
    const finalItem = this.applyVisualEffects(raster, state, width, height, p)
    if (layer) {
      layer.addChild(finalItem)
    }
    return finalItem
>>>>>>> spine
  }
}
