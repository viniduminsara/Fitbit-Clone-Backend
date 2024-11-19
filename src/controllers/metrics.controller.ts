import {Router, Request, Response} from "express";
import asyncHandler from "express-async-handler";
import {
    getMetricsByIdValidator, saveActivityValidator,
    updateMetricsValidator
} from "../shared/middlewares/validators/metrics-validator.middleware";
import * as metricsService from "../services/metrics/metrics.service";

const controller = Router();

controller

    // GET /api/v1/metrics/:id
    .get(
        '/:uid',
        getMetricsByIdValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const existingUser = await metricsService.retrieveMetricsById(req.params.uid);
            res.send(existingUser);
        })
    )

    //PATCH api/v1/metrics/:id
    .patch(
        '/:uid',
        updateMetricsValidator,
        asyncHandler(async (req: Request, res: Response) => {
            const updatedMetrics = await metricsService.updateMetrics(req.params.uid, req.body);
            res.send(updatedMetrics);
        })
    )

    //POST api/v1/metrics/:id/activity
    .post(
        '/:uid/activity',
        saveActivityValidator,
        asyncHandler(async (req: Request, res: Response) => {
            await metricsService.saveActivity(req.params.uid, req.body);
            res.status(201).send('Activity created successfully');
        })
    )

export default controller;
