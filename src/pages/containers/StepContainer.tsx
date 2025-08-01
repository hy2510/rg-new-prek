import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Images } from '@utils/Assets'

import { SCREEN_CONFIG, TIMING } from '@constants/constant'
import { ThemeType } from '@interfaces/IThemeType'
import CompleteMark from '@components/common/CompleteMark'

type StepContainerProps = {
  theme: ThemeType
  themeNumber: number
  stepNumber: number
  completedSteps: number[]
  handleReplay: () => void
  handleNextStep: () => void
  handleStartStudy: () => void
}

export default function StepContainer({
  theme,
  themeNumber,
  stepNumber,
  completedSteps,
  handleReplay,
  handleNextStep,
  handleStartStudy,
}: StepContainerProps) {
  const getStepImage = useMemo(() => {
    let themeKey: 'Theme01' | 'Theme02' | 'Theme03'
    if (themeNumber === 1) {
      themeKey = 'Theme01'
    } else if (themeNumber === 2) {
      themeKey = 'Theme02'
    } else {
      themeKey = 'Theme03'
    }
    const stepImages = Images.Theme[theme][themeKey]

    switch (stepNumber) {
      case 0:
        return stepImages.stepMovie
      case 1:
        return stepImages.step1
      case 2:
        return stepImages.step2
      case 3:
        return stepImages.step3
      case 4:
        return stepImages.step4
      case 5:
        return stepImages.step5
      default:
        return stepImages.stepMovie
    }
  }, [stepNumber, theme, themeNumber])

  return (
    <StyledStepContentContainer currentStep={stepNumber}>
      {Array.from({ length: SCREEN_CONFIG.STEP_COUNT }, (_, i) => (
        <StepContentWrapper stepNumber={i}>
          <StepContentContainer>
            <div className="step-number">
              {stepNumber > 0 ? `Step ${stepNumber}` : 'Movie'}
              {completedSteps.includes(stepNumber) && (
                <img
                  src={Images.Common.CompleteMark.completeMarkCheck}
                  alt="complete-mark-check"
                  className="complete-mark-check"
                />
              )}
            </div>
            <StepImage
              src={getStepImage}
              alt={`step-${stepNumber}`}
              onClick={handleStartStudy}
              isCompleted={completedSteps.includes(stepNumber)}
            />
            {completedSteps.includes(stepNumber) && (
              <CompleteMark
                handleReplay={handleReplay}
                handleNextStep={handleNextStep}
              />
            )}
          </StepContentContainer>
        </StepContentWrapper>
      ))}
    </StyledStepContentContainer>
  )
}

const StyledStepContentContainer = styled.div<{ currentStep: number }>`
  position: relative;
  width: calc(${SCREEN_CONFIG.BASE_WIDTH}px * ${SCREEN_CONFIG.STEP_COUNT - 1});
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
  transform: translateX(
    calc(-${SCREEN_CONFIG.BASE_WIDTH}px * ${({ currentStep }) => currentStep})
  );
  transition: transform ${TIMING.MAIN_CONTAINER.SLIDE_TRANSITION}ms ease-in-out;
`

const StepContentWrapper = styled.div<{ stepNumber: number }>`
  position: absolute;
  top: 0;
  left: calc(${SCREEN_CONFIG.BASE_WIDTH}px * ${({ stepNumber }) => stepNumber});
  width: ${SCREEN_CONFIG.BASE_WIDTH}px;
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
`

const StepContentContainer = styled.div`
  position: absolute;
  top: 80px;
  right: 100px;
  width: 450px;
  height: 360px;
  cursor: pointer;
  z-index: 10;
  animation: floating ${TIMING.MAIN_CONTAINER.FLOATING_DURATION}ms ease-in-out
    infinite;

  .step-number {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    font-size: 24px;
    font-weight: bold;
    background-color: #1a1a1a;
    color: #fff;
    font-size: 1em;
    padding: 10px 20px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .complete-mark-check {
      width: auto;
      height: 20px;
    }
  }

  @keyframes floating {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(10px);
    }
  }
`

const StepImage = styled.img<{ isCompleted: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: ${({ isCompleted }) => (isCompleted ? 'grayscale(50%)' : 'none')};
  opacity: ${({ isCompleted }) => (isCompleted ? 0.5 : 1)};
`
