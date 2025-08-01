import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

interface QuizResultScreenProps {
  title?: string
  resultText?: string
  theme: ThemeType
  themeNumber: number
  children?: React.ReactNode
  customStyles?: React.CSSProperties
  showRibbon?: boolean
  showCharacter?: boolean
  showCompleteMark?: boolean
  characterSize?: number
  completeMarkSize?: number
  onClose?: () => void
}

/**
 * 퀴즈 완료 시 표시되는 결과 화면 컴포넌트
 */
export default function QuizResultScreen({
  title,
  resultText,
  theme,
  themeNumber,
  children,
  customStyles,
  onClose,
  showRibbon = true,
  showCharacter = true,
  showCompleteMark = true,
  characterSize = 200,
}: QuizResultScreenProps) {
  const AnimatedCompleteMark = () => {
    const completeMark = showRibbon
      ? Images.Common.CompleteMark.completeReebon
      : Images.Common.CompleteMark.completeNoReebon

    return (
      <object
        data={completeMark}
        type="image/svg+xml"
        aria-label="완료 마크"
        width={400}
        height={showRibbon ? 400 : 170}
        style={{ pointerEvents: 'none' }}
      />
    )
  }

  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle={title}
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody>
        <ResultContainer
          style={customStyles}
          className="animate__animated animate__pulse"
        >
          {children || <ResultText>{resultText || ''}</ResultText>}

          {showCharacter && (
            <CharacterContainer size={characterSize}>
              <div className="wrapper">
                <CharacterImage
                  src={Images.Theme[theme].Quiz.completeCharacter}
                  alt={`${theme} 캐릭터`}
                />
              </div>
            </CharacterContainer>
          )}

          {showCompleteMark && (
            <CompleteMarkContainer>
              <div onClick={onClose}>
                <AnimatedCompleteMark />
              </div>
            </CompleteMarkContainer>
          )}
        </ResultContainer>
      </QuizBody>
    </QuizContainer>
  )
}

const ResultContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
`

const ResultText = styled.div`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`

const CompleteMarkContainer = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`

const characterAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateZ(0) scale(0.3) translateY(50px);
  }
  50% {
    opacity: 0.8;
    transform: translateZ(0) scale(1.1) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateZ(0) scale(1) translateY(0);
  }
`

const characterFloat = keyframes`
  0%, 100% {
    transform: translateZ(0) translateY(0) rotate(0deg);
  }
  25% {
    transform: translateZ(0) translateY(-8px) rotate(1deg);
  }
  50% {
    transform: translateZ(0) translateY(-15px) rotate(0deg);
  }
  75% {
    transform: translateZ(0) translateY(-8px) rotate(-1deg);
  }
`

const CharacterContainer = styled.div<{ size: number }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;

    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    will-change: transform, opacity;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;

    animation: ${characterAppear} 1.2s ease-out,
      ${characterFloat} 3s ease-in-out 1.5s infinite;
  }
`

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimizeQuality;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: all 0.3s ease;
  &[src=''] {
    display: none;
  }
`
