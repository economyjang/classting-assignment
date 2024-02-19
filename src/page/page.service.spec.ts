import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { Repository } from 'typeorm';
import { Page } from './entity/Page.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';
import { Subscription } from './entity/Subscription.entity';
import { NotFoundException } from '@nestjs/common';
import { News } from './entity/News.entity';
import { NewsDto } from './dto/NewsDto';

describe('PageService', () => {
    let service: PageService;
    let pageRepository: Repository<Page>;
    let subscriptionRepository: Repository<Subscription>;
    let newsRepository: Repository<News>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PageService,
                {
                    provide: getRepositoryToken(Page),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Subscription),
                    useValue: {
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                        softDelete: jest.fn(),
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

        service = module.get<PageService>(PageService);
        pageRepository = module.get(getRepositoryToken(Page));
        subscriptionRepository = module.get(getRepositoryToken(Subscription));
        newsRepository = module.get(getRepositoryToken(News));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
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
                service.createPage(user, pageDto),
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
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;
            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(subscriptionRepository, 'save').mockResolvedValue(
                undefined,
            );

            await expect(
                service.subscribePage(user, pageId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(subscriptionRepository.save).toHaveBeenCalledWith({
                user: user,
                page: page,
            });
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

            await expect(service.subscribePage(user, pageId)).rejects.toThrow(
                NotFoundException,
            );
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });

    describe('unSubscribePage 테스트', () => {
        it('정상 구독 해지 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;
            const pageId = 'test';
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(subscriptionRepository, 'softDelete').mockResolvedValue(
                undefined,
            );

            await expect(
                service.unSubscribePage(user, pageId),
            ).resolves.not.toThrow();
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
            expect(subscriptionRepository.softDelete).toHaveBeenCalledWith({
                user: user,
                page: page,
            });
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

            await expect(service.unSubscribePage(user, pageId)).rejects.toThrow(
                NotFoundException,
            );
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
                service.createNews(user, pageId, newsDto),
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

            await expect(service.unSubscribePage(user, pageId)).rejects.toThrow(
                NotFoundException,
            );
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
                service.deleteNews(pageId, newsId),
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

            await expect(service.deleteNews(pageId, newsId)).rejects.toThrow(
                NotFoundException,
            );
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

            await expect(service.deleteNews(pageId, newsId)).rejects.toThrow(
                NotFoundException,
            );
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });
});
