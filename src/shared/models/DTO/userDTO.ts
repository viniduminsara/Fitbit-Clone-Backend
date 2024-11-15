import {IUser} from '../../../databases/model/user.model';
import {IGoal} from "../../../databases/model/goal.model";

export class UserResponseDTO {
    uid!: string;
    email!: string;
    displayName!: string;
    gender!: string;
    height!: number;
    weight!: number;
    createdAt!: Date;
    goals!: GoalDTO;

    static toResponse(user: IUser): UserResponseDTO {
        const userDTO = new UserResponseDTO();
        userDTO.uid = user.uid;
        userDTO.email = user.email;
        userDTO.displayName = user.displayName;
        userDTO.gender = user.gender;
        userDTO.height = user.height;
        userDTO.weight = user.weight;
        userDTO.createdAt = user.createdAt;
        userDTO.goals = {
            exerciseDays: user.goals.exerciseDays,
            steps: user.goals.steps,
            distance: user.goals.distance,
            energyBurned: user.goals.energyBurned,
            weight: user.goals.weight,
            bodyFat: user.goals.bodyFat,
        };

        return userDTO;
    }
}
