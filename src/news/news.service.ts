import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entity/News.entity';
import { User } from '../auth/entity/User.entity';
import { NewsDto } from './dto/NewsDto';
import { Page } from '../page/entity/Page.entity';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(News) private newsRepository: Repository<News>,
    ) {}

    async createNews(user: User, page: Page, newsDto: NewsDto) {
        const news = new News()
            .setSubject(newsDto.subject)
            .setContent(newsDto.content)
            .setCreatedBy(user.name)
            .setPage(page);
        await this.newsRepository.save(news);
    }

    async deleteNews(pageId: string, newsId: string) {
        await this.validateNewsId(newsId, pageId);
        await this.newsRepository.softDelete(newsId);
    }

    async updateNews(pageId: string, newsId: string, newsDto: NewsDto) {
        const newsResult = await this.validateNewsId(newsId, pageId);

        newsResult.setSubject(newsDto.subject).setContent(newsDto.content);
        await this.newsRepository.save(newsResult);
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
}
