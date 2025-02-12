import {Request, Response, Router} from "express";
import {saveActivityValidator} from "../shared/middlewares/validators/metrics-validator.middleware";
import asyncHandler from "express-async-handler";
import * as activityService from "../services/activity/activity.service";
import {CommonResponseDTO} from "../shared/models/DTO/commonResponseDTO";
import {SuccessMessages} from "../shared/enums/messages/success-messages.enum";
import {authenticateUser} from "../shared/middlewares/authentication.middleware";

const controller = Router();

controller
    .post(
        '/:uid/manual',
        authenticateUser,
        saveActivityValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await activityService.saveManualActivity(req.params.uid, req.body);
            res.status(201).send(new CommonResponseDTO(true, SuccessMessages.CreateSuccess, {}));
        })
    )

    .post(
        '/:uid/tracking',
        authenticateUser,
        saveActivityValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await activityService.saveTrackingActivity(req.params.uid, req.body);
            res.status(201).send(new CommonResponseDTO(true, SuccessMessages.CreateSuccess, {}));
        })
    )

export default controller;
