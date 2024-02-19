import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Repository } from 'typeorm';
import { PageDto } from './dto/PageDto';
import { User } from '../auth/entity/User.entity';
import { Subscription } from './entity/Subscription.entity';
import { NewsDto } from './dto/NewsDto';
import { News } from './entity/News.entity';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepository: Repository<Page>,
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @InjectRepository(News) private newsRepository: Repository<News>,
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
        const subscription = new Subscription().setUser(user).setPage(page);
        await this.subscriptionRepository.save(subscription);
    }

    async unSubscribePage(user: User, pageId: string) {
        const page = await this.validatePageId(pageId);
        await this.subscriptionRepository.softDelete({ user, page });
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

        const newsResult = await this.newsRepository.findOne({
            where: { id: newsId, page: { id: pageId } },
            relations: { page: true },
        });
        if (!newsResult) {
            throw new NotFoundException('존재하지 않는 소식 입니다.');
        }

        await this.newsRepository.softDelete(newsId);
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
