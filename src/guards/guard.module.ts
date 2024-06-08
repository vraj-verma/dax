import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: 'sdfsdjfnsfd65674d8676dsbkd184',
            signOptions: { expiresIn: '5h' },
        }),
    ],
})
export class GuardModule { }