import {Schema, model} from 'mongoose';
import {IGoal} from "../model/goal.model";

const schema = new Schema<IGoal>(
    {
        exerciseDays: {
            type: Number,
            required: true,
        },
        steps: {
            type: Number,
            required: true,
        },
        distance: {
            type: Number,
            required: true,
        },
        energyBurned: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        bodyFat: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model<IGoal>('Goal', schema);
