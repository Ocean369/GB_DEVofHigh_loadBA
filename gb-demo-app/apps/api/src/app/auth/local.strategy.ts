import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersEntity } from '../users/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<UsersEntity> {
        const _user = await this.authService.validateUser(email, password);
        if (!_user) {
            throw new UnauthorizedException();
        }

        return _user;
    }
}