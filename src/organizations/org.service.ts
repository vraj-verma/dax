import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Organizations } from "../models/organization.model";
import { Paged } from "../types/types";

@Injectable()
export class OrganizationsService {

    constructor(
        @InjectRepository(Organizations) private orgRepository: Repository<Organizations>
    ) { }

    async create(payload: Organizations): Promise<Organizations> {
        try {
            const response = await this.orgRepository.save(payload);
            return response as Organizations || null;

        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getOrgById(org_id: number, account_id: string): Promise<Organizations> {
        try {
            const response = await this.orgRepository.findOne({ where: { org_id, account_id } });
            return response as Organizations || null;

        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getOrgByName(name: string, account_id: string): Promise<Organizations> {
        try {
            const response = await this.orgRepository.findOne({ where: { name, account_id } });
            return response as Organizations || null;

        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async getOrganizations(account_id: string, paged: Paged): Promise<Organizations[]> {
        try {
            const response = await this.orgRepository.find(
                {
                    where: { account_id },
                    skip: paged.offset,
                    take: paged.limit
                }
            );
            return response as Organizations[] || null;

        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async updateOrgById(org_id: number, account_id: string, payload: string): Promise<boolean> {
        try {
            const response = await this.orgRepository.update({ org_id, account_id }, { name: payload });
            return response.affected > 0 ? true : false || null;

        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

    async deleteOrgByIds(org_ids: any, account_id: string) {
        try {
            const response = await this.orgRepository.delete({ org_id: In(org_ids), account_id });
            return response.affected > 0 ? true : false || null;
        } catch (error) {
            throw new Error(`Something went wrong: ${error.message}`);
        }
    }

}