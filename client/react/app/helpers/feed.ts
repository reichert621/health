import { extend, groupBy } from 'lodash';
import { HttpResponse, get } from './http';
import { ReportingDatedItem } from './reporting';

export enum ActivityType {
  SCORECARD = 'scorecard',
  CHECKLIST = 'checklist'
}

export interface IFeedActivity extends ReportingDatedItem {
  type?: ActivityType;
  username: string;
}

interface FeedResponse extends HttpResponse {
  scorecards: IFeedActivity[];
  checklists: IFeedActivity[];
}

export const fetchFeed = (): Promise<{ [date: string]: IFeedActivity[] }> => {
  return get('/api/feed')
    .then(({ scorecards, checklists }: FeedResponse) => {
      const activitiesByDate = groupBy([
        ...scorecards.map(s => extend(s, { type: ActivityType.SCORECARD })),
        ...checklists.map(c => extend(c, { type: ActivityType.CHECKLIST })),
      ], 'date');

      return activitiesByDate;
    });
};
