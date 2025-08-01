import styled from 'styled-components'
import { SCREEN_CONFIG } from '@constants/constant'

interface ScaledContainerProps {
  children: React.ReactNode
  scale: number
}

export default function ScaledContainer({
  children,
  scale,
}: ScaledContainerProps) {
  return <StyledScaledContainer scale={scale}>{children}</StyledScaledContainer>
}

const StyledScaledContainer = styled.div<{ scale: number }>`
  position: relative;
  width: ${SCREEN_CONFIG.BASE_WIDTH}px;
  height: ${SCREEN_CONFIG.BASE_HEIGHT}px;
  transform: scale(${({ scale }) => scale});
  transform-origin: center;
  overflow: hidden;
`
