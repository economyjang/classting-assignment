import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Subscription } from './entity/Subscription.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Page, Subscription])],
    providers: [PageService],
    controllers: [PageController],
})
export class PageModule {}
