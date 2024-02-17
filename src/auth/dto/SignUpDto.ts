import { UserType } from '../../../types/UserType';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    emailId: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    name: string;

    @IsEnum(UserType)
    type: UserType;
}
