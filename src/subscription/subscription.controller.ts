import {
    Controller,
    Get,
    HttpCode,
    UseGuards,
    Request,
    Param,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { NewsDto } from '../news/dto/NewsDto';

@UseGuards(AuthGuard('jwt'))
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    @Get('my-pages')
    @HttpCode(200)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '구독중인 전체 페이지 조회' })
    @ApiResponse({
        status: 200,
        description: '구독중인 전체 페이지 조회 성공',
        schema: {
            example: {
                statusCode: 200,
                data: [
                    {
                        id: 8,
                        name: '페이지 이름',
                        region: '페이지 지역',
                        created_at: '2024-02-20T11:14:13.605Z',
                        updated_at: '2024-02-20T11:14:13.605Z',
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
    async getMySubscribePages(@Request() req) {
        return await this.subscriptionService.getMySubscribePages(req.user);
    }

    @Get('/:pageId/news')
    @HttpCode(200)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '구독중인 특정 페이지의 뉴스 조회' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiResponse({
        status: 200,
        description: '구독중인 특정 페이지의 뉴스 조회 성공',
        schema: {
            example: {
                statusCode: 200,
                data: [
                    {
                        id: 8,
                        name: '페이지 이름',
                        region: '페이지 지역',
                        created_at: '2024-02-20T11:14:13.605Z',
                        updated_at: '2024-02-20T11:14:13.605Z',
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
    @ApiResponse({
        status: 404,
        description: '페이지 ID 검증 오류',
        schema: {
            example: {
                message: '구독중인 페이지가 아닙니다.',
                error: 'NotFoundException',
                statusCode: 404,
            },
        },
    })
    async getNewsBySubscribedPageId(
        @Request() req,
        @Param('pageId') pageId: string,
    ) {
        return this.subscriptionService.getNewsBySubscribedPageId(
            req.user,
            pageId,
        );
    }
}
