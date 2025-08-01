import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'
import { QuizCallbacks, useQuizLogic } from '@hooks/useQuizLogic'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import QuizResultScreen from '@components/common/QuizResultScreen'

// 퀴즈 설정
const QUIZ_CONFIG = {
  BASE_TITLE: 'ABCPictureMatch',
  COMPLETE_MESSAGE: 'Great Job!',
} as const

type ABCPictureMatchProps = QuizCallbacks & {
  theme?: ThemeType
  themeNumber?: number
  onClose?: () => void
}

export default function ABCPictureMatch({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
  onComplete,
  onClose,
}: ABCPictureMatchProps) {
  // const {
  //   isCompleted,
  //   currentQuiz,
  //   handleOptionClick,
  //   getQuizTitle,
  //   getCompleteTitle,
  // } = useQuizLogic(
  //   quizData,
  //   { onCorrect, onIncorrect, onComplete },
  //   {
  //     playQuestionAudio: true,
  //     playResultAudio: true,
  //   },
  // )

  // // 결과 화면 렌더링
  // if (isCompleted) {
  //   return (
  //     <QuizResultScreen
  //       title={getCompleteTitle(QUIZ_CONFIG.BASE_TITLE)}
  //       theme={theme}
  //       themeNumber={themeNumber}
  //       onClose={onClose}
  //     />
  //   )
  // }

  // 일반 화면 렌더링
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Ai Speak Practice"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
