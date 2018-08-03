import { HttpResponse, get, post } from './http';
import { IQuestion } from './checklist';

export enum AssessmentType {
  DEPRESSION = 'depression',
  ANXIETY = 'anxiety',
  WELL_BEING = 'wellbeing'
}

export interface IAssessmentQuestion {
  id: number;
  text: string;
  category: string;
  score: number;
  type?: string;
  title?: string;
}

export interface IAssessmentScore {
  id: number;
  score: number;
}

export interface IAssessment {
  id: number;
  type?: string;
  title?: string;
  date: string;
  questions: IQuestion[]; // FIXME
}

export interface IAssessmentsByType {
  [type: string]: IAssessment[];
}

export interface IAssessmentStat {
  included: number;
  excluded: number;
  delta: number;
}

export interface IAssessmentStats {
  depression: IAssessmentStat;
  anxiety: IAssessmentStat;
  wellbeing: IAssessmentStat;
}

export interface IAssessmentScoreFrequencies {
  [score: string]: number;
}

export interface IUniqueAssessmentScoreTask {
  [score: string]: string[];
}

export interface IAssessmentTaskStats {
  [score: string]: {
    task: string;
    count: number;
    percentage: number;
    deltas: {
      next?: number;
      prev?: number;
    }
  }[];
}

export interface IAssessmentQuestionStat {
  question: IAssessmentQuestion;
  frequencies: IAssessmentScoreFrequencies;
  uniqs: IUniqueAssessmentScoreTask;
  stats: IAssessmentTaskStats;
}

export enum DepressionLevel {
  NONE = 'No depression',
  NORMAL = 'Normal but unhappy',
  MILD = 'Mild depression',
  MODERATE = 'Moderate depression',
  SEVERE = 'Severe depression',
  EXTREME = 'Extreme depression'
}

export const getDepressionLevelByScore = (score: number): string => {
  if (score <= 5) {
    return DepressionLevel.NONE;
  } else if (score > 5 && score <= 10) {
    return DepressionLevel.NORMAL;
  } else if (score > 10 && score <= 25) {
    return DepressionLevel.MILD;
  } else if (score > 25 && score <= 50) {
    return DepressionLevel.MODERATE;
  } else if (score > 50 && score <= 75) {
    return DepressionLevel.SEVERE;
  } else {
    return DepressionLevel.EXTREME;
  }
};

export enum AnxietyLevel {
  NONE = 'No anxiety',
  NORMAL = 'Normal anxiety',
  MILD = 'Mild anxiety',
  MODERATE = 'Moderate anxiety',
  SEVERE = 'Severe anxiety',
  EXTREME = 'Extreme anxiety'
}

export const getAnxietyLevelByScore = (score: number): string => {
  if (score <= 5) {
    return AnxietyLevel.NONE;
  } else if (score > 5 && score <= 10) {
    return AnxietyLevel.NORMAL;
  } else if (score > 10 && score <= 25) {
    return AnxietyLevel.MILD;
  } else if (score > 25 && score <= 50) {
    return AnxietyLevel.MODERATE;
  } else if (score > 50 && score <= 75) {
    return AnxietyLevel.SEVERE;
  } else {
    return AnxietyLevel.EXTREME;
  }
};

export enum WellnessLevel {
  VERY_LOW = 'Very low well-being',
  LOW = 'Low well-being',
  MODERATE = 'Moderate well-being',
  HIGH = 'High well-being',
  VERY_HIGH = 'Very high well-being'
}

export const getWellnessLevelByScore = (score: number): string => {
  if (score <= 15) {
    return WellnessLevel.VERY_LOW;
  } else if (score > 15 && score <= 35) {
    return WellnessLevel.LOW;
  } else if (score > 35 && score <= 55) {
    return WellnessLevel.MODERATE;
  } else if (score > 55 && score <= 70) {
    return WellnessLevel.HIGH;
  } else {
    return WellnessLevel.VERY_HIGH;
  }
};

export const getDescriptionByAssessmentType = (
  type: AssessmentType,
  points: number
) => {
  switch (type) {
    case AssessmentType.DEPRESSION:
      return getDepressionLevelByScore(points);
    case AssessmentType.ANXIETY:
      return getAnxietyLevelByScore(points);
    case AssessmentType.WELL_BEING:
      return getWellnessLevelByScore(points);
    default:
      // For backwards compatibility
      return getDepressionLevelByScore(points);
  }
};

export const fetchAssessments = (): Promise<IAssessment[]> => {
  return get('/api/assessments')
    .then((res: HttpResponse) => res.assessments);
};

export const fetchAssessmentsByDate = (
  date: string
): Promise<{ [type: string]: IAssessment }> => {
  return get(`/api/assessments/date/${date}`)
    .then((res: HttpResponse) => res.assessments);
};

export const fetchAssessment = (id: number): Promise<IAssessment> => {
  return get(`/api/assessments/${id}`)
    .then((res: HttpResponse) => res.assessment);
};

export const createAssessment = (params: object): Promise<IAssessment> => {
  return post('/api/assessments', params)
    .then((res: HttpResponse) => res.assessment);
};

export const updateAssessmentScore = (
  id: number,
  questionId: number,
  score: number
): Promise<IAssessmentScore> => {
  return post(`/api/assessments/${id}/questions/${questionId}/score`, { score })
    .then((res: HttpResponse) => res.assessmentScore);
};

export const fetchDepressionQuestions = (): Promise<IQuestion[]> => {
  return get('/api/assessments/depression')
    .then((res: HttpResponse) => res.questions);
};

export const fetchAnxietyQuestions = (): Promise<IQuestion[]> => {
  return get('/api/assessments/anxiety')
    .then((res: HttpResponse) => res.questions);
};

export const fetchWellBeingQuestions = (): Promise<IQuestion[]> => {
  return get('/api/assessments/well-being')
    .then((res: HttpResponse) => res.questions);
};
