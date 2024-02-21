import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'test@test.com',
        description: '이메일 계정',
        required: true,
    })
    @IsEmail({}, { message: '이메일 형식이 잘못되었습니다.' })
    @IsNotEmpty({ message: '이메일은 필수값 입니다.' })
    emailId: string;

    @ApiProperty({
        example: 'password',
        description: '페스워드',
        required: true,
    })
    @IsNotEmpty({ message: '패스워드는 필수값 입니다.' })
    password: string;
}
