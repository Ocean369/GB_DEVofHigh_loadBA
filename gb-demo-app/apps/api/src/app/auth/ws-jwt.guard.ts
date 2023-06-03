import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private readonly authService: AuthService) { }

    async canActivate(context: ExecutionContext) {
        try {

            const client = context.switchToWs().getClient();
            const cookies: Array<string> = client.handshake.headers.cookie.split('; ');
            const regex = new RegExp('jwt=', 'g');
            let authToken = '';
            cookies.forEach(c => {
                if (regex.test(c)) {
                    authToken = c.replace(regex, '');
                }
            });

            const isAuth = await this.authService.verify(authToken);
            if (isAuth) {
                const user = await this.authService.decode(authToken);
                context.switchToWs().getClient().data.user = user;
                return true;
            }
            return false;

        } catch (error) {
            return false
        }
    }
}