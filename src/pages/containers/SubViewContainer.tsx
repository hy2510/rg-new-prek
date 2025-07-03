import { useMemo } from 'react'
import styled from 'styled-components'

import { IStudyModules } from '@interfaces/IStep'

import AiSpeakPractice from '@pages/studyModules/AiSpeakPractice'
import ChooseImageByLetter from '@pages/studyModules/ChooseImageByLetter'
import ChooseImageBySentence from '@pages/studyModules/ChooseImageBySentence'
import ChooseLetterBySound from '@pages/studyModules/ChooseLetterBySound'
import ChooseWordBySound from '@pages/studyModules/ChooseWordBySound'
import ChooseWordOrSentenceByImage from '@pages/studyModules/ChooseWordOrSentenceByImage'
import CompleteWordByPhoneme from '@pages/studyModules/CompleteWordByPhoneme'
import MatchImageAndWord from '@pages/studyModules/MatchImageAndWord'
import MatchLetter1 from '@pages/studyModules/MatchLetter1'
import MatchLetter2 from '@pages/studyModules/MatchLetter2'
import MatchWordAndImage from '@pages/studyModules/MatchWordAndImage'
import Movie from '@pages/studyModules/Movie'
import OrderPhrasesByImage from '@pages/studyModules/OrderPhrasesByImage'
import TraceLetter from '@pages/studyModules/TraceLetter'
import TypeWordBySound from '@pages/studyModules/TypeWordBySound'

type ISubContainerProps = {
  studyModule: IStudyModules
  handleCloseStudyModal: () => void
}

export default function SubViewContainer({
  studyModule,
  handleCloseStudyModal,
}: ISubContainerProps) {
  const PageRouter = useMemo(() => {
    return {
      Movie: <Movie />,
      AiSpeakPractice: <AiSpeakPractice />,
      ChooseImageByLetter: <ChooseImageByLetter />,
      ChooseImageBySentence: <ChooseImageBySentence />,
      ChooseLetterBySound: <ChooseLetterBySound />,
      ChooseWordBySound: <ChooseWordBySound />,
      ChooseWordOrSentenceByImage: <ChooseWordOrSentenceByImage />,
      CompleteWordByPhoneme: <CompleteWordByPhoneme />,
      MatchImageAndWord: <MatchImageAndWord />,
      MatchLetter1: <MatchLetter1 />,
      MatchLetter2: <MatchLetter2 />,
      MatchWordAndImage: <MatchWordAndImage />,
      OrderPhrasesByImage: <OrderPhrasesByImage />,
      TraceLetter: <TraceLetter />,
      TypeWordBySound: <TypeWordBySound />,
    } satisfies Record<IStudyModules, JSX.Element>
  }, [])

  return (
    <Wrapper>
      <Content>{PageRouter[studyModule]}</Content>

      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '100px',
          height: '50px',
        }}
        onClick={handleCloseStudyModal}
      >
        닫기
      </button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
`
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 80%;
  box-sizing: border-box;
  color: white;
`
