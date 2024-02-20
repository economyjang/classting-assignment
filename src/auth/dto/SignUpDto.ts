import { UserType } from '../../../types/UserType';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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
        description: '패스워드',
        required: true,
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: '김철수',
        description: '사용자 이름',
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'STUDENT | MANAGER',
        description: '사용자 타입',
        required: true,
    })
    @IsEnum(UserType)
    type: UserType;
}
