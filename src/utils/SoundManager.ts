/**
 * 애플리케이션의 모든 오디오 재생을 관리하는 클래스
 * - 배경음악, 효과음, 문제 사운드를 통합 관리
 * - 브라우저 호환성과 사용자 상호작용 정책 준수
 * - Safari 깜빡거림 방지를 위한 최적화 포함
 */
export class SoundManager {
  // === 정적 속성 ===
  private static audioInstances: Map<string, HTMLAudioElement> = new Map()
  private static audioEnabled = false
  private static hasUserInteracted = false
  private static originalVolume = 0.7

  // 재생 상태 관리
  private static isPlaying = false
  private static playingCallbacks: Set<(isPlaying: boolean) => void> = new Set()

  // 프리로딩 상태 관리
  private static preloadedSounds: Set<string> = new Set()
  private static isPreloading = false

  // 캐시된 경로들
  private static themePathCache: Map<string, string> = new Map()

  // Safari 최적화를 위한 AudioContext 관리
  private static audioContext: AudioContext | undefined
  private static isSafari = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent,
  )

  // 테마별 사운드 기본 경로
  private static readonly THEME_BASE = {
    baro: 'src/assets/sounds/theme/baro',
    chello: 'src/assets/sounds/theme/chello',
    millo: 'src/assets/sounds/theme/millo',
  } as const

  // 공통 효과음 경로
  private static readonly COMMON_SOUNDS = {
    stepOpen: 'src/assets/sounds/common/step-open.mp3',
  } as const

  // 문제 사운드 기본 경로
  private static readonly QUESTION_SOUNDS_BASE = {
    default: 'https://wcfresource.a1edu.com/newsystem/sound/dodoabc',
    alphabetWords:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/words',
    alphabetLetter:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/letter',
    alphabetSound:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/sound',
    phonics1Words:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics1/words',
    phonics2Words:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/words',
    sightwordWords:
      'https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/words',
  } as const

  // === 경로 생성 ===

  /**
   * 테마별 사운드 경로 생성 (캐시 적용)
   */
  private static getThemePath(
    theme: ThemeType,
    themeNumber: ThemeNumber,
  ): string {
    const cacheKey = `${theme}-${themeNumber}`
    if (!this.themePathCache.has(cacheKey)) {
      this.themePathCache.set(
        cacheKey,
        `${this.THEME_BASE[theme]}/theme0${themeNumber}`,
      )
    }
    return this.themePathCache.get(cacheKey)!
  }

  /**
   * 배경 음악 경로 가져오기
   */
  static getBackgroundMusic(
    theme: ThemeType,
    themeNumber: ThemeNumber,
  ): string {
    return `${this.getThemePath(theme, themeNumber)}/bg-sound.mp3`
  }

  /**
   * 효과음 경로 가져오기
   */
  static getEffectSound(
    theme: ThemeType,
    themeNumber: ThemeNumber,
    soundName: string,
  ): string {
    return `${this.getThemePath(theme, themeNumber)}/${soundName}.mp3`
  }

  /**
   * 공통 효과음 경로 가져오기
   */
  static getCommonSound(
    soundName: keyof (typeof SoundManager)['COMMON_SOUNDS'],
  ): string {
    return this.COMMON_SOUNDS[soundName]
  }

  /**
   * 문제 사운드 경로 생성
   */
  static getQuestionSound(
    questionType: keyof (typeof SoundManager)['QUESTION_SOUNDS_BASE'],
    audioFileName: string,
  ): string {
    const baseUrl = this.QUESTION_SOUNDS_BASE[questionType]
    const fullUrl = `${baseUrl}/${audioFileName}.mp3`

    // 개발 환경에서 URL 유효성 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`Generated question sound URL: ${fullUrl}`)
    }

    return fullUrl
  }

  // === 재생 상태 관리 ===

  /**
   * 재생 상태 변경 감지 콜백 등록
   * @returns 등록 해제 함수
   */
  static addPlayingStateListener(
    callback: (isPlaying: boolean) => void,
  ): () => void {
    this.playingCallbacks.add(callback)
    return () => this.playingCallbacks.delete(callback)
  }

  /**
   * 재생 상태 업데이트 및 콜백 호출
   */
  private static setPlayingState(playing: boolean): void {
    if (this.isPlaying !== playing) {
      this.isPlaying = playing
      this.playingCallbacks.forEach((callback) => callback(playing))
    }
  }

  /**
   * 현재 재생 상태 반환
   */
  static getIsPlaying(): boolean {
    return this.isPlaying
  }

  // === 오디오 시스템 초기화 ===

  /**
   * 브라우저의 오디오 형식 지원 확인
   */
  static checkAudioSupport(): void {
    const audio = new Audio()
    const formats = {
      mp3: 'audio/mpeg',
      ogg: 'audio/ogg',
      wav: 'audio/wav',
      m4a: 'audio/mp4',
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Audio format support check:')
      Object.entries(formats).forEach(([format, mime]) => {
        const support = audio.canPlayType(mime)
        console.log(`${format.toUpperCase()}: ${support || 'not supported'}`)
      })
    }
  }

  /**
   * Safari용 AudioContext 초기화
   */
  private static initAudioContext(): void {
    if (this.isSafari && !this.audioContext) {
      try {
        // Safari 호환성을 위한 AudioContext 생성
        const AudioContextConstructor =
          window.AudioContext || (window as any).webkitAudioContext
        this.audioContext = new AudioContextConstructor()

        // Safari에서 AudioContext suspend 해제
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume()
        }
      } catch (error) {
        console.warn('AudioContext initialization failed:', error)
      }
    }
  }

  /**
   * 사용자 상호작용 후 오디오 활성화
   * (브라우저 자동재생 정책 준수)
   */
  static enableAudio(): void {
    if (!this.hasUserInteracted) {
      console.log('Enabling audio from user interaction')
      this.hasUserInteracted = true
      this.audioEnabled = true

      // Safari용 AudioContext 초기화
      this.initAudioContext()

      // 오디오 지원 형식 확인
      this.checkAudioSupport()
    }
  }

  /**
   * 오디오 활성화 상태 확인
   */
  static isAudioEnabled(): boolean {
    return this.audioEnabled && this.hasUserInteracted
  }

  // === 오디오 재생 ===

  /**
   * 공통 효과음 재생 (버튼 클릭, 팝업 등)
   */
  static playCommonSound(
    soundName: keyof (typeof SoundManager)['COMMON_SOUNDS'],
  ): void {
    if (!this.hasUserInteracted) {
      console.log('Audio not enabled yet, waiting for user interaction')
      return
    }

    const key = `common-${soundName}`
    const src = this.getCommonSound(soundName)
    const audio = this.getAudioInstance(key, src)

    console.log('Playing common sound:', src)

    audio.loop = false
    audio.currentTime = 0
    audio.play().catch((error) => {
      console.error('Failed to play common sound:', error)
    })
  }

  /**
   * 문제 사운드 재생 (매번 새로운 인스턴스 생성) - Safari 최적화 포함
   * 캐시를 사용하지 않아 다른 문제 간 간섭 방지
   */
  static playQuestionSound(
    questionType: keyof (typeof SoundManager)['QUESTION_SOUNDS_BASE'],
    audioFileName: string,
    onEnded?: () => void,
  ): HTMLAudioElement | undefined {
    if (!this.hasUserInteracted) {
      console.log('Audio not enabled yet, waiting for user interaction')
      return
    }

    const src = this.getQuestionSound(questionType, audioFileName)

    // 매번 새로운 오디오 인스턴스 생성 (캐시 사용 안 함)
    const audio = new Audio()
    audio.volume = this.originalVolume
    audio.loop = false
    audio.preload = 'auto'

    // Safari 최적화 설정
    if (this.isSafari) {
      audio.crossOrigin = 'anonymous'

      // Safari에서 AudioContext와 연결
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
    }

    console.log('Playing fresh question sound:', src)

    this.setPlayingState(true)

    // 오류 처리 개선
    const handleError = (error: Event) => {
      console.error('Failed to play question sound:', error)
      console.error('Source URL:', src)
      this.setPlayingState(false)

      // 개발 환경에서 추가 디버깅 정보
      if (process.env.NODE_ENV === 'development') {
        console.warn('Audio format may not be supported by this browser')
        console.warn('Consider providing alternative formats (mp3, ogg, wav)')
      }
    }

    const handleEnded = () => {
      this.setPlayingState(false)
      onEnded?.()
    }

    const handleCanPlay = () => {
      // Safari에서 더 안정적인 재생을 위한 추가 체크
      if (this.isSafari && this.audioContext) {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            audio.play().catch(handleError)
          })
        } else {
          audio.play().catch(handleError)
        }
      } else {
        audio.play().catch(handleError)
      }
    }

    // 이벤트 리스너 등록
    audio.addEventListener('ended', handleEnded, { once: true })
    audio.addEventListener('error', handleError, { once: true })
    audio.addEventListener('canplay', handleCanPlay, { once: true })

    // 소스 설정 및 로드 시작
    audio.src = src
    audio.load()

    return audio
  }

  // === 배경 음악 제어 ===

  /**
   * 배경 음악 재생 시작
   */
  static playBackgroundMusic(theme: ThemeType, themeNumber: ThemeNumber): void {
    if (!this.hasUserInteracted) {
      console.log('Audio not enabled yet, waiting for user interaction')
      return
    }

    const key = `bg-${theme}-${themeNumber}`
    const src = this.getBackgroundMusic(theme, themeNumber)
    const audio = this.getAudioInstance(key, src)

    console.log('Playing background music:', src)

    // 다른 배경음악 정지 후 새로운 음악 재생
    this.stopAllBackgroundMusic()

    audio.src = src
    audio.load()
    audio.play().catch((error) => {
      console.error('Failed to play background music:', error)
    })
  }

  /**
   * 모든 배경 음악 정지
   */
  static stopAllBackgroundMusic(): void {
    this.audioInstances.forEach((audio, key) => {
      if (key.startsWith('bg-')) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }

  /**
   * 배경 음악 일시정지
   */
  static pauseBackgroundMusic(): void {
    this.audioInstances.forEach((audio, key) => {
      if (key.startsWith('bg-')) {
        audio.pause()
      }
    })
  }

  /**
   * 배경 음악 재개
   * @param theme 특정 테마만 재생할 경우
   * @param themeNumber 특정 테마 번호만 재생할 경우
   */
  static resumeBackgroundMusic(
    theme?: ThemeType,
    themeNumber?: ThemeNumber,
  ): void {
    if (!this.hasUserInteracted) return

    this.audioInstances.forEach((audio, key) => {
      if (key.startsWith('bg-')) {
        if (theme && themeNumber && key === `bg-${theme}-${themeNumber}`) {
          audio.play().catch(console.error)
        } else if (theme && themeNumber) {
          audio.pause()
          audio.currentTime = 0
        } else {
          audio.play().catch(console.error)
        }
      }
    })
  }

  /**
   * 배경 음악 재생 상태 확인
   */
  static isBackgroundMusicPlaying(): boolean {
    return Array.from(this.audioInstances.entries()).some(
      ([key, audio]) => key.startsWith('bg-') && !audio.paused,
    )
  }

  /**
   * 배경 음악 재생/일시정지 토글
   */
  static toggleBackgroundMusic(): void {
    if (this.isBackgroundMusicPlaying()) {
      this.pauseBackgroundMusic()
    } else {
      this.resumeBackgroundMusic()
    }
  }

  /**
   * 특정 테마의 배경 음악을 처음부터 재생
   */
  static restartBackgroundMusic(
    theme: ThemeType,
    themeNumber: ThemeNumber,
  ): void {
    if (!this.hasUserInteracted) return

    const key = `bg-${theme}-${themeNumber}`
    const src = this.getBackgroundMusic(theme, themeNumber)
    const audio = this.getAudioInstance(key, src)

    // 다른 배경음악 정지
    this.stopAllBackgroundMusic()

    console.log('Restarting background music from beginning:', src)

    // 처음부터 재생
    audio.currentTime = 0
    audio.play().catch((error) => {
      console.error('Failed to restart background music:', error)
    })
  }

  // === 볼륨 관리 ===

  /**
   * 배경 음악 볼륨 설정
   * @param volume 0.0 ~ 1.0 사이의 값
   */
  static setBackgroundMusicVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    this.audioInstances.forEach((audio, key) => {
      if (key.startsWith('bg-')) {
        audio.volume = clampedVolume
      }
    })
  }

  /**
   * 배경 음악 볼륨을 15%로 줄이기 (퀴즈 실행 시)
   */
  static reduceBackgroundMusicVolume(): void {
    this.audioInstances.forEach((audio, key) => {
      if (key.startsWith('bg-')) {
        audio.volume = 0.15
        if (!audio.paused) {
          audio.pause()
          audio.currentTime = Math.max(0, audio.currentTime - 0.01)
          audio.play().catch(() => {})
        }
      }
    })
  }

  /**
   * 배경 음악 볼륨을 원래대로 복원
   */
  static restoreBackgroundMusicVolume(): void {
    this.setBackgroundMusicVolume(this.originalVolume)
  }

  // === 오디오 인스턴스 관리 ===

  /**
   * 오디오 인스턴스 가져오기 또는 생성 (배경음악, 효과음용)
   */
  private static getAudioInstance(key: string, src: string): HTMLAudioElement {
    if (!this.audioInstances.has(key)) {
      const audio = new Audio(src)
      audio.volume = this.originalVolume
      audio.loop = true
      audio.preload = 'auto'
      this.audioInstances.set(key, audio)
    }
    return this.audioInstances.get(key)!
  }

  /**
   * 모든 오디오 정지
   */
  static stopAllAudio(): void {
    this.audioInstances.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    this.setPlayingState(false)
  }

  /**
   * 모든 오디오 리소스 정리 (컴포넌트 언마운트 시)
   */
  static cleanup(): void {
    this.stopAllAudio()
    this.audioInstances.clear()
    this.themePathCache.clear()
    this.audioEnabled = false
    this.hasUserInteracted = false
    this.isPlaying = false
    this.playingCallbacks.clear()
  }

  // === 프리로딩 시스템 ===

  /**
   * 자주 사용되는 사운드들을 미리 로드 - Safari 최적화 포함
   * @param onProgress 로딩 진행률 콜백
   */
  static async preloadSounds(
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<void> {
    if (this.isPreloading) return
    this.isPreloading = true

    const soundsToPreload = this.getSoundsToPreload()
    let loadedCount = 0
    const totalCount = soundsToPreload.length

    const preloadPromises = soundsToPreload.map(({ key, src }) => {
      return new Promise<void>((resolve) => {
        if (this.preloadedSounds.has(key)) {
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
          return
        }

        const audio = new Audio()
        audio.volume = this.originalVolume
        audio.preload = 'auto'

        // Safari 최적화 설정
        if (this.isSafari) {
          audio.muted = true // Safari에서 프리로딩 시 일시적으로 음소거
          audio.crossOrigin = 'anonymous'
        }

        const handleLoad = () => {
          this.preloadedSounds.add(key)
          this.audioInstances.set(key, audio)

          // Safari에서 음소거 해제
          if (this.isSafari) {
            audio.muted = false
          }

          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        const handleError = (error: Event) => {
          console.warn(`Failed to preload sound: ${src}`, error)
          loadedCount++
          onProgress?.(loadedCount, totalCount)
          resolve()
        }

        // Safari에서 더 안정적인 로딩을 위한 이벤트 리스너
        if (this.isSafari) {
          audio.addEventListener('loadeddata', handleLoad, { once: true })
        } else {
          audio.addEventListener('canplaythrough', handleLoad, { once: true })
        }
        audio.addEventListener('error', handleError, { once: true })

        audio.src = src
        audio.load()
      })
    })

    await Promise.all(preloadPromises)
    this.isPreloading = false
    console.log(`Preloaded ${this.preloadedSounds.size} sounds`)
  }

  /**
   * 프리로드할 사운드 목록 생성
   */
  private static getSoundsToPreload(): Array<{ key: string; src: string }> {
    const sounds: Array<{ key: string; src: string }> = []

    // 공통 효과음들
    sounds.push({
      key: 'common-stepOpen',
      src: this.getCommonSound('stepOpen'),
    })

    // 기본 문제 사운드들
    const commonQuestions = ['a', 'b', 'c']
    commonQuestions.forEach((question) => {
      sounds.push({
        key: `question-${question}`,
        src: this.getQuestionSound('alphabetWords', question),
      })
    })

    // 주요 테마 배경음악들
    const mainTheme: ThemeType = 'baro'
    for (let themeNum = 1; themeNum <= 3; themeNum++) {
      const themeNumber = themeNum as ThemeNumber
      sounds.push({
        key: `bg-${mainTheme}-${themeNumber}`,
        src: this.getBackgroundMusic(mainTheme, themeNumber),
      })
    }

    return sounds
  }

  /**
   * 특정 사운드의 프리로드 상태 확인
   */
  static isSoundPreloaded(key: string): boolean {
    return this.preloadedSounds.has(key)
  }

  /**
   * 현재 프리로딩 진행 중인지 확인
   */
  static isCurrentlyPreloading(): boolean {
    return this.isPreloading
  }
}

// === 타입 정의 ===
export type ThemeType = 'baro' | 'chello' | 'millo'
export type ThemeNumber = 1 | 2 | 3 | 4

// === 테마별 사운드 구성 ===
const createThemeSounds = (theme: ThemeType) => ({
  theme01: {
    background: { bgSound: SoundManager.getBackgroundMusic(theme, 1) },
    effects: {},
  },
  theme02: {
    background: { bgSound: SoundManager.getBackgroundMusic(theme, 2) },
    effects: {},
  },
  theme03: {
    background: { bgSound: SoundManager.getBackgroundMusic(theme, 3) },
    effects: {},
  },
  theme04: {
    background: { bgSound: SoundManager.getBackgroundMusic(theme, 4) },
    effects: {},
  },
})

/**
 * 테마별 사운드 리소스 상수
 * 외부에서 사운드 경로 참조 시 사용
 */
export const SOUNDS = {
  baro: createThemeSounds('baro'),
  chello: createThemeSounds('chello'),
  millo: createThemeSounds('millo'),
} as const
