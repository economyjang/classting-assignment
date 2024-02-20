import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { Repository } from 'typeorm';
import { Feed } from './entity/Feed.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { News } from '../news/entity/News.entity';

describe('FeedService', () => {
    let service: FeedService;
    let feedRepository: Repository<Feed>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeedService,
                {
                    provide: getRepositoryToken(Feed),
                    useValue: {
                        save: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<FeedService>(FeedService);
        feedRepository = module.get(getRepositoryToken(Feed));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('saveFeed 테스트', () => {
        it('정상 저장 테스트', async () => {
            const user = new User();
            const news = new News();
            const feed = new Feed().setUser(user).setNews(news);

            jest.spyOn(feedRepository, 'save').mockResolvedValue(undefined);

            await expect(service.saveFeed(user, news)).resolves.not.toThrow();
            expect(feedRepository.save).toHaveBeenCalledWith(feed);
        });
    });

    describe('getNewsFeed 테스트', () => {
        it('정상 저장 테스트', async () => {
            const user = new User();
            user.id = 'test';

            jest.spyOn(feedRepository, 'find').mockResolvedValue([]);

            await expect(service.getNewsFeed(user)).resolves.not.toThrow();
            expect(feedRepository.find).toHaveBeenCalledWith({
                where: { user: { id: 'test' } },
                relations: { news: true },
                order: {
                    news: {
                        created_at: { direction: 'DESC' },
                    },
                },
            });
        });
    });
});
