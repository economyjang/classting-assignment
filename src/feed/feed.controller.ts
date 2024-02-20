import { Controller, Get, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedService } from './feed.service';

@UseGuards(AuthGuard('jwt'))
@Controller('feeds')
export class FeedController {
    constructor(private feedService: FeedService) {}

    @Get('news')
    @HttpCode(200)
    async getNewsFeed(@Request() req) {
        return await this.feedService.getNewsFeed(req.user);
    }
}
