import {Document} from "mongoose";

export interface IGoal extends Document {
    exerciseDays: number;
    steps: number;
    distance: number;
    energyBurned: number;
    weight: number;
    bodyFat: number;
}
