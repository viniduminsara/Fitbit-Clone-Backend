import to from 'await-to-js';

import {IUser} from '../../databases/model/user.model';
import UserModel from '../../databases/schema/user.schema';
import GoalModel from '../../databases/schema/goal.schema';
import {MongooseErrorCodes, MongooseErrors} from '../../shared/enums/db/mongodb-errors.enum';
import {ErrorMessages} from '../../shared/enums/messages/error-messages.enum';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException
} from '../../shared/exceptions/http.exceptions';
import {UserResponseDTO} from '../../shared/models/DTO/userDTO';
import {IMongooseError} from '../../shared/models/extensions/errors.extension';

// POST /api/v1/users
export const createNewUser = async (
    userData: IUser
): Promise<UserResponseDTO> => {

    const newGoal = new GoalModel(userData.goals);
    const [goalError, savedGoal] = await to(newGoal.save());

    if (goalError && MongooseErrors.MongoServerError) {
        throw new InternalServerErrorException(ErrorMessages.CreateFail);
    }

    if (!savedGoal) throw new InternalServerErrorException(ErrorMessages.CreateFail);

    const newUser = new UserModel({
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        goals: savedGoal._id
    });

    const [error] = await to(newUser.save());

    if (error && MongooseErrors.MongoServerError) {
        // this conversion is needed because Error class does not have code property
        const mongooseError = error as IMongooseError;

        // check if there is a duplicate entry
        if (mongooseError.code === MongooseErrorCodes.UniqueConstraintFail) {
            throw new ConflictException(ErrorMessages.DuplicateEntryFail);
        } else {
            throw new InternalServerErrorException(ErrorMessages.CreateFail);
        }
    }

    const [findError, existingUser] = await to(UserModel.findOne({ uid: newUser.uid }).populate('goals'));

    if (findError || !existingUser) {
        throw new InternalServerErrorException(ErrorMessages.CreateFail);
    }


    return UserResponseDTO.toResponse(existingUser);
};

// GET /api/v1/users
export const retrieveUsers = async (): Promise<UserResponseDTO[]> => {

    const [error, users] = await to(UserModel.find({}));

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail);
    }

    if (!users?.length) {
        return [];
    }

    return users.map((user) => UserResponseDTO.toResponse(user));
};

// GET /api/v1/users/:id
export const retrieveUserById = async (
    uid: string
): Promise<UserResponseDTO> => {
    const [error, existingUser] = await to(UserModel.findOne({ uid: uid }).populate('goals'));

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.GetFail);
    }

    if (!existingUser) {
        throw new NotFoundException(`User with id: ${uid} was not found!`);
    }

    return UserResponseDTO.toResponse(existingUser);
};

// PATCH /api/v1/users/:id
export const updateUser = async (
    uid: string,
    userData: Partial<IUser>
): Promise<UserResponseDTO> => {
    const [error, updatedUser] = await to(UserModel.findOneAndUpdate(
        {uid: uid},
        {$set: {...userData}},
        {new: true}
    ).populate('goals'));

    if (!updatedUser) {
        throw new NotFoundException(`User with id: ${uid} was not found!`);
    }

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    return UserResponseDTO.toResponse(updatedUser);
};

// DELETE /api/v1/users:id
export const deleteUser = async (id: string): Promise<void> => {
    const [error, existingUser] = await to(UserModel.findById(id));

    if (!existingUser) {
        throw new NotFoundException(`User with id: ${id} was not found!`);
    }

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.DeleteFail);
    }

    await UserModel.findOneAndRemove({_id: id});
};

