import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'
import { useQuizLogic, QuizItem, QuizCallbacks } from '@hooks/useQuizLogic'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import QuizResultScreen from '@components/common/QuizResultScreen'
import PlayAudioButton from '@components/common/PlayAudioButton'
import ImageSentenceGapFill, {
  GapFill,
} from '@components/questions/ImageSentenceGapFill'
import LongTextOptions from '@components/options/LongTextOptions'

type OrderPhrasesByImageProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 퀴즈 데이터
const quizData: QuizItem[] = [
  {
    question: ['', 'I am', ''],
    options: ['Hello', 'Dodo'],
    correctAnswer: 'Hello, I am Dodo.',
    quizSound: 'helloiamdodo',
    questionImage: 'helloiamdodo',
    questionType: 'sightwordWords',
  },
  {
    question: ['', '', 'the sky'],
    options: ['Look', 'at'],
    correctAnswer: 'Look at the sky',
    quizSound: 'lookatthesky',
    questionImage: 'lookatthesky',
    questionType: 'sightwordWords',
  },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Order Phrases By Image',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

// 메인 컴포넌트
export default function OrderPhrasesByImage({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: OrderPhrasesByImageProps) {
  // 상태 관리
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentGapFillItems, setCurrentGapFillItems] = useState<string[]>([])

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
    {
      onCorrect,
      onIncorrect: () => {
        console.log('❌ OrderPhrases 오답! 상태 초기화')
        setSelectedOptions([])
        if (currentQuiz) {
          setCurrentGapFillItems(currentQuiz.question as string[])
        }
        onIncorrect?.()
      },
      onComplete,
    },
    {
      playQuestionAudio: true,
      playResultAudio: true,
    },
  )

  // 문제 변경 시 상태 초기화
  useEffect(() => {
    console.log(`📋 OrderPhrases 문제 변경: 인덱스 ${currentQuestionIndex}`)
    if (currentQuiz) {
      setSelectedOptions([])
      setCurrentGapFillItems(currentQuiz.question as string[])
    }
  }, [currentQuestionIndex, currentQuiz])

  // 옵션 클릭 핸들러
  const handleLongTextOptionClick = useCallback(
    (option: string) => {
      if (isCompleted) return

      const newSelected = [...selectedOptions, option]
      setSelectedOptions(newSelected)

      // GapFill 업데이트: 빈 칸을 클릭된 순서대로 채움
      const questionTemplate = currentQuiz.question as string[]
      const updatedGapFill = [...questionTemplate]
      let emptySlotIndex = 0

      for (let i = 0; i < updatedGapFill.length; i++) {
        if (updatedGapFill[i] === '') {
          if (emptySlotIndex < newSelected.length) {
            updatedGapFill[i] = newSelected[emptySlotIndex]
            emptySlotIndex++
          }
        }
      }

      setCurrentGapFillItems(updatedGapFill)

      // 모든 옵션이 선택되었으면 useQuizLogic에 정답 전달
      const totalOptions = currentQuiz.options as string[]
      if (newSelected.length === totalOptions.length) {
        const userAnswer = newSelected.join(' ')
        console.log('🎯 OrderPhrases 완성된 답안:', userAnswer)
        handleOptionClick(userAnswer)
      }
    },
    [selectedOptions, currentQuiz, isCompleted, handleOptionClick],
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

  // 일반 퀴즈 화면 렌더링
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
        <OrderPhrasesByImageContainer>
          <div className="row1">
            <ImageSentenceGapFill
              imageUrl={currentQuiz?.questionImage}
              containerBgImage={Images.Theme[theme].Quiz.resShelfShort}
            />
            <LongTextOptions
              options={currentQuiz.options as string[]}
              onOptionClick={handleLongTextOptionClick}
              disabledOptions={selectedOptions}
              theme={theme}
            />
          </div>
          <div className="row2">
            <GapFill items={currentGapFillItems} />
          </div>
        </OrderPhrasesByImageContainer>
      </QuizBody>
    </QuizContainer>
  )
}

const OrderPhrasesByImageContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 120px;

  .row1 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    align-items: center;
  }

  .row2 {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
  }
`
