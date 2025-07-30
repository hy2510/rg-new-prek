import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { IMAGES } from '@utils/ImageManager'
import { ThemeType } from '@utils/SoundManager'

type CorrectionType = 'correct' | 'incorrect'

interface CorrectionMarkProps {
  type: CorrectionType
  theme?: ThemeType
  isVisible: boolean
  onAnimationEnd?: () => void
  className?: string
}

// 타이밍 상수
const TIMING = {
  HIDE_DELAY: 1000, // 숨김 처리 지연 시간
  OPACITY_TRANSITION: 300, // opacity 전환 시간
  ANIMATION_DURATION: 600, // 애니메이션 지속 시간
} as const

export default function CorrectionMark({
  type,
  theme = 'baro',
  isVisible,
  onAnimationEnd,
  className,
}: CorrectionMarkProps) {
  const [shouldRender, setShouldRender] = useState(false)

  // 이미지 경로들을 메모이제이션
  const imageSources = useMemo(
    () => ({
      front: IMAGES.common.correction[type].front,
      back: IMAGES.common.correction[type].back,
      character: IMAGES.theme[theme].quiz.correction[type],
    }),
    [type, theme],
  )

  // 접근성을 위한 alt 텍스트
  const altTexts = useMemo(
    () => ({
      front: `${type === 'correct' ? '정답' : '오답'} 표시`,
      back: `${type === 'correct' ? '정답' : '오답'} 배경`,
      character: `${type === 'correct' ? '정답' : '오답'} 캐릭터`,
    }),
    [type],
  )

  // 렌더링 상태 관리
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, TIMING.HIDE_DELAY)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // 이미지 로드 핸들러
  const handleImageLoad = useCallback(
    (imageType: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${type} ${imageType} 이미지 로딩 성공`)
      }
    },
    [type],
  )

  const handleImageError = useCallback(
    (imageType: string, error: React.SyntheticEvent<HTMLImageElement>) => {
      console.error(`${type} ${imageType} 이미지 로딩 실패:`, error)
    },
    [type],
  )

  // 렌더링하지 않을 때는 null 반환
  if (!shouldRender) {
    return null
  }

  return (
    <>
      <ScreenBlock $isVisible={isVisible} />
      <CorrectionMarkContainer
        $isVisible={isVisible}
        $type={type}
        onAnimationEnd={onAnimationEnd}
        className={className}
      >
        {/* <CorrectionImage
          src={imageSources.back}
          alt={altTexts.back}
          onLoad={() => handleImageLoad('back')}
          onError={(e) => handleImageError('back', e)}
        /> */}
        <CorrectionImage
          $isCharacter
          src={imageSources.character}
          alt={altTexts.character}
          onLoad={() => handleImageLoad('character')}
          onError={(e) => handleImageError('character', e)}
        />
        <CorrectionImage
          src={imageSources.front}
          alt={altTexts.front}
          onLoad={() => handleImageLoad('front')}
          onError={(e) => handleImageError('front', e)}
        />
      </CorrectionMarkContainer>
    </>
  )
}

const ScreenBlock = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity ${TIMING.OPACITY_TRANSITION}ms ease-in-out;
`

const CorrectionMarkContainer = styled.div<{
  $isVisible: boolean
  $type: CorrectionType
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 300px;
  height: 300px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity ${TIMING.OPACITY_TRANSITION}ms ease-in-out;
  pointer-events: none;

  ${({ $isVisible, $type }) =>
    $isVisible &&
    `animation: ${$type === 'correct' ? 'correctPulse' : 'incorrectShake'} ${
      TIMING.ANIMATION_DURATION
    }ms ease-in-out;`}

  @keyframes correctPulse {
    0% {
      transform: translate(-50%, -50%) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes incorrectShake {
    0%,
    100% {
      transform: translate(-50%, -50%) translateX(0);
    }
    10%,
    30%,
    50%,
    70% {
      transform: translate(-50%, -50%) translateX(-10px);
    }
    20%,
    40%,
    60% {
      transform: translate(-50%, -50%) translateX(10px);
    }
    80% {
      transform: translate(-50%, -50%) translateX(8px);
    }
    90% {
      transform: translate(-50%, -50%) translateX(-8px);
    }
  }
`

const CorrectionImage = styled.img<{ $isCharacter?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));

  ${({ $isCharacter }) =>
    $isCharacter
      ? `
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `
      : `
        top: 0;
        left: 0;
      `}
`
