import {
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Request,
    Body,
    Param,
    Delete,
    Patch,
} from '@nestjs/common';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { PageDto } from './dto/PageDto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserType } from '../../types/UserType';
import { Roles } from '../auth/decorator/roles.decorator';
import { NewsDto } from '../news/dto/NewsDto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PageController {
    constructor(private pageService: PageService) {}

    // 페이지 생성
    @Post()
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 생성' })
    @ApiResponse({
        status: 200,
        description: '페이지 생성 성공',
        schema: {
            example: {
                statusCode: 200,
                data: {
                    pageId: 'pageId',
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '요청 Body 검증 오류',
        schema: {
            example: {
                message: [
                    '페이지명은 필수값 입니다.',
                    '지역명은 필수값 입니다.',
                ],
                error: 'Bad Request',
                statusCode: 400,
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
        status: 409,
        description: '페이지 생성 오류',
        schema: {
            example: {
                message: '관리자는 여러개의 페이지를 소유할 수 없습니다.',
                error: 'ConflictException',
                statusCode: 409,
            },
        },
    })
    @ApiBody({ type: PageDto })
    async createPage(@Request() req, @Body() pageDto: PageDto) {
        const result = await this.pageService.createPage(req.user, pageDto);
        return { pageId: result.id };
    }

    // 페이지 구독
    @Post(':pageId/subscriptions')
    @HttpCode(200)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 구독' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiResponse({
        status: 200,
        description: '구독 성공',
        schema: {
            example: {
                statusCode: 200,
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
                message: '존재하지 않는 페이지 입니다.',
                error: 'NotFoundException',
                statusCode: 404,
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: '이미 존재하는 구독 페이지',
        schema: {
            example: {
                message: '이미 구독중인 페이지 입니다.',
                error: 'ConflictException',
                statusCode: 409,
            },
        },
    })
    async subscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.subscribePage(req.user, pageId);
    }

    // 페이지 구독 취소
    @Delete(':pageId/subscriptions')
    @HttpCode(200)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 구독 취소' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiResponse({
        status: 200,
        description: '구독 취소 성공',
        schema: {
            example: {
                statusCode: 200,
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
                message: '존재하지 않는 페이지 입니다.',
                error: 'NotFoundException',
                statusCode: 404,
            },
        },
    })
    @ApiResponse({
        status: 409,
        description: '구독중인 목록에 없는 페이지',
        schema: {
            example: {
                message: '구독중인 페이지가 아닙니다.',
                error: 'ConflictException',
                statusCode: 409,
            },
        },
    })
    async unSubscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.unSubscribePage(req.user, pageId);
    }

    // 페이지 소식 생성
    @Post(':pageId/news')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 소식 생성' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiResponse({
        status: 200,
        description: '소식 생성 성공',
        schema: {
            example: {
                statusCode: 200,
                data: {
                    newsId: 'newsId',
                },
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
                message: '존재하지 않는 페이지 입니다.',
                error: 'NotFoundException',
                statusCode: 404,
            },
        },
    })
    async createNews(
        @Request() req,
        @Param('pageId') pageId: string,
        @Body() newDto: NewsDto,
    ) {
        const result = await this.pageService.createNews(
            req.user,
            pageId,
            newDto,
        );
        return { newsId: result.id };
    }

    // 페이지 소식 삭제
    @Delete(':pageId/news/:newsId')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 소식 삭제' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiParam({ name: 'newsId', type: 'string', description: '소식 ID' })
    @ApiResponse({
        status: 200,
        description: '소식 삭제 성공',
        schema: {
            example: {
                statusCode: 200,
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
        description: '페이지 ID, 소식 ID 검증 오류',
        content: {
            'application/json': {
                examples: {
                    example1: {
                        summary: '존재하지 않는 페이지 입니다.',
                        value: {
                            message: '존재하지 않는 페이지 입니다.',
                            error: 'NotFoundException',
                            statusCode: 404,
                        },
                    },
                    example2: {
                        summary: '존재하지 않는 소식 입니다.',
                        value: {
                            message: '존재하지 않는 소식 입니다.',
                            error: 'NotFoundException',
                            statusCode: 404,
                        },
                    },
                },
            },
        },
    })
    async deleteNews(
        @Request() req,
        @Param('pageId') pageId: string,
        @Param('newsId') newsId: string,
    ) {
        await this.pageService.deleteNews(req.user, pageId, newsId);
    }

    // 페이지 소식 수정
    @Patch(':pageId/news/:newsId')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    @ApiBearerAuth('Bearer Token')
    @ApiOperation({ summary: '페이지 소식 수정' })
    @ApiParam({ name: 'pageId', type: 'string', description: '페이지 ID' })
    @ApiParam({ name: 'newsId', type: 'string', description: '소식 ID' })
    @ApiResponse({
        status: 200,
        description: '소식 수정 성공',
        schema: {
            example: {
                statusCode: 200,
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
        description: '페이지 ID, 소식 ID 검증 오류',
        content: {
            'application/json': {
                examples: {
                    example1: {
                        summary: '존재하지 않는 페이지 입니다.',
                        value: {
                            message: '존재하지 않는 페이지 입니다.',
                            error: 'NotFoundException',
                            statusCode: 404,
                        },
                    },
                    example2: {
                        summary: '존재하지 않는 소식 입니다.',
                        value: {
                            message: '존재하지 않는 소식 입니다.',
                            error: 'NotFoundException',
                            statusCode: 404,
                        },
                    },
                },
            },
        },
    })
    @ApiBody({ type: NewsDto })
    async updateNews(
        @Request() req,
        @Param('pageId') pageId: string,
        @Param('newsId') newsId: string,
        @Body() newDto: NewsDto,
    ) {
        await this.pageService.updateNews(req.user, pageId, newsId, newDto);
    }
}
