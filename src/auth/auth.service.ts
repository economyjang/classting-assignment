import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/SignUpDto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/LoginDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async signUpUser(signUpDto: SignUpDto) {
        const existsResult = await this.userRepository.exists({
            where: { email_id: signUpDto.emailId },
        });
        if (existsResult) {
            throw new ConflictException('이미 존재하는 계정입니다.');
        }

        const user = new User()
            .setEmailId(signUpDto.emailId)
            .setPassword(await this.hashPassword(signUpDto.password))
            .setName(signUpDto.name)
            .setType(signUpDto.type);

        await this.userRepository.save(user);
    }

    async loginUser(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { email_id: loginDto.emailId },
        });
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 계정입니다.');
        }

        const isValidPassword = await this.comparePasswords(
            loginDto.password,
            user.password,
        );
        if (!isValidPassword) {
            throw new UnauthorizedException('패스워드가 일치하지 않습니다.');
        }

        const payload = {
            id: user.id,
            emailId: user.email_id,
            name: user.name,
            type: user.type,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async validateUser(id: string) {
        return await this.userRepository.findOne({where: {id}});
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hashSync(password, 10);
    }

    private async comparePasswords(
        password: string,
        storedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compareSync(password, storedPassword);
    }
}
