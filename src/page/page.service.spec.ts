import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { Repository } from 'typeorm';
import { Page } from './entity/Page.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';
import { NotFoundException } from '@nestjs/common';
import { News } from '../news/entity/News.entity';
import { NewsDto } from '../news/dto/NewsDto';
import { SubscriptionService } from '../subscription/subscription.service';

describe('PageService', () => {
    let pageService: PageService;
    let subscriptionService: SubscriptionService;

    let pageRepository: Repository<Page>;
    let newsRepository: Repository<News>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PageService,
                {
                    provide: SubscriptionService,
                    useValue: {
                        saveSubscription: jest.fn(),
                        deleteSubscription: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Page),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
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

        pageService = module.get<PageService>(PageService);
        subscriptionService =
            module.get<SubscriptionService>(SubscriptionService);
        pageRepository = module.get(getRepositoryToken(Page));
        newsRepository = module.get(getRepositoryToken(News));
    });

    it('should be defined', () => {
        expect(pageService).toBeDefined();
    });

    describe('createPage 테스트', () => {
        it('정상 생성 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.MANAGER;
            const pageDto = { name: 'Test Page', region: 'Test Region' };

            jest.spyOn(pageRepository, 'save').mockResolvedValue(undefined);

            await expect(
                pageService.createPage(user, pageDto),
            ).resolves.not.toThrow();
            expect(pageRepository.save).toHaveBeenCalledWith({
                name: pageDto.name,
                region: pageDto.region,
                manager: user,
            });
        });
    });

    describe('subscribePage 테스트', () => {
        it('정상 구독 테스트', async () => {
            const user = new User();
            const page = new Page();
            const pageId = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(
                subscriptionService,
                'saveSubscription',
            ).mockResolvedValue(undefined);

            await expect(
                pageService.subscribePage(user, pageId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(subscriptionService.saveSubscription).toHaveBeenCalledWith(
                user,
                page,
            );
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;
            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.subscribePage(user, pageId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });

    describe('unSubscribePage 테스트', () => {
        it('정상 구독 해지 테스트', async () => {
            const user = new User();
            const page = new Page();
            const pageId = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(
                subscriptionService,
                'deleteSubscription',
            ).mockResolvedValue(undefined);

            await expect(
                pageService.unSubscribePage(user, pageId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(subscriptionService.deleteSubscription).toHaveBeenCalledWith(
                user,
                page,
            );
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;
            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.unSubscribePage(user, pageId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });

    describe('createNews 테스트', () => {
        it('페이지 소식 생성 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.MANAGER;

            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            const newsDto = new NewsDto();
            newsDto.subject = 'hello';
            newsDto.content = 'world';

            const news = new News()
                .setSubject(newsDto.subject)
                .setContent(newsDto.content)
                .setPage(page)
                .setCreatedBy(user.name);

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsRepository, 'save').mockResolvedValue(undefined);

            await expect(
                pageService.createNews(user, pageId, newsDto),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(newsRepository.save).toHaveBeenCalledWith(news);
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;
            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.unSubscribePage(user, pageId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });

    describe('deleteNews 테스트', () => {
        it('페이지 소식 삭제 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const news = new News();
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsRepository, 'findOne').mockResolvedValue(news);
            jest.spyOn(newsRepository, 'softDelete').mockResolvedValue(
                undefined,
            );

            await expect(
                pageService.deleteNews(pageId, newsId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(newsRepository.findOne).toHaveBeenCalledWith({
                where: { id: newsId, page: { id: pageId } },
                relations: { page: true },
            });
            expect(newsRepository.softDelete).toHaveBeenCalledWith(newsId);
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.deleteNews(pageId, newsId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });

        it('존재하지 않은 뉴스 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(newsRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.deleteNews(pageId, newsId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });

    describe('updateNews 테스트', () => {
        it('페이지 소식 수정 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const news = new News();
            const page = new Page();
            const newsDto = new NewsDto();

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsRepository, 'findOne').mockResolvedValue(news);
            jest.spyOn(newsRepository, 'save').mockResolvedValue(undefined);

            await expect(
                pageService.updateNews(pageId, newsId, newsDto),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(newsRepository.findOne).toHaveBeenCalledWith({
                where: { id: newsId, page: { id: pageId } },
                relations: { page: true },
            });
            expect(newsRepository.save).toHaveBeenCalledWith(news);
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const newsDto = new NewsDto();

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.updateNews(pageId, newsId, newsDto),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });

        it('존재하지 않은 뉴스 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const newsDto = new NewsDto();

            jest.spyOn(newsRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.updateNews(pageId, newsId, newsDto),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });
});
