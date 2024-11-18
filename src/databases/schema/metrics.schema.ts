import mongoose, {Schema, model} from 'mongoose';
import {IActivity} from "../model/activity.model";
import {IMetrics} from "../model/metrics.model";

const schema = new Schema<IMetrics>(
    {
        uid: {
            type: String,
            required: true,
        },
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
        },
        activities: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Activity'
            }
        ]
    },
    {
        timestamps: true,
    }
);

export default model<IMetrics>('Metric', schema);
