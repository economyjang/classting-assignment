import { Test, TestingModule } from '@nestjs/testing';
import { PageService } from './page.service';
import { Repository } from 'typeorm';
import { Page } from './entity/Page.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/User.entity';
import { UserType } from '../../types/UserType';

describe('SchoolService', () => {
    let service: PageService;
    let pageRepository: Repository<Page>;

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
            ],
        }).compile();

        service = module.get<PageService>(PageService);
        pageRepository = module.get(getRepositoryToken(Page));
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
});
