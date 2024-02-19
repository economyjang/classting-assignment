import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { News } from './entity/News.entity';
import { SubscriptionService } from '../subscription/subscription.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
    imports: [SubscriptionModule, TypeOrmModule.forFeature([Page, News])],
    providers: [PageService, SubscriptionService],
    controllers: [PageController],
})
export class PageModule {}
