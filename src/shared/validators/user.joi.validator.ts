import Joi from 'joi';

export const createUserValidationSchema = Joi.object({
    uid: Joi.string().alphanum().required()
        .messages({
            'string.alphanum': 'UID must be alphanumeric.',
            'string.length': 'UID must be 28 characters long.',
            'any.required': 'UID is required.',
        }),

    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']}
    }).required()
        .messages({
            'string.email': 'Please provide a valid email address.',
            'any.required': 'Email is required.',
        }),

    displayName: Joi.string().min(1).required()
        .messages({
            'string.min': 'Display name must be at least 1 character long.',
            'any.required': 'Display name is required.',
        }),

    gender: Joi.string().valid('Male', 'Female').required()
        .messages({
            'any.only': 'Gender must be either Male or Female.',
            'any.required': 'Gender is required.',
        }),

    height: Joi.number().positive().min(50).max(250).required()
        .messages({
            'number.base': 'Height must be a number.',
            'number.min': 'Height must be at least 50 cm.',
            'number.max': 'Height must be at most 250 cm.',
            'any.required': 'Height is required.',
        }),

    weight: Joi.number().positive().min(30).max(300).required()
        .messages({
            'number.base': 'Weight must be a number.',
            'number.min': 'Weight must be at least 30 kg.',
            'number.max': 'Weight must be at most 300 kg.',
            'any.required': 'Weight is required.',
        }),

    goals: Joi.object({
        exerciseDays: Joi.number().integer().min(1).max(7).required()
            .messages({
                'number.base': 'Exercise days must be a number.',
                'number.min': 'Exercise days must be at least 1.',
                'number.max': 'Exercise days must be at most 7.',
                'any.required': 'Exercise days are required.',
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
        energyBurned: Joi.number().positive().min(500).max(5000).required()
            .messages({
                'number.base': 'Energy burned must be a number.',
                'number.min': 'Energy burned must be at least 500 calories.',
                'number.max': 'Energy burned must be at most 5000 calories.',
                'any.required': 'Energy burned goal is required.',
            }),
        weight: Joi.number().positive().min(30).max(300).required()
            .messages({
                'number.base': 'Weight goal must be a number.',
                'number.min': 'Weight goal must be at least 30 kg.',
                'number.max': 'Weight goal must be at most 300 kg.',
                'any.required': 'Weight goal is required.',
            }),
        bodyFat: Joi.number().positive().min(5).max(50).required()
            .messages({
                'number.base': 'Body fat percentage must be a number.',
                'number.min': 'Body fat must be at least 5%.',
                'number.max': 'Body fat must be at most 50%.',
                'any.required': 'Body fat goal is required.',
            })
    }).required()
        .messages({
            'any.required': 'Goals are required.',
        })
});

export const getUserIdValidationSchema = Joi.object({
    uid: Joi.string().alphanum().required()
        .messages({
            'string.alphanum': 'UID must be alphanumeric.',
            'string.length': 'UID must be 28 characters long.',
            'any.required': 'UID is required.',
        }),
});
