import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { PageDto } from './dto/PageDto';
import { NewsDto } from '../news/dto/NewsDto';
import { Page } from './entity/Page.entity';
import { News } from '../news/entity/News.entity';

describe('PageController', () => {
    let controller: PageController;
    let service: PageService;

    const mockPageService = {
        createPage: jest.fn(),
        subscribePage: jest.fn(),
        unSubscribePage: jest.fn(),
        createNews: jest.fn(),
        deleteNews: jest.fn(),
        updateNews: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PageController],
            providers: [
                {
                    provide: PageService,
                    useValue: mockPageService,
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<PageController>(PageController);
        service = module.get<PageService>(PageService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createPage', () => {
        it('PageService 올바른 호출', async () => {
            const pageDto = new PageDto();
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };

            const page = new Page();
            page.id = 'test';
            jest.spyOn(service, 'createPage').mockResolvedValue(page);

            await controller.createPage(req, pageDto);
            expect(service.createPage).toHaveBeenCalledWith(req.user, pageDto);
        });
    });

    describe('subscribe', () => {
        it('PageService 올바른 호출', async () => {
            const pageId = 'test';
            const req = { user: { id: 'user-id', roles: ['STUDENT'] } };

            await controller.subscribe(req, pageId);
            expect(service.subscribePage).toHaveBeenCalledWith(
                req.user,
                pageId,
            );
        });
    });

    describe('unSubscribe', () => {
        it('PageService 올바른 호출', async () => {
            const pageId = 'test';
            const req = { user: { id: 'user-id', roles: ['STUDENT'] } };

            await controller.unSubscribe(req, pageId);
            expect(service.unSubscribePage).toHaveBeenCalledWith(
                req.user,
                pageId,
            );
        });
    });

    describe('createNews', () => {
        it('PageService 올바른 호출', async () => {
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };
            const newsDto = new NewsDto();
            const pageId = 'test';

            const news = new News();
            news.id = 'test';
            jest.spyOn(service, 'createNews').mockResolvedValue(news);
            await controller.createNews(req, pageId, newsDto);
            expect(service.createNews).toHaveBeenCalledWith(
                req.user,
                pageId,
                newsDto,
            );
        });
    });

    describe('deleteNews', () => {
        it('PageService 올바른 호출', async () => {
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };
            const pageId = 'test';
            const newsId = 'test';

            await controller.deleteNews(req, pageId, newsId);
            expect(service.deleteNews).toHaveBeenCalledWith(
                req.user,
                pageId,
                newsId,
            );
        });
    });

    describe('updateNews', () => {
        it('PageService 올바른 호출', async () => {
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };
            const pageId = 'test';
            const newsId = 'test';
            const newsDto = new NewsDto();
            newsDto.subject = 'test';
            newsDto.content = 'test';

            await controller.updateNews(req, pageId, newsId, newsDto);
            expect(service.updateNews).toHaveBeenCalledWith(
                req.user,
                pageId,
                newsId,
                newsDto,
            );
        });
    });
});
