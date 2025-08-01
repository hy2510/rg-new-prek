import React from 'react'
import styled from 'styled-components'
import { ThemeType } from '@interfaces/IThemeType'

interface QuizContainerProps {
  bgImage: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  quizTitle?: string
  theme?: ThemeType
  themeNumber?: number
  showThemeInfo?: boolean
}

interface QuizBodyProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const StyledQuizContainer = styled.div<QuizContainerProps>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
`

const QuizBody = styled.div<QuizBodyProps>`
  width: calc(100% - 180px);
  height: calc(100% - 140px);
  padding: 80px 90px 60px 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* gap: 20px; */
`

const ThemeInfo = styled.div`
  text-align: center;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 10px;
  font-weight: bold;
  font-size: 0.8em;
  opacity: 0.25;
`

const QuizContainer: React.FC<QuizContainerProps> = ({
  bgImage,
  children,
  className,
  style,
  quizTitle,
  theme,
  themeNumber,
  showThemeInfo = false,
}) => {
  return (
    <StyledQuizContainer bgImage={bgImage} className={className} style={style}>
      {children}
      {showThemeInfo && theme && (
        <ThemeInfo>
          {quizTitle} - {theme.toUpperCase()} {themeNumber}
        </ThemeInfo>
      )}
    </StyledQuizContainer>
  )
}

export { QuizBody }
export default QuizContainer
