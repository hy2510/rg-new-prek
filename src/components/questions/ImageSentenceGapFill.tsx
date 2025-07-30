import { IMAGES } from '@utils/ImageManager'
import styled, { css } from 'styled-components'

interface ImageSentenceGapFillProps {
  imageUrl?: string
  containerBgImage?: string
}

export default function ImageSentenceGapFill({
  imageUrl = 'https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/whatsyourname.png',
  containerBgImage = IMAGES.theme.baro.quiz.options.resShelfShort,
}: ImageSentenceGapFillProps) {
  return (
    <ImageSentenceGapFillContainer $bgImage={containerBgImage}>
      <ImageSentenceGapFillImage
        $imageUrl={`https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/${imageUrl}.png`}
      />
    </ImageSentenceGapFillContainer>
  )
}

interface GapFillProps {
  items?: string[]
}

export function GapFill({ items = ['', 'I am', ''] }: GapFillProps) {
  const firstUnfilledIndex = items.findIndex((item) => !item)

  return (
    <GapFillContainer>
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className={`gap-fill-item ${item ? 'filled' : ''} ${
              !item && index === firstUnfilledIndex ? 'ani' : ''
            }`}
          >
            {item ? item : index + 1}
          </div>
        )
      })}
    </GapFillContainer>
  )
}

const ImageSentenceGapFillContainer = styled.div<{ $bgImage: string }>`
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
  position: relative;
`

const ImageSentenceGapFillImage = styled.div<{ $imageUrl: string }>`
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

const GapFillContainer = styled.div`
  width: calc(100% - 40px);
  height: 100px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  padding: 0 20px;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  .gap-fill-item {
    width: calc(100% - 10px);
    height: 100%;
    border: 3px dotted rgb(255, 255, 255, 0.85);
    border-radius: 20px;
    background-color: rgb(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: rgb(0, 0, 0, 0.25);
    font-size: 1.8em;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &.filled {
      background-color: #fff;
      color: #000;
      font-size: 2.5em;
    }

    &.ani {
      animation: float 2s ease-in-out infinite;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }
`
