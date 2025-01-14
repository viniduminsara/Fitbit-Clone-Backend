import {Request, Response, Router} from "express";
import {saveActivityValidator} from "../shared/middlewares/validators/metrics-validator.middleware";
import asyncHandler from "express-async-handler";
import * as activityService from "../services/activity/activity.service";

const controller = Router();

controller
    .post(
        '/:uid/manual',
        saveActivityValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await activityService.saveActivity(req.params.uid, req.body);
            res.status(201).send('Activity created successfully');
        })
    )

export default controller;
