import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
    @ApiProperty({
        example: '한국 고등학교',
        description: '페이지 학교명',
        required: true,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '한국',
        description: '페이지 지역',
        required: true,
    })
    @IsNotEmpty()
    region: string;
}