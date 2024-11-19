import to from "await-to-js";
import MetricModel from "../../databases/schema/metrics.schema";
import ActivityModel from "../../databases/schema/activity.schema";
import {InternalServerErrorException, NotFoundException} from "../../shared/exceptions/http.exceptions";
import {ErrorMessages} from "../../shared/enums/messages/error-messages.enum";
import {MetricsResponseDTO} from "../../shared/models/DTO/metricsDTO";
import {IMetrics} from "../../databases/model/metrics.model";
import {IActivity} from "../../databases/model/activity.model";
import {MongooseErrors} from "../../shared/enums/db/mongodb-errors.enum";


// GET /api/v1/users/:id
export const retrieveMetricsById = async (
    uid: string
): Promise<MetricsResponseDTO[]> => {
    try {
        const today = new Date();
        today.setHours(24, 0, 0, 0);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(today.getDate() - 6);

        const metrics = await MetricModel.find({
            uid,
            date: { $gte: sixDaysAgo, $lte: today },
        })
            .populate('activities')
            .sort({ date: 1 })
            .lean();

        const result: MetricsResponseDTO[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sixDaysAgo);
            date.setDate(sixDaysAgo.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const metricForDate = metrics.find(
                (m) => m.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
            );

            if (metricForDate) {
                result.push(MetricsResponseDTO.toResponse(metricForDate));
            } else {
                const defaultMetric = new MetricModel({
                    uid,
                    date,
                    steps: 0,
                    distance: 0,
                    caloriesBurned: 0,
                    activities: [],
                });
                await defaultMetric.save();
                result.push(MetricsResponseDTO.toResponse(defaultMetric.toObject()));
            }
        }

        return result.reverse();
    } catch (error) {
        console.error('Error retrieving metrics:', error);
        throw new Error('Failed to retrieve metrics');
    }
};

export const updateMetrics = async (
    uid: string,
    data: Partial<IMetrics>
): Promise<MetricsResponseDTO> => {
    const today = new Date();

    const [error, updatedMetrics] = await to(
        MetricModel.findOneAndUpdate(
            {
                uid,
                $expr: {
                    $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        today.toISOString().split("T")[0],
                    ],
                },
            },
            { $set: { ...data } },
            { new: true }
        ).populate('activities')
    );

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    if (!updatedMetrics) {
        throw new NotFoundException(`Metrics for user with id: ${uid} were not found!`);
    }

    return MetricsResponseDTO.toResponse(updatedMetrics);
};


export const saveActivity = async (
    uid: string,
    data: Partial<IActivity>
): Promise<void> => {
    const newActivity = new ActivityModel(data);
    const [goalError, savedActivity] = await to(newActivity.save());

    if (goalError || !savedActivity) {
        throw new InternalServerErrorException(ErrorMessages.CreateFail);
    }

    if (!data.date) throw new InternalServerErrorException(ErrorMessages.CreateFail);

    const activityDate = new Date(data.date).toISOString().split('T')[0];

    // Step 1: Find the metric by uid and date (ignoring time)
    const [findError, metric] = await to(
        MetricModel.findOne({
            uid,
            date: {
                $gte: new Date(`${activityDate}T00:00:00.000Z`),
                $lte: new Date(`${activityDate}T23:59:59.999Z`),
            },
        })
    );

    if (findError) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    // Step 2: Update or create the metric
    if (metric) {
        metric.steps += savedActivity.activitySteps || 0;
        metric.distance += savedActivity.activityDistance || 0;
        metric.caloriesBurned += savedActivity.activityCaloriesBurned || 0;
        metric.activities.push(savedActivity._id);
        await metric.save();
    } else {
        const [createError] = await to(
            MetricModel.create({
                uid,
                date: new Date(activityDate),
                steps: savedActivity.activitySteps || 0,
                distance: savedActivity.activityDistance || 0,
                caloriesBurned: savedActivity.activityCaloriesBurned || 0,
                activities: [savedActivity._id],
            })
        );

        if (createError) {
            throw new InternalServerErrorException(ErrorMessages.CreateFail);
        }
    }
};


