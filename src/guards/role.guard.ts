import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrivilegesService } from '../privileges/privileges.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        // private reflector: Reflector,
        private jwtService: JwtService,
        private privilegesService: PrivilegesService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;

        if (!authorization || authorization.trim() === '') {
            throw new HttpException('Please provide access token', HttpStatus.UNAUTHORIZED);
        }

        const token = authorization.replace(/bearer/gim, '').trim();

        const decodedJWTToken = await this.jwtService.verify(token);

        if (!decodedJWTToken) {
            throw new HttpException(
                `Token invalid or expired`,
                HttpStatus.UNAUTHORIZED,
            );
        }

        const privileges = await this.privilegesService.getPrivilegeById(decodedJWTToken.privileged_id);

        if (request.method == 'POST' && privileges == null || privileges?.create) {
            return true;
        } else if (request.method == 'GET' && privileges == null || privileges?.read) {
            return true;
        } else if (request.method == 'PUT' && privileges == null || privileges?.update) {
            return true;
        } else if (request.method == 'PATCH' && privileges == null || privileges?.update) {
            return true;
        } else if (request.method == 'DELETE' && privileges == null || privileges?.delete) {
            return true;
        }
        else {
            return false;
        }

        // change this with switch case


    }

    // private checkRoles(context: ExecutionContext, currentRole: number) {
    //     const routeRoles = this.reflector.get<number[]>('roles', context.getHandler());

    //     if (!routeRoles) {
    //         return true;
    //     }

    //     if (!routeRoles.some((role) => role === currentRole)) {
    //         throw new HttpException(
    //             `Your current role don't have permission to access this API`,
    //             HttpStatus.FORBIDDEN,
    //         );
    //     }
    // }
}
