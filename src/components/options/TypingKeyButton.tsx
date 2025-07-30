import { IMAGES } from '@utils/ImageManager'
import { ThemeType } from '@utils/SoundManager'
import styled from 'styled-components'
import { useMemo } from 'react'

interface TypingKeyButtonProps {
  word?: string | string[]
  onLetterClick?: (letter: string) => void
  theme?: ThemeType // 테마 타입 추가
}

export default function TypingKeyButton({
  word = '',
  onLetterClick,
  theme = 'baro', // 기본값 설정
}: TypingKeyButtonProps) {
  const letters = useMemo(() => {
    // word를 문자열로 변환하고 중복 제거
    const wordString = Array.isArray(word) ? word.join('') : String(word)
    const uniqueLetters = [...new Set(wordString.split(''))]

    // 알파벳 배열 생성 (a-z)
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

    // 결과 배열 초기화
    const result: string[] = []

    // 1. word에서 중복 없는 글자들을 먼저 추가
    result.push(...uniqueLetters)

    // 2. 6개가 되도록 알파벳에서 랜덤으로 추가
    while (result.length < 6) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
      if (!result.includes(randomLetter)) {
        result.push(randomLetter)
      }
    }

    // 3. 배열을 섞기
    return result.sort(() => Math.random() - 0.5)
  }, [word])

  return (
    <TypingKeyButtonContainer>
      {letters.map((letter, index) => (
        <TypingKeyButtonItem
          key={index}
          $theme={theme}
          onClick={() => onLetterClick?.(letter)}
        >
          {letter}
        </TypingKeyButtonItem>
      ))}
    </TypingKeyButtonContainer>
  )
}

const TypingKeyButtonContainer = styled.div`
  min-height: 150px;
  display: flex;
  gap: 10px;
`

const TypingKeyButtonItem = styled.div<{ $theme: ThemeType }>`
  cursor: pointer;
  height: 150px;
  width: 150px;
  background-image: ${(props) =>
    `url(${IMAGES.theme[props.$theme].quiz.options.optionBlankKey})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  font-weight: 700;
  color: #fff;
  text-shadow: -2px -2px 0 rgba(0, 0, 0, 0.8), 2px -2px 0 rgba(0, 0, 0, 0.8),
    -2px 2px 0 rgba(0, 0, 0, 0.8), 2px 2px 0 rgba(0, 0, 0, 0.8);
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.95);
  }
`
