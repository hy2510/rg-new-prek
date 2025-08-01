import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

type CompleteTheWordProps = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}

export default function CompleteTheWord({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: CompleteTheWordProps) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Complete the Word"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
