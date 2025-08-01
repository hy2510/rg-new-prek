import React, { useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import { TIMING } from '@constants/constant'
import { useSoundContext } from '@contexts/SoundContext'

type CorrectionType = 'correct' | 'incorrect'

interface CorrectionMarkProps {
  type: CorrectionType
  theme?: ThemeType
  isVisible: boolean
  onAnimationEnd?: () => void
  className?: string
}

export default function CorrectionMark({
  type,
  theme = 'Baro',
  isVisible,
  onAnimationEnd,
  className,
}: CorrectionMarkProps) {
  const { audioList, playSound } = useSoundContext()

  // 접근성을 위한 alt 텍스트
  const altTexts = useMemo(
    () => ({
      front: `${type === 'correct' ? '정답' : '오답'} 표시`,
      back: `${type === 'correct' ? '정답' : '오답'} 배경`,
      character: `${type === 'correct' ? '정답' : '오답'} 캐릭터`,
    }),
    [type],
  )

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

  useEffect(() => {
    if (isVisible) {
      playSound(
        type === 'correct' ? audioList.correct : audioList.incorrect,
        0,
        0.25,
      )
    }
  }, [isVisible])

  return (
    <>
      {!isVisible ? (
        <></>
      ) : (
        <>
          <ScreenBlock isVisible={isVisible} />

          <CorrectionMarkContainer
            isVisible={isVisible}
            type={type}
            onAnimationEnd={onAnimationEnd}
            className={className}
          >
            <CorrectionImage
              isCharacter
              src={Images.Theme[theme].Quiz.correctionCorrectMarkCharacter}
              alt={altTexts.character}
              onLoad={() => handleImageLoad('character')}
              onError={(e) => handleImageError('character', e)}
            />
            <CorrectionImage
              src={
                type === 'correct'
                  ? Images.Common.CorrectionMark.correctionCorrectMarkFront
                  : Images.Common.CorrectionMark.correctionIncorrectMarkFront
              }
              alt={altTexts.front}
              onLoad={() => handleImageLoad('front')}
              onError={(e) => handleImageError('front', e)}
            />
          </CorrectionMarkContainer>
        </>
      )}
    </>
  )
}

const ScreenBlock = styled.div<{ isVisible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity ${TIMING.CORRECTION_MARK.OPACITY_TRANSITION}ms ease-in-out;
`

const CorrectionMarkContainer = styled.div<{
  isVisible: boolean
  type: CorrectionType
}>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 300px;
  height: 300px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity ${TIMING.CORRECTION_MARK.OPACITY_TRANSITION}ms ease-in-out;
  pointer-events: none;

  ${({ isVisible, type }) =>
    isVisible &&
    `animation: ${type === 'correct' ? 'correctPulse' : 'incorrectShake'} ${
      TIMING.CORRECTION_MARK.ANIMATION_DURATION
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

const CorrectionImage = styled.img<{ isCharacter?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));

  ${({ isCharacter }) =>
    isCharacter
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
