export interface IQuestionDb {
  questions: string[];
  lanes: { [key: string]: string[] };
}

export interface ILanesDb {
  lanes: string[];
}
