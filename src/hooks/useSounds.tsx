import { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import { isIOS } from 'react-device-detect'

import { Sounds } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'

interface SoundItem {
  ref: React.RefObject<HTMLAudioElement>
  src: string
  loop?: boolean
  preload?: 'auto' | 'metadata' | 'none'
}

export type AudioList = {
  correct: React.RefObject<HTMLAudioElement>
  incorrect: React.RefObject<HTMLAudioElement>
  stepOpen: React.RefObject<HTMLAudioElement>
  bgm: React.RefObject<HTMLAudioElement>
}

interface UseSoundsProps {
  theme?: ThemeType
  themeNumber?: number
}

export function useSounds({
  theme = 'Baro',
  themeNumber = 1,
}: UseSoundsProps = {}) {
  const [isBgmMute, setIsBgmMute] = useState(false)
  const [isAudioLetterPlaying, setIsAudioLetterPlaying] = useState(false)
  const correctSoundRef = useRef<HTMLAudioElement>(null)
  const incorrectSoundRef = useRef<HTMLAudioElement>(null)
  const stepOpenSoundRef = useRef<HTMLAudioElement>(null)
  const bgmRef = useRef<HTMLAudioElement>(null)
  const audioLetterRef = useRef<HTMLAudioElement>(null)

  // theme과 themeNumber에 따라 배경음악 경로 결정
  const getBgmSrc = () => {
    const themeAssets = (Sounds.Theme as any)[theme]
    const themeKey = `theme0${themeNumber}BgSound` as keyof typeof themeAssets
    return themeAssets[themeKey]
  }

  const sounds: Record<string, SoundItem> = {
    correct: {
      ref: correctSoundRef,
      src: Sounds.Common.correct,
      preload: 'auto',
    },
    incorrect: {
      ref: incorrectSoundRef,
      src: Sounds.Common.incorrect,
      preload: 'auto',
    },
    stepOpen: {
      ref: stepOpenSoundRef,
      src: Sounds.Common.stepOpen,
      preload: 'auto',
    },
    bgm: {
      ref: bgmRef,
      src: getBgmSrc(),
      loop: true,
      preload: 'auto',
    },
  }

  const [isReady, setIsReady] = useState(false)
  const [isMuteBGM, setIsMuteBGM] = useState(false)

  useEffect(() => {
    const audioElements = Object.values(sounds)
      .map((sound) => sound.ref.current)
      .filter((el): el is HTMLAudioElement => el !== null)

    if (audioElements.length === 0) return

    let loadedCount = 0

    const handlePlayHandler = () => {
      loadedCount++

      if (loadedCount === audioElements.length) {
        setIsReady(true)
      }
    }

    audioElements.forEach((audio) => {
      if (isIOS) {
        audio.addEventListener('loadedmetadata', handlePlayHandler, {
          once: true,
        })
      } else {
        audio.addEventListener('canplaythrough', handlePlayHandler, {
          once: true,
        })
      }

      audio.load() // 강제 로드 시작 (ios 대응)
    })

    return () => {
      audioElements.forEach((audio) => {
        if (isIOS) {
          audio.removeEventListener('loadedmetadata', handlePlayHandler)
        } else {
          audio.removeEventListener('canplaythrough', handlePlayHandler)
        }
      })
    }
  }, [])

  /**
   * 오디오 재생
   * @param ref
   * @param startTime
   * @param volume
   */
  const playSound = (
    ref: React.RefObject<HTMLAudioElement>,
    startTime = 0,
    volume = 1,
  ) => {
    const audio = ref.current

    if (audio) {
      audio.currentTime = startTime
      audio.volume = volume
      audio.play().catch(console.error)
    }
  }

  /**
   * 문제 음원 재생
   * @param audioLetter
   */
  const playAudioLetter = (audioLetter: string) => {
    console.log('playAudioLetter 호출됨:', audioLetter)

    if (!audioLetter) {
      console.warn('audioLetter가 비어있음')
      return
    }

    // 재생 상태를 true로 설정
    setIsAudioLetterPlaying(true)

    // audioLetterRef가 없으면 동적으로 Audio 객체 생성하여 재생
    if (!audioLetterRef.current) {
      console.log('audioLetterRef가 null, 동적 Audio 객체 생성')
      const audio = new Audio(audioLetter)
      audio.volume = 1.0

      audio
        .play()
        .then(() => {
          console.log('AudioLetter 재생 성공 (동적 생성)')
        })
        .catch((error) => {
          console.error('AudioLetter 재생 실패 (동적 생성):', error)
          setIsAudioLetterPlaying(false)
        })

      // 재생 완료 후 상태 초기화
      audio.addEventListener('ended', () => {
        setIsAudioLetterPlaying(false)
      })
    } else {
      // 기존 audio 요소 사용
      audioLetterRef.current.src = audioLetter
      audioLetterRef.current.load()
      audioLetterRef.current.volume = 1.0

      audioLetterRef.current
        .play()
        .then(() => {
          console.log('AudioLetter 재생 성공')
        })
        .catch((error) => {
          console.error('AudioLetter 재생 실패:', error)
          setIsAudioLetterPlaying(false)
        })

      // 재생 완료 후 상태 초기화
      audioLetterRef.current.addEventListener('ended', () => {
        setIsAudioLetterPlaying(false)
      })
    }
  }

  /**
   * 오디오 일시 중지
   * @param ref
   */
  const pauseSound = (ref: React.RefObject<HTMLAudioElement>) => {
    const audio = ref.current

    if (audio) {
      audio.pause()
    }
  }

  /**
   * 오디오 다시 시작
   * @param ref
   */
  const resumeSound = (ref: React.RefObject<HTMLAudioElement>) => {
    const audio = ref.current

    if (audio) {
      audio.play()
    }
  }

  /**
   * 오디오 중지
   * @param ref
   */
  const stopSound = (ref: React.RefObject<HTMLAudioElement>) => {
    const audio = ref.current

    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * BGM 토글
   */
  const toggleBGM = () => {
    if (isBgmMute) {
      setIsBgmMute(false)
      resumeSound(audioList.bgm)
    } else {
      setIsBgmMute(true)
      pauseSound(audioList.bgm)
    }
    const audio = bgmRef.current

    if (audio) {
      audio.volume = audio.volume > 0 ? 0 : 0.3
    }
  }

  const renderAudioElements = (): JSX.Element[] => {
    const audioElements = Object.entries(sounds).map(
      ([key, { ref, src, loop, preload }]) => (
        <audio key={key} ref={ref} src={src} loop={loop} preload={preload} />
      ),
    )

    // audioLetter는 동적으로 src가 변경되므로 별도로 추가
    audioElements.push(
      <audio
        key="audioLetter"
        ref={audioLetterRef}
        preload="auto"
        controls={false}
        muted={false}
      />,
    )

    return audioElements
  }

  const renderLoadingScreen = () => (
    <StyledLoadingScreen>Loading Sounds...</StyledLoadingScreen>
  )

  const changeBGMMute = (state: boolean) => {
    setIsBgmMute(state)
  }

  const audioList: AudioList = {
    bgm: bgmRef,
    correct: correctSoundRef,
    incorrect: incorrectSoundRef,
    stepOpen: stepOpenSoundRef,
  }

  return {
    isReady,
    isBgmMute,
    isAudioLetterPlaying,
    audioList,
    playSound,
    playAudioLetter,
    pauseSound,
    resumeSound,
    stopSound,
    toggleBGM,
    changeBGMMute,
    renderAudioElements,
    renderLoadingScreen,
  }
}

const StyledLoadingScreen = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`
