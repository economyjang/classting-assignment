import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';
import { UserType } from '../../types/UserType';
import { LoginDto } from './dto/LoginDto';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockAuthService = {
        signUpUser: jest
            .fn()
            .mockImplementation((signUpDto: SignUpDto) => Promise.resolve()),
        loginUser: jest
            .fn()
            .mockImplementation((loginDto: LoginDto) =>
                Promise.resolve({ accessToken: 'accessToken' }),
            ),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signUp', () => {
        it('AuthService 올바른 호출', async () => {
            const signUpDto = new SignUpDto();
            signUpDto.emailId = 'test@example.com';
            signUpDto.password = 'Test1234';
            signUpDto.name = 'Test Name';
            signUpDto.type = UserType.STUDENT;

            await controller.signUp(signUpDto);

            expect(service.signUpUser).toHaveBeenCalledWith(signUpDto);
        });
    });

    describe('login', () => {
        it('AuthService 올바른 호출', async () => {
            const loginDto = new LoginDto();
            loginDto.emailId = 'user@example.com';
            loginDto.password = 'password';

            await controller.login(loginDto);

            expect(service.loginUser).toHaveBeenCalledWith(loginDto);
        });

        it('should return access token on successful login', async () => {
            const loginDto = new LoginDto();
            loginDto.emailId = 'user@example.com';
            loginDto.password = 'password';

            const result = await controller.login(loginDto);

            expect(result).toEqual({ accessToken: 'accessToken' });
        });
    });
});
