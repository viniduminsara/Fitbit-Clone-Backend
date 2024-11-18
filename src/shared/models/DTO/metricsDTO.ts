import {IMetrics} from "../../../databases/model/metrics.model";

export class MetricsResponseDTO{
    uid!: string;
    date!: Date;
    steps!: number;
    distance!: number;
    caloriesBurned!: number;
    activities!: IActivityDTO[];

    static toResponse(metrics: IMetrics): MetricsResponseDTO {
        const metricDTO = new MetricsResponseDTO();
        metricDTO.uid = metrics.uid;
        metricDTO.date = metrics.date;
        metricDTO.steps = metrics.steps;
        metricDTO.distance = metrics.distance;
        metricDTO.caloriesBurned = metrics.caloriesBurned;
        metricDTO.activities = metrics.activities;

        return metricDTO;
    }
}
