import {Document} from "mongoose";

export interface IDailyMetrics extends Document {
    date: Date,
    steps: number;
    distance: number;
    caloriesBurned: number;
}
