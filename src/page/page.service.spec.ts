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
import { NewsService } from '../news/news.service';
import { FeedService } from '../feed/feed.service';
import { PageDto } from './dto/PageDto';
import { Subscription } from '../subscription/entity/Subscription.entity';

describe('PageService', () => {
    let pageService: PageService;
    let subscriptionService: SubscriptionService;
    let newsService: NewsService;
    let feedService: FeedService;

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
                        getSubscriptionUserList: jest.fn(),
                    },
                },
                {
                    provide: NewsService,
                    useValue: {
                        createNews: jest.fn(),
                        deleteNews: jest.fn(),
                        updateNews: jest.fn(),
                    },
                },
                {
                    provide: FeedService,
                    useValue: {
                        saveFeed: jest.fn(),
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
        newsService = module.get<NewsService>(NewsService);
        feedService = module.get<FeedService>(FeedService);
        pageRepository = module.get(getRepositoryToken(Page));
        newsRepository = module.get(getRepositoryToken(News));
    });

    it('should be defined', () => {
        expect(pageService).toBeDefined();
    });

    describe('createPage 테스트', () => {
        it('정상 생성 테스트', async () => {
            const user = new User();
            const pageDto = new PageDto();

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
            const pageId = 'test';

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
            const pageId = 'test';

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
            const page = new Page();
            const pageId = 'test';

            const newsDto = new NewsDto();
            newsDto.subject = 'hello';
            newsDto.content = 'world';

            const news = new News()
                .setSubject(newsDto.subject)
                .setContent(newsDto.content)
                .setPage(page)
                .setCreatedBy(user.name);

            const subscription = new Subscription().setUser(user).setPage(page);

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsService, 'createNews').mockResolvedValue(news);
            jest.spyOn(
                subscriptionService,
                'getSubscriptionUserList',
            ).mockResolvedValue([subscription]);
            jest.spyOn(feedService, 'saveFeed').mockResolvedValue(undefined);

            await expect(
                pageService.createNews(user, pageId, newsDto),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: pageId, manager: { id: user.id } },
                relations: { manager: true },
            });
            expect(newsService.createNews).toHaveBeenCalledWith(
                user,
                page,
                newsDto,
            );
            expect(
                subscriptionService.getSubscriptionUserList,
            ).toHaveBeenCalledWith(pageId);
            expect(feedService.saveFeed).toHaveBeenCalledWith(
                subscription.user,
                news,
            );
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            const pageId = 'test';

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
            const user = new User();
            const pageId = 'test';
            const newsId = 'test';
            const page = new Page();

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsService, 'deleteNews').mockResolvedValue(undefined);

            await expect(
                pageService.deleteNews(user, pageId, newsId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: pageId, manager: { id: user.id } },
                relations: { manager: true },
            });
            expect(newsService.deleteNews).toHaveBeenCalledWith(pageId, newsId);
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            const pageId = 'test';
            const newsId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.deleteNews(user, pageId, newsId),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: pageId, manager: { id: user.id } },
                relations: { manager: true },
            });
        });
    });

    describe('updateNews 테스트', () => {
        it('페이지 소식 수정 테스트', async () => {
            const pageId = 'test';
            const newsId = 'test';
            const user = new User();
            const page = new Page();
            const newsDto = new NewsDto();

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(newsService, 'updateNews').mockResolvedValue(undefined);

            await expect(
                pageService.updateNews(user, pageId, newsId, newsDto),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: pageId, manager: { id: user.id } },
                relations: { manager: true },
            });
            expect(newsService.updateNews).toHaveBeenCalledWith(
                pageId,
                newsId,
                newsDto,
            );
        });

        it('존재하지 않은 페이지 테스트', async () => {
            const user = new User();
            const pageId = 'test';
            const newsId = 'test';
            const newsDto = new NewsDto();

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                pageService.updateNews(user, pageId, newsId, newsDto),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: pageId, manager: { id: user.id } },
                relations: { manager: true },
            });
        });
    });
});
