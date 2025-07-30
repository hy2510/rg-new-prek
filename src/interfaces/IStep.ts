type IStep =
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'reward'

type IStudyModules =
  | 'Movie'
  | 'AiSpeakPractice'
  | 'ChooseImageByLetter'
  | 'ChooseImageBySentence'
  | 'ChooseLetterBySound'
  | 'ChooseWordBySound'
  | 'ChooseWordOrSentenceByImage'
  | 'CompleteWordByPhoneme'
  | 'MatchImageAndWord'
  | 'MatchLetter1'
  | 'MatchLetter2'
  | 'MatchWordAndImage'
  | 'OrderPhrasesByImage'
  | 'TraceLetter'
  | 'TypeWordBySound'

//매핑 테이블
const STUDY_MODULE_MAP: Record<string, Record<number, IStudyModules>> = {
  alphabet_1: {
    1: 'TraceLetter',
    2: 'ChooseLetterBySound',
    3: 'MatchLetter1',
    4: 'ChooseLetterBySound',
    5: 'ChooseImageByLetter',
  },
  alphabet_2: {
    1: 'TraceLetter',
    2: 'ChooseLetterBySound',
    3: 'MatchLetter2',
    4: 'ChooseLetterBySound',
    5: 'ChooseImageByLetter',
  },
  phonics1_1: {
    1: 'CompleteWordByPhoneme',
    2: 'CompleteWordByPhoneme',
    3: 'MatchImageAndWord',
    4: 'ChooseImageByLetter',
    5: 'ChooseImageByLetter',
  },
  phonics1_2: {
    1: 'CompleteWordByPhoneme',
    2: 'MatchImageAndWord',
    3: 'MatchWordAndImage',
    4: 'ChooseImageByLetter',
    5: 'ChooseImageByLetter',
  },
  phonics2_1: {
    1: 'CompleteWordByPhoneme',
    2: 'MatchImageAndWord',
    3: 'MatchWordAndImage',
    4: 'ChooseImageByLetter',
    5: 'ChooseImageByLetter',
  },
  phonics2_2: {
    1: 'CompleteWordByPhoneme',
    2: 'CompleteWordByPhoneme',
    3: 'MatchImageAndWord',
    4: 'ChooseImageByLetter',
    5: 'ChooseImageByLetter',
  },
  sightWords1_1: {
    1: 'AiSpeakPractice',
    2: 'ChooseWordBySound',
    3: 'MatchImageAndWord',
    4: 'ChooseImageBySentence',
    5: 'OrderPhrasesByImage',
  },
  sightWords1_2: {
    1: 'AiSpeakPractice',
    2: 'ChooseWordBySound',
    3: 'MatchImageAndWord',
    4: 'ChooseWordOrSentenceByImage',
    5: 'OrderPhrasesByImage',
  },
  sightWords2_1: {
    1: 'AiSpeakPractice',
    2: 'ChooseWordBySound',
    3: 'MatchImageAndWord',
    4: 'ChooseImageBySentence',
    5: 'OrderPhrasesByImage',
  },
  sightWords2_2: {
    1: 'AiSpeakPractice',
    2: 'TypeWordBySound',
    3: 'MatchImageAndWord',
    4: 'ChooseWordOrSentenceByImage',
    5: 'OrderPhrasesByImage',
  },
}

// studyType과 stepNumber에 따른 studyModule을 반환하는 함수
const getStudyModule = (
  studyType: string,
  stepNumber: number,
): IStudyModules => {
  return STUDY_MODULE_MAP[studyType]?.[stepNumber] || 'Movie'
}

export type { IStep, IStudyModules }
export { STUDY_MODULE_MAP, getStudyModule }
