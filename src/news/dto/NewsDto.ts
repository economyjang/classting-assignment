import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
    @ApiProperty({
        example: '새로운 소식 제목',
        description: '제목',
        required: true,
    })
    @IsNotEmpty({ message: '제목은 필수값 입니다.' })
    subject: string;

    @ApiProperty({
        example: '새로운 소식 본문',
        description: '본문',
        required: true,
    })
    @IsNotEmpty({ message: '본문은 필수값 입니다.' })
    content: string;
}
