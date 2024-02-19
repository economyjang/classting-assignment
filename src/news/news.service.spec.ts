import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { News } from './entity/News.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entity/User.entity';
import { NewsDto } from './dto/NewsDto';
import { Page } from '../page/entity/Page.entity';
import { UserType } from '../../types/UserType';
import { NotFoundException } from '@nestjs/common';

describe('NewsService', () => {
    let service: NewsService;
    let repository: Repository<News>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NewsService,
                {
                    provide: getRepositoryToken(News),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                        softDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<NewsService>(NewsService);
        repository = module.get(getRepositoryToken(News));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createNews 테스트', () => {
        it('정상 생성 테스트', async () => {
            const user = new User().setName('test');
            const page = new Page();
            const newsDto = new NewsDto();
            newsDto.subject = 'test';
            newsDto.content = 'test';
            const news = new News()
                .setSubject(newsDto.subject)
                .setContent(newsDto.content)
                .setCreatedBy(user.name)
                .setPage(page);

            jest.spyOn(repository, 'save').mockResolvedValue(undefined);

            await expect(
                service.createNews(user, page, newsDto),
            ).resolves.not.toThrow();
            expect(repository.save).toHaveBeenCalledWith(news);
        });
    });

    describe('deleteNews 테스트', () => {
        it('정상 생성 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const news = new News();

            jest.spyOn(repository, 'findOne').mockResolvedValue(news);

            await expect(
                service.deleteNews(pageId, newsId),
            ).resolves.not.toThrow();
            expect(repository.softDelete).toHaveBeenCalledWith(newsId);
        });

        it('존재하지 않은 뉴스 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';

            jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

            await expect(service.deleteNews(pageId, newsId)).rejects.toThrow(
                NotFoundException,
            );
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: newsId, page: { id: pageId } },
                relations: { page: true },
            });
        });
    });

    describe('updateNews 테스트', () => {
        it('정상 생성 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const newsDto = new NewsDto();
            const news = new News();

            jest.spyOn(repository, 'findOne').mockResolvedValue(news);

            await expect(
                service.updateNews(pageId, newsId, newsDto),
            ).resolves.not.toThrow();
            expect(repository.save).toHaveBeenCalledWith(news);
        });

        it('존재하지 않은 뉴스 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';

            jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

            await expect(service.deleteNews(pageId, newsId)).rejects.toThrow(
                NotFoundException,
            );
            expect(repository.findOne).toHaveBeenCalledWith({
                where: { id: newsId, page: { id: pageId } },
                relations: { page: true },
            });
        });
    });
});
