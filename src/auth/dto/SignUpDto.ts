import { UserType } from '../../../types/UserType';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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
        description: '패스워드',
        required: true,
    })
    @IsNotEmpty({ message: '패스워드는 필수값 입니다.' })
    password: string;

    @ApiProperty({
        example: '김철수',
        description: '사용자 이름',
        required: true,
    })
    @IsNotEmpty({ message: '사용자 이름은 필수값 입니다.' })
    name: string;

    @ApiProperty({
        example: 'STUDENT | MANAGER',
        description: '사용자 타입',
        required: true,
    })
    @IsEnum(UserType, { message: '사용자 타입이 올바르지 않습니다.' })
    type: UserType;
}
