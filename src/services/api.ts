import axios from 'axios'

import { INFO_PATH, MOVIE_PATH, QUIZ_PATH } from '@constants/constant'
import { IMovieInfo, IQuizInfo } from '@interfaces/IStudyInfo'

const getInfoData = async (studyId: string, studentHistoryId: string) => {
  const response = await axios.get(
    `/${INFO_PATH}?studyId=${studyId}&studentHistoryId=${studentHistoryId}`,
  )
  console.log(response.data)
  return response.data
}

const getMovieData = async (
  studyId: string,
  studentHistoryId: string,
): Promise<IMovieInfo> => {
  const response = await axios.get<IMovieInfo>(
    `/${MOVIE_PATH}?studyId=${studyId}&studentHistoryId=${studentHistoryId}`,
  )

  return response.data
}

const getQuizData = async (
  studyId: string,
  studentHistoryId: string,
  step: number,
  type: 'A' | 'B',
): Promise<IQuizInfo> => {
  const response = await axios.get<IQuizInfo>(
    `/${QUIZ_PATH}?studyId=${studyId}&studentHistoryId=${studentHistoryId}&step=${step}&type=${type}`,
  )

  return response.data
}

export { getInfoData, getMovieData, getQuizData }
