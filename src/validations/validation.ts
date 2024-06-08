import * as joi from 'joi';
import { ROLESENUM } from '../enums/enum';

export class CustomValidation {

    static signupSchema = joi.object({
        name: joi.string().min(2).optional().allow(null, ''),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(200).required()
    });

    static signinSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(200).required()
    });

    static organizationSchema = joi.object({
        name: joi.string().min(2).max(20).required(),
        account_id: joi.string().optional().allow(null, '')
    });

    static newUserSchema = joi.object({
        name: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(200).required(),
        account_id: joi.string().optional().allow(null, ''),
        role: joi.string().required().valid(...Object.values(ROLESENUM)),
        orgId: joi.number().required()
    });

    static taskSchema = joi.object({
        task: joi.string().min(2).max(15).required(),
        description: joi.string().min(2).max(200).required(),
        // account_id: joi.string().optional().allow(null, ''),
        // role: joi.string().required().valid(...Object.values(ROLESENUM)),
        // orgId: joi.number().required()
    });

}

