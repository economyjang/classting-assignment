import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';
import { UserType } from '../../types/UserType';

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService;

    const mockAuthService = {
        signUpUser: jest
            .fn()
            .mockImplementation((signUpDto: SignUpDto) => Promise.resolve()),
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
});
