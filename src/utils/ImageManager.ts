import { ThemeType, ThemeNumber } from './SoundManager'

export class ImageManager {
  // 공용 이미지 경로
  private static readonly COMMON_PATHS = {
    common: 'src/assets/temp/common',
    button: 'src/assets/temp/common/button',
    correctionMark: 'src/assets/temp/common/correction-mark',
    completeMark: 'src/assets/temp/common/complete-mark',
    questionBg: 'src/assets/temp/common/question-bg',
    stepIndicator: 'src/assets/temp/common/step-indicator',
    collections: 'src/assets/temp/common/collections',
  }

  // 프리로딩 상태 관리
  private static preloadedImages: Set<string> = new Set()
  private static decodedImages: Set<string> = new Set()
  private static isPreloading = false

  // 테마별 프리로딩 완료 상태 추적
  private static preloadedThemes: Set<string> = new Set()

  /**
   * 이미지 프리로딩 함수 - Safari 깜빡거림 방지를 위한 디코딩 최적화 포함
   */
  static async preloadImages(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    if (this.isPreloading) return
    this.isPreloading = true

    // 프리로드할 주요 이미지들 수집
    const imagesToPreload = this.getImagesToPreload()

    let loadedCount = 0
    const totalCount = imagesToPreload.length

    const preloadPromises = imagesToPreload.map((imageUrl) => {
      return new Promise<void>((resolve, reject) => {
        if (
          this.preloadedImages.has(imageUrl) &&
          this.decodedImages.has(imageUrl)
        ) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const img = new Image()

        img.onload = async () => {
          this.preloadedImages.add(imageUrl)

          // Safari 깜빡거림 방지를 위한 이미지 디코딩
          try {
            if (img.decode) {
              await img.decode()
              this.decodedImages.add(imageUrl)
            }
          } catch (decodeError) {
            console.warn(`Image decode failed for ${imageUrl}:`, decodeError)
            // 디코딩 실패해도 계속 진행
          }

          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.onerror = () => {
          console.warn(`Failed to preload image: ${imageUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve() // 실패해도 계속 진행
        }

        // 크로스 오리진 이미지에 대한 설정
        img.crossOrigin = 'anonymous'
        img.src = imageUrl
      })
    })

    await Promise.all(preloadPromises)
    this.isPreloading = false
    console.log(
      `Preloaded ${this.preloadedImages.size} images, decoded ${this.decodedImages.size} images`,
    )
  }

  /**
   * 프리로드할 이미지 목록 수집 - 더 완전한 리스트로 개선
   */
  private static getImagesToPreload(): string[] {
    const images: string[] = []

    // 공통 버튼 이미지들
    images.push(
      this.getCommonImage('button', 'btn-play-sound'),
      this.getCommonImage('button', 'btn-stop-sound'),
      this.getCommonImage('button', 'btn-close-quiz-modal'),
      this.getCommonSvgImage('button', 'btn-radiocast-play'),
      this.getCommonSvgImage('button', 'btn-radiocast-stop'),
      this.getCommonImage('button', 'btn-start'),
      this.getCommonImage('button', 'btn-record-ready'),
      this.getCommonImage('button', 'btn-record-rec'),
      this.getCommonImage('button', 'btn-record-play'),
      this.getCommonImage('button', 'btn-record-next'),
      this.getCommonImage('button', 'btn-go-to-collections'),
    )

    // 공통 UI 이미지들
    images.push(
      this.getCommonImage('completeMark', 'complete-mark'),
      this.getCommonImage('completeMark', 'complete-mark-check'),
      this.getCommonSvgImage('completeMark', 'complete-no-reebon'),
      this.getCommonSvgImage('completeMark', 'complete-reebon'),
      this.getCommonImage('questionBg', 'question-bg-long'),
      this.getCommonImage('questionBg', 'question-bg-short'),
      this.getCommonImage('correctionMark', 'correction-correct-mark-front'),
      this.getCommonImage('correctionMark', 'correction-correct-mark-back'),
      this.getCommonImage('correctionMark', 'correction-incorrect-mark-front'),
      this.getCommonImage('correctionMark', 'correction-incorrect-mark-back'),
      this.getCommonSvgImage('correctionMark', 'correction-backlight'),
    )

    // 스텝 인디케이터 이미지들
    images.push(
      this.getCommonImage('stepIndicator', 'step-number-bg'),
      this.getCommonImage('stepIndicator', 'step-movie-mark'),
      this.getCommonImage('stepIndicator', 'step-current-mark'),
      this.getCommonImage('stepIndicator', 'step-completed-mark'),
    )

    // 컬렉션 이미지들
    images.push(
      this.getCommonImage('collections', 'collection-showcase'),
      this.getCommonImage('collections', 'collection-pedestal'),
      this.getCommonImage('collections', 'collection-pedestal-light'),
      this.getCommonImage('collections', 'label-ribbon'),
      this.getCommonSvgImage('collections', 'res-collect-item-bg'),
      // 배지 이미지들 - 모든 캐릭터
      this.getCommonImage('collections', 'badge-enable-baro-1'),
      this.getCommonImage('collections', 'badge-enable-baro-2'),
      this.getCommonImage('collections', 'badge-enable-baro-3'),
      this.getCommonImage('collections', 'badge-disable-baro-1'),
      this.getCommonImage('collections', 'badge-disable-baro-2'),
      this.getCommonImage('collections', 'badge-disable-baro-3'),
      this.getCommonImage('collections', 'badge-enable-chello-1'),
      this.getCommonImage('collections', 'badge-enable-chello-2'),
      this.getCommonImage('collections', 'badge-enable-chello-3'),
      this.getCommonImage('collections', 'badge-disable-chello-1'),
      this.getCommonImage('collections', 'badge-disable-chello-2'),
      this.getCommonImage('collections', 'badge-disable-chello-3'),
      this.getCommonImage('collections', 'badge-enable-millo-1'),
      this.getCommonImage('collections', 'badge-enable-millo-2'),
      this.getCommonImage('collections', 'badge-enable-millo-3'),
      this.getCommonImage('collections', 'badge-disable-millo-1'),
      this.getCommonImage('collections', 'badge-disable-millo-2'),
      this.getCommonImage('collections', 'badge-disable-millo-3'),
    )

    // 모든 테마에 대한 기본 이미지들 프리로드 (baro, chello, millo 전체)
    const themes: ThemeType[] = ['baro', 'chello', 'millo']
    themes.forEach((theme) => {
      // 퀴즈 관련 이미지들
      images.push(
        this.getQuizBackgroundImage(theme),
        this.getCorrectionCharacterImage(theme, 'correct'),
        this.getCorrectionCharacterImage(theme, 'incorrect'),
        this.getQuizOptionImage(theme, 'option-card-front'),
        this.getQuizOptionImage(theme, 'option-card-back'),
        this.getQuizOptionImage(theme, 'option-blank-long'),
        this.getQuizOptionImage(theme, 'option-blank-short'),
        this.getQuizOptionImage(theme, 'option-blank-key'),
        this.getQuizOptionImage(theme, 'option-letter-by-sound'),
        this.getQuizOptionImage(theme, 'res-shelf-long'),
        this.getQuizOptionImage(theme, 'res-shelf-short'),
      )

      // 각 테마의 첫 번째 테마 이미지들 (가장 자주 사용됨)
      images.push(
        this.getCharacterImage(theme, 1, theme),
        this.getStepImage(theme, 1, 'step-movie'),
        this.getStepImage(theme, 1, 'step1'),
        this.getStepImage(theme, 1, 'step2'),
        this.getStepImage(theme, 1, 'step3'),
        this.getStepImage(theme, 1, 'step4'),
        this.getStepImage(theme, 1, 'step5'),
        this.getBackgroundImage(theme, 1, 'bg01'),
        this.getBackgroundImage(theme, 1, 'bg02'),
        this.getBackgroundImage(theme, 1, 'bg03'),
      )

      // 컬렉션 캐릭터 라벨들
      images.push(
        this.getCommonImage('collections', `label-character-${theme}`),
      )
    })

    return images
  }

  /**
   * 특정 테마의 모든 이미지를 동적으로 프리로드 (테마 변경 시 사용)
   */
  static async preloadThemeImages(
    theme: ThemeType,
    themeNumber: ThemeNumber,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    const themeKey = `${theme}-${themeNumber}`

    // 이미 프리로드된 테마라면 즉시 리턴
    if (this.preloadedThemes.has(themeKey)) {
      console.log(`테마 ${themeKey}는 이미 프리로드 완료됨 - 건너뛰기`)
      return
    }

    const themeImages: string[] = []

    // 해당 테마의 모든 이미지들
    for (let step = 1; step <= 5; step++) {
      themeImages.push(
        this.getStepImage(theme, themeNumber, `step${step}` as StepType),
      )
    }
    themeImages.push(this.getStepImage(theme, themeNumber, 'step-movie'))

    // 배경 이미지들 (테마에 따라 개수가 다를 수 있음)
    for (let bgNum = 1; bgNum <= 6; bgNum++) {
      const bgName = `bg${bgNum.toString().padStart(2, '0')}`
      themeImages.push(this.getBackgroundImage(theme, themeNumber, bgName))
    }

    themeImages.push(this.getCharacterImage(theme, themeNumber, theme))

    // 퀴즈 관련 이미지들
    themeImages.push(this.getQuizBackgroundImage(theme))
    themeImages.push(this.getCompleteCharacterImage(theme))
    themeImages.push(this.getCorrectionCharacterImage(theme, 'correct'))
    themeImages.push(this.getCorrectionCharacterImage(theme, 'incorrect'))

    let loadedCount = 0
    const totalCount = themeImages.length

    const preloadPromises = themeImages.map((imageUrl) => {
      return new Promise<void>((resolve) => {
        if (
          this.preloadedImages.has(imageUrl) &&
          this.decodedImages.has(imageUrl)
        ) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const img = new Image()
        img.onload = async () => {
          this.preloadedImages.add(imageUrl)

          try {
            if (img.decode) {
              await img.decode()
              this.decodedImages.add(imageUrl)
            }
          } catch (decodeError) {
            console.warn(
              `Theme image decode failed for ${imageUrl}:`,
              decodeError,
            )
          }

          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.onerror = () => {
          console.warn(`Failed to preload theme image: ${imageUrl}`)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        img.crossOrigin = 'anonymous'
        img.src = imageUrl
      })
    })

    await Promise.all(preloadPromises)

    // 테마 프리로딩 완료 상태 저장
    this.preloadedThemes.add(themeKey)
    console.log(`테마 ${themeKey} 이미지 프리로딩 완료: ${loadedCount}개`)
  }

  /**
   * 특정 테마가 이미 프리로드되었는지 확인
   */
  static isThemePreloaded(theme: ThemeType, themeNumber: ThemeNumber): boolean {
    const themeKey = `${theme}-${themeNumber}`
    return this.preloadedThemes.has(themeKey)
  }

  /**
   * 프리로딩 상태 확인 (디코딩 포함)
   */
  static isImagePreloaded(imageUrl: string): boolean {
    return (
      this.preloadedImages.has(imageUrl) && this.decodedImages.has(imageUrl)
    )
  }

  /**
   * 프리로딩 진행 상태 확인
   */
  static isCurrentlyPreloading(): boolean {
    return this.isPreloading
  }

  /**
   * 공용 이미지 경로 가져오기
   */
  static getCommonImage(
    category: keyof typeof ImageManager.COMMON_PATHS,
    imageName: string,
  ): string {
    return `${this.COMMON_PATHS[category]}/${imageName}.png`
  }

  /**
   * 공용 SVG 이미지 경로 가져오기
   */
  static getCommonSvgImage(
    category: keyof typeof ImageManager.COMMON_PATHS,
    imageName: string,
  ): string {
    return `${this.COMMON_PATHS[category]}/${imageName}.svg`
  }

  /**
   * 퀴즈 배경 이미지 경로 가져오기 (theme/quiz 경로 사용)
   */
  static getQuizBackgroundImage(theme: ThemeType): string {
    return `${this.THEME_BASE[theme]}/quiz/quiz-bg.png`
  }

  /**
   * 테마별 correction character 이미지 경로 가져오기 (theme/quiz 경로 사용)
   */
  static getCorrectionCharacterImage(
    theme: ThemeType,
    type: 'correct' | 'incorrect',
  ): string {
    return `${this.THEME_BASE[theme]}/quiz/correction-${type}-mark-character.png`
  }

  /**
   * 테마별 완료 캐릭터 이미지 경로 가져오기 (theme/quiz 경로 사용)
   */
  static getCompleteCharacterImage(theme: ThemeType): string {
    return `${this.THEME_BASE[theme]}/quiz/complete-character.png`
  }

  /**
   * 퀴즈 옵션 이미지 경로 가져오기
   */
  static getQuizOptionImage(theme: ThemeType, imageName: string): string {
    return `${this.THEME_BASE[theme]}/quiz/${imageName}.png`
  }

  // 학습 테마용 기본 경로
  private static readonly THEME_BASE = {
    baro: 'src/assets/temp/theme/baro',
    chello: 'src/assets/temp/theme/chello',
    millo: 'src/assets/temp/theme/millo',
  }

  /**
   * 학습 테마용 이미지 경로 생성
   */
  private static getThemePath(
    theme: ThemeType,
    themeNumber: ThemeNumber,
  ): string {
    return `${this.THEME_BASE[theme]}/theme0${themeNumber}`
  }

  /**
   * 캐릭터 이미지 경로 가져오기 (추후 애니메이션일 때 익스텐션을 svg로 교체하기)
   */
  static getCharacterImage(
    theme: ThemeType,
    themeNumber: ThemeNumber,
    characterName: string,
  ): string {
    const themePath = this.getThemePath(theme, themeNumber)
    return `${themePath}/${characterName}.svg`
  }

  /**
   * 스텝 이미지 경로 가져오기
   */
  static getStepImage(
    theme: ThemeType,
    themeNumber: ThemeNumber,
    stepType: StepType,
  ): string {
    const themePath = this.getThemePath(theme, themeNumber)
    return `${themePath}/${stepType}.png`
  }

  /**
   * 학습 테마용 배경 이미지 경로 가져오기
   */
  static getBackgroundImage(
    theme: ThemeType,
    themeNumber: ThemeNumber,
    bgName: string,
  ): string {
    const themePath = this.getThemePath(theme, themeNumber)
    return `${themePath}/${bgName}.png`
  }
}

// 타입 정의
export type StepType =
  | 'step-movie'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'

// 테마별 이미지 팩토리 함수
const createThemeImages = (theme: ThemeType) => ({
  theme01: {
    step: {
      stepMovie: ImageManager.getStepImage(theme, 1, 'step-movie'),
      step1: ImageManager.getStepImage(theme, 1, 'step1'),
      step2: ImageManager.getStepImage(theme, 1, 'step2'),
      step3: ImageManager.getStepImage(theme, 1, 'step3'),
      step4: ImageManager.getStepImage(theme, 1, 'step4'),
      step5: ImageManager.getStepImage(theme, 1, 'step5'),
    },
    character: {
      [theme]: ImageManager.getCharacterImage(theme, 1, theme),
    },
    background: {
      bg01: ImageManager.getBackgroundImage(theme, 1, 'bg01'),
      bg02: ImageManager.getBackgroundImage(theme, 1, 'bg02'),
      bg03: ImageManager.getBackgroundImage(theme, 1, 'bg03'),
      bg04: ImageManager.getBackgroundImage(theme, 1, 'bg04'),
      bg05: ImageManager.getBackgroundImage(theme, 1, 'bg05'),
      bg06: ImageManager.getBackgroundImage(theme, 1, 'bg06'),
    },
  },
  theme02: {
    step: {
      stepMovie: ImageManager.getStepImage(theme, 2, 'step-movie'),
      step1: ImageManager.getStepImage(theme, 2, 'step1'),
      step2: ImageManager.getStepImage(theme, 2, 'step2'),
      step3: ImageManager.getStepImage(theme, 2, 'step3'),
      step4: ImageManager.getStepImage(theme, 2, 'step4'),
      step5: ImageManager.getStepImage(theme, 2, 'step5'),
    },
    character: {
      [theme]: ImageManager.getCharacterImage(theme, 2, theme),
    },
    background: {
      bg01: ImageManager.getBackgroundImage(theme, 2, 'bg01'),
      bg02: ImageManager.getBackgroundImage(theme, 2, 'bg02'),
      bg03: ImageManager.getBackgroundImage(theme, 2, 'bg03'),
      bg04: ImageManager.getBackgroundImage(theme, 2, 'bg04'),
      bg05: ImageManager.getBackgroundImage(theme, 2, 'bg05'),
      bg06: ImageManager.getBackgroundImage(theme, 2, 'bg06'),
    },
  },
  theme03: {
    step: {
      stepMovie: ImageManager.getStepImage(theme, 3, 'step-movie'),
      step1: ImageManager.getStepImage(theme, 3, 'step1'),
      step2: ImageManager.getStepImage(theme, 3, 'step2'),
      step3: ImageManager.getStepImage(theme, 3, 'step3'),
      step4: ImageManager.getStepImage(theme, 3, 'step4'),
      step5: ImageManager.getStepImage(theme, 3, 'step5'),
    },
    character: {
      [theme]: ImageManager.getCharacterImage(theme, 3, theme),
    },
    background: {
      bg01: ImageManager.getBackgroundImage(theme, 3, 'bg01'),
      bg02: ImageManager.getBackgroundImage(theme, 3, 'bg02'),
      bg03: ImageManager.getBackgroundImage(theme, 3, 'bg03'),
      bg04: ImageManager.getBackgroundImage(theme, 3, 'bg04'),
      bg05: ImageManager.getBackgroundImage(theme, 3, 'bg05'),
      bg06: ImageManager.getBackgroundImage(theme, 3, 'bg06'),
    },
  },
  theme04: {
    step: {
      stepMovie: ImageManager.getStepImage(theme, 4, 'step-movie'),
      step1: ImageManager.getStepImage(theme, 4, 'step1'),
      step2: ImageManager.getStepImage(theme, 4, 'step2'),
      step3: ImageManager.getStepImage(theme, 4, 'step3'),
      step4: ImageManager.getStepImage(theme, 4, 'step4'),
      step5: ImageManager.getStepImage(theme, 4, 'step5'),
    },
    character: {
      [theme]: ImageManager.getCharacterImage(theme, 4, theme),
    },
    background: {
      bg01: ImageManager.getBackgroundImage(theme, 4, 'bg01'),
      bg02: ImageManager.getBackgroundImage(theme, 4, 'bg02'),
      bg03: ImageManager.getBackgroundImage(theme, 4, 'bg03'),
      bg04: ImageManager.getBackgroundImage(theme, 4, 'bg04'),
      bg05: ImageManager.getBackgroundImage(theme, 4, 'bg05'),
      bg06: ImageManager.getBackgroundImage(theme, 4, 'bg06'),
    },
  },
  quiz: {
    background: {
      quizBg: ImageManager.getQuizBackgroundImage(theme),
    },
    character: {
      completeCharacter: ImageManager.getCompleteCharacterImage(theme),
    },
    correction: {
      correct: ImageManager.getCorrectionCharacterImage(theme, 'correct'),
      incorrect: ImageManager.getCorrectionCharacterImage(theme, 'incorrect'),
    },
    options: {
      optionCardFront: ImageManager.getQuizOptionImage(
        theme,
        'option-card-front',
      ),
      optionCardBack: ImageManager.getQuizOptionImage(
        theme,
        'option-card-back',
      ),
      optionLetterBySound: ImageManager.getQuizOptionImage(
        theme,
        'option-letter-by-sound',
      ),
      optionBlankLong: ImageManager.getQuizOptionImage(
        theme,
        'option-blank-long',
      ),
      optionBlankShort: ImageManager.getQuizOptionImage(
        theme,
        'option-blank-short',
      ),
      optionBlankKey: ImageManager.getQuizOptionImage(
        theme,
        'option-blank-key',
      ),
      resShelfLong: ImageManager.getQuizOptionImage(theme, 'res-shelf-long'),
      resShelfShort: ImageManager.getQuizOptionImage(theme, 'res-shelf-short'),
    },
  },
})

// 이미지 정의 상수
export const IMAGES = {
  theme: {
    baro: createThemeImages('baro'),
    chello: createThemeImages('chello'),
    millo: createThemeImages('millo'),
  },
  common: {
    sample: ImageManager.getCommonImage('common', 'img_temp_intro'),
    currentStepPointer: ImageManager.getCommonImage(
      'common',
      'current-step-pointer',
    ),
    completeMark: ImageManager.getCommonImage('completeMark', 'complete-mark'),
    completeMarkCheck: ImageManager.getCommonImage(
      'completeMark',
      'complete-mark-check',
    ),
    resultCompleteMark: ImageManager.getCommonSvgImage(
      'completeMark',
      'complete-reebon',
    ),
    resultCompleteMarkNoRebon: ImageManager.getCommonSvgImage(
      'completeMark',
      'complete-no-reebon',
    ),
    questionBg: {
      long: ImageManager.getCommonImage('questionBg', 'question-bg-long'),
      short: ImageManager.getCommonImage('questionBg', 'question-bg-short'),
    },
    correction: {
      correct: {
        front: ImageManager.getCommonImage(
          'correctionMark',
          'correction-correct-mark-front',
        ),
        back: ImageManager.getCommonImage(
          'correctionMark',
          'correction-correct-mark-back',
        ),
      },
      incorrect: {
        front: ImageManager.getCommonImage(
          'correctionMark',
          'correction-incorrect-mark-front',
        ),
        back: ImageManager.getCommonImage(
          'correctionMark',
          'correction-incorrect-mark-back',
        ),
      },
    },
    button: {
      playSoundButton: ImageManager.getCommonImage('button', 'btn-play-sound'),
      stopSoundButton: ImageManager.getCommonImage('button', 'btn-stop-sound'),
      recordReady: ImageManager.getCommonImage('button', 'btn-record-ready'),
      recordRec: ImageManager.getCommonImage('button', 'btn-record-rec'),
      recordPlay: ImageManager.getCommonImage('button', 'btn-record-play'),
      recordNext: ImageManager.getCommonImage('button', 'btn-record-next'),
      closeQuizModal: ImageManager.getCommonImage(
        'button',
        'btn-close-quiz-modal',
      ),
      radioCastPlay: ImageManager.getCommonSvgImage(
        'button',
        'btn-radiocast-play',
      ),
      radioCastStop: ImageManager.getCommonSvgImage(
        'button',
        'btn-radiocast-stop',
      ),
      start: ImageManager.getCommonImage('button', 'btn-start'),
      tryAgain: ImageManager.getCommonImage('button', 'btn-try-again'),
      next: ImageManager.getCommonImage('button', 'btn-next'),
      goToCollections: ImageManager.getCommonImage(
        'button',
        'btn-go-to-collections',
      ),
    },
    collections: {
      showcase: ImageManager.getCommonImage(
        'collections',
        'collection-showcase',
      ),
      pedestal: ImageManager.getCommonImage(
        'collections',
        'collection-pedestal',
      ),
      pedestalLight: ImageManager.getCommonImage(
        'collections',
        'collection-pedestal-light',
      ),
      resCollectItemBg: ImageManager.getCommonSvgImage(
        'collections',
        'res-collect-item-bg',
      ),
      badge: {
        enable: {
          baro: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-enable-baro-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-enable-baro-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-enable-baro-3',
            ),
          },
          chello: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-enable-chello-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-enable-chello-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-enable-chello-3',
            ),
          },
          millo: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-enable-millo-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-enable-millo-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-enable-millo-3',
            ),
          },
        },
        disable: {
          baro: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-disable-baro-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-disable-baro-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-disable-baro-3',
            ),
          },
          chello: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-disable-chello-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-disable-chello-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-disable-chello-3',
            ),
          },
          millo: {
            1: ImageManager.getCommonImage(
              'collections',
              'badge-disable-millo-1',
            ),
            2: ImageManager.getCommonImage(
              'collections',
              'badge-disable-millo-2',
            ),
            3: ImageManager.getCommonImage(
              'collections',
              'badge-disable-millo-3',
            ),
          },
        },
      },
      label: {
        ribbon: ImageManager.getCommonImage('collections', 'label-ribbon'),
        character: {
          baro: ImageManager.getCommonImage(
            'collections',
            'label-character-baro',
          ),
          chello: ImageManager.getCommonImage(
            'collections',
            'label-character-chello',
          ),
          millo: ImageManager.getCommonImage(
            'collections',
            'label-character-millo',
          ),
        },
      },
    },
    stepIndicator: {
      stepNumberBg: ImageManager.getCommonImage(
        'stepIndicator',
        'step-number-bg',
      ),
      stepMovieMark: ImageManager.getCommonImage(
        'stepIndicator',
        'step-movie-mark',
      ),
      stepCurrentMark: ImageManager.getCommonImage(
        'stepIndicator',
        'step-current-mark',
      ),
      stepCompletedMark: ImageManager.getCommonImage(
        'stepIndicator',
        'step-completed-mark',
      ),
    },
  },
} as const
