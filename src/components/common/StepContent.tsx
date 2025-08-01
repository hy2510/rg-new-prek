import styled from 'styled-components'
import { SCREEN_CONFIG, TIMING } from '@constants/constant'

type StepContainerProps = {
  children: React.ReactNode
  currentStep: number
}

export default function StepContainer({
  children,
  currentStep,
}: StepContainerProps) {
  return <StyledStep currentStep={currentStep}>{children}</StyledStep>
}

const StyledStep = styled.div<{ currentStep: number }>`
  position: relative;
  width: calc(${SCREEN_CONFIG.BASE_WIDTH}px * ${SCREEN_CONFIG.STEP_COUNT - 1});
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
  transform: translateX(
    calc(-${SCREEN_CONFIG.BASE_WIDTH}px * ${({ currentStep }) => currentStep})
  );
  transition: transform ${TIMING.MAIN_CONTAINER.SLIDE_TRANSITION}ms ease-in-out;
`
