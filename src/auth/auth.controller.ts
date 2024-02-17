import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignUpDto } from './dto/SignUpDto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(200)
    async signUp(@Body() signUpDto: SignUpDto) {
        await this.authService.signUpUser(signUpDto);
    }
}
