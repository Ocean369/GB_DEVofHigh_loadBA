import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractFromCookies,
            ]),
            //ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    private static extractFromCookies(req: Request) {
        console.log('cookie in req => ', req.cookies);
        return req.cookies && 'jwt' in req.cookies ? req.cookies.jwt : null
    }

    async validate(payload: any) {
        console.log(payload);
        const _user = await this.userService.findById(payload.id);
        return {
            userId: payload.id,
            userRoles: _user.roles
        }
    };

}