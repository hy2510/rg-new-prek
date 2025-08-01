import styled from 'styled-components'
import { CardItem, GamePhase } from '@hooks/useCardMatchingLogic'
import { Images } from '@utils/Assets'
import { ThemeType } from '@interfaces/IThemeType'

interface TextMatchingBoardProps {
  cards: CardItem[]
  onCardClick: (cardId: string) => void
  theme: ThemeType
}

export default function TextMatchingBoard({
  cards,
  onCardClick,
  theme,
}: TextMatchingBoardProps) {
  return (
    <TextMatchingBoardContainer>
      {cards.map((card) => (
        <Card
          key={card.id}
          isFlipped={card.isFlipped}
          isMatched={card.isMatched}
          theme={theme}
          data-flipped={card.isFlipped}
          data-matched={card.isMatched}
          onClick={() => onCardClick(card.id)}
        >
          <CardFront>
            {card.id.startsWith('front-') ? card.uppercase : card.lowercase}
          </CardFront>
          <CardBack />
        </Card>
      ))}
    </TextMatchingBoardContainer>
  )
}

const TextMatchingBoardContainer = styled.div`
  width: calc(100% - 60px);
  height: calc(100% - 60px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .showing-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 3em;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
`

const Card = styled.div<{
  isFlipped: boolean
  isMatched: boolean
  theme: ThemeType
}>`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: ${({ isMatched }) => (isMatched ? 'default' : 'pointer')};
  perspective: 1000px;
  transition: transform 0.3s ease;

  &:hover {
    transform: ${({ isMatched }) => (isMatched ? 'scale(1)' : 'scale(1.05)')};

    @media (pointer: coarse) {
      transform: scale(1);
    }
  }

  &:active {
    transform: ${({ isMatched }) => (isMatched ? 'scale(1)' : 'scale(0.95)')};
  }
`

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-image: url(${Images.Theme.Baro.Quiz.optionCardFront});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6em;
  font-weight: bold;
  color: #333;
  transform: ${({}) => 'rotateY(0deg)'};
  transition: transform 0.6s ease-in-out;

  ${Card}[data-flipped="false"] & {
    transform: rotateY(180deg);
  }

  ${Card}[data-matched="true"] & {
    color: #ea5044;
  }
`

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-image: url(${Images.Theme.Baro.Quiz.optionCardBack});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 15px;
  transform: rotateY(180deg);
  transition: transform 0.6s ease-in-out;

  ${Card}[data-flipped="false"] & {
    transform: rotateY(0deg);
  }
`
