import { Injectable } from "@nestjs/common";
import { Users } from "../models/users.model";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService
    ) { }

    async createUser(payload: Users) {
        try {
            const response = await this.usersService
        } catch (error) {
            throw new error.detail
        }
    }

}