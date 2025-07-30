import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'

interface ImageShortTextGapFillProps {
  word?: string | string[]
  imageSrc?: string
  imageAlt?: string
}

export default function ImageShortTextGapFill({
  word = '',
  imageSrc = 'https://wcfresource.a1edu.com/newsystem/image/dodoabc/phonics1/words/can.png',
  imageAlt = '',
}: ImageShortTextGapFillProps) {
  return (
    <ImageShortTextGapFillContainer>
      <div className="quiz-image-container">
        <div className="quiz-image">
          <img src={imageSrc} alt={imageAlt} />
        </div>
      </div>
      <div className="fill-in-the-blank-word-container">
        <div className="fill-in-the-blank-word">
          {Array.isArray(word) ? (
            word.map((item, index) =>
              item === '' ? (
                <div key={index} className="blank" />
              ) : (
                item.split('').map((letter, letterIndex) => (
                  <div key={`${index}-${letterIndex}`} className="letter">
                    {letter}
                  </div>
                ))
              ),
            )
          ) : word === '' ? (
            <div className="blank" />
          ) : (
            word.split('').map((letter, index) => (
              <div key={index} className="letter">
                {letter}
              </div>
            ))
          )}
        </div>
      </div>
    </ImageShortTextGapFillContainer>
  )
}

const ImageShortTextGapFillContainer = styled.div`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: start;

  .quiz-image-container {
    width: 450px;
    height: 280px;
    margin-left: auto;

    .quiz-image {
      background-image: url(${IMAGES.common.questionBg.short});
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: fit-content;
        height: calc(100% - 40px);
        object-fit: contain;
      }
    }
  }

  .fill-in-the-blank-word-container {
    width: calc(100% - 100px);
    height: 100%;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .fill-in-the-blank-word {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 5px;
      margin-bottom: 50px;

      .blank {
        width: 120px;
        height: 120px;
        background-color: rgb(255, 255, 255, 0.85);
        border-radius: 20px;
        border: 1px solid rgb(0, 0, 0, 0.2);
      }

      .letter {
        color: #333;
        font-size: 6em;
        font-weight: bold;
      }
    }
  }
`
