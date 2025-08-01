import styled from 'styled-components'
import { Images } from '@utils/Assets'

type ActionButtonProps = {
  handleReplay: () => void
  handleNextStep: () => void
}

export default function ActionButton({
  handleReplay,
  handleNextStep,
}: ActionButtonProps) {
  return (
    <ActionButtonsWrapper>
      <ReplayButton onClick={handleReplay} />
      <NextButton onClick={handleNextStep} />
    </ActionButtonsWrapper>
  )
}

const ActionButtonsWrapper = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const ReplayButton = styled.button`
  width: 120px;
  height: 80px;
  background-color: transparent;
  background-image: url(${Images.Common.Button.btnTryAgain});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`

const NextButton = styled.button`
  width: 180px;
  height: 80px;
  background-color: transparent;
  background-image: url(${Images.Common.Button.btnNext});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`
