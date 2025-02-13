import {Router, Request, Response} from "express";
import asyncHandler from "express-async-handler";
import {
    getMetricsByIdValidator, saveActivityValidator,
    updateMetricsValidator
} from "../shared/middlewares/validators/metrics-validator.middleware";
import * as metricsService from "../services/metrics/metrics.service";
import {CommonResponseDTO} from "../shared/models/DTO/commonResponseDTO";
import {SuccessMessages} from "../shared/enums/messages/success-messages.enum";
import {authenticateUser} from "../shared/middlewares/authentication.middleware";

const controller = Router();

controller

    // GET /api/v1/metrics/:id
    .get(
        '/:uid',
        authenticateUser,
        getMetricsByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const metrics = await metricsService.retrieveMetricsById(req.params.uid, req.query.date as string);
            res.send(new CommonResponseDTO(true, SuccessMessages.GetSuccess, metrics));
        })
    )

    //PATCH api/v1/metrics/:id
    .patch(
        '/:uid',
        authenticateUser,
        updateMetricsValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedMetrics = await metricsService.updateMetrics(req.params.uid, req.body);
            res.send(new CommonResponseDTO(true, SuccessMessages.UpdateSuccess, updatedMetrics));
        })
    )
    //
    // //POST api/v1/metrics/:id/activity
    // .post(
    //     '/:uid/activity',
    //     saveActivityValidator,
    //     asyncHandler(async (req: Request, res: Response) => {
    //         await metricsService.saveActivity(req.params.uid, req.body);
    //         res.status(201).send('Activity created successfully');
    //     })
    // )

export default controller;
