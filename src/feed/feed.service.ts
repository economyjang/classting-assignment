import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from './entity/Feed.entity';
import { Repository } from 'typeorm';
import { News } from '../news/entity/News.entity';
import { User } from '../auth/entity/User.entity';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(Feed) private feedRepository: Repository<Feed>,
    ) {}

    async saveFeed(user: User, news: News) {
        const feed = new Feed().setUser(user).setNews(news);
        await this.feedRepository.save(feed);
    }

    async deleteFeed(newsId: string) {
        await this.feedRepository.softDelete({ news: { id: newsId } });
    }

    async getNewsFeed(user) {
        const feedList = await this.feedRepository.find({
            where: { user: { id: user.id } },
            relations: { news: true },
            order: {
                news: {
                    created_at: { direction: 'DESC' },
                },
            },
        });

        return feedList.map((feed) => feed.news);
    }
}
