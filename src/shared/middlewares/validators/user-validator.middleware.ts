import to from 'await-to-js';
import asyncHandler from 'express-async-handler';
import {Request, Response, NextFunction} from 'express';
import {BadRequestException} from '../../exceptions/http.exceptions';
import {
    createUserValidationSchema,
    getUserIdValidationSchema,
} from '../../validators/user.joi.validator';

export const createUserValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    if (!req.body)
        throw new BadRequestException('Missing request body!');

    // the validateAsync method is built into Joi
    const [error] = await to(createUserValidationSchema.validateAsync(req.body));

    if (error)
        throw new BadRequestException(error.message);

    next();
});

export const updateUserValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    if (!req.params?.uid)
        throw new BadRequestException('Required parameter "uid" is missing!');

    if (!req.body)
        throw new BadRequestException('Missing request body!');

    next();
});

export const getUserByIdValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    if (!req.params?.uid)
        throw new BadRequestException('Required parameter "uid" is missing!');

    const [error] = await to(getUserIdValidationSchema.validateAsync(req.params));

    if (error)
        throw new BadRequestException(error.message);

    next();
});
