import asyncHandler from "express-async-handler";
import {NextFunction, Request, Response} from "express";
import {BadRequestException} from "../../exceptions/http.exceptions";
import to from "await-to-js";
import {saveActivityValidationSchema, updateMetricsValidationSchema} from "../../validators/metrics.joi.validator";

export const getMetricsByIdValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    if (!req.params?.uid)
        throw new BadRequestException('Required parameter "uid" is missing!');

    next();
});

export const updateMetricsValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {

    if (!req.params?.uid)
        throw new BadRequestException('Required parameter "uid" is missing!');

    if (!req.body)
        throw new BadRequestException('Missing request body!');

    const [error] = await to(updateMetricsValidationSchema.validateAsync(req.body));

    if (error)
        throw new BadRequestException(error.message);

    next();
});

export const saveActivityValidator = asyncHandler(async (
    req: Request,
    _: Response,
    next: NextFunction
) => {

    if (!req.params?.uid)
        throw new BadRequestException('Required parameter "uid" is missing!');

    if (!req.body)
        throw new BadRequestException('Missing request body!');

    const [error] = await to(saveActivityValidationSchema.validateAsync(req.body));

    if (error)
        throw new BadRequestException(error.message);

    next();
});
