import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from '../../../utils/crypto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const _user = await this.usersService.findByEmail(email);
    if (_user && (await compare(pass, _user.password))) {
      const { password, ...result } = _user;
      return result;
    }
    return null;
  }

  async login(user: any) {

    const payload = { email: user.firstName, id: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      idUser: user.id
    };
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}

