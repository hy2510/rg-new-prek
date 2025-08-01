import { useMemo } from 'react'
import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import styled from 'styled-components'

interface LongTextOptionsProps {
  options?: string[]
  onOptionClick?: (option: string) => void
  disabledOptions?: string[] // 비활성화된 옵션들
  theme?: ThemeType // 테마 타입 추가
}

/**
 * 배열을 랜덤하게 섞는 Fisher-Yates 알고리즘
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function LongTextOptions({
  options = [`My Name is Gino.`, `What's your name?`, `I'm a teacher.`],
  onOptionClick,
  disabledOptions = [],
  theme = 'Baro', // 기본값 설정
}: LongTextOptionsProps) {
  // 옵션들을 랜덤하게 섞어서 메모이제이션
  const shuffledOptions = useMemo(() => shuffleArray(options), [options])

  return (
    <LongTextOptionsContainer>
      {shuffledOptions.map((option) => {
        const isDisabled = disabledOptions.includes(option)
        return (
          <LongTextOption
            key={option}
            textLength={option.length}
            isDisabled={isDisabled}
            theme={theme}
            onClick={() => !isDisabled && onOptionClick?.(option)}
          >
            {option}
          </LongTextOption>
        )
      })}
    </LongTextOptionsContainer>
  )
}

const LongTextOptionsContainer = styled.div`
  width: 100%;
  max-width: 500px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const LongTextOption = styled.div<{
  textLength: number
  isDisabled?: boolean
  theme: ThemeType
}>`
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
  height: 90px;
  width: 100%;
  background-image: ${(props) =>
    `url(${Images.Theme[props.theme as ThemeType].Quiz.optionBlankLong})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.textLength >= 15 ? '1.8em' : '2.25em')};
  font-weight: 700;
  color: ${(props) => (props.isDisabled ? '#999' : '#fff')};
  text-shadow: -2px -2px 0 rgba(0, 0, 0, 0.8), 2px -2px 0 rgba(0, 0, 0, 0.8),
    -2px 2px 0 rgba(0, 0, 0, 0.8), 2px 2px 0 rgba(0, 0, 0, 0.8);

  transition: transform 0.2s ease-in-out;
  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:active {
    transform: ${(props) => (props.isDisabled ? 'none' : 'scale(0.95)')};
  }

  &:hover {
    opacity: ${(props) => (props.isDisabled ? 0.5 : 0.9)};
  }
`
