import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../models/users.model";
import { RolesModule } from "../roles/roles.module";
import { Utility } from "../helpers/utils";
import { OrganizationsModule } from "../organizations/org.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        RolesModule,
        OrganizationsModule
    ],
    providers: [
        UsersService,
        Utility
    ],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }