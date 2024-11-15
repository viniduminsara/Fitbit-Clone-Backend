import { Document } from 'mongoose';
import { IGoal } from "./goal.model";

export interface IUser extends Document {
    uid: string;
    email: string;
    displayName: string;
    gender: string;
    height: number;
    weight: number;
    goals: IGoal;
    createdAt: Date;  // Add createdAt
    updatedAt: Date;  // Add updatedAt
}
