import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'
import { useState } from 'react'

interface TypingInputBoxProps {
  word?: string | string[]
  onLetterCheck?: (index: number) => void
  checkedLetters?: Set<number>
  isShaking?: boolean
}

export default function TypingInputBox({
  word = '',
  onLetterCheck,
  checkedLetters = new Set(),
  isShaking = false,
}: TypingInputBoxProps) {
  const wordString = Array.isArray(word) ? word.join('') : String(word)
  const letters = wordString.split('')

  // 체크되지 않은 첫 번째 글자의 인덱스 찾기
  const firstUncheckedIndex = letters.findIndex(
    (_, index) => !checkedLetters.has(index),
  )

  return (
    <TypingInputBoxContainer $isShaking={isShaking}>
      <div className="letter-container">
        <div className="letter-text">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`letter ${
                checkedLetters.has(index) ? 'checked' : ''
              } ${
                !checkedLetters.has(index) && index === firstUncheckedIndex
                  ? 'cursor'
                  : ''
              }`}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </TypingInputBoxContainer>
  )
}

const TypingInputBoxContainer = styled.div<{ $isShaking: boolean }>`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: start;
  animation: ${({ $isShaking }) =>
    $isShaking ? 'shake 0.5s ease-in-out' : 'none'};

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-10px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(10px);
    }
  }

  .letter-container {
    width: 450px;
    height: 280px;

    .letter-text {
      font-size: 5em;
      font-weight: bold;
      color: rgba(26, 26, 26, 0.25);
      background-image: url(${IMAGES.common.questionBg.short});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 15px;
      gap: 8px;

      .letter {
        display: inline-block;
        transition: all 0.3s ease;
        position: relative;

        &.checked {
          color: rgba(26, 26, 26, 1);
        }

        &.cursor::after {
          content: '';
          display: block;
          width: 100%;
          height: 5px;
          background-color: rgba(26, 26, 26, 1);
          position: absolute;
          bottom: 5px;
          left: 0;
          border-radius: 10px;
          animation: blink 1.5s infinite;
        }
      }
    }
  }
`
