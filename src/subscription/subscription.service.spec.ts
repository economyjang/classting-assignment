import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { Repository } from 'typeorm';
import { Subscription } from './entity/Subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';
import { Page } from '../page/entity/Page.entity';
import { PageService } from '../page/page.service';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionService', () => {
    let service: SubscriptionService;
    let pageService: PageService;
    let subscriptionRepository: Repository<Subscription>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionService,
                {
                    provide: PageService,
                    useValue: {
                        getNewsByPageId: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Subscription),
                    useValue: {
                        find: jest.fn(),
                        save: jest.fn(),
                        exists: jest.fn(),
                        findOne: jest.fn(),
                        softDelete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SubscriptionService>(SubscriptionService);
        pageService = module.get<PageService>(PageService);
        subscriptionRepository = module.get(getRepositoryToken(Subscription));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('학생의 구독중인 페이지 목록 조회 테스트', () => {
        it('정상 조회 테스트', async () => {
            const user = new User();
            user.id = 'test';
            user.email_id = 'test@test.com';
            user.password = 'test';
            user.type = UserType.STUDENT;

            jest.spyOn(subscriptionRepository, 'find').mockResolvedValue([]);

            await expect(service.getMySubscribePages(user)).resolves.toEqual(
                [],
            );
            expect(subscriptionRepository.find).toHaveBeenCalledWith({
                where: { user: { id: user.id } },
                relations: { user: true, page: true },
            });
        });
    });

    describe('페이지 구독 & 취소 테스트', () => {
        it('정상 구독 테스트', async () => {
            const user = new User();
            const page = new Page();
            const subscription = new Subscription().setUser(user).setPage(page);

            jest.spyOn(subscriptionRepository, 'save').mockResolvedValue(
                undefined,
            );

            await expect(
                service.saveSubscription(user, page),
            ).resolves.not.toThrow();
            expect(subscriptionRepository.save).toHaveBeenCalledWith(
                subscription,
            );
        });

        it('정상 구독 취소 테스트', async () => {
            const user = new User();
            const page = new Page();

            jest.spyOn(subscriptionRepository, 'softDelete').mockResolvedValue(
                undefined,
            );

            await expect(
                service.deleteSubscription(user, page),
            ).resolves.not.toThrow();
            expect(subscriptionRepository.softDelete).toHaveBeenCalledWith({
                user,
                page,
            });
        });
    });

    describe('학생이 구독중인 페이지의 뉴스 조회 테스트', () => {
        it('정상 조회 테스트', async () => {
            const user = new User();
            const pageId = 'test';

            jest.spyOn(subscriptionRepository, 'exists').mockResolvedValue(
                true,
            );
            jest.spyOn(pageService, 'getNewsByPageId').mockResolvedValue(
                new Page(),
            );

            await expect(
                service.getNewsBySubscribedPageId(user, pageId),
            ).resolves.not.toThrow();
            expect(subscriptionRepository.exists).toHaveBeenCalledWith({
                where: { user: { id: user.id }, page: { id: pageId } },
                relations: { user: true, page: true },
            });
        });

        it('구독하지 않은 페이지', async () => {
            const user = new User();
            const pageId = 'test';

            jest.spyOn(subscriptionRepository, 'exists').mockResolvedValue(
                false,
            );

            await expect(
                service.getNewsBySubscribedPageId(user, pageId),
            ).rejects.toThrow(NotFoundException);
            expect(subscriptionRepository.exists).toHaveBeenCalledWith({
                where: { user: { id: user.id }, page: { id: pageId } },
                relations: { user: true, page: true },
            });
        });
    });
});
