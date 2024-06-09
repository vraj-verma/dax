import { Body, Controller, HttpException, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ValidationPipe } from "../pipes/joi-validation.pipe";
import { CustomValidation } from "../validations/validation";
import { UsersService } from "../users/users.service";
import { Utility } from "../helpers/utils";

import { JwtService } from "@nestjs/jwt";

@Controller('auth')
export class AuthController {

    constructor(
        private usersService: UsersService,
        private util: Utility,
        private jwtService: JwtService
    ) { }

    @Post('signup')
    async signup(
        @Res() res: Response,
        @Body(new ValidationPipe(CustomValidation.signupSchema)) payload: any
    ) {

        const isExist = await this.usersService.getByEmail(payload.email);

        if (isExist) {
            throw new HttpException(
                `Already exist`,
                HttpStatus.CONFLICT
            );
        }

        const hash = await this.util.encryptPassword(payload.password);

        // const isRoleAlreadyInDB = await this.rolesService.getByRole(payload.role);

        // const role = isRoleAlreadyInDB ? isRoleAlreadyInDB.role_id : await this.rolesService.createRole(payload.role);

        const account_id = this.util.randomID();

        const userPayload = {
            name: payload.name,
            email: payload.email,
            password: hash,
            role_id: 1,
            account_id,
            current_org_id: null,
            privileged_id: 1
        }

        const response = await this.usersService.create(userPayload);

        if (!response) {
            throw new HttpException(
                `Failed signup`,
                HttpStatus.BAD_REQUEST
            );
        }

        response.password = undefined;

        res.status(201).json(response);


    }

    @Post('signin')
    async signin(
        @Res() res: Response,
        @Body(new ValidationPipe(CustomValidation.signinSchema)) payload: any
    ) {

        const user = await this.usersService.getByEmail(payload.email);

        if (!user) {
            throw new HttpException(
                `Not exist`,
                HttpStatus.NOT_FOUND
            );
        }

        const isPasswordMatch = await this.util.decryptPassword(payload.password, user.password);

        if (!isPasswordMatch) {
            throw new HttpException(
                `Incorrect Password`,
                HttpStatus.BAD_REQUEST
            );
        }

        const JWTPayload = {
            user_id: user.user_id,
            account_id: user.account_id,
            email: user.email,
            role_id: user.role_id,
            org_id: user.current_org_id
        }

        const token = this.jwtService.sign(JWTPayload);

        user.password = undefined;

        res.status(200).json({ ...user, token });
    }
}