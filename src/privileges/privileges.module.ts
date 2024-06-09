import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Privileges } from "../models/privileges.model";
import { PrivilegesService } from "./privileges.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([Privileges]),
    ],
    providers: [PrivilegesService],
    exports: [PrivilegesService]
})
export class PrivilegesModule { }