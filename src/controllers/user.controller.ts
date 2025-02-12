import {Router, Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from '../services/user/user.service';
import {SuccessMessages} from '../shared/enums/messages/success-messages.enum';
import {
    createUserValidator,
    getUserByIdValidator,
    updateUserValidator,
} from '../shared/middlewares/validators/user-validator.middleware';
import {CommonResponseDTO} from "../shared/models/DTO/commonResponseDTO";
import {authenticateUser} from "../shared/middlewares/authentication.middleware";

const controller = Router();

controller

    // POST /api/v1/users
    .post(
        '/',
        authenticateUser,
        createUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const newUser = await userService.createNewUser(req.body);
            res.status(201).send(new CommonResponseDTO(true, SuccessMessages.CreateSuccess, newUser));
        })
    )

    // GET /api/v1/users
    .get(
        '/',
        authenticateUser,
        asyncHandler(async (req: Request, res: Response) => {
            const users = await userService.retrieveUsers();
            res.send(new CommonResponseDTO(true, SuccessMessages.GetSuccess, users));
        })
    )

    // GET /api/v1/users/:id
    .get(
        '/:uid',
        authenticateUser,
        getUserByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const existingUser = await userService.retrieveUserById(req.params.uid);
            res.send(new CommonResponseDTO(true, SuccessMessages.GetSuccess, existingUser));
        })
    )

    // PATCH /api/v1/users/:id
    .patch(
        '/:uid',
        authenticateUser,
        getUserByIdValidator,
        updateUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedUser = await userService.updateUser(req.params.uid, req.body);
            res.send(new CommonResponseDTO(true, SuccessMessages.UpdateSuccess, updatedUser));
        })
    )

    // PATCH /api/v1/users/:id
    .patch(
        '/:uid/goals',
        authenticateUser,
        updateUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedUser = await userService.updateUserGoals(req.params.uid, req.body);
            res.send(new CommonResponseDTO(true, SuccessMessages.UpdateSuccess, updatedUser));
        })
    )

    // DELETE /api/v1/users:id
    .delete(
        '/:id',
        authenticateUser,
        getUserByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await userService.deleteUser(req.params.id);
            res.send(new CommonResponseDTO(true, SuccessMessages.DeleteSuccess, {}));
        })
    );

export default controller;
