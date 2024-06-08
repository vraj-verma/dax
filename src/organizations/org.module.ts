import { Module } from "@nestjs/common";
import { OrganizationsController } from "./org.controller";
import { OrganizationsService } from "./org.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organizations } from "../models/organization.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([Organizations]),
    ],
    controllers: [
        OrganizationsController
    ],
    providers: [
        OrganizationsService
    ],
    exports: [OrganizationsService]
})
export class OrganizationsModule { }