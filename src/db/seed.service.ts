import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Privileges } from "../models/privileges.model";
import { Roles } from "../models/roles.model";

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Privileges) private privilegesRepository: Repository<Privileges>,
        @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    ) { }

    rolesData = [
        { role: 'Super Admin' },
    ];

    privilegesData = {
        create: true,
        read: true,
        update: true,
        delete: true,
    }

    async truncatePrivileges() {
        try {
            const truncateQuery = `TRUNCATE TABLE privileges;`
            await this.privilegesRepository.query(truncateQuery);

            console.log('Privileges table trunacted')
        } catch (e) {
            console.log('Failed to truncate privileges table', e);
            throw new Error(`Something went wrong: ${e.message}`);
        }
    }

    async truncateRoles() {
        try {
            const truncateQuery = `TRUNCATE TABLE roles;`
            await this.rolesRepository.query(truncateQuery);

            console.log('Roles table trunacted')
        } catch (e) {
            console.log('Failed to truncate role table', e);
            throw new Error(`Something went wrong: ${e.message}`);
        }
    }


    async seedRoles() {
        try {
            const response = await this.rolesRepository.save(this.rolesData);
            console.log('Roles data seeded successfully');

            return response ? true : false;
        } catch (e) {
            console.log('Failed to seed role data', e);
            throw new Error(`Something went wrong: ${e.message}`);
        }
    };

    async seedPrivileges() {
        try {
            const response = await this.privilegesRepository.save(this.privilegesData);
            console.log('Privileges data seeded successfully');

            return response ? true : false;
        } catch (e) {
            console.log('Failed to seed Privileges data', e);
            throw new Error(`Something went wrong: ${e.message}`);
        }
    };

}