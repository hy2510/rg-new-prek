import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'
import { useCardMatchingLogic } from '@hooks/useCardMatchingLogic'
import { QuizCallbacks } from '@hooks/useQuizLogic'
import TextMatchingBoard from '@components/questions/TextMatchingBoard'
import QuizResultScreen from '@components/common/QuizResultScreen'

// 1. Props 타입 정의 (QuizCallbacks 확장)
type MatchLetter2Props = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
}

// 카드 매칭 데이터 (대문자-소문자 쌍)
const cardPairs = [
  { uppercase: 'A', lowercase: 'a' },
  { uppercase: 'B', lowercase: 'b' },
  { uppercase: 'C', lowercase: 'c' },
]

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'Match Letter 2',
} as const

export default function MatchLetter2({
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
  theme = 'Baro',
  themeNumber = 1,
}: MatchLetter2Props) {
  const { cards, handleCardClick, isCompleted } = useCardMatchingLogic(
    cardPairs,
    {
      onCorrect: () => {
        console.log('🎯 MatchLetter2 onCorrect 호출됨')
        onCorrect?.()
      },
      onIncorrect: () => {
        console.log('❌ MatchLetter2 onIncorrect 호출됨')
        onIncorrect?.()
      },
      onComplete: () => {
        console.log('🎉 MatchLetter2 onComplete 호출됨!')
        onComplete?.()
      },
    },
  )

  // 결과 화면 렌더링
  if (isCompleted) {
    return (
      <QuizResultScreen
        theme={theme}
        themeNumber={themeNumber}
        onClose={onClose}
      />
    )
  }

  // 카드 매칭 게임 화면 렌더링
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle={QUIZ_CONFIG.BASE_TITLE}
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody>
        <TextMatchingBoard
          cards={cards}
          onCardClick={handleCardClick}
          theme={theme}
        />
      </QuizBody>
    </QuizContainer>
  )
}
