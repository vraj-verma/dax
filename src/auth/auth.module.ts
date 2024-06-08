import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { RolesModule } from "../roles/roles.module";
import { Utility } from "../helpers/utils";

@Module({
    imports: [
        UsersModule,
        RolesModule,
    ],
    providers: [
        AuthService,
        Utility
    ]
    ,
    controllers: [AuthController]
})
export class AuthModule { }