import { ThemeType } from '@interfaces/IThemeType'
import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import { Images } from '@utils/Assets'
import TracingQuestion from '@components/questions/TracingQuestion'

// 글자 트레이싱 모듈의 props 타입 정의
type TraceLetterProps = {
  onCorrect?: () => void
  onIncorrect?: () => void
  theme?: ThemeType
  themeNumber?: number
}

export default function TraceLetter({
  onCorrect,
  onIncorrect,
  theme = 'Baro',
  themeNumber = 1,
}: TraceLetterProps) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
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
