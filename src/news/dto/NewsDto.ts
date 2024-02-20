import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
    @ApiProperty({
        example: '새로운 소식 제목',
        description: '제목',
        required: true,
    })
    @IsNotEmpty()
    subject: string;

    @ApiProperty({
        example: '새로운 소식 본문',
        description: '본문',
        required: true,
    })
    @IsNotEmpty()
    content: string;
}
