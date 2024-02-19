import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entity/News.entity';

@Module({
    imports: [TypeOrmModule.forFeature([News])],
    providers: [NewsService],
    controllers: [NewsController],
    exports: [NewsService],
})
export class NewsModule {}
