import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    emailId: string;

    @IsNotEmpty()
    password: string;
}
