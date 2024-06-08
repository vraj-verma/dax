import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './models/users.model';
import { Tasks } from './models/tasks.model';
import { Roles } from './models/roles.model';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { RolesModule } from './roles/roles.module';
import { Organizations } from './models/organization.model';
import { OrganizationsModule } from './organizations/org.module';
import { Privileges } from './models/privileges.model';
import { GuardModule } from './guards/guard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'dax_db',
      entities: [
        Users,
        Organizations,
        Tasks,
        Roles,
        Privileges,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    RolesModule,
    OrganizationsModule,
    GuardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
