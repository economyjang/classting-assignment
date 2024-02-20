import {
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/entity/User.entity';
import { Subscription } from './entity/Subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../page/entity/Page.entity';
import { PageService } from '../page/page.service';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
        @Inject(forwardRef(() => PageService)) private pageService: PageService,
    ) {}

    async getMySubscribePages(user: User) {
        const result = await this.subscriptionRepository.find({
            where: { user: { id: user.id } },
            relations: { user: true, page: true },
        });
        return result.map((subscription) => subscription.page);
    }

    async saveSubscription(user: User, page: Page) {
        const subscription = new Subscription().setUser(user).setPage(page);

        const existResult = await this.subscriptionRepository.exists({
            where: { user: { id: user.id }, page: { id: page.id } },
        });
        if (existResult) {
            throw new ConflictException('이미 구독중인 페이지 입니다.');
        }

        return await this.subscriptionRepository.save(subscription);
    }

    async deleteSubscription(user: User, page: Page) {
        await this.subscriptionRepository.softDelete({ user, page });
    }

    async getNewsBySubscribedPageId(user: User, pageId: string) {
        const existResult = await this.subscriptionRepository.exists({
            where: { user: { id: user.id }, page: { id: pageId } },
            relations: { user: true, page: true },
        });
        if (!existResult) {
            throw new NotFoundException('구독중인 페이지가 아닙니다.');
        }

        const result = await this.pageService.getNewsByPageId(pageId);
        return result.news;
    }

    async getSubscriptionUserList(pageId: string) {
        return await this.subscriptionRepository.find({
            where: { page: { id: pageId } },
            relations: { user: true, page: true },
        });
    }
}
