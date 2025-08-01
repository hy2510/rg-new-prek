import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

type LetterPairsProps = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}

export default function LetterPairs({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: LetterPairsProps) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Letter Pairs"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
