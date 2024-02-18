import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'classting-test-secret-key',
        });
    }

    async validate(payload: any) {
        return {
            id: payload.id,
            emailId: payload.emailId,
            name: payload.name,
            type: payload.type,
        };
    }
}
