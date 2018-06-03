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
  } else if (score >= 6 && score <= 10) {
    return DepressionLevel.NORMAL;
  } else if (score >= 11 && score <= 25) {
    return DepressionLevel.MILD;
  } else if (score >= 26 && score <= 50) {
    return DepressionLevel.MODERATE;
  } else if (score >= 51 && score <= 75) {
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
  } else if (score >= 6 && score <= 10) {
    return AnxietyLevel.NORMAL;
  } else if (score >= 11 && score <= 25) {
    return AnxietyLevel.MILD;
  } else if (score >= 26 && score <= 50) {
    return AnxietyLevel.MODERATE;
  } else if (score >= 51 && score <= 75) {
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
  } else if (score >= 16 && score <= 35) {
    return WellnessLevel.LOW;
  } else if (score >= 36 && score <= 55) {
    return WellnessLevel.MODERATE;
  } else if (score >= 56 && score <= 70) {
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
