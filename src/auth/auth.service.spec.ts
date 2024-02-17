import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { UserType } from '../../types/UserType';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get(getRepositoryToken(User));

        jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('signUpUser 테스트', () => {
        it('정상 회원가입', async () => {
            const signUpDto: SignUpDto = {
                emailId: 'test@example.com',
                password: 'password',
                name: 'Test User',
                type: UserType.STUDENT,
            };

            jest.spyOn(userRepository, 'exists').mockResolvedValue(false);
            jest.spyOn(userRepository, 'save').mockResolvedValue(undefined);

            await expect(service.signUpUser(signUpDto)).resolves.not.toThrow();
            expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
        });

        it('이미 존재하는 사용자', async () => {
            const signUpDto: SignUpDto = {
                emailId: 'test@example.com',
                password: 'password',
                name: 'Test User',
                type: UserType.STUDENT,
            };

            jest.spyOn(userRepository, 'exists').mockResolvedValue(true);

            await expect(service.signUpUser(signUpDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });
});
