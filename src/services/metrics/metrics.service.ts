import to from "await-to-js";
import MetricModel from "../../databases/schema/metrics.schema";
import {InternalServerErrorException, NotFoundException} from "../../shared/exceptions/http.exceptions";
import {ErrorMessages} from "../../shared/enums/messages/error-messages.enum";
import {MetricsResponseDTO} from "../../shared/models/DTO/metricsDTO";
import {IMetrics} from "../../databases/model/metrics.model";


// GET /api/v1/users/:id
export const retrieveMetricsById = async (
    uid: string,
    date: string
): Promise<MetricsResponseDTO[]> => {
    try {
        const baseDate = new Date(date);
        const today = new Date(Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate(), 23, 59, 59));
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setUTCDate(today.getUTCDate() - 6);
        sixDaysAgo.setUTCHours(0, 0, 0, 0);

        console.log("Today (UTC):", today.toISOString());
        console.log("Six days ago (UTC):", sixDaysAgo.toISOString());

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
            date.setUTCDate(sixDaysAgo.getUTCDate() + i);
            date.setUTCHours(0, 0, 0, 0);

            const metricForDate = metrics.find(
                (m) => new Date(m.date).toISOString().split('T')[0] === date.toISOString().split('T')[0]
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
        ).populate('activities').lean()
    );

    if (error) {
        throw new InternalServerErrorException(ErrorMessages.UpdateFail);
    }

    if (!updatedMetrics) {
        throw new NotFoundException(`Metrics for user with id: ${uid} were not found!`);
    }

    return MetricsResponseDTO.toResponse(updatedMetrics);
};



