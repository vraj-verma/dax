import { Module } from "@nestjs/common";
import { RolesModule } from "../roles/roles.module";
import { PrivilegesModule } from "../privileges/privileges.module";


@Module({
    imports: [
        RolesModule,
        PrivilegesModule
    ],
})
export class SeedModule { }