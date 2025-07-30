import styled from 'styled-components'
import { useState, useEffect, useCallback } from 'react'
import { SoundManager, ThemeType, ThemeNumber } from '@utils/SoundManager'
import { VideoConfig } from '@utils/VideoConfig'
import { IMAGES } from '@utils/ImageManager'

interface MovieProps {
  onClose?: () => void
  closeTrigger?: number
  onComplete?: () => void
  theme?: ThemeType
  themeNumber?: ThemeNumber
}

// 타이밍 및 볼륨 상수
const MOVIE_CONFIG = {
  TIMING: {
    FADE_OUT_DURATION: 500,
    AUTO_CLOSE_DELAY: 500,
  },
} as const

export default function Movie({
  onClose,
  closeTrigger,
  onComplete,
  theme = 'baro',
  themeNumber = 1,
}: MovieProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // 비디오 로딩 및 배경음 관리
  useEffect(() => {
    let isMounted = true
    let currentVideoUrl = ''

    const setupMovie = async () => {
      try {
        // 배경음악 완전 정지
        SoundManager.stopAllBackgroundMusic()

        // 비디오 로딩
        setIsLoading(true)
        const blobUrl = await VideoConfig.createBlobVideoUrl()

        if (isMounted) {
          currentVideoUrl = blobUrl
          setVideoUrl(blobUrl)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('비디오 로딩 실패:', error)
        }
        // 실패 시 원본 URL 사용
        const fallbackUrl = VideoConfig.getVideoUrl()
        if (isMounted) {
          currentVideoUrl = fallbackUrl
          setVideoUrl(fallbackUrl)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    setupMovie()

    // 정리 함수
    return () => {
      isMounted = false

      // 배경음악을 처음부터 재생
      SoundManager.restartBackgroundMusic(theme, themeNumber)

      // Blob URL 정리
      if (currentVideoUrl.startsWith('blob:')) {
        VideoConfig.revokeBlobUrl(currentVideoUrl)
      }
    }
  }, [theme, themeNumber])

  // closeTrigger 변경 시 페이드아웃 처리
  useEffect(() => {
    if (closeTrigger && closeTrigger > 0) {
      handleCloseWithFade()
    }
  }, [closeTrigger])

  // 페이드아웃 및 닫기 처리
  const handleCloseWithFade = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      onClose?.()
    }, MOVIE_CONFIG.TIMING.FADE_OUT_DURATION)
  }, [onClose])

  // 비디오 종료 처리
  const handleVideoEnded = useCallback(() => {
    // 완료 콜백 호출
    onComplete?.()

    // 자동 닫기
    if (onClose) {
      setTimeout(() => {
        handleCloseWithFade()
      }, MOVIE_CONFIG.TIMING.AUTO_CLOSE_DELAY)
    }
  }, [onComplete, onClose, handleCloseWithFade])

  // 로딩 화면
  if (isLoading) {
    return (
      <MovieWrapper $isClosing={isClosing}>
        <LoadingContainer>
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </MovieWrapper>
    )
  }

  return (
    <MovieWrapper $isClosing={isClosing}>
      <VideoPlayer
        src={videoUrl}
        controls
        controlsList="nodownload"
        disablePictureInPicture
        autoPlay
        onEnded={handleVideoEnded}
        onError={() => {
          if (process.env.NODE_ENV === 'development') {
            console.error('비디오 재생 오류 발생')
          }
        }}
      />
    </MovieWrapper>
  )
}

const CompleteMarkCharacter = styled.img`
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`

const MovieWrapper = styled.div<{ $isClosing: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  opacity: ${({ $isClosing }) => ($isClosing ? 0 : 1)};
  transition: opacity ${MOVIE_CONFIG.TIMING.FADE_OUT_DURATION}ms ease-in-out;
`

const VideoPlayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const LoadingContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`
