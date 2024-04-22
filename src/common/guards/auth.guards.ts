import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            // request['user'] = payload;
            request.user = payload
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

// import {
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtGuard extends AuthGuard('jwt') {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return super.canActivate(context);
//   }
//   handleRequest<TUser = any>(err: any, user: any): TUser {
//     if (err || !user) {
//       throw err || new UnauthorizedException();
//     }
//     console.log(user);
//     if (user.artistId) {
//       return user;
//     }
//     throw err || new UnauthorizedException();
//   }
// }