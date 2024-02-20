import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Repository } from 'typeorm';
import { PageDto } from './dto/PageDto';
import { User } from '../auth/entity/User.entity';
import { NewsDto } from '../news/dto/NewsDto';
import { SubscriptionService } from '../subscription/subscription.service';
import { NewsService } from '../news/news.service';
import { FeedService } from '../feed/feed.service';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepository: Repository<Page>,
        @Inject(forwardRef(() => SubscriptionService))
        private subscriptionService: SubscriptionService,
        private newsService: NewsService,
        private feedService: FeedService,
    ) {}

    async createPage(user: User, pageDto: PageDto) {
        const page = new Page()
            .setName(pageDto.name)
            .setRegion(pageDto.region)
            .setManager(user);
        return await this.pageRepository.save(page);
    }

    async subscribePage(user: User, pageId: string) {
        const page = await this.validateByPageId(pageId);
        return await this.subscriptionService.saveSubscription(user, page);
    }

    async unSubscribePage(user: User, pageId: string) {
        const page = await this.validateByPageId(pageId);
        await this.subscriptionService.deleteSubscription(user, page);
    }

    async createNews(user: User, pageId: string, newsDto: NewsDto) {
        const page = await this.validateByUserWithPageId(user, pageId);
        const savedNews = await this.newsService.createNews(
            user,
            page,
            newsDto,
        );

        // 현재 페이지를 구독한 전체 사용자 목록 조회
        const subscriptionUserList =
            await this.subscriptionService.getSubscriptionUserList(pageId);
        // 사용자 목록만큼 feed 를 저장
        for (const subscription of subscriptionUserList) {
            const user = subscription.user;
            await this.feedService.saveFeed(user, savedNews);
        }

        return savedNews;
    }

    async deleteNews(user: User, pageId: string, newsId: string) {
        await this.validateByUserWithPageId(user, pageId);
        await this.newsService.deleteNews(pageId, newsId);
    }

    async updateNews(
        user: User,
        pageId: string,
        newsId: string,
        newsDto: NewsDto,
    ) {
        await this.validateByUserWithPageId(user, pageId);
        await this.newsService.updateNews(pageId, newsId, newsDto);
    }

    async getNewsByPageId(pageId: string) {
        return await this.pageRepository.findOne({
            where: { id: pageId },
            relations: {
                news: true,
            },
            order: {
                news: {
                    created_at: { direction: 'DESC' },
                },
            },
        });
    }

    private async validateByPageId(pageId: string) {
        const page = await this.pageRepository.findOne({
            where: { id: pageId },
        });

        if (!page) {
            throw new NotFoundException('존재하지 않는 페이지 입니다.');
        }

        return page;
    }

    private async validateByUserWithPageId(user: User, pageId: string) {
        const page = await this.pageRepository.findOne({
            where: { id: pageId, manager: { id: user.id } },
            relations: { manager: true },
        });

        if (!page) {
            throw new NotFoundException('존재하지 않는 페이지 입니다.');
        }

        return page;
    }
}
