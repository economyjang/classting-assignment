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
import { News } from '../news/entity/News.entity';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepository: Repository<Page>,
        @InjectRepository(News) private newsRepository: Repository<News>,
        @Inject(forwardRef(() => SubscriptionService))
        private subscriptionService: SubscriptionService,
    ) {}

    async createPage(user: User, pageDto: PageDto) {
        const page = new Page()
            .setName(pageDto.name)
            .setRegion(pageDto.region)
            .setManager(user);
        await this.pageRepository.save(page);
    }

    async subscribePage(user: User, pageId: string) {
        const page = await this.validatePageId(pageId);
        await this.subscriptionService.saveSubscription(user, page);
    }

    async unSubscribePage(user: User, pageId: string) {
        const page = await this.validatePageId(pageId);
        await this.subscriptionService.deleteSubscription(user, page);
    }

    async createNews(user: User, pageId: string, newsDto: NewsDto) {
        const page = await this.validatePageId(pageId);
        const news = new News()
            .setSubject(newsDto.subject)
            .setContent(newsDto.content)
            .setCreatedBy(user.name)
            .setPage(page);
        await this.newsRepository.save(news);
    }

    async deleteNews(pageId: string, newsId: string) {
        await this.validatePageId(pageId);
        await this.validateNewsId(newsId, pageId);

        await this.newsRepository.softDelete(newsId);
    }

    async updateNews(pageId: string, newsId: string, newsDto: NewsDto) {
        await this.validatePageId(pageId);
        const newsResult = await this.validateNewsId(newsId, pageId);

        newsResult.setSubject(newsDto.subject).setContent(newsDto.content);
        await this.newsRepository.save(newsResult);
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

    private async validateNewsId(newsId: string, pageId: string) {
        const newsResult = await this.newsRepository.findOne({
            where: { id: newsId, page: { id: pageId } },
            relations: { page: true },
        });
        if (!newsResult) {
            throw new NotFoundException('존재하지 않는 소식 입니다.');
        }

        return newsResult;
    }

    private async validatePageId(pageId: string) {
        const page = await this.pageRepository.findOne({
            where: { id: pageId },
        });
        if (!page) {
            throw new NotFoundException('존재하지 않는 페이지 입니다.');
        }

        return page;
    }
}
