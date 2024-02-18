import { IsNotEmpty } from 'class-validator';

export class PageDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    region: string;
}