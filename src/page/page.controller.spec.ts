import { Test, TestingModule } from '@nestjs/testing';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { PageDto } from './dto/PageDto';

describe('SchoolController', () => {
    let controller: PageController;
    let service: PageService;

    const mockPageService = {
        createPage: jest.fn(),
        subscribePage: jest.fn(),
        unSubscribePage: jest.fn(),
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

    describe('create', () => {
        it('PageService 올바른 호출', async () => {
            const pageDto = new PageDto();
            const req = { user: { id: 'user-id', roles: ['MANAGER'] } };

            await controller.create(req, pageDto);

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
});
