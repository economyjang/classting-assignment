import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/SignUpDto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
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
