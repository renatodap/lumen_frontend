export type DayType = 'standard' | 'laundry_day' | 'gym_day';

export interface AcceptanceCriterion {
  id: string;
  userId: string;
  criteriaText: string;
  dayType: DayType;
  orderIndex: number;
  createdAt: string;
}

export interface CreateCriterionParams {
  criteriaText: string;
  dayType: DayType;
  orderIndex: number;
}

export interface UpdateCriterionParams {
  id: string;
  criteriaText?: string;
  dayType?: DayType;
  orderIndex?: number;
}
