import {Document} from "mongoose";

export interface IActivity extends Document {
    activityType: string;
    date: Date,
    startTime: string;
    steps: number;
    distance: number;
    caloriesBurned: number;
}
