import {
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Request,
    Body,
    Param,
    Delete,
} from '@nestjs/common';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { PageDto } from './dto/PageDto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserType } from '../../types/UserType';
import { Roles } from '../auth/decorator/roles.decorator';
import { NewsDto } from './dto/NewsDto';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PageController {
    constructor(private pageService: PageService) {}

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
}
