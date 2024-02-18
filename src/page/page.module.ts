import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Page])],
    providers: [PageService],
    controllers: [PageController],
})
export class PageModule {}
