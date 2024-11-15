import {Schema, model} from 'mongoose';
import {IActivity} from "../model/activity.model";
import {IDailyMetrics} from "../model/dailyMetrics.model";

const schema = new Schema<IDailyMetrics>(
    {
        date: {
            type: Date,
            required: true
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

export default model<IDailyMetrics>('activity', schema);
