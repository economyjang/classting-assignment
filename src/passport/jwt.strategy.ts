import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'classting-test-secret-key',
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.id);
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
        }

        return user;
    }
}
