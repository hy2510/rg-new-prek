import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

type MatchTheSound2Props = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}

export default function MatchTheSound2({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: MatchTheSound2Props) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Match the Sound"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
