import { ThemeType } from '@interfaces/IThemeType'
import { Images, Sounds } from '@utils/Assets'

export class Manager {
  private static preloadedImages: Set<string> = new Set()
  private static preloadedSounds: Set<string> = new Set()
  private static isPreloading = false

  // Asset 그룹을 미리 정의
  private static readonly ASSET_GROUPS = {
    Common: {
      Buttons: Object.values(Images.Common.Button),
      Collections: Object.values(Images.Common.Collections),
      CompleteMarks: Object.values(Images.Common.CompleteMark),
      CorrectionMarks: Object.values(Images.Common.CorrectionMark),
      QuestionBgs: Object.values(Images.Common.QuestionBg),
      StepIndicators: Object.values(Images.Common.StepIndicator),
      Other: [Images.Common.Other.imgTempIntro],
    },
    Themes: {
      Baro: {
        Quiz: Object.values(Images.Theme.Baro.Quiz),
        Theme01: Object.values(Images.Theme.Baro.Theme01),
        Theme02: Object.values(Images.Theme.Baro.Theme02),
        Theme03: Object.values(Images.Theme.Baro.Theme03),
      },
      Chello: {
        Quiz: Object.values(Images.Theme.Chello.Quiz),
        Theme01: Object.values(Images.Theme.Chello.Theme01),
        Theme02: Object.values(Images.Theme.Chello.Theme02),
        Theme03: Object.values(Images.Theme.Chello.Theme03),
      },
      Millo: {
        Quiz: Object.values(Images.Theme.Millo.Quiz),
        Theme01: Object.values(Images.Theme.Millo.Theme01),
        Theme02: Object.values(Images.Theme.Millo.Theme02),
        Theme03: Object.values(Images.Theme.Millo.Theme03),
      },
    },
    Sounds: {
      Common: Object.values(Sounds.Common),
      Themes: {
        Baro: Object.values(Sounds.Theme.Baro),
        Chello: Object.values(Sounds.Theme.Chello),
        Millo: Object.values(Sounds.Theme.Millo),
      },
    },
  } as const

  /**
   * 모든 Common 이미지들을 프리로드
   */
  static async preloadCommonImages(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    if (this.isPreloading) {
      console.log('Already preloading assets...')
      return
    }

    this.isPreloading = true
    const commonImages = this.getCommonImages()
    let loadedCount = 0
    const totalCount = commonImages.length

    const preloadPromises = commonImages.map((imageUrl) => {
      return new Promise<void>((resolve) => {
        if (this.preloadedImages.has(imageUrl)) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const img = new window.Image()
        img.onload = async () => {
          this.preloadedImages.add(imageUrl)

          // Safari 깜빡거림 방지를 위한 이미지 디코딩
          try {
            if (img.decode) {
              await img.decode()
            }
          } catch (decodeError) {
            console.warn(`Image decode failed for ${imageUrl}:`, decodeError)
          }

          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.onerror = () => {
          console.warn(`Failed to preload image: ${imageUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.crossOrigin = 'anonymous'
        img.src = imageUrl
      })
    })

    await Promise.all(preloadPromises)
    this.isPreloading = false
    console.log(`Preloaded ${this.preloadedImages.size} common images`)
  }

  /**
   * 모든 Common 사운드들을 프리로드
   */
  static async preloadCommonSounds(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    const commonSounds = this.getCommonSounds()
    let loadedCount = 0
    const totalCount = commonSounds.length

    const preloadPromises = commonSounds.map((soundUrl) => {
      return new Promise<void>((resolve) => {
        if (this.preloadedSounds.has(soundUrl)) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const audio = new Audio()
        audio.oncanplaythrough = () => {
          this.preloadedSounds.add(soundUrl)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        audio.onerror = () => {
          console.warn(`Failed to preload sound: ${soundUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        audio.src = soundUrl
        audio.load()
      })
    })

    await Promise.all(preloadPromises)
    console.log(`Preloaded ${this.preloadedSounds.size} common sounds`)
  }

  /**
   * 모든 Common asset들을 프리로드 (이미지 + 사운드)
   */
  static async preloadCommonAssets(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    console.log('Starting common assets preload...')

    // 이미지와 사운드를 순차적으로 로드
    await this.preloadCommonImages(onProgress)
    await this.preloadCommonSounds(onProgress)

    console.log('Common assets preload completed')
  }

  /**
   * 특정 테마의 이미지들을 프리로드
   */
  static async preloadThemeImages(
    theme: ThemeType,
    themeNumber: number,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    const themeImages = this.getThemeImages(theme, themeNumber)
    let loadedCount = 0
    const totalCount = themeImages.length

    const preloadPromises = themeImages.map((imageUrl) => {
      return new Promise<void>((resolve) => {
        if (this.preloadedImages.has(imageUrl)) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const img = new window.Image()
        img.onload = async () => {
          this.preloadedImages.add(imageUrl)

          try {
            if (img.decode) {
              await img.decode()
            }
          } catch (decodeError) {
            console.warn(`Image decode failed for ${imageUrl}:`, decodeError)
          }

          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.onerror = () => {
          console.warn(`Failed to preload image: ${imageUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.crossOrigin = 'anonymous'
        img.src = imageUrl
      })
    })

    await Promise.all(preloadPromises)
    console.log(
      `Preloaded ${themeImages.length} theme images for ${theme} theme${themeNumber}`,
    )
  }

  /**
   * 특정 테마의 사운드들을 프리로드
   */
  static async preloadThemeSounds(
    theme: ThemeType,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    const themeSounds = this.getThemeSounds(theme)
    let loadedCount = 0
    const totalCount = themeSounds.length

    const preloadPromises = themeSounds.map((soundUrl) => {
      return new Promise<void>((resolve) => {
        if (this.preloadedSounds.has(soundUrl)) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const audio = new Audio()
        audio.oncanplaythrough = () => {
          this.preloadedSounds.add(soundUrl)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        audio.onerror = () => {
          console.warn(`Failed to preload sound: ${soundUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        audio.src = soundUrl
        audio.load()
      })
    })

    await Promise.all(preloadPromises)
    console.log(`Preloaded ${themeSounds.length} theme sounds for ${theme}`)
  }

  /**
   * 특정 테마의 모든 asset들을 프리로드
   */
  static async preloadThemeAssets(
    theme: ThemeType,
    themeNumber: number,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    console.log(`Starting ${theme} theme${themeNumber} assets preload...`)

    await this.preloadThemeImages(theme, themeNumber, onProgress)
    await this.preloadThemeSounds(theme, onProgress)

    console.log(`${theme} theme${themeNumber} assets preload completed`)
  }

  // 간단한 메서드들
  private static getCommonImages(): string[] {
    return [
      ...this.ASSET_GROUPS.Common.Buttons,
      ...this.ASSET_GROUPS.Common.Collections,
      ...this.ASSET_GROUPS.Common.CompleteMarks,
      ...this.ASSET_GROUPS.Common.CorrectionMarks,
      ...this.ASSET_GROUPS.Common.QuestionBgs,
      ...this.ASSET_GROUPS.Common.StepIndicators,
      ...this.ASSET_GROUPS.Common.Other,
    ]
  }

  private static getCommonSounds(): string[] {
    return this.ASSET_GROUPS.Sounds.Common
  }

  private static getThemeImages(
    theme: ThemeType,
    themeNumber: number,
  ): string[] {
    const themeAssets = this.ASSET_GROUPS.Themes[theme]
    const themeKey = `Theme0${themeNumber}` as keyof typeof themeAssets

    return [...themeAssets.Quiz, ...themeAssets[themeKey]]
  }

  private static getThemeSounds(theme: ThemeType): string[] {
    return this.ASSET_GROUPS.Sounds.Themes[theme]
  }

  // 상태 확인 메서드들
  static isImagePreloaded(imageUrl: string): boolean {
    return this.preloadedImages.has(imageUrl)
  }

  static isSoundPreloaded(soundUrl: string): boolean {
    return this.preloadedSounds.has(soundUrl)
  }

  static isCurrentlyPreloading(): boolean {
    return this.isPreloading
  }

  static getPreloadedImageCount(): number {
    return this.preloadedImages.size
  }

  static getPreloadedSoundCount(): number {
    return this.preloadedSounds.size
  }

  static clearPreloadStatus(): void {
    this.preloadedImages.clear()
    this.preloadedSounds.clear()
    this.isPreloading = false
    console.log('Preload status cleared')
  }
}

// 기존 코드와의 호환성을 위해 export
export const AssetsManager = Manager
