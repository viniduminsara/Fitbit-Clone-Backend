import Joi from "joi";

export const updateMetricsValidationSchema = Joi.object({
    uid: Joi.string().alphanum().required()
        .messages({
            'string.alphanum': 'UID must be alphanumeric.',
            'string.length': 'UID must be 28 characters long.',
            'any.required': 'UID is required.',
        }),
    steps: Joi.number().integer().min(1000).max(50000).required()
        .messages({
            'number.base': 'Steps must be a number.',
            'number.min': 'Steps must be at least 1000.',
            'number.max': 'Steps must be at most 50000.',
            'any.required': 'Steps goal is required.',
        }),
    distance: Joi.number().positive().min(1).max(100).required()
        .messages({
            'number.base': 'Distance must be a number.',
            'number.min': 'Distance must be at least 1 km.',
            'number.max': 'Distance must be at most 100 km.',
            'any.required': 'Distance goal is required.',
        }),
    caloriesBurned: Joi.number().positive().min(500).max(5000).required()
        .messages({
            'number.base': 'Energy burned must be a number.',
            'number.min': 'Energy burned must be at least 500 calories.',
            'number.max': 'Energy burned must be at most 5000 calories.',
            'any.required': 'Energy burned goal is required.',
        })
});

export const saveActivityValidationSchema = Joi.object({
    activityType: Joi.string()
        .valid('Walk', 'Run', 'Cycle', 'Swim')
        .required()
        .messages({
            'any.required': 'Activity type is required.',
            'any.only': 'Activity type must be one of [Walk, Run, Cycle, Swim].',
        }),

    date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Date must be a valid ISO date.',
            'any.required': 'Date is required.',
        }),

    startTime: Joi.string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .required()
        .messages({
            'string.pattern.base': 'Start time must be in HH:mm format (24-hour clock).',
            'any.required': 'Start time is required.',
        }),

    activitySteps: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Steps must be a valid number.',
            'number.integer': 'Steps must be an integer.',
            'number.min': 'Steps cannot be less than 0.',
            'any.required': 'Steps are required.',
        }),

    activityDistance: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.base': 'Distance must be a valid number.',
            'number.min': 'Distance cannot be less than 0.',
            'any.required': 'Distance is required.',
        }),

    activityCaloriesBurned: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.base': 'Calories burned must be a valid number.',
            'number.min': 'Calories burned cannot be less than 0.',
            'any.required': 'Calories burned is required.',
        }),
});
