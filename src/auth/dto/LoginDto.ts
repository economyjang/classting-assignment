import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'test@test.com',
        description: '이메일 계정',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    emailId: string;

    @ApiProperty({
        example: 'password',
        description: '페스워드',
        required: true,
    })
    @IsNotEmpty()
    password: string;
}
