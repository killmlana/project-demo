export type Question = {
  question: string;
  topic: string;
};

export type QuestionWithAnswer = Question & { answer: string };

export type Pairs<T> = {
  pairs: T[];
};
