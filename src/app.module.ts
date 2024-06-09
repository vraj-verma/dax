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
import { ConfigModule } from '@nestjs/config';
import { PrivilegesModule } from './privileges/privileges.module';
import { SeedService } from './db/seed.service';
import { SeedModule } from './db/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: process.env.MYSQL_TYPE as any,
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [
        Users,
        Organizations,
        Tasks,
        Roles,
        Privileges,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Privileges, Roles]),
    AuthModule,
    UsersModule,
    TasksModule,
    RolesModule,
    SeedModule,
    PrivilegesModule,
    OrganizationsModule,
    GuardModule
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule { }
