import styled from 'styled-components'
import ActionButton from './ActionButton'

type CompleteMarkProps = {
  handleReplay: () => void
  handleNextStep: () => void
}

export default function CompleteMark({
  handleReplay,
  handleNextStep,
}: CompleteMarkProps) {
  return (
    <CompleteMarkWrapper>
      <CompleteMarkCharacter />
      <CompleteMarkImage />
      <ActionButton
        handleReplay={handleReplay}
        handleNextStep={handleNextStep}
      />
    </CompleteMarkWrapper>
  )
}

const CompleteMarkWrapper = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 100px;
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
`

const CompleteMarkCharacter = styled.img`
  position: absolute;
  left: 50%;
  bottom: 135px;
  transform: translateX(-50%);
  width: 180px;
  height: 180px;
  z-index: 2;
`

const CompleteMarkImage = styled.img`
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  width: auto;
  height: 180px;
  z-index: 1;
`
