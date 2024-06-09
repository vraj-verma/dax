import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Privileges } from "../models/privileges.model";
import { Repository } from "typeorm";

@Injectable()
export class PrivilegesService {

    constructor(
        @InjectRepository(Privileges) private privilgeRepository: Repository<Privileges>
    ) { }

    async create(payload: { create: any, read: any, update: any, delete: any }): Promise<Privileges> {
        try {

            console.log(payload)
            const response = await this.privilgeRepository.save(payload);

            console.log(response, '+++++++')
            return response as Privileges || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    // async getByUserId(user_id: number): Promise<Privileges> {
    //     try {
    //         const response = await this.privilgeRepository.findOne({ where: { user_id } });
    //         return response as Privileges || null;
    //     } catch (error) {
    //         throw new Error(`Something went wrong: ${error.message}`);
    //     }
    // }

    async getPrivilegeById(privileged_id: number): Promise<Privileges> {
        try {
            const response = await this.privilgeRepository.findOne({ where: { privileged_id } });
            return response as Privileges || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getPrivileges(): Promise<Privileges[]> {
        try {
            const response = await this.privilgeRepository.find();
            return response as Privileges[] || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }
}