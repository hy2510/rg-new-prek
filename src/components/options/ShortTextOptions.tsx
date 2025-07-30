import { IMAGES } from '@utils/ImageManager'
import { ThemeType } from '@utils/SoundManager'
import styled from 'styled-components'
import { useMemo } from 'react'

interface ShortTextOptionsProps {
  options?: string[]
  onOptionClick?: (option: string, index: number) => void
  theme?: ThemeType // 테마 타입 추가
}

// Fisher-Yates shuffle 알고리즘으로 배열을 랜덤하게 섞는 함수
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ShortTextOptions({
  options = ['a', 'b', 'c'],
  onOptionClick,
  theme = 'baro', // 기본값 설정
}: ShortTextOptionsProps) {
  // 옵션들을 랜덤 순서로 섞기
  const shuffledOptions = useMemo(() => {
    return shuffleArray(options)
  }, [options])

  const handleOptionClick = (option: string, index: number) => {
    onOptionClick?.(option, index)
  }

  return (
    <ShortTextOptionsContainer>
      {shuffledOptions.map((option, index) => (
        <ShortTextOption
          key={`${option}-${index}`}
          $textLength={option.length}
          $theme={theme}
          onClick={() => handleOptionClick(option, index)}
        >
          {option}
        </ShortTextOption>
      ))}
    </ShortTextOptionsContainer>
  )
}

const ShortTextOptionsContainer = styled.div`
  min-height: 200px;
  display: flex;
  gap: 10px;
`

const ShortTextOption = styled.div<{
  $textLength: number
  $theme: ThemeType
}>`
  cursor: pointer;
  height: 200px;
  width: 320px;
  background-image: ${(props) =>
    `url(${IMAGES.theme[props.$theme].quiz.options.optionBlankShort})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) =>
    props.$textLength >= 9
      ? '2.5em'
      : props.$textLength >= 7
      ? '3em'
      : props.$textLength >= 5
      ? '3.5em'
      : '5em'};
  font-weight: 700;
  color: #fff;
  text-shadow: -2px -2px 0 rgba(0, 0, 0, 0.8), 2px -2px 0 rgba(0, 0, 0, 0.8),
    -2px 2px 0 rgba(0, 0, 0, 0.8), 2px 2px 0 rgba(0, 0, 0, 0.8);

  transition: transform 0.2s ease-in-out;

  &:active {
    transform: scale(0.95);
  }
`
