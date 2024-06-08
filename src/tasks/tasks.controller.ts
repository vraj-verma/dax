import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { TasksService } from "./tasks.service";
import { ValidationPipe } from "../pipes/joi-validation.pipe";
import { CustomValidation } from "../validations/validation";
import { JWTAuthGuard } from "../guards/jwt.strategy";

@UseGuards(JWTAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ) { }


    @Post()
    async createTask(
        @Request() req,
        @Res() res: Response,
        @Body(new ValidationPipe(CustomValidation.taskSchema)) payload: any
    ) {

        const { account_id, org_id, user_id, role_id } = req.user;

        if (role_id === 1) {
            throw new HttpException(
                `Super Admin can not create task`,
                HttpStatus.BAD_REQUEST
            );
        }

        const task = await this.tasksService.getByName(payload.task, account_id, org_id, user_id);

        if (task) {
            throw new HttpException(
                `Task with name: ${payload.task} already exist`,
                HttpStatus.CONFLICT
            );
        }

        const taskPayload = {
            task: payload.task,
            description: payload.description,
            account_id,
            org_id,
            user_id
        }

        const response = await this.tasksService.create(taskPayload);

        if (!response) {
            throw new HttpException(
                `Failed to create task`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(201).json(response);

    }

    @Get('organization')
    async getTasksInOrg(
        @Request() req,
        @Res() res: Response,
    ) {

        const { account_id, org_id } = req.user;

        const tasks = await this.tasksService.getTasksInOrg(account_id, org_id);

        if (!tasks || tasks.length < 1) {
            throw new HttpException(
                `Tasks not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(tasks);
    }

    @Get('account')
    async getTasksInAccount(
        @Request() req,
        @Res() res: Response,
    ) {

        const { account_id } = req.user;

        const tasks = await this.tasksService.getTasksInAccount(account_id);

        if (!tasks || tasks.length < 1) {
            throw new HttpException(
                `Tasks not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(tasks);
    }

    @Get('user')
    async getTasksOfUser(
        @Request() req,
        @Res() res: Response,
    ) {

        const { account_id, user_id } = req.user;

        const tasks = await this.tasksService.getTasksOfUser(account_id, user_id);

        if (!tasks || tasks.length < 1) {
            throw new HttpException(
                `Tasks not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(tasks);
    }

    @Get(':id')
    async getTask(
        @Request() req,
        @Res() res: Response,
        @Param('id', ParseIntPipe) task_id: number,
    ) {

        const { account_id, org_id, user_id } = req.user;

        const task = await this.tasksService.getById(task_id, account_id, org_id, user_id);

        if (!task) {
            throw new HttpException(
                `Tasks not found`,
                HttpStatus.NOT_FOUND
            );
        }

        res.status(200).json(task);
    }

    @Put(':id')
    async updateTask(
        @Request() req,
        @Res() res: Response,
        @Param('id', ParseIntPipe) task_id: number,
        @Body(new ValidationPipe(CustomValidation.taskSchema)) payload: any
    ) {

        const { account_id, org_id, user_id } = req.user;

        const task = await this.tasksService.getById(task_id, account_id, org_id, user_id);

        if (!task) {
            throw new HttpException(
                `Tasks not found`,
                HttpStatus.NOT_FOUND
            );
        }

        const response = await this.tasksService.updateTask(account_id, org_id, user_id, task_id, payload);

        if (!response) {
            throw new HttpException(
                `Failed to update task`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(200).json({
            message: `Task with id: ${task_id} updated successfully`
        });
    }

    @Delete()
    async deleteTaskByIds(
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

        const { account_id, org_id, user_id } = req.user;

        const response = await this.tasksService.deleteTasks(account_id, org_id, user_id, ids);

        if (!response) {
            throw new HttpException(
                `Failed to delete task(s) ${ids} or the task(s) does not exist`,
                HttpStatus.BAD_REQUEST
            );
        }

        res.status(200).json({
            messsage: `Task with id: ${ids} deleted successfully`
        });
    }
}