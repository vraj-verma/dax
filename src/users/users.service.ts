import { Injectable } from "@nestjs/common";
import { Users } from "../models/users.model";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Paged } from "../types/types";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) { }

    async create(user: Users): Promise<Users> {
        try {
            const response = await this.usersRepository.save(user);
            return response || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`)
        }
    }

    async getByEmail(email: string): Promise<Users> {
        try {

            const response = await this.usersRepository.findOne({ where: { email } });
            return response as Users || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`)
        }
    }

    async getAccountUsers(account_id: string, paged: Paged): Promise<Users[]> {
        try {

            const sqlQuery = `SELECT user_id, name, email, account_id, current_org_id, createdAt, updatedAt
            FROM Users                
            WHERE account_id = '${account_id}'`;

            const result = await this.usersRepository.query(sqlQuery);

            return result as Users[] || [];
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getOrganizationUsers(account_id: string, org_id: number, paged: Paged): Promise<Users[]> {
        try {
            const sqlQuery = `SELECT user_id, name, email, account_id, current_org_id, createdAt, updatedAt
            FROM Users                
            WHERE account_id = '${account_id}' AND current_org_id = ${org_id}`;

            const result = await this.usersRepository.query(sqlQuery);

            return result as Users[] || [];
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async switchUserBetweenOrganizations(user_id: number, orgId: number, account_id: string) {
        try {
            const response = await this.usersRepository.update({ account_id, user_id }, { current_org_id: orgId });
            return response.affected > 0 ? true : false;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getById(user_id: number, account_id: string): Promise<Users> {
        try {
            const response = await this.usersRepository.findOne({ where: { user_id, account_id } });
            return response as Users || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async deleteUserByIds(user_id: any, account_id: string) {
        try {
            const response = await this.usersRepository.delete({ user_id: In(user_id), account_id });
            return response.affected > 0 ? true : false || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

}