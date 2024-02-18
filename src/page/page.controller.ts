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

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('pages')
export class PageController {
    constructor(private pageService: PageService) {}

    @Post()
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async create(@Request() req, @Body() pageDto: PageDto) {
        await this.pageService.createPage(req.user, pageDto);
    }

    @Post(':pageId/subscriptions')
    @HttpCode(200)
    async subscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.subscribePage(req.user, pageId);
    }

    @Delete(':pageId/subscriptions')
    @HttpCode(200)
    async unSubscribe(@Request() req, @Param('pageId') pageId: string) {
        await this.pageService.unSubscribePage(req.user, pageId);
    }
}
