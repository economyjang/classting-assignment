import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Subscription } from '../subscription/entity/Subscription.entity';
import { News } from './entity/News.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Page, Subscription, News])],
    providers: [PageService],
    controllers: [PageController],
})
export class PageModule {}
