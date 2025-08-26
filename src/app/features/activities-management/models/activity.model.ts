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

export interface Activity {
    id: string;
    name: string;
    description: string;
    scheduledTime: Date; // Date object for backend
    frequency: ActivityFrequency;
    status: ActivityStatus;
    lastCompleted?: Date; // Date object for backend
    createdAt: number; // Unix timestamp from backend
}