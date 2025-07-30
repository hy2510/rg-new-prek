import { useMemo } from 'react'
import styled from 'styled-components'

interface LargeImageOptionsProps {
  options: string[]
  onOptionClick: (option: string) => void
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

export default function LargeImageOptions({
  options,
  onOptionClick,
}: LargeImageOptionsProps) {
  // 옵션들을 랜덤하게 섞어서 메모이제이션
  const shuffledOptions = useMemo(() => shuffleArray(options), [options])

  return (
    <LargeImageOptionsContainer>
      {shuffledOptions.map((option) => (
        <LargeImageOption key={option} onClick={() => onOptionClick(option)}>
          <div className="img-container">
            <img src={option} alt="" />
          </div>
        </LargeImageOption>
      ))}
    </LargeImageOptionsContainer>
  )
}

const LargeImageOptionsContainer = styled.div`
  min-height: 200px;
  display: flex;
  gap: 20px;
`
const LargeImageOption = styled.div`
  cursor: pointer;
  width: 330px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  .img-container {
    width: 340px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      filter: saturate(1.1);
      border-radius: 20px;
      border: 4px solid #ffffff;
    }
  }

  &:active {
    transform: scale(0.95);
  }
`
