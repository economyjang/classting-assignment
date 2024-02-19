import { Controller, Get, HttpCode, UseGuards, Request } from '@nestjs/common';
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
}
