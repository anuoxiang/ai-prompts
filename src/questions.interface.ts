export interface IQuestionDb {
  questions: string[];
  coreQuestions: string[];
  lanes: { [key: string]: string[] };
}

export interface ILanesDb {
  lanes: string[];
}
