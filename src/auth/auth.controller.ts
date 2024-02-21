import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/LoginDto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(200)
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 200,
        description: '회원가입 성공',
        schema: {
            example: {
                statusCode: 200,
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '요청 Body 검증 오류',
        schema: {
            example: {
                message: [
                    '이메일은 필수값 입니다.',
                    '이메일 형식이 잘못되었습니다.',
                    '패스워드는 필수값 입니다.',
                    '사용자 이름은 필수값 입니다.',
                    '사용자 타입이 올바르지 않습니다.',
                ],
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: '이미 존재하는 계정',
        schema: {
            example: {
                message: '이미 존재하는 계정입니다.',
                error: 'Conflict',
                statusCode: 409,
            },
        },
    })
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.authService.signUpUser(signUpDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '로그인 성공',
        schema: {
            example: {
                statusCode: 200,
                data: {
                    accessToken: 'accessToken',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '요청 Body 검증 오류',
        schema: {
            example: {
                message: [
                    '이메일은 필수값 입니다.',
                    '이메일 형식이 잘못되었습니다.',
                    '패스워드는 필수값 입니다.',
                ],
                error: 'Bad Request',
                statusCode: 400,
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: '계정 또는 패스워드 오류',
        content: {
            'application/json': {
                examples: {
                    example1: {
                        summary: '존재하지 않는 계정입니다.',
                        value: {
                            message: '존재하지 않는 계정입니다.',
                            error: 'Unauthorized',
                            statusCode: 401,
                        },
                    },
                    example2: {
                        summary: '패스워드가 일치하지 않습니다.',
                        value: {
                            message: '패스워드가 일치하지 않습니다.',
                            error: 'Unauthorized',
                            statusCode: 401,
                        },
                    },
                },
            },
        },
    })
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.loginUser(loginDto);
    }
}
