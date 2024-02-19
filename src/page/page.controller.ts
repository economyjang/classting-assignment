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

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PageController {
    constructor(private pageService: PageService) {}

    // 페이지 생성
    @Post()
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async createPage(@Request() req, @Body() pageDto: PageDto) {
        await this.pageService.createPage(req.user, pageDto);
    }

    // 페이지 구독
    @Post(':pageId/subscriptions')
    @HttpCode(200)
    async subscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.subscribePage(req.user, pageId);
    }

    // 페이지 구독 취소
    @Delete(':pageId/subscriptions')
    @HttpCode(200)
    async unSubscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.unSubscribePage(req.user, pageId);
    }

    // 페이지 소식 생성
    @Post(':pageId/news')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async createNews(
        @Request() req,
        @Param('pageId') pageId: string,
        @Body() newDto: NewsDto,
    ) {
        await this.pageService.createNews(req.user, pageId, newDto);
    }

    // 페이지 소식 삭제
    @Delete(':pageId/news/:newsId')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async deleteNews(
        @Param('pageId') pageId: string,
        @Param('newsId') newsId: string,
    ) {
        await this.pageService.deleteNews(pageId, newsId);
    }

    // 페이지 소식 수정
    @Patch(':pageId/news/:newId')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async updateNews(
        @Param('pageId') pageId: string,
        @Param('newsId') newsId: string,
        @Body() newDto: NewsDto,
    ) {
        await this.pageService.updateNews(pageId, newsId, newDto);
    }
}
