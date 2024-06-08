import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tasks } from "../models/tasks.model";

@Module({
    imports: [
        TypeOrmModule.forFeature([Tasks])
    ],
    providers: [TasksService],
    controllers: [TasksController],
})
export class TasksModule { }