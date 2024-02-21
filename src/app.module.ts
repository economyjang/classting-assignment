import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FeedModule } from './feed/feed.module';
import { NewsModule } from './news/news.module';
import { PageModule } from './page/page.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './passport/jwt.strategy';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
    imports: [
        AuthModule,
        PageModule,
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
        SubscriptionModule,
    ],
    controllers: [],
    providers: [JwtStrategy],
})
export class AppModule {}
