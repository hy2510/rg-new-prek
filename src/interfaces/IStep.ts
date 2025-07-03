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

export type { IStep, IStudyModules }
