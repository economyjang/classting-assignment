import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { PageDto } from '../page/dto/PageDto';

describe('SubscriptionController', () => {
    let controller: SubscriptionController;
    let service: SubscriptionService;

    const mockSubscriptionService = {
        getMySubscribePages: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubscriptionController],
            providers: [
                {
                    provide: SubscriptionService,
                    useValue: mockSubscriptionService,
                },
            ],
        }).compile();

        controller = module.get<SubscriptionController>(SubscriptionController);
        service = module.get<SubscriptionService>(SubscriptionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getMySubscribePages', () => {
        it('SubscriptionService 올바른 호출', async () => {
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };

            await controller.getMySubscribePages(req);
            expect(service.getMySubscribePages).toHaveBeenCalledWith(req.user);
        });
    });
});
