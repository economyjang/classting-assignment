import { Test, TestingModule } from '@nestjs/testing';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { AuthGuard } from '@nestjs/passport';

describe('FeedController', () => {
    let controller: FeedController;
    let service: FeedService;

    const mockFeedService = {
        getNewsFeed: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FeedController],
            providers: [
                {
                    provide: FeedService,
                    useValue: mockFeedService,
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<FeedController>(FeedController);
        service = module.get<FeedService>(FeedService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getNewsFeed', () => {
        it('FeedService 올바른 호출', async () => {
            const req = { user: { id: 'user-id', roles: ['STUDENT'] } };

            await controller.getNewsFeed(req);
            expect(service.getNewsFeed).toHaveBeenCalledWith(req.user);
        });
    });
});
