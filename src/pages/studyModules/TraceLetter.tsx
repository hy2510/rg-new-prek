import { ThemeType, ThemeNumber } from '@utils/SoundManager'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { IMAGES } from '@utils/ImageManager'
import TracingQuestion from '@components/questions/TracingQuestion'

// 글자 트레이싱 모듈의 props 타입 정의
type TraceLetterProps = {
  onCorrect?: () => void
  onIncorrect?: () => void
  theme?: ThemeType
  themeNumber?: ThemeNumber
}

export default function TraceLetter({
  onCorrect,
  onIncorrect,
  theme = 'baro',
  themeNumber = 1,
}: TraceLetterProps) {
  return (
    <QuizContainer
      bgImage={IMAGES.theme[theme].quiz.background.quizBg}
      quizTitle="Trace Letter"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody>
        <TracingQuestion />
      </QuizBody>
    </QuizContainer>
  )
}
