import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { Repository } from 'typeorm';
import { Page } from './entity/Page.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';
import { Subscription } from './entity/Subscription.entity';
import { NotFoundException } from '@nestjs/common';

describe('PageService', () => {
    let service: PageService;
    let pageRepository: Repository<Page>;
    let subscriptionRepository: Repository<Subscription>;

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
                    },
                },
            ],
        }).compile();

        service = module.get<PageService>(PageService);
        pageRepository = module.get(getRepositoryToken(Page));
        subscriptionRepository = module.get(getRepositoryToken(Subscription));
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
            const subscriptionDto = { id: 'test' };
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(page);
            jest.spyOn(subscriptionRepository, 'save').mockResolvedValue(
                undefined,
            );

            await expect(
                service.subscribePage(user, subscriptionDto),
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
            const subscriptionDto = { id: 'test' };
            const page = new Page();
            page.id = 'test';

            jest.spyOn(pageRepository, 'findOne').mockResolvedValue(undefined);

            await expect(
                service.subscribePage(user, subscriptionDto),
            ).rejects.toThrow(NotFoundException);
            expect(pageRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'test' },
            });
        });
    });
});
