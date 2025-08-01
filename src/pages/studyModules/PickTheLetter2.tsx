import { ThemeType } from '@interfaces/IThemeType'
import { Images } from '@utils/Assets'

import QuizContainer, { QuizBody } from '@components/common/QuizContainer'

type PickTheLetter2Props = {
  theme?: ThemeType
  themeNumber?: number
  onCorrect?: () => void
  onIncorrect?: () => void
}
export default function PickTheLetter2({
  theme = 'Baro',
  themeNumber = 1,
  onCorrect,
  onIncorrect,
}: PickTheLetter2Props) {
  return (
    <QuizContainer
      bgImage={Images.Theme[theme].Quiz.quizBg}
      quizTitle="Pick the Letter"
      theme={theme}
      themeNumber={themeNumber}
      showThemeInfo={true}
    >
      <QuizBody></QuizBody>
    </QuizContainer>
  )
}
