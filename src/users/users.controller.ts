import { Body, Controller, Request, HttpException, HttpStatus, Post, Res, UseGuards, Get, Query, Param, Put, ParseIntPipe, Delete, ParseBoolPipe } from "@nestjs/common";
import { UsersService } from "./users.service";

import { ValidationPipe } from "../pipes/joi-validation.pipe";
import { CustomValidation } from "../validations/validation";
import { RolesService } from "../roles/roles.service";
import { Utility } from "../helpers/utils";
import { JWTAuthGuard } from "../guards/jwt.strategy";
import { Response } from "express";
import { Paged } from "../types/types";
import { OrganizationsService } from "../organizations/org.service";
import { PrivilegesService } from "../privileges/privileges.service";
import { Role } from "../guards/role.decorator";
import { RoleGuard } from "../guards/role.guard";

@UseGuards(JWTAuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private rolesService: RolesService,
        private orgService: OrganizationsService,
        private privilegesService: PrivilegesService,
        private util: Utility,
    ) { }


    @UseGuards(RoleGuard) 
    @Post()
    async addUser(
        @Request() req,
        @Res() res: Response,
        @Body(new ValidationPipe(CustomValidation.newUserSchema)) payload: any
    ) {

        const { account_id } = req.user;

        const user = await this.usersService.getByEmail(payload.email);

        if (user) {
            throw new HttpException(
                `User with email: ${payload.email} already exist`,
                HttpStatus.CONFLICT
            );
        }

        const org = await this.orgService.getOrgById(payload.orgId, account_id);

        if (!org) {
            throw new HttpException(
                `Organization with id: ${payload.orgId} does not exist, create organization first, then add user in it`,
                HttpStatus.BAD_REQUEST
            );
        }

        const hash = await this.util.encryptPassword(payload.password);

        const isRoleAlreadyInDB = await this.rolesService.getByRole(payload.role);

        const role_id = isRoleAlreadyInDB ? isRoleAlreadyInDB.role_id : await this.rolesService.createRole(payload.role);

        // set privileges

        const userPayload = {
            name: payload.name,
            email: payload.email,
            password: hash,
            role_id,
            account_id,
            current_org_id: payload.orgId,
            privileged_id: null
        }

        const response = await this.usersService.create(userPayload);

        if (!response) {
            throw new HttpException(
                `Failed to create user`,
                HttpStatus.BAD_REQUEST
            );
        }

        response.password = undefined;

        res.status(201).json(response);

    }

    @UseGuards(RoleGuard)
    @Put('privileges/:id')
    async addPrivileges(
        @Request() req,
        @Res() res: Response,
        @Param('id', ParseIntPipe) user_id: number,
        @Body() payload: { create: any, read: any, update: any, delete: any }
    ) {

        const { account_id } = req.user;

        // transform string in boolean
        payload.create = payload.create == 'true' ? true : false;
        payload.read = payload.read == 'true' ? true : false;
        payload.update = payload.update == 'true' ? true : false;
        payload.delete = payload.delete == 'true' ? true : false;

        const response = await this.privilegesService.create(payload);

        if (!response) {
            throw new HttpException(
                `Failed to create privileges`,
                HttpStatus.BAD_REQUEST
            );
        }

        const privilege = await this.usersService.assignPrivilegeIdToUser(account_id, user_id, response.privileged_id);

        if (!privilege) {
            throw new HttpException(
                `Failed assign privileges to user: ${user_id} either the user doesn't exist or invalid user ID`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(201).json({
            message: `Privileges assigned to user: ${user_id}`,
            ...response
        });
    }

    @UseGuards(RoleGuard)
    @Get()
    async getAccountUsers(
        @Request() req,
        @Res() res: Response,
        @Query() paged: Paged
    ) {

        const { account_id } = req.user;

        const users = await this.usersService.getAccountUsers(account_id, paged);

        if (!users) {
            throw new HttpException(
                `Users not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(users);
    }

    @Get('me')
    async meProfile(
        @Request() req,
        @Res() res: Response,
    ) {

        const { account_id, user_id } = req.user;

        const user = await this.usersService.getById(user_id, account_id);

        if (!user) {
            throw new HttpException(
                `Failed to get profile`,
                HttpStatus.NOT_FOUND
            );
        }

        user.password = undefined;

        res.status(200).json(user);
    }

    @UseGuards(RoleGuard)
    @Get(':id')
    async getUsersInOrganization(
        @Request() req,
        @Res() res: Response,
        @Param('id') org_id: number,
        @Query() paged: Paged
    ) {

        const { account_id } = req.user;

        const org = await this.orgService.getOrgById(org_id, account_id);

        if (!org) {
            throw new HttpException(
                `Organization does not exist with org_id: ${org_id}`,
                HttpStatus.NOT_FOUND
            );
        }

        const usersInAnOrganization = await this.usersService.getOrganizationUsers(account_id, org_id, paged);

        if (!usersInAnOrganization || usersInAnOrganization.length < 1) {
            throw new HttpException(
                `Users not found in org_id ${org_id}`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(usersInAnOrganization);
    }

    @UseGuards(RoleGuard)
    @Get('get-user/:id')
    async getUserById(
        @Request() req,
        @Res() res: Response,
        @Param('id', ParseIntPipe) id: number,
    ) {

        const { account_id } = req.user;

        const user = await this.usersService.getById(id, account_id);

        if (!user) {
            throw new HttpException(
                `User with id: ${id} does not exist`,
                HttpStatus.NOT_FOUND
            );
        }

        user.password = undefined;

        res.status(200).json(user);
    }

    @Put(':id')
    async switchUserBetweenOrg(
        @Request() req,
        @Res() res: Response,
        @Param('id', ParseIntPipe) org_id: number,
    ) {

        const { account_id, user_id, email, role_id } = req.user;

        if (role_id === 1) {
            throw new HttpException(
                `Super Admin can not switch in organization(s)`,
                HttpStatus.BAD_REQUEST
            );
        }

        const user = await this.usersService.getByEmail(email);

        const isOrgExist = await this.orgService.getOrgById(org_id, account_id);

        if (user.current_org_id === org_id) {
            throw new HttpException(
                `You are already in '${isOrgExist.name}' organization`,
                HttpStatus.BAD_REQUEST
            );
        }

        if (!isOrgExist) {
            throw new HttpException(
                `Organization with id: ${org_id} not found`,
                HttpStatus.NOT_FOUND
            );
        }

        const response = await this.usersService.switchUserBetweenOrganizations(user_id, org_id, account_id);

        if (!response) {
            throw new HttpException(
                `Failed to switch in org: ${org_id}`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json({
            message: `You have successfully switched in organization '${isOrgExist.name}'`
        });
    }

    @Delete(':id')
    async deleteUserByIds(
        @Request() req,
        @Res() res: Response,
        @Query('id') ids: any,
    ) {

        if (!ids) {
            throw new HttpException(
                'id query parameter is required',
                HttpStatus.BAD_REQUEST
            );
        }

        if (ids && typeof ids === 'string') {
            ids = ids.split(' ');
        }

        const { account_id } = req.user;

        const response = await this.usersService.deleteUserByIds(ids, account_id);

        if (!response) {
            throw new HttpException(
                `Failed to delete user(s) ${ids} or the user(s) does not exist`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(200).json({
            messsage: `User(s) with id: ${ids} deleted successfully`
        });
    }

}