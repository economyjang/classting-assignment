import { Controller, Get, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedService } from './feed.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@Controller('feeds')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Get('news')
    @HttpCode(200)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '뉴스피드 조회' })
    @ApiResponse({
        status: 200,
        description: '뉴스피드 조회 성공',
        schema: {
            example: {
                statusCode: 200,
                data: [
                    {
                        id: 13,
                        subject: '제목',
                        content: '본문',
                        created_by: '소유자',
                        created_at: '2024-02-20T11:59:22.974Z',
                        updated_at: '2024-02-20T11:59:22.974Z',
                        deleted_at: null,
                    },
                ],
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Access Token 검증 오류',
        schema: {
            example: {
                message: 'Unauthorized',
                statusCode: 401,
            },
        },
    })
    async getNewsFeed(@Request() req) {
        return await this.feedService.getNewsFeed(req.user);
    }
}
