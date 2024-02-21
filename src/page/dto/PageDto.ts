import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
    @ApiProperty({
        example: '한국 고등학교',
        description: '페이지 학교명',
        required: true,
    })
    @IsNotEmpty({ message: '페이지명은 필수값 입니다.' })
    name: string;

    @ApiProperty({
        example: '한국',
        description: '페이지 지역',
        required: true,
    })
    @IsNotEmpty({ message: '지역명은 필수값 입니다.' })
    region: string;
}
