import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { News } from '../news/entity/News.entity';
import { SubscriptionService } from '../subscription/subscription.service';
import { Subscription } from '../subscription/entity/Subscription.entity';
import { NewsService } from '../news/news.service';

@Module({
    imports: [TypeOrmModule.forFeature([Page, News, Subscription])],
    providers: [PageService, SubscriptionService, NewsService],
    controllers: [PageController],
    exports: [PageService],
})
export class PageModule {}
