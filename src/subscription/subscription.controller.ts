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

@UseGuards(AuthGuard('jwt'))
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    @Get('my-pages')
    @HttpCode(200)
    async getMySubscribePages(@Request() req) {
        return await this.subscriptionService.getMySubscribePages(req.user);
    }

    @Get('/:pageId/news')
    @HttpCode(200)
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
