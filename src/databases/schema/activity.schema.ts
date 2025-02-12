import {Schema, model} from 'mongoose';
import {IActivity} from "../model/activity.model";

const schema = new Schema<IActivity>(
    {
        activityType: {
            type: String,
            enum: ['WALK', 'RUN', 'CYCLE', 'HIKE'],
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
        activitySteps: {
            type: Number,
            required: true,
        },
        activityDistance: {
            type: Number,
            required: true,
        },
        activityCaloriesBurned: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default model<IActivity>('Activity', schema);
