import { useMemo } from 'react'
import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'
import styled from 'styled-components'

// Fisher-Yates 셔플 알고리즘
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface SmallImageOptionsProps {
  options: string[]
  onOptionClick: (option: string) => void
  theme?: ThemeType // 테마 타입 추가
}

export default function SmallImageOptions({
  options,
  onOptionClick,
  theme = 'Baro', // 기본값 설정
}: SmallImageOptionsProps) {
  // 옵션들을 랜덤하게 섞기
  const shuffledOptions = useMemo(() => shuffleArray(options), [options])

  return (
    <SmallImageOptionsContainer>
      {shuffledOptions.map((option) => (
        <SmallImageOption
          key={option}
          theme={theme}
          onClick={() => onOptionClick(option)}
        >
          <div className="img-container">
            <img src={option} alt="" />
          </div>
        </SmallImageOption>
      ))}
    </SmallImageOptionsContainer>
  )
}

const SmallImageOptionsContainer = styled.div`
  min-height: 200px;
  display: flex;
  gap: 20px;
`

const SmallImageOption = styled.div<{ theme: ThemeType }>`
  cursor: pointer;
  height: 200px;
  width: 320px;
  background-image: ${(props) =>
    `url(${Images.Theme[props.theme as ThemeType].Quiz.optionBlankShort})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 7em;
  font-weight: 700;
  color: #fff;
  text-shadow: -2px -2px 0 rgba(0, 0, 0, 0.8), 2px -2px 0 rgba(0, 0, 0, 0.8),
    -2px 2px 0 rgba(0, 0, 0, 0.8), 2px 2px 0 rgba(0, 0, 0, 0.8);
  transition: all 0.2s ease-in-out;

  .img-container {
    width: calc(100% - 40px);
    height: calc(100% - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    background-color: rgb(255, 255, 255, 0.9);
    border-radius: 20px;

    img {
      width: auto;
      height: 100%;
      filter: saturate(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`
