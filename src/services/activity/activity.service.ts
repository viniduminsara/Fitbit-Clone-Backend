import {IActivity} from "../../databases/model/activity.model";
import ActivityModel from "../../databases/schema/activity.schema";
import to from "await-to-js";
import {InternalServerErrorException} from "../../shared/exceptions/http.exceptions";
import {ErrorMessages} from "../../shared/enums/messages/error-messages.enum";
import MetricModel from "../../databases/schema/metrics.schema";

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
