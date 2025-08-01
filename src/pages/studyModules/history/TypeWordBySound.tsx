import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import QuizResultScreen from '@components/common/QuizResultScreen'
import PlayAudioButton from '@components/common/PlayAudioButton'
import TypingInputBox from '@components/questions/TypingInputBox'
import TypingKeyButton from '@components/options/TypingKeyButton'

type TypeWordBySoundProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: 'hello',
    options: [],
    correctAnswer: 'hello',
    quizSound: 'hello',
    questionType: 'sightwordWords',
  },
  {
    question: 'doll',
    options: [],
    correctAnswer: 'doll',
    quizSound: 'doll',
    questionType: 'sightwordWords',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Type Word By Sound',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

export default function TypeWordBySound({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: TypeWordBySoundProps) {
  // 상태 관리
  const [checkedLetters, setCheckedLetters] = useState<Set<number>>(new Set())
  const [isShaking, setIsShaking] = useState(false)
  const [isWordCompleted, setIsWordCompleted] = useState(false) // 단어 완성 상태 추적

  // 퀴즈 로직
  const {
    isCompleted,
    currentQuiz,
    currentQuestionIndex,
    handleOptionClick,
    getQuizTitle,
    getCompleteTitle,
  } = useQuizLogic(
    quizData,
    { onCorrect, onIncorrect, onComplete },
    {
      playQuestionAudio: true,
      playResultAudio: true,
    },
  )

  // 문제 변경 시 상태 초기화
  useEffect(() => {
    console.log(`📋 TypeWordBySound 문제 변경: 인덱스 ${currentQuestionIndex}`)
    console.log('🔄 상태 초기화 중...')
    setCheckedLetters(new Set())
    setIsShaking(false)
    setIsWordCompleted(false) // 완성 상태도 초기화
  }, [currentQuestionIndex])

  // 단어 완성 확인 및 처리
  useEffect(() => {
    if (!currentQuiz || isWordCompleted) return

    const word = currentQuiz.question as string
    const totalLetters = word.length

    if (checkedLetters.size === totalLetters && totalLetters > 0) {
      console.log('🎯 TypeWordBySound 단어 완성:', word)
      console.log('📝 완성된 단어 정보:', {
        입력된단어: word,
        정답: currentQuiz.correctAnswer,
        일치여부: word === currentQuiz.correctAnswer,
        체크된글자수: checkedLetters.size,
        전체글자수: totalLetters,
      })

      // 완성 상태로 설정하여 중복 처리 방지
      setIsWordCompleted(true)

      // useQuizLogic에 완성된 단어 전달 (정답 검증은 useQuizLogic에서 처리)
      setTimeout(() => {
        handleOptionClick(word)
      }, 500)
    }
  }, [checkedLetters, currentQuiz, handleOptionClick, isWordCompleted])

  // 글자 클릭 핸들러
  const handleLetterClick = useCallback(
    (clickedLetter: string) => {
      if (!currentQuiz) return

      const word = currentQuiz.question as string
      const letters = word.split('')

      // 체크되지 않은 첫 번째 글자의 인덱스 찾기
      const firstUncheckedIndex = letters.findIndex(
        (_letter: string, index: number) => !checkedLetters.has(index),
      )

      // 첫 번째 체크되지 않은 글자와 클릭된 글자가 일치하는지 확인
      if (
        firstUncheckedIndex !== -1 &&
        letters[firstUncheckedIndex].toLowerCase() ===
          clickedLetter.toLowerCase()
      ) {
        setCheckedLetters((prev) => {
          const newSet = new Set(prev)
          newSet.add(firstUncheckedIndex)
          console.log(
            `✅ 올바른 글자: ${clickedLetter} (${newSet.size}/${letters.length})`,
          )
          return newSet
        })
      } else {
        console.log(`❌ 틀린 글자: ${clickedLetter}`)
        // 잘못된 글자 입력 시 흔들림 애니메이션
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
      }
    },
    [currentQuiz, checkedLetters],
  )

  // 결과 화면 렌더링
  if (isCompleted) {
    return (
      <QuizResultScreen
        title={getCompleteTitle(QUIZ_CONFIG.BASE_TITLE)}
        theme={theme}
        themeNumber={themeNumber}
        onClose={onClose}
      />
    )
  }

  // 메인 퀴즈 화면 렌더링
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle={getQuizTitle(QUIZ_CONFIG.BASE_TITLE)}
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <PlayAudioButton
        isVisible={true}
        audioLetter={currentQuiz?.quizSound}
        questionType={currentQuiz?.questionType}
      />

      <QuizBody>
        <TypeWordBySoundContainer>
          <TypingInputBox
            word={currentQuiz.question as string}
            checkedLetters={checkedLetters}
            isShaking={isShaking}
          />
          <TypingKeyButton
            word={currentQuiz.question as string}
            onLetterClick={handleLetterClick}
            theme={theme}
          />
        </TypeWordBySoundContainer>
      </QuizBody>
    </QuizContainer>
  )
}

const TypeWordBySoundContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`
