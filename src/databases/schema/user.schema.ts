import mongoose, {Schema, model} from 'mongoose';
import {IUser} from '../model/user.model';

const schema = new Schema<IUser>(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
        },
        height: {
            type: Number,
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        goals: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Goal'
        }
    },
    {
        timestamps: true,
    }
);

export default model<IUser>('User', schema);
