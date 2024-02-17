import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { NewsModule } from './news/news.module';
import { SchoolModule } from './school/school.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        AuthModule,
        SchoolModule,
        NewsModule,
        FeedModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'classting_test',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
