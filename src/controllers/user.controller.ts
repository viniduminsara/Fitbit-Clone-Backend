import {Router, Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import * as userService from '../services/user/user.service';
import {SuccessMessages} from '../shared/enums/messages/success-messages.enum';
import {
    createUserValidator,
    getUserByIdValidator,
    updateUserValidator,
} from '../shared/middlewares/user-validator.middleware';

const controller = Router();

controller

    // POST /api/mongoose/users
    .post(
        '/',
        createUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const newUser = await userService.createNewUser(req.body);
            res.status(201).send(newUser);
        })
    )

    // GET /api/mongoose/users
    .get(
        '/',
        asyncHandler(async (req: Request, res: Response) => {
            const users = await userService.retrieveUsers();
            res.send(users);
        })
    )

    // GET /api/mongoose/users/:id
    .get(
        '/:uid',
        getUserByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const existingUser = await userService.retrieveUserById(req.params.uid);
            res.send(existingUser);
        })
    )

    // PATCH /api/mongoose/users/:id
    .patch(
        '/:uid',
        getUserByIdValidator,
        updateUserValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedUser = await userService.updateUser(req.params.uid, req.body);
            res.send(updatedUser);
        })
    )

    // DELETE /api/mongoose/users:id
    .delete(
        '/:id',
        getUserByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await userService.deleteUser(req.params.id);
            res.send({message: SuccessMessages.UserRemoveSuccess});
        })
    );

export default controller;
