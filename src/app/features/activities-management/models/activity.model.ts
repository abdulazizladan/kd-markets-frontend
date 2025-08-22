export enum ActivityStatus {
    Planned = 'Planned',
    InProgress = 'In Progress',
    Completed = 'Completed',
    Overdue = 'Overdue'
  }

export enum ActivityFrequency {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Quarterly = 'Quarterly',
    Yearly = 'Yearly',
    AdHoc = 'Ad Hoc' // For one-off activities
}

export class Activity {
    "name": string;
    "description": string;
    "scheduledTime": Date;
    "frequency": ActivityFrequency;
    "status": ActivityStatus = ActivityStatus.Planned; // Default status is 'Planned'
    "id"?: string;
    "lastCompleted"?: Date;
}