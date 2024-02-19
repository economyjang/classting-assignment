import { IsNotEmpty } from 'class-validator';

export class NewsDto {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    content: string;
}
