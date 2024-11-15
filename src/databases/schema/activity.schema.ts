import {Schema, model} from 'mongoose';
import {IActivity} from "../model/activity.model";

const schema = new Schema<IActivity>(
    {
        activityType: {
            type: String,
            enum: ['Walk', 'Run', 'Cycle', 'Swim'],
            required: true
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
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
        caloriesBurned: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default model<IActivity>('activity', schema);
