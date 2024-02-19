import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { Repository } from 'typeorm';
import { Subscription } from './entity/Subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';

describe('SubscriptionService', () => {
    let service: SubscriptionService;
    let subscriptionRepository: Repository<Subscription>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscriptionService,
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
});
