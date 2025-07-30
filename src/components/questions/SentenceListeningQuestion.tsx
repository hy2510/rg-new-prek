import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'

interface SentenceListeningQuestionProps {
  text?: string
  className?: string
}

export default function SentenceListeningQuestion({
  text = 'Hello, I am Dodo.',
  className,
}: SentenceListeningQuestionProps) {
  return (
    <SentenceListeningQuestionContainer className={className}>
      <div className="sentence-container">
        <div className="sentence-text">
          <span>{text}</span>
        </div>
      </div>
    </SentenceListeningQuestionContainer>
  )
}

const SentenceListeningQuestionContainer = styled.div`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: start;

  .sentence-container {
    width: 800px;
    height: 280px;

    .sentence-text {
      font-size: 2.5em;
      font-weight: bold;
      color: #1a1a1a;
      background-image: url(${IMAGES.common.questionBg.long});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`
