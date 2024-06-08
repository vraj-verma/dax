import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Roles } from "../models/roles.model";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Roles) private rolesRepository: Repository<Roles>
    ) { }

    async createRole(role: string): Promise<number> {
        try {
            const response = await this.rolesRepository.save({ role });
            return response ? response.role_id : null;
        } catch (e) {
            throw new Error(`Something went wrong: ${e.message}`);
        }
    }

    async getByRole(role: string): Promise<Roles> {
        try {
            const response = await this.rolesRepository.findOne({ where: { role } });
            return response as Roles || null;
        } catch (e) {
            throw new Error(`Something went wrong: ${e.message}`);
        }
    }
}