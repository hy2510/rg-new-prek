import { IMAGES } from '@utils/ImageManager'
import styled from 'styled-components'

interface WideImageAudioQuestionProps {
  imageUrl?: string
  containerBgImage?: string
}

export default function WideImageAudioQuestion({
  imageUrl = 'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/whatsyourname.png',
  containerBgImage = IMAGES.theme.baro.quiz.options.resShelfShort,
}: WideImageAudioQuestionProps) {
  return (
    <WideImageAudioQuestionContainer $bgImage={containerBgImage}>
      <WideImageAudioQuestionImage
        $imageUrl={imageUrl}
      ></WideImageAudioQuestionImage>
    </WideImageAudioQuestionContainer>
  )
}

const WideImageAudioQuestionContainer = styled.div<{ $bgImage: string }>`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(${({ $bgImage }) => $bgImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom 5px center;
`

const WideImageAudioQuestionImage = styled.div<{ $imageUrl: string }>`
  width: calc(100% - 150px);
  height: calc(100% - 180px);
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 3px solid #fff;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
`
