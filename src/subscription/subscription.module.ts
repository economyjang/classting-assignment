import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entity/Subscription.entity';
import { Page } from '../page/entity/Page.entity';
import { News } from '../news/entity/News.entity';
import { PageService } from '../page/page.service';
import { NewsService } from '../news/news.service';
import { FeedService } from '../feed/feed.service';
import { Feed } from '../feed/entity/Feed.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Subscription, Page, News, Feed])],
    providers: [SubscriptionService, PageService, NewsService, FeedService],
    controllers: [SubscriptionController],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
