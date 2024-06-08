import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tasks } from "../models/tasks.model";
import { In, Repository } from "typeorm";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>
    ) { }

    async create(payload: any): Promise<Tasks> {
        try {
            const response = await this.tasksRepository.save(payload);
            return response as Tasks || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getByName(name: string, account_id: string, org_id: number, user_id: number) {
        try {
            const response = await this.tasksRepository.findOne({ where: { task: name, account_id, org_id, user_id } });
            return response as Tasks || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getById(task_id: number, account_id: string, org_id: number, user_id: number) {
        try {
            const response = await this.tasksRepository.findOne({ where: { task_id, account_id, org_id, user_id } });
            return response as Tasks || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getTasksInAccount(account_id: string): Promise<Tasks[]> {
        try {
            const response = await this.tasksRepository.find({ where: { account_id } });
            return response as Tasks[] || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getTasksInOrg(account_id: string, org_id: number): Promise<Tasks[]> {
        try {
            const response = await this.tasksRepository.find({ where: { account_id, org_id } });
            return response as Tasks[] || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getTasksOfUser(account_id: string, user_id: number): Promise<Tasks[]> {
        try {
            const tasks = await this.tasksRepository.find({ where: { account_id, user_id } });
            return tasks as Tasks[] || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async updateTask(account_id: string, org_id: number, user_id: number, task_id: number, payload: { task: string, description: string }) {
        try {
            const response = await this.tasksRepository.update({ account_id, org_id, user_id, task_id }, payload);
            return response.affected > 0 ? true : false;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async deleteTasks(account_id: string, org_id: number, user_id: number, task_id: any) {
        try {
            const response = await this.tasksRepository.delete({ account_id, org_id, user_id, task_id: In(task_id) });
            return response.affected > 0 ? true : false;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }
}