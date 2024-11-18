import {Document} from "mongoose";
import {IActivity} from "./activity.model";

export interface IMetrics extends Document {
    uid: string;
    date: Date;
    steps: number;
    distance: number;
    caloriesBurned: number;
    activities: IActivity[];
}
