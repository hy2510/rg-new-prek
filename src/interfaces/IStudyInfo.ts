interface IStudyInfo {
  StudyId: string
  StudentHistoryId: string
  Book: string
  Mode: string
  Server: string
  Url: string
  User: string
}

interface IMovieInfo {
  AnimationPath: string
  AnimationPoster: string
}

interface IQuizInfo {
  quiz: {
    QuizId: string
    QuizType: string
    QuizNo: string
    Question: string
    CorrectText: string
    ExampleCount: number
    Example1: string
    Example2: string
    Example3: string
    Example4: string
    Example5: string
    Image1: string
    Image2: string
    Image3: string
    Image4: string
    Image5: string
    Sound1: string
    Sound2: string
    Sound3: string
    Sound4: string
    Sound5: string
  }[]
}

export type { IStudyInfo, IMovieInfo, IQuizInfo }
