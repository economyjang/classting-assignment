import {
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Request,
    Body,
} from '@nestjs/common';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { PageDto } from './dto/PageDto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserType } from '../../types/UserType';
import { Roles } from '../auth/decorator/roles.decorator';
import { SubscriptionDto } from './dto/SubscriptionDto';

@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
@Controller('page')
export class PageController {
    constructor(private pageService: PageService) {}

    @Post('create')
    @HttpCode(200)
    @Roles(UserType.MANAGER)
    async create(@Request() req, @Body() pageDto: PageDto) {
        await this.pageService.createPage(req.user, pageDto);
    }

    // 구독
    @Post('subscription')
    @HttpCode(200)
    async subscribe(@Request() req, @Body() subscriptionDto: SubscriptionDto) {
        await this.pageService.subscribePage(req.user, subscriptionDto);
    }

    // 구독 취소
    // 구독 중인 페이지 목록
}
