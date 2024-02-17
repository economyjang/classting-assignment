import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/SignUpDto';
import { UserType } from '../../types/UserType';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);

        jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
    });

    afterEach(() => {
        jest.clearAllMocks();
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

    describe('loginUser 테스트', () => {
        it('정상 로그인', async () => {
            const user = new User();
            user.email_id = 'test@example.com';
            user.name = 'Test User';
            user.password = 'hashedPassword';
            user.type = UserType.STUDENT;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

            const result = await service.loginUser({
                emailId: 'test@example.com',
                password: 'password',
            });

            expect(result).toEqual({ accessToken: 'jwtToken' });
            expect(jwtService.sign).toHaveBeenCalledWith({
                emailId: user.email_id,
                name: user.name,
                type: user.type,
            });
        });

        it('존재하지 않는 사용자', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            await expect(
                service.loginUser({
                    emailId: 'test@example.com',
                    password: 'password',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('패스워드 불일치', async () => {
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

            await expect(
                service.loginUser({
                    emailId: 'test@example.com',
                    password: 'password',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
