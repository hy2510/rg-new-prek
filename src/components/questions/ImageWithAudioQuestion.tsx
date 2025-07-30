import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'

export default function ImageWithAudioQuestion({
  imageSrc,
}: {
  imageSrc: string
}) {
  return (
    <ImageWithAudioQuestionContainer>
      <div className="image-container">
        <div className="image-wrapper">
          <img src={imageSrc} alt="image" />
        </div>
      </div>
    </ImageWithAudioQuestionContainer>
  )
}

const ImageWithAudioQuestionContainer = styled.div`
  background-image: url(${IMAGES.theme.baro.quiz.options.resShelfLong});
  background-size: calc(100% - 40px);
  background-position: top calc(100% + 20px) center;
  background-repeat: no-repeat;
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: start;

  .image-container {
    width: 450px;
    height: 280px;

    .image-wrapper {
      color: white;
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
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        object-fit: contain;
      }
    }
  }
`
