import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'
import TracingQuestion from '@components/questions/TracingQuestion'

// 글자 트레이싱 모듈의 props 타입 정의
type ABCTracingProps = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}

export default function ABCTracing({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: ABCTracingProps) {
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
