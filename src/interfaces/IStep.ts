type IStudyModules =
  | 'Movie'
  | 'ABCPictureMatch'
  | 'ABCTracing'
  | 'CompleteTheWord'
  | 'FillTheWord1'
  | 'FillTheWord2'
  | 'FindTheMatch'
  | 'LetterPairs'
  | 'ListenAndMatch'
  | 'MakeSentence'
  | 'MatchTheMeaning1'
  | 'MatchTheMeaning2'
  | 'MatchTheSound1'
  | 'MatchTheSound2'
  | 'PictureMatch'
  | 'PickTheLetter1'
  | 'PickTheLetter2'
  | 'PickTheSound'
  | 'RhymeMatch1'
  | 'RhymeMatch2'
  | 'SpeakAndCheck'
  | 'WordMatch'

//매핑 테이블
const STUDY_MODULE_MAP: Record<string, Record<number, IStudyModules>> = {
  alphabet_1: {
    1: 'ABCTracing',
    2: 'PickTheLetter1',
    3: 'LetterPairs',
    4: 'PickTheLetter2',
    5: 'ABCPictureMatch',
  },
  alphabet_2: {
    1: 'ABCTracing',
    2: 'PickTheLetter1',
    3: 'FindTheMatch',
    4: 'PickTheLetter2',
    5: 'ABCPictureMatch',
  },
  phonics1_1: {
    1: 'FillTheWord1',
    2: 'FillTheWord2',
    3: 'WordMatch',
    4: 'RhymeMatch1',
    5: 'RhymeMatch2',
  },
  phonics1_2: {
    1: 'FillTheWord1',
    2: 'PickTheSound',
    3: 'PictureMatch',
    4: 'RhymeMatch1',
    5: 'RhymeMatch2',
  },
  phonics2_1: {
    1: 'FillTheWord1',
    2: 'FillTheWord2',
    3: 'WordMatch',
    4: 'MatchTheSound1',
    5: 'MatchTheSound2',
  },
  phonics2_2: {
    1: 'FillTheWord1',
    2: 'PickTheSound',
    3: 'PictureMatch',
    4: 'MatchTheSound1',
    5: 'MatchTheSound2',
  },
  sightWords1_1: {
    1: 'SpeakAndCheck',
    2: 'ListenAndMatch',
    3: 'WordMatch',
    4: 'MatchTheMeaning1',
    5: 'MakeSentence',
  },
  sightWords1_2: {
    1: 'SpeakAndCheck',
    2: 'ListenAndMatch',
    3: 'WordMatch',
    4: 'MatchTheMeaning2',
    5: 'MakeSentence',
  },
  sightWords2_1: {
    1: 'SpeakAndCheck',
    2: 'ListenAndMatch',
    3: 'WordMatch',
    4: 'MatchTheMeaning1',
    5: 'MakeSentence',
  },
  sightWords2_2: {
    1: 'SpeakAndCheck',
    2: 'CompleteTheWord',
    3: 'WordMatch',
    4: 'MatchTheMeaning2',
    5: 'MakeSentence',
  },
}

// studyType과 stepNumber에 따른 studyModule을 반환하는 함수
const getStudyModule = (
  studyType: string,
  stepNumber: number,
): IStudyModules => {
  return STUDY_MODULE_MAP[studyType]?.[stepNumber] || 'Movie'
}

export type { IStudyModules }
export { STUDY_MODULE_MAP, getStudyModule }
