import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Response,
    UseGuards
} from "@nestjs/common";
import { Paged } from "../types/types";
import { OrganizationsService } from "./org.service";
import { JWTAuthGuard } from "../guards/jwt.strategy";
import { CustomValidation } from "../validations/validation";
import { ValidationPipe } from "../pipes/joi-validation.pipe";

@UseGuards(JWTAuthGuard)
@Controller('organizations')
export class OrganizationsController {

    constructor(
        private orgService: OrganizationsService
    ) { }

    @Post()
    async create(
        @Request() req,
        @Response() res,
        @Body(new ValidationPipe(CustomValidation.organizationSchema)) payload: any
    ) {

        const { account_id, user_id } = req.user;

        const isAlreadyExist = await this.orgService.getOrgByName(payload.name, account_id);

        if (isAlreadyExist) {
            throw new HttpException(
                `Organization with name '${payload.name}' is already exist`,
                HttpStatus.CONFLICT
            );
        }

        const orgPayload = {
            name: payload.name,
            user_id,
            account_id,
        }

        const response = await this.orgService.create(orgPayload);

        if (!response) {
            throw new HttpException(
                `Failed to create Organization`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(201).json(response);
    }

    @Get()
    async getOrganizations(
        @Request() req,
        @Response() res,
        @Query() paged: Paged
    ) {

        const { account_id } = req.user;

        const org = await this.orgService.getOrganizations(account_id, paged);

        if (!org || org.length < 1) {
            throw new HttpException(
                `Not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(org);
    }

    @Get(':id')
    async getOrganizationById(
        @Request() req,
        @Response() res,
        @Param('id') id: number
    ) {

        const { account_id } = req.user;

        const org = await this.orgService.getOrgById(id, account_id);

        if (!org) {
            throw new HttpException(
                `Not found with org id: ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(org);
    }

    @Patch(':id')
    async updateOrganizationById(
        @Request() req,
        @Response() res,
        @Param('id') id: number,
        @Body('name') name: string
    ) {

        const { account_id } = req.user;

        const org = await this.orgService.getOrgById(id, account_id);

        if (!org) {
            throw new HttpException(
                `Not found with org id: ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        const response = await this.orgService.updateOrgById(id, account_id, name);

        if (!response) {
            throw new HttpException(
                `Failed to udpate organization with org id: ${id}`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(200).json({
            messsage: `Organization with id: ${id} updated successfully`
        });
    }

    @Delete(':id')
    async deleteOrganizationByIds(
        @Request() req,
        @Response() res,
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

        const response = await this.orgService.deleteOrgByIds(ids, account_id);

        if (!response) {
            throw new HttpException(
                `Failed to delete organization(s) with id: ${ids} or the organization(s) does not exist`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(200).json({
            messsage: `Organization(s) with id: ${ids} deleted successfully`
        });
    }

}