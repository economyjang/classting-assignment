import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entity/Subscription.entity';
import { Page } from '../page/entity/Page.entity';
import { News } from '../news/entity/News.entity';
import { PageService } from '../page/page.service';
import { NewsService } from '../news/news.service';

@Module({
    imports: [TypeOrmModule.forFeature([Subscription, Page, News])],
    providers: [SubscriptionService, PageService, NewsService],
    controllers: [SubscriptionController],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
