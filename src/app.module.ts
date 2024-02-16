import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { NewsModule } from './news/news.module';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AuthModule, SchoolModule, NewsModule, FeedModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
