import {Document} from "mongoose";

export interface IActivity extends Document {
    activityType: string;
    date: Date,
    startTime: string;
    activitySteps: number;
    activityDistance: number;
    activityCaloriesBurned: number;
}
